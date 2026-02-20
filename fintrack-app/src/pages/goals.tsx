import { useEffect, useState } from 'react';
import AnimatedPage from '@/components/shared/animated-page';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus, TrendingUp, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useGoalStore, type Goal } from '@/store/useGoalStore';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import AddGoalModal from '@/components/modals/add-goal-modal';
import ContributeModal from '@/components/modals/contribute-modal';

export default function Goals() {
  const { goals, fetchGoals, isLoading, deleteGoal } = useGoalStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);
  const [contributeGoal, setContributeGoal] = useState<Goal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const diffTime = Math.abs(new Date(deadline).getTime() - new Date().getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground">Set targets and track your progress to financial freedom.</p>
        </div>
      </div>

      {isLoading && goals.length === 0 ? (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : goals.length === 0 ? (
        <Card className="rounded-xl border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Target className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Goals Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    Start visualizing your dreams by adding a savings goal. Whether it's a new car, a vacation, or an emergency fund, track it here!
                </p>
                <Button onClick={() => setIsAddModalOpen(true)} className="rounded-full px-8">
                    <Plus className="w-5 h-5 mr-2" /> Create First Goal
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <Card key={goal.id} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className={cn("h-2 w-full", goal.color || 'bg-primary')} />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-inner", goal.color || 'bg-primary')}>
                          {/* Fallback icon strategy based on name or random */}
                          <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight truncate max-w-[160px]">{goal.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            {goal.deadline ? (
                                <>
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                                    {daysRemaining && ` (${daysRemaining}d left)`}
                                </>
                            ) : 'No Deadline'}
                        </p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setGoalToEdit(goal)}>
                          <Edit2 className="w-4 h-4 mr-2" /> Edit Goal
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteGoal(goal.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 mb-6">
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-sm font-medium text-muted-foreground">Saved</p>
                              <p className="text-xl font-bold">{formatCurrency(goal.currentAmount)}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-xs text-muted-foreground">Target</p>
                              <p className="text-sm font-semibold">{formatCurrency(goal.targetAmount)}</p>
                          </div>
                      </div>
                      <Progress value={progress} className={cn("h-2.5", goal.color?.replace('bg-', 'text-'))} />
                      <div className="flex justify-between items-center text-xs">
                          <span className="font-medium">{progress}% Complete</span>
                          <span className="text-muted-foreground">
                              {formatCurrency(goal.targetAmount - goal.currentAmount)} to go
                          </span>
                      </div>
                  </div>

                  <Button 
                    variant={isCompleted ? "secondary" : "default"}
                    className="w-full rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-semibold"
                    onClick={() => setContributeGoal(goal)}
                    disabled={isCompleted}
                  >
                    {isCompleted ? 'Goal Reached! 🎉' : (
                        <><TrendingUp className="w-4 h-4 mr-2" /> Add Funds</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Floating Action Button */}
      {goals.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
              <Button
                  onClick={() => setIsAddModalOpen(true)}
                  size="icon"
                  className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105"
              >
                  <Plus className="h-6 w-6" />
              </Button>
          </div>
      )}

      <AddGoalModal 
        open={isAddModalOpen || !!goalToEdit} 
        onClose={() => { setIsAddModalOpen(false); setGoalToEdit(null); }} 
        goal={goalToEdit}
      />
      <ContributeModal 
        open={!!contributeGoal}
        onClose={() => setContributeGoal(null)}
        goal={contributeGoal}
      />
    </AnimatedPage>
  );
}
