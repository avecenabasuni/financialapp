import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency, cn } from '@/lib/utils';
import BudgetCard from '@/components/shared/budget-card';
import EmptyState from '@/components/shared/empty-state';
import AnimatedPage from '@/components/shared/animated-page';
import { Plus, PiggyBank, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import SetBudgetModal from '@/components/modals/set-budget-modal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { format } from 'date-fns';
import BudgetsSkeleton from '@/components/skeletons/budgets-skeleton';
import { useToast } from '@/context/toast-context';
import MonthPicker from '@/components/shared/month-picker';

export default function Budgets() {
  const { budgets, fetchBudgets, deleteBudget, isLoading } = useBudgetStore();
  const { addToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | undefined>(undefined);

  // Derived state for API and Display
  const apiMonth = useMemo(() => currentDate.toISOString().slice(0, 7), [currentDate]);
  
  useEffect(() => {
    fetchBudgets(apiMonth);
  }, [fetchBudgets, apiMonth]);

  const handleOpen = (catId?: string) => {
    setEditCategoryId(catId);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
        try {
            await deleteBudget(id);
            addToast('Budget deleted successfully', 'success');
        } catch (error) {
            addToast('Failed to delete budget', 'error');
        }
    }
  };
  
  // Calculations
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const remaining = totalBudget - totalSpent;
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const spendingData = budgets
    .filter(b => b.spent > 0)
    .map(b => ({
      name: b.categoryName,
      value: b.spent,
      color: b.categoryColor
    }));

  if (isLoading) {
    return <BudgetsSkeleton />
  }

  return (
    <AnimatedPage className="space-y-6">
      <SetBudgetModal open={isModalOpen} onClose={() => setIsModalOpen(false)} defaultCategoryId={editCategoryId} month={apiMonth} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">Set spending limits and track your progress.</p>
        </div>
        <div className="flex items-center gap-2">
            <MonthPicker currentDate={currentDate} onMonthChange={setCurrentDate} />
        </div>
      </div>

      {budgets.length === 0 ? (
        <EmptyState
            title="No budgets set"
            description="Create a budget to track your spending and save more money."
            actionLabel="Create Budget"
            onAction={() => handleOpen()}
            icon={PiggyBank}
        />
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Distribution */}
            <Card className="shadow-sm border-none shadow-black/5">
                <CardHeader className="pb-2">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle className="text-lg font-bold">Spending Distribution</CardTitle>
                        <CardDescription>Where your money goes</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full mt-2">
                        {spendingData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={spendingData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {spendingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        formatter={(value: number | undefined) => [formatCurrency(value || 0), 'Spent']}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No spending data</div>
                        )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        {spendingData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="truncate">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card className="shadow-sm border-none shadow-black/5 flex flex-col h-full">
                <CardHeader>
                     <div className="flex flex-col space-y-1.5">
                        <CardTitle className="text-lg font-bold">Monthly Summary</CardTitle>
                        <CardDescription>{format(currentDate, 'MMMM yyyy')} budget overview</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-2">
                    <div className="grid grid-cols-3 gap-4 mb-6 text-left">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Total Budget</p>
                            <h3 className="text-2xl font-bold tracking-tight">{formatCurrency(totalBudget)}</h3>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Total Spent</p>
                            <h3 className="text-2xl font-bold tracking-tight text-destructive">{formatCurrency(totalSpent)}</h3>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Remaining</p>
                            <h3 className={cn("text-2xl font-bold tracking-tight", remaining < 0 ? "text-destructive" : "text-emerald-500")}>
                                {remaining < 0 ? '-' : ''}{formatCurrency(Math.abs(remaining))}
                            </h3>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className="font-medium">{Math.round(overallProgress)}% used</span>
                        </div>
                        <Progress value={Math.min(overallProgress, 100)} className="h-3" indicatorClassName={remaining < 0 ? "bg-destructive" : "bg-emerald-500"} />
                        
                        {remaining < 0 && (
                            <div className="mt-2 text-xs text-destructive flex items-center gap-1.5 font-medium">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>You are over budget by {formatCurrency(Math.abs(remaining))}</span>
                            </div>
                        )}
                        {remaining >= 0 && overallProgress > 85 && (
                            <div className="mt-2 text-xs text-amber-600 flex items-center gap-1.5 font-medium">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>Approaching Limit</span>
                                <span className="text-muted-foreground font-normal ml-1">
                                    {Math.round((remaining / totalBudget) * 100)}% of budget remaining with {new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() - new Date().getDate()} days left
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
          </div>

          {/* Budget List Grid */}
          <div>
            <h3 className="font-semibold mb-4">Category Budgets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {budgets.map((budget) => (
                    <BudgetCard 
                        key={budget.id} 
                        budget={budget} 
                        onClick={() => handleOpen(budget.categoryId)}
                        onEdit={(catId) => handleOpen(catId)}
                        onDelete={(id) => handleDelete(id)}
                    />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
            onClick={() => handleOpen()}
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105"
        >
            <Plus className="h-6 w-6" />
        </Button>
      </div>
    </AnimatedPage>
  );
}
