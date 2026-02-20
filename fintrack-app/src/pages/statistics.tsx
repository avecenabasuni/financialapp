import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area
} from 'recharts';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { formatCurrency } from '@/lib/utils';
import CategoryIcon from '@/components/shared/category-icon';
import EmptyState from '@/components/shared/empty-state';
import AnimatedPage from '@/components/shared/animated-page';
import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Statistics() {
  const { transactions } = useTransactionStore();
  const [period, setPeriod] = useState('Month'); // 'Month' | 'Year' | 'All'

  // Filter Transactions
  const filteredTransactions = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return transactions.filter(t => {
      const d = new Date(t.date);
      if (period === 'Year') return d.getFullYear() === currentYear;
      if (period === 'Month') return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      return true; // All
    });
  }, [transactions, period]);

  return <StatisticsContent period={period} setPeriod={setPeriod} filteredTransactions={filteredTransactions} allTransactions={transactions} />;
}

function StatisticsContent({ period, setPeriod, filteredTransactions, allTransactions }: any) {
  const { categories } = useCategoryStore();

  const data = useMemo(() => {
    let income = 0;
    let totalExpense = 0;
    let needs = 0;
    let wants = 0;
    let savings = 0;

    const expenseList: any[] = [];

    filteredTransactions.forEach((t: any) => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        totalExpense += t.amount;
        
        // Find group
        const cat = categories.find((c: any) => c.id === t.categoryId);
        const group = cat?.group || 'wants'; // Default to wants

        if (group === 'needs') needs += t.amount;
        else if (group === 'savings') savings += t.amount;
        else wants += t.amount;

        expenseList.push({ ...t, group });
      }
    });

    return { 
      income, 
      expense: totalExpense, 
      net: income - totalExpense, 
      needs, 
      wants, 
      savings,
      savingsRate: income > 0 ? ((income - (needs + wants)) / income) * 100 : 0
      // specificSavingsRate: income > 0 ? (savings / income) * 100 : 0
    };
  }, [filteredTransactions, categories]);

  // Radar Data
  const radarData = [
    { subject: 'Needs', A: data.needs, fullMark: data.income },
    { subject: 'Wants', A: data.wants, fullMark: data.income },
    { subject: 'Savings', A: data.savings, fullMark: data.income },
  ];

  // Monthly Trend Data (Net Cash Flow)
  const trendData = useMemo(() => {
    const map: Record<string, any> = {};
    allTransactions.forEach((t: any) => {
        const d = new Date(t.date);
        // last 6 months or current year
        if(d.getFullYear() !== new Date().getFullYear()) return; 

        const key = d.toLocaleDateString('en-US', { month: 'short' });
        if(!map[key]) map[key] = { name: key, income: 0, expense: 0, savings: 0 };
        
        if(t.type === 'income') map[key].income += t.amount;
        else {
            map[key].expense += t.amount;
             const cat = categories.find((c: any) => c.id === t.categoryId);
             if(cat?.group === 'savings') map[key].savings += t.amount;
        }
    });
    return Object.values(map).sort((a: any, b: any) => {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months.indexOf(a.name) - months.indexOf(b.name);
    });
  }, [allTransactions, categories]);

  // CATEGORY BREAKDOWN
  const expenseByCategory = useMemo(() => {
    const expenses = filteredTransactions.filter((t: any) => t.type === 'expense');
    const grouped = expenses.reduce((acc: any, t: any) => {
      const existing = acc.find((c: any) => c.name === t.categoryName);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({
          name: t.categoryName,
          value: t.amount,
          color: t.categoryColor || '#cbd5e1',
          icon: t.categoryIcon || 'HelpCircle',
        });
      }
      return acc;
    }, []);
    return grouped.sort((a: any, b: any) => b.value - a.value);
  }, [filteredTransactions]);

  if (allTransactions.length === 0) {
    return <EmptyState icon={BarChart3} title="No Analytics Yet" description="Add transactions to see your financial insights." />;
  }

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <Tabs value={period} onValueChange={setPeriod} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 sm:w-[300px]">
            <TabsTrigger value="Month">Month</TabsTrigger>
            <TabsTrigger value="Year">Year</TabsTrigger>
            <TabsTrigger value="All">All Time</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Net Cash Flow" amount={data.net} icon={TrendingUp} trend={data.net > 0 ? "Positive" : "Negative"} color={data.net >= 0 ? "text-emerald-500" : "text-rose-500"} />
                <KPICard title="Total Income" amount={data.income} icon={ArrowDownRight} color="text-blue-500" />
                <KPICard title="Total Expense" amount={data.expense} icon={ArrowUpRight} color="text-rose-500" />
                <KPICard title="Savings Rate" value={`${data.savingsRate.toFixed(1)}%`} icon={PiggyBank} color="text-violet-500" subtext="of Income" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radar Chart - N / W / S */}
                <Card>
                    <CardHeader>
                        <CardTitle>Spending Pattern</CardTitle>
                        <CardDescription>Needs vs Wants vs Savings</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar name="Amount" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                                <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0)} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Bar Chart - Net Flow */}
                <Card>
                    <CardHeader>
                        <CardTitle>Net Cash Flow</CardTitle>
                        <CardDescription>Income vs Expenses (Year to Date)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} formatter={(val: number | undefined) => formatCurrency(val || 0)} />
                                <Bar dataKey="income" name="Income" fill="hsl(142, 60%, 45%)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" name="Expense" fill="hsl(0, 65%, 55%)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="spending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <Card className="md:col-span-5 h-[400px] flex flex-col">
                    <CardHeader>
                        <CardTitle>Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value">
                                    {expenseByCategory.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0)} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--popover-foreground))' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="md:col-span-7">
                    <CardHeader>
                        <CardTitle>Top Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {expenseByCategory.map((cat: any) => (
                            <div key={cat.name} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                                        <span>{cat.name}</span>
                                    </div>
                                    <span className="font-medium tabular-nums">{formatCurrency(cat.value)}</span>
                                </div>
                                <Progress value={(cat.value / data.expense) * 100} className="h-2" indicatorClassName="bg-primary/80" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="savings" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Savings Trend</CardTitle>
                    <CardDescription>Total Savings Analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} formatter={(val: number | undefined) => formatCurrency(val || 0)} />
                             {/* Approximating "Savings" as Income - Expense for this chart, or explicit savings? Let's use Income - Expense as Net Savings */}
                            <Area type="monotone" dataKey={(data) => data.income - data.expense} name="Net Savings" stroke="hsl(262, 83%, 58%)" fillOpacity={1} fill="url(#colorSavings)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <div className="grid grid-cols-3 gap-4">
                 <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{formatCurrency(data.income - data.expense)}</div>
                        <p className="text-xs text-muted-foreground">Total Net Savings ({period})</p>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{data.savingsRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">Average Savings Rate</p>
                    </CardContent>
                 </Card>
            </div>
        </TabsContent>
      </Tabs>
    </AnimatedPage>
  );
}

function KPICard({ title, amount, value, icon: Icon, trend, color, subtext }: any) {
    return (
        <Card>
            <CardContent className="p-6 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">{title}</span>
                    <div className={cn("p-2 rounded-full bg-secondary", color && color.replace('text-', 'bg-').replace('500', '100'))}>
                        <Icon className={cn("w-4 h-4", color)} />
                    </div>
                </div>
                <div className="text-2xl font-bold mt-2">{amount !== undefined ? formatCurrency(amount) : value}</div>
                {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
                {trend && <p className={cn("text-xs font-medium", trend === 'Positive' ? 'text-emerald-500' : 'text-rose-500')}>{trend} flow</p>}
            </CardContent>
        </Card>
    )
}
