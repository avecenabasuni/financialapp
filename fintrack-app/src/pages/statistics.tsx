import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
  LineChart, Line
} from 'recharts';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { formatCurrency } from '@/lib/utils';
import EmptyState from '@/components/shared/empty-state';
import AnimatedPage from '@/components/shared/animated-page';
import { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, ArrowUpRight, PiggyBank, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Statistics() {
  const { transactions } = useTransactionStore();

  // Always use all transactions for the overview processing
  return <StatisticsContent allTransactions={transactions} />;
}
function CustomBarTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)] border border-gray-100 p-3 min-w-[130px]">
        <p className="text-[#64748b] text-[13px] font-medium mb-1.5">{label}</p>
        <div className="space-y-1">
          <p className="text-[#10b981] font-medium text-[13px]">
            Income: {formatCurrency(payload[0]?.value || 0)}
          </p>
          <p className="text-[#6366f1] font-medium text-[13px]">
            Expenses: {formatCurrency(payload[1]?.value || 0)}
          </p>
        </div>
      </div>
    );
  }
  return null;
}

function StatisticsContent({ allTransactions }: any) {
  const { categories } = useCategoryStore();
  const [activeTab, setActiveTab] = useState('overview');

  const data = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let totalIncome = 0;
    let totalExpense = 0;
    
    // For KPI: Current vs Last Month
    let currentMonthExpense = 0;
    let lastMonthExpense = 0;

    // For KPI: Highest Saving Month
    const monthlyNet: Record<string, number> = {};

    // For KPI: Top Spending Category (Current Month)
    const currentMonthCategoryExpense: Record<string, { value: number, name: string }> = {};

    // For Radar: Current Month vs 6-Month Average
    const sixMonthCategoryExpense: Record<string, number> = {};
    const radarCurrentMonth: Record<string, number> = {};

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const expenseList: any[] = []; // For Donut Chart (Current Month typically)

    allTransactions.forEach((t: any) => {
      const d = new Date(t.date);
      const isCurrentMonth = d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      const isLastMonth = d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      const isWithin6Months = d >= sixMonthsAgo;

      const monthKey = d.toLocaleDateString('en-US', { month: 'long' });

      if (t.type === 'income') {
        if (isCurrentMonth) totalIncome += t.amount;
        if (!monthlyNet[monthKey]) monthlyNet[monthKey] = 0;
        monthlyNet[monthKey] += t.amount;
      } else {
        if (isCurrentMonth) totalExpense += t.amount;
        
        if (!monthlyNet[monthKey]) monthlyNet[monthKey] = 0;
        monthlyNet[monthKey] -= t.amount;

        if (isCurrentMonth) {
            currentMonthExpense += t.amount;
            if(!currentMonthCategoryExpense[t.categoryId]) {
                currentMonthCategoryExpense[t.categoryId] = { value: 0, name: t.categoryName };
            }
            currentMonthCategoryExpense[t.categoryId].value += t.amount;
            
            if(!radarCurrentMonth[t.categoryName]) radarCurrentMonth[t.categoryName] = 0;
            radarCurrentMonth[t.categoryName] += t.amount;

            expenseList.push(t);
        }
        if (isLastMonth) lastMonthExpense += t.amount;

        if (isWithin6Months) {
            if(!sixMonthCategoryExpense[t.categoryName]) sixMonthCategoryExpense[t.categoryName] = 0;
            sixMonthCategoryExpense[t.categoryName] += t.amount;
        }
      }
    });

    // Highest Saving Month
    let highestSavingMonth = 'N/A';
    let highestSavingValue = -Infinity;
    Object.entries(monthlyNet).forEach(([month, net]) => {
        if (net > highestSavingValue) {
            highestSavingValue = net;
            highestSavingMonth = month;
        }
    });

    // Top Spending Category
    let topSpendingCategory = 'N/A';
    let topSpendingValue = 0;
    Object.values(currentMonthCategoryExpense).forEach((cat) => {
         if(cat.value > topSpendingValue) {
             topSpendingValue = cat.value;
             topSpendingCategory = cat.name;
         }
    });

    // Spending Trend
    let spendingTrendValue = 0;
    let spendingTrendDirection = 'Neutral';
    if (lastMonthExpense > 0) {
        spendingTrendValue = ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
        spendingTrendDirection = spendingTrendValue > 0 ? 'Increasing' : 'Decreasing';
    }

    // Savings Rate (Current Month)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Prepare Radar Data (Top 5 Categories by 6m avg)
    const top6MCats = Object.entries(sixMonthCategoryExpense)
        .map(([name, val]) => ({ name, val: val / 6 }))
        .sort((a, b) => b.val - a.val)
        .slice(0, 6);

    const radarData = top6MCats.map(cat => ({
        subject: cat.name,
        current: radarCurrentMonth[cat.name] || 0,
        average: cat.val
    }));

    return { 
      income: totalIncome, 
      expense: totalExpense, 
      highestSavingMonth,
      highestSavingValue: highestSavingValue === -Infinity ? 0 : highestSavingValue,
      topSpendingCategory,
      topSpendingValue,
      spendingTrendValue,
      spendingTrendDirection,
      savingsRate,
      radarData,
      currentMonthExpenseList: expenseList
    };
  }, [allTransactions, categories]);

  // Monthly Trend Data (Last 6 Months)
  const trendData = useMemo(() => {
    const map: Record<string, any> = {};
    const months = [];
    
    // Generate last 6 months keys
    for(let i=5; i>=0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toLocaleDateString('en-US', { month: 'short' });
        months.push(key);
        map[key] = { name: key, income: 0, expense: 0, savingsRate: 0 };
    }

    allTransactions.forEach((t: any) => {
        const d = new Date(t.date);
        const key = d.toLocaleDateString('en-US', { month: 'short' });
        if(map[key]) {
            if(t.type === 'income') map[key].income += t.amount;
            else map[key].expense += t.amount;
        }
    });

    return months.map(m => {
        const item = map[m];
        const net = item.income - item.expense;
        item.net = net;
        item.savingsRate = item.income > 0 ? (net / item.income) * 100 : 0;
        return item;
    });
  }, [allTransactions]);

  // CATEGORY BREAKDOWN (Current Month)
  const expenseByCategory = useMemo(() => {
    const grouped = data.currentMonthExpenseList.reduce((acc: any, t: any) => {
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
  }, [data.currentMonthExpenseList]);

  if (allTransactions.length === 0) {
    return <EmptyState icon={BarChart3} title="No Analytics Yet" description="Add transactions to see your financial insights." />;
  }

  return (
    <AnimatedPage className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">Deep insights into your financial patterns.</p>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Calendar className="w-4 h-4" />
            Last 6 Months
        </Button>
      </div>

      {/* KPI Cards (Global) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
              title="Highest Saving Month" 
              value={data.highestSavingMonth} 
              icon={TrendingUp} 
              color="text-emerald-500" 
              subtext={`${formatCurrency(data.highestSavingValue)} saved`} 
          />
          <KPICard 
              title="Top Spending Category" 
              value={data.topSpendingCategory} 
              icon={ArrowUpRight} 
              color="text-violet-500" 
              subtext={`${formatCurrency(data.topSpendingValue)} this month`}
          />
          <KPICard 
              title="Spending Trend" 
              value={data.spendingTrendDirection} 
              icon={data.spendingTrendDirection === 'Decreasing' ? TrendingDown : TrendingUp} 
              color={data.spendingTrendDirection === 'Decreasing' ? 'text-emerald-500' : 'text-rose-500'} 
              subtext={`${data.spendingTrendValue > 0 ? '+' : ''}${data.spendingTrendValue.toFixed(1)}% vs last month`}
          />
          <KPICard 
              title="Savings Rate" 
              value={`${data.savingsRate.toFixed(0)}%`} 
              icon={PiggyBank} 
              color="text-amber-500" 
              subtext="Of total income" 
          />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-transparent space-x-2 p-0 h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-full px-5 py-2 bg-gray-50/50 border text-muted-foreground data-[state=active]:text-foreground">Overview</TabsTrigger>
            <TabsTrigger value="spending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-full px-5 py-2 bg-gray-50/50 border text-muted-foreground data-[state=active]:text-foreground">Spending</TabsTrigger>
            <TabsTrigger value="savings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-full px-5 py-2 bg-gray-50/50 border text-muted-foreground data-[state=active]:text-foreground">Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
            {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart - Net Flow (Green/Purple bars) */}
                <Card className="shadow-sm rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Net Cash Flow</CardTitle>
                        <CardDescription>Monthly income minus expenses</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] mt-4 w-full min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#e2e8f0', opacity: 0.8 }} />
                                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
                                <Bar dataKey="expense" name="Expense" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Radar Chart - Category Pattern */}
                <Card className="shadow-sm rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Spending Pattern</CardTitle>
                        <CardDescription>Current vs average spending by category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center -mt-4 w-full min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data.radarData}>
                                <PolarGrid stroke="hsl(var(--muted))" strokeOpacity={0.5} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar name="Current Month" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.2} isAnimationActive={false} />
                                <Radar name="6-Month Average" dataKey="average" stroke="#6366f1" strokeDasharray="4 4" fill="none" isAnimationActive={false} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0)} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            )}
        </TabsContent>

        <TabsContent value="spending" className="space-y-6 mt-4">
            {activeTab === 'spending' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-[450px] flex flex-col shadow-sm rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Category Breakdown</CardTitle>
                        <CardDescription>Spending by category this month</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center pb-8 w-full min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={90} outerRadius={140} paddingAngle={3} dataKey="value" stroke="none" isAnimationActive={false}>
                                    {expenseByCategory.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0)} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--popover-foreground))' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="h-[450px] flex flex-col shadow-sm rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Spending Ranking</CardTitle>
                        <CardDescription>Categories sorted by amount spent</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto pr-2">
                        <div className="space-y-4 pt-2">
                            {expenseByCategory.map((cat: any, i: number) => (
                                <div key={cat.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="text-muted-foreground w-4 text-left">{i+1}</span>
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="font-medium text-base">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold tabular-nums text-right w-24 text-base tracking-tight">{formatCurrency(cat.value)}</span>
                                        <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded w-12 text-center">{((cat.value / data.expense) * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            )}
        </TabsContent>

        <TabsContent value="savings" className="space-y-6 mt-4">
            {activeTab === 'savings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Savings Trend</CardTitle>
                        <CardDescription>Monthly savings over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dx={-10} width={60} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} formatter={(val: number | undefined) => formatCurrency(val || 0)} />
                                <Area type="monotone" dataKey="net" name="Net Savings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Savings Rate History</CardTitle>
                        <CardDescription>Percentage of income saved each month</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tickFormatter={(val) => `${val}%`} domain={[0, 'auto']} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip formatter={(val: any) => typeof val === 'number' ? `${val.toFixed(1)}%` : `${val}%`} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="savingsRate" name="Savings Rate" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6 }} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            )}
        </TabsContent>
      </Tabs>
    </AnimatedPage>
  );
}

function KPICard({ title, amount, value, icon: Icon, color, subtext }: any) {
    return (
        <Card className="shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-start gap-4">
                <div className={cn("p-3 rounded-full flex items-center justify-center flex-shrink-0", color && color.replace('text-', 'bg-').replace('500', '100'))}>
                    <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div className="flex flex-col gap-0.5 mt-0.5">
                    <span className="text-xs text-muted-foreground font-medium">{title}</span>
                    <div className="text-xl font-bold tracking-tight">{value !== undefined ? value : (amount !== undefined ? formatCurrency(amount) : '')}</div>
                    {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
                </div>
            </CardContent>
        </Card>
    )
}

