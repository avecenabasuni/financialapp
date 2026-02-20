import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, getStartOfWeek, getDaysInMonth, getAllMonths } from '@/lib/utils';
import SummaryCard from '@/components/shared/summary-card';
import TransactionRow from '@/components/shared/transaction-row';
import BudgetProgress from '@/components/shared/budget-progress';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useState, useMemo } from 'react';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useWalletStore } from '@/store/useWalletStore';

// Custom Tooltip Component
function CustomTooltip({ active, payload, label, period }: any) {
  if (active && payload && payload.length) {
    let fullLabel = label;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); 

    if (period === 'Year') {
       const monthMap: Record<string, string> = {
        Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
        Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December'
      };
      fullLabel = monthMap[label] || label;
    } else if (period === 'Month') {
      const date = new Date(currentYear, currentMonth, parseInt(label));
      fullLabel = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } else if (period === 'Week') {
      const dayMap: Record<string, string> = {
        Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday'
      };
      fullLabel = dayMap[label] || label;
    }

    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">{fullLabel}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState('Month');
  
  const { transactions } = useTransactionStore();
  const { budgets } = useBudgetStore();
  const { wallets } = useWalletStore();

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = income - expenses;

  // Helper for Chart Description
  const getPeriodDescription = () => {
      const now = new Date();
      if (period === 'Year') return now.getFullYear().toString();
      if (period === 'Month') return now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      if (period === 'Week') {
          const start = getStartOfWeek(now);
          const end = new Date(start);
          end.setDate(end.getDate() + 6);
          return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
      }
      return 'Overview';
  };

  // Dynamic Greeting Logic
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const name = user?.username || (wallets[0]?.name ? 'User' : 'Guest');
    
    // Time-based specific greetings
    if (hour >= 5 && hour < 12) return `Good morning, ${name}`;
    if (hour >= 12 && hour < 17) return `Good afternoon, ${name}`;
    if (hour >= 17 && hour < 21) return `Good evening, ${name}`;
    
    // Late night / variety
    const nightPhrases = [
       `Working late, ${name}?`,
       `Time to rest, ${name}`,
       `Good night, ${name}`
    ];
    return nightPhrases[Math.floor(Math.random() * nightPhrases.length)];
  }, [user?.username, wallets]);

  // Variety phrases for subtitle
  const subtitle = useMemo(() => {
     const phrases = [
         "Here's your financial overview.",
         "Let's see how your money is doing.",
         "Tracking your progress today.",
         "Stay on top of your finances."
     ];
     return `${phrases[Math.floor(Math.random() * phrases.length)]} It's ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`;
  }, []);

  // ─── Trend Calculation Logic ─────────────────────────────────────────
  const { incomeTrend, expenseTrend, savingsTrend } = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();

    let currentIncome = 0;
    let currentExpense = 0;
    let prevIncome = 0;
    let prevExpense = 0;

    transactions.forEach(t => {
      const d = new Date(t.date);
      const tMonth = d.getMonth();
      const tYear = d.getFullYear();

      if (tYear === currentYear && tMonth === currentMonth) {
        if (t.type === 'income') currentIncome += t.amount;
        if (t.type === 'expense') currentExpense += t.amount;
      } else if (tYear === prevYear && tMonth === prevMonth) {
        if (t.type === 'income') prevIncome += t.amount;
        if (t.type === 'expense') prevExpense += t.amount;
      }
    });

    const currentSavings = currentIncome - currentExpense;
    const prevSavings = prevIncome - prevExpense;

    const calculatePercentage = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    return {
      incomeTrend: calculatePercentage(currentIncome, prevIncome),
      expenseTrend: calculatePercentage(currentExpense, prevExpense),
      savingsTrend: calculatePercentage(currentSavings, prevSavings)
    };
  }, [transactions]);

  // ─── Chart Aggregation Logic ─────────────────────────────────────────
  const chartData = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    if (period === 'Year') {
      const data = getAllMonths().map(m => ({ name: m, income: 0, expense: 0 }));
      transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === currentYear) {
          const monthIdx = d.getMonth();
          if (t.type === 'income') data[monthIdx].income += t.amount;
          if (t.type === 'expense') data[monthIdx].expense += t.amount;
        }
      });
      return data;
    } 
    
    if (period === 'Month') {
      const daysInMonth = getDaysInMonth(currentYear, currentMonth);
      const data = Array.from({ length: daysInMonth }, (_, i) => ({ name: (i + 1).toString(), income: 0, expense: 0 }));
      transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          const dayIdx = d.getDate() - 1;
          if (t.type === 'income') data[dayIdx].income += t.amount;
          if (t.type === 'expense') data[dayIdx].expense += t.amount;
        }
      });
      return data;
    }

    if (period === 'Week') {
      const startOfWeek = getStartOfWeek(today);
      const data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ name: d, income: 0, expense: 0 }));
      
      transactions.forEach(t => {
        const d = new Date(t.date);
        const diffTime = d.getTime() - startOfWeek.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays >= 0 && diffDays < 7) {
            if (t.type === 'income') data[diffDays].income += t.amount;
            if (t.type === 'expense') data[diffDays].expense += t.amount;
        }
      });
      return data;
    }

    if (period === 'Day') {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = d.toISOString().slice(0, 10);
            
            let income = 0;
            let expense = 0;

            transactions.forEach(t => {
                if (t.date.startsWith(dateStr)) {
                    if (t.type === 'income') income += t.amount;
                    if (t.type === 'expense') expense += t.amount;
                }
            });
            data.push({ name: dayName, income, expense });
        }
        return data;
    }

    return [];
  }, [transactions, period]);

  return (
    <div className="space-y-8">
      {/* Header & Period Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <Tabs value={period} onValueChange={setPeriod} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3 sm:w-[300px]">
            <TabsTrigger value="Week">Weeks</TabsTrigger>
            <TabsTrigger value="Month">Months</TabsTrigger>
            <TabsTrigger value="Year">Years</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Balance" 
          amount={totalBalance} 
          icon={Wallet} 
          iconBg="bg-emerald-100" 
          iconColor="text-emerald-600"
          trend={2.5} // Example trend or calculate total net worth trend if possible
        />
        <SummaryCard 
          title="Monthly Income" 
          amount={income} 
          trend={incomeTrend} 
          icon={TrendingUp} 
          iconBg="bg-blue-100" 
          iconColor="text-blue-600"
        />
        <SummaryCard 
          title="Monthly Expenses" 
          amount={expenses} 
          trend={expenseTrend} 
          inverseTrend={true}
          icon={TrendingDown} 
          iconBg="bg-rose-100" 
          iconColor="text-rose-600"
        />
        <SummaryCard 
          title="Net Savings" 
          amount={netSavings} 
          trend={savingsTrend} 
          icon={PiggyBank} 
          iconBg="bg-violet-100" 
          iconColor="text-violet-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income vs Expenses Chart (Area) */}
        <Card className="col-span-1 lg:col-span-8 shadow-sm border-none shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Income vs Expenses</CardTitle>
              <CardDescription>{getPeriodDescription()}</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-muted-foreground">Income</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-muted-foreground">Expenses</span>
                </div>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                    cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<CustomTooltip period={period} />}
                />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" name="Expenses" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly/Period Spending (Bar) */}
        <Card className="col-span-1 lg:col-span-4 shadow-sm border-none shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Spending Analysis</CardTitle>
              <CardDescription>{getPeriodDescription()}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <ResponsiveContainer width="100%" height={350}>
               <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} minTickGap={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                    content={<CustomTooltip period={period} />}
                  />
                  <Bar dataKey="expense" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Recent Transactions */}
         <Card className="shadow-sm border-none shadow-black/5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
               <div>
                  <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
                  <CardDescription>Your latest financial activity</CardDescription>
               </div>
               <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" asChild>
                  <Link to="/transactions">View all</Link>
               </Button>
            </CardHeader>
            <CardContent>
               <div className="divide-y divide-gray-100">
                  {transactions.slice(0, 5).map((t) => (
                  <TransactionRow key={t.id} transaction={t} />
                  ))}
                  {transactions.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground text-sm">No recent transactions</div>
                  )}
               </div>
            </CardContent>
         </Card>

         {/* Budget Overview */}
         <Card className="shadow-sm border-none shadow-black/5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
               <div>
                  <CardTitle className="text-lg font-bold">Budget Overview</CardTitle>
                  <CardDescription>Spending limits for this month</CardDescription>
               </div>
               <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
               </Button>
            </CardHeader>
            <CardContent className="space-y-6">
               {budgets.slice(0, 4).map((b) => (
                  <BudgetProgress key={b.id} budget={b} />
               ))}
               {budgets.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground text-sm">No active budgets</div>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
