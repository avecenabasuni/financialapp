import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  formatCurrency,
  getStartOfWeek,
  getDaysInMonth,
  getAllMonths,
} from "@/lib/utils";
import { QuickActions } from "@/components/shared/quick-actions";
import { HealthScoreCard } from "@/components/shared/health-score-card";
import { UpcomingBillsCard } from "@/components/shared/upcoming-bills-card";
import { FinancialTipsCard } from "@/components/shared/financial-tips-card";
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useMemo } from "react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useWalletStore } from "@/store/useWalletStore";

// Custom Tooltip Component
function CustomTooltip({ active, payload, label, period }: any) {
  if (active && payload && payload.length) {
    let fullLabel = label;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (period === "Year") {
      const monthMap: Record<string, string> = {
        Jan: "January",
        Feb: "February",
        Mar: "March",
        Apr: "April",
        May: "May",
        Jun: "June",
        Jul: "July",
        Aug: "August",
        Sep: "September",
        Oct: "October",
        Nov: "November",
        Dec: "December",
      };
      fullLabel = monthMap[label] || label;
    } else if (period === "Month") {
      const date = new Date(currentYear, currentMonth, parseInt(label));
      fullLabel = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } else if (period === "Week") {
      const dayMap: Record<string, string> = {
        Mon: "Monday",
        Tue: "Tuesday",
        Wed: "Wednesday",
        Thu: "Thursday",
        Fri: "Friday",
        Sat: "Saturday",
        Sun: "Sunday",
      };
      fullLabel = dayMap[label] || label;
    }

    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1.5">{fullLabel}</p>
        {payload.map((entry: any, idx: number) => (
          <p
            key={idx}
            className="text-sm font-semibold"
            style={{ color: entry.color }}
          >
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Sparkline Component
function SparkLine({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
      >
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          strokeOpacity={0.8}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Modern Stat Card with gradient and sparkline
interface ModernStatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  sparkColor: string;
  sparkData: number[];
}

function ModernStatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  gradient,
  iconBg,
  sparkColor,
  sparkData,
}: ModernStatCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-md hover:shadow-black/5 transition-all duration-300 border-border/60">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} shrink-0`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <Badge
            variant="secondary"
            className={`border-0 text-xs gap-0.5 ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                : "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </Badge>
        </div>
        <div className="mt-3">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl tracking-tight mt-0.5 font-extrabold">
            {value}
          </p>
        </div>
        {/* Sparkline */}
        <div className="h-10 mt-3 opacity-60 group-hover:opacity-90 transition-opacity">
          <SparkLine data={sparkData} color={sparkColor} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [period] = useState("Month");
  const [, setAddTxOpen] = useState(false);
  const navigate = useNavigate();

  const { transactions } = useTransactionStore();
  const { budgets } = useBudgetStore();
  const { wallets } = useWalletStore();

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = income - expenses;

  // Dynamic Greeting Logic
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const name = user?.username || (wallets[0]?.name ? "User" : "Guest");

    // Time-based specific greetings
    if (hour >= 5 && hour < 12) return `Good morning, ${name}`;
    if (hour >= 12 && hour < 17) return `Good afternoon, ${name}`;
    if (hour >= 17 && hour < 21) return `Good evening, ${name}`;

    // Late night / variety
    const nightPhrases = [
      `Working late, ${name}?`,
      `Time to rest, ${name}`,
      `Good night, ${name}`,
    ];
    return nightPhrases[Math.floor(Math.random() * nightPhrases.length)];
  }, [user?.username, wallets]);

  // Variety phrases for subtitle
  const subtitle = useMemo(() => {
    const phrases = [
      "Here's your financial overview.",
      "Let's see how your money is doing.",
      "Tracking your progress today.",
      "Stay on top of your finances.",
    ];
    return `${
      phrases[Math.floor(Math.random() * phrases.length)]
    } It's ${new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}.`;
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

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const tMonth = d.getMonth();
      const tYear = d.getFullYear();

      if (tYear === currentYear && tMonth === currentMonth) {
        if (t.type === "income") currentIncome += t.amount;
        if (t.type === "expense") currentExpense += t.amount;
      } else if (tYear === prevYear && tMonth === prevMonth) {
        if (t.type === "income") prevIncome += t.amount;
        if (t.type === "expense") prevExpense += t.amount;
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
      savingsTrend: calculatePercentage(currentSavings, prevSavings),
    };
  }, [transactions]);

  // ─── Chart Aggregation Logic ─────────────────────────────────────────
  const chartData = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    if (period === "Year") {
      const data = getAllMonths().map((m) => ({
        name: m,
        income: 0,
        expense: 0,
      }));
      transactions.forEach((t) => {
        const d = new Date(t.date);
        if (d.getFullYear() === currentYear) {
          const monthIdx = d.getMonth();
          if (t.type === "income") data[monthIdx].income += t.amount;
          if (t.type === "expense") data[monthIdx].expense += t.amount;
        }
      });
      return data;
    }

    if (period === "Month") {
      const daysInMonth = getDaysInMonth(currentYear, currentMonth);
      const data = Array.from({ length: daysInMonth }, (_, i) => ({
        name: (i + 1).toString(),
        income: 0,
        expense: 0,
      }));
      transactions.forEach((t) => {
        const d = new Date(t.date);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          const dayIdx = d.getDate() - 1;
          if (t.type === "income") data[dayIdx].income += t.amount;
          if (t.type === "expense") data[dayIdx].expense += t.amount;
        }
      });
      return data;
    }

    if (period === "Week") {
      const startOfWeek = getStartOfWeek(today);
      const data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
        (d) => ({
          name: d,
          income: 0,
          expense: 0,
        })
      );

      transactions.forEach((t) => {
        const d = new Date(t.date);
        const diffTime = d.getTime() - startOfWeek.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays < 7) {
          if (t.type === "income") data[diffDays].income += t.amount;
          if (t.type === "expense") data[diffDays].expense += t.amount;
        }
      });
      return data;
    }

    if (period === "Day") {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        const dateStr = d.toISOString().slice(0, 10);

        let income = 0;
        let expense = 0;

        transactions.forEach((t) => {
          if (t.date.startsWith(dateStr)) {
            if (t.type === "income") income += t.amount;
            if (t.type === "expense") expense += t.amount;
          }
        });
        data.push({ name: dayName, income, expense });
      }
      return data;
    }

    return [];
  }, [transactions, period]);

  // Sparkline data for stat cards
  const sparklineData = [
    [4200, 4800, 4500, 5100, 5500, 6050, 6820],
    [3800, 4100, 3600, 4200, 4500, 4300, 3958],
    [900, 1100, 1200, 800, 1500, 1600, 2862],
    [72000, 73200, 74100, 74800, 75400, 75800, 76022],
  ];

  const statCards = [
    {
      title: "Total Balance",
      value: `$${totalBalance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: "+2.5%",
      trend: "up" as const,
      icon: Wallet,
      gradient: "from-primary/10 via-primary/5 to-transparent",
      iconBg: "bg-primary/15 text-primary",
      sparkColor: "#10b981",
      sparkIndex: 3,
    },
    {
      title: "Monthly Income",
      value: `$${income.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: `+${incomeTrend.toFixed(1)}%`,
      trend: "up" as const,
      icon: TrendingUp,
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      iconBg:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      sparkColor: "#10b981",
      sparkIndex: 0,
    },
    {
      title: "Monthly Expenses",
      value: `$${expenses.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: `-${expenseTrend.toFixed(1)}%`,
      trend: "down" as const,
      icon: CreditCard,
      gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
      iconBg:
        "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      sparkColor: "#f97316",
      sparkIndex: 1,
    },
    {
      title: "Net Savings",
      value: `$${netSavings.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: `+${savingsTrend.toFixed(1)}%`,
      trend: "up" as const,
      icon: PiggyBank,
      gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
      iconBg:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
      sparkColor: "#8b5cf6",
      sparkIndex: 2,
    },
  ];

  // Recent transactions for display
  const recentTransactions = transactions.slice(0, 6);

  // Top budgets
  const topBudgets = budgets.slice(0, 4);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl tracking-tight font-extrabold">
              {greeting}
            </h1>
          </div>
          <p className="text-muted-foreground mt-0.5 text-sm">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button
            onClick={() => setAddTxOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 font-semibold"
          >
            <DollarSign className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Stat cards - Modern with sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <ModernStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            gradient={stat.gradient}
            iconBg={stat.iconBg}
            sparkColor={stat.sparkColor}
            sparkData={sparklineData[stat.sparkIndex]}
          />
        ))}
      </div>

      {/* Charts + Quick Actions row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Income vs Expenses chart */}
        <Card className="xl:col-span-5 border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Income vs Expenses
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Last 6 months comparison
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Income
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  Expenses
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#10b981"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="expenseGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.15)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip period={period} />} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#incomeGrad)"
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fill="url(#expenseGrad)"
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly spending chart */}
        <Card className="xl:col-span-4 border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Weekly Spending
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  This week's daily expenses
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="border-0 text-xs bg-primary/10 text-primary font-semibold"
              >
                ${chartData.reduce((s, d) => s + d.expense, 0).toFixed(0)} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.15)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    content={<CustomTooltip period={period} />}
                    cursor={{ fill: "rgba(16,185,129,0.05)", radius: 6 }}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    name="Spent"
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="xl:col-span-3">
          <QuickActions onAddTransaction={() => setAddTxOpen(true)} />
        </div>
      </div>

      {/* Middle row: Health + Upcoming Bills + Financial Tips */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <HealthScoreCard />
        <UpcomingBillsCard />
        <FinancialTipsCard />
      </div>

      {/* Budget Overview Row */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Budget Overview
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  {new Date().toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  spending limits
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBudgets.map((budget) => {
                const percentage = Math.round(
                  (budget.spent / budget.amount) * 100
                );
                const isNearLimit = percentage >= 85;
                return (
                  <div key={budget.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: budget.categoryColor }}
                        />
                        <span className="text-xs font-medium">
                          {budget.categoryName}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ${budget.spent.toFixed(0)}{" "}
                        <span className="opacity-50">/</span> ${budget.amount}
                      </span>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isNearLimit
                            ? "#ef4444"
                            : budget.categoryColor,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span
                        className={
                          isNearLimit
                            ? "text-red-500 dark:text-red-400 font-semibold"
                            : ""
                        }
                      >
                        {percentage}% used
                      </span>
                      <span>
                        ${(budget.amount - budget.spent).toFixed(0)} left
                      </span>
                    </div>
                  </div>
                );
              })}
              {budgets.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No active budgets. Create one to track your spending!
                </div>
              )}
            </div>
            {budgets.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total budget</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      ${budgets.reduce((s, b) => s + b.spent, 0).toFixed(0)}
                    </span>
                    <span className="text-muted-foreground">
                      / $
                      {budgets
                        .reduce((s, b) => s + b.amount, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Recent Transactions */}
      <Card className="border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Recent Transactions
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Your latest financial activity
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 transition-colors font-semibold"
              asChild
            >
              <Link to="/transactions">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0.5">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-accent/60 transition-all duration-150 cursor-pointer group"
                onClick={() => navigate("/transactions")}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                    tx.type === "income"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                  }`}
                >
                  {tx.type === "transfer" ? (
                    <ArrowRightLeft className="h-4 w-4" />
                  ) : (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M12 2v20M2 12h20"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate font-semibold">
                    {tx.categoryName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.walletName} ·{" "}
                    {new Date(tx.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      tx.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : tx.type === "expense"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tx.type === "income"
                      ? "+"
                      : tx.type === "expense"
                      ? "-"
                      : ""}
                    ${Math.abs(tx.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No transactions yet. Add your first transaction to get started!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
