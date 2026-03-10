import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  ShoppingCart,
  Tv,
  Car,
  Laptop,
  Zap,
  Coffee,
  Package,
  Home,
  MoreHorizontal,
  Wallet,
  Sparkles,
  PiggyBank,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { transactions, monthlyData, weeklySpending, budgetCategories } from "./mock-data";
import { HealthScoreCard } from "./health-score-card";
import { QuickActions } from "./quick-actions";
import { UpcomingBillsCard } from "./upcoming-bills-card";
import { FinancialTipsCard } from "./financial-tips-card";
import { CurrencyConverter } from "./currency-converter";
import { AddTransactionDialog } from "./add-transaction-dialog";

const iconMap: Record<string, React.ElementType> = {
  Briefcase, ShoppingCart, Tv, Car, Laptop, Zap, Coffee, Package, Home,
};

const sparklineData = [
  [4200, 4800, 4500, 5100, 5500, 6050, 6820],
  [3800, 4100, 3600, 4200, 4500, 4300, 3958],
  [900, 1100, 1200, 800, 1500, 1600, 2862],
  [72000, 73200, 74100, 74800, 75400, 75800, 76022],
];

const statCards = [
  {
    title: "Total Balance",
    value: "$76,022.13",
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
    value: "$6,820.00",
    change: "+12.7%",
    trend: "up" as const,
    icon: TrendingUp,
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    sparkColor: "#10b981",
    sparkIndex: 0,
  },
  {
    title: "Monthly Expenses",
    value: "$3,957.76",
    change: "-8.1%",
    trend: "down" as const,
    icon: CreditCard,
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
    iconBg: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    sparkColor: "#f97316",
    sparkIndex: 1,
  },
  {
    title: "Net Savings",
    value: "$2,862.24",
    change: "+24.3%",
    trend: "up" as const,
    icon: PiggyBank,
    gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
    iconBg: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    sparkColor: "#8b5cf6",
    sparkIndex: 2,
  },
];

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl shadow-black/10">
        <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-xs" style={{ color: entry.color, fontWeight: 600 }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
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

export function Dashboard() {
  const [addTxOpen, setAddTxOpen] = useState(false);
  const recentTransactions = transactions.slice(0, 6);
  const topBudgets = budgetCategories.slice(0, 4);

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl tracking-tight" style={{ fontWeight: 700 }}>
              {greeting}, Jordan 👋
            </h1>
          </div>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Here's your financial overview — March 2026.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => setAddTxOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
            style={{ fontWeight: 600 }}
          >
            <DollarSign className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="relative overflow-hidden group hover:shadow-md hover:shadow-black/5 transition-all duration-300 border-border/60">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
            <CardContent className="relative p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} shrink-0`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge
                  variant="secondary"
                  className={`border-0 text-xs gap-0.5 ${
                    stat.trend === "up"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">{stat.title}</p>
                <p className="text-xl tracking-tight mt-0.5" style={{ fontWeight: 700 }}>{stat.value}</p>
              </div>
              {/* Sparkline */}
              <div className="h-10 mt-3 opacity-60 group-hover:opacity-90 transition-opacity">
                <SparkLine data={sparklineData[index]} color={stat.sparkColor} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts + Quick Actions row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Income vs Expenses chart */}
        <Card className="xl:col-span-5 border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Income vs Expenses</CardTitle>
                <CardDescription className="mt-0.5 text-xs">Last 6 months comparison</CardDescription>
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
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fill="url(#incomeGrad)" name="Income" />
                  <Area type="monotone" dataKey="expenses" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#expenseGrad)" name="Expenses" />
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
                <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Weekly Spending</CardTitle>
                <CardDescription className="mt-0.5 text-xs">This week's daily expenses</CardDescription>
              </div>
              <Badge variant="secondary" className="border-0 text-xs bg-primary/10 text-primary">
                $1,164 total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySpending} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(16,185,129,0.05)", radius: 6 }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} name="Spent" maxBarSize={36} />
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

      {/* Middle row: Health + Tips + Upcoming Bills */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <HealthScoreCard />
        <UpcomingBillsCard />
        <div className="space-y-4">
          <FinancialTipsCard />
          <CurrencyConverter />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Recent transactions */}
        <Card className="xl:col-span-3 border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Recent Transactions</CardTitle>
                <CardDescription className="mt-0.5 text-xs">Your latest financial activity</CardDescription>
              </div>
              <button
                className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                style={{ fontWeight: 500 }}
              >
                View all
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0.5">
              {recentTransactions.map((tx) => {
                const Icon = iconMap[tx.icon] || DollarSign;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-accent/60 transition-all duration-150 cursor-pointer group"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                        tx.type === "income"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ fontWeight: 500 }}>{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.category} · {tx.account}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm ${
                          tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {tx.type === "income" ? "+" : ""}
                        ${Math.abs(tx.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget overview */}
        <Card className="xl:col-span-2 border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Budget Overview</CardTitle>
                <CardDescription className="mt-0.5 text-xs">February spending limits</CardDescription>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent p-1">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBudgets.map((budget) => {
                const percentage = Math.round((budget.spent / budget.allocated) * 100);
                const isNearLimit = percentage >= 85;
                return (
                  <div key={budget.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: budget.color }}
                        />
                        <span className="text-xs" style={{ fontWeight: 500 }}>{budget.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ${budget.spent.toFixed(0)} <span className="opacity-50">/</span> ${budget.allocated}
                      </span>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isNearLimit ? "#ef4444" : budget.color,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className={isNearLimit ? "text-red-500 dark:text-red-400" : ""} style={{ fontWeight: isNearLimit ? 600 : 400 }}>
                        {percentage}% used
                      </span>
                      <span>${(budget.allocated - budget.spent).toFixed(0)} left</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total budget</span>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 600 }}>
                    ${budgetCategories.reduce((s, b) => s + b.spent, 0).toFixed(0)}
                  </span>
                  <span className="text-muted-foreground">
                    / ${budgetCategories.reduce((s, b) => s + b.allocated, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTransactionDialog open={addTxOpen} onOpenChange={setAddTxOpen} />
    </div>
  );
}
