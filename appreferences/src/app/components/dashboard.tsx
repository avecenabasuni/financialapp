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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
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
} from "recharts";
import { transactions, monthlyData, weeklySpending, budgetCategories } from "./mock-data";

const iconMap: Record<string, React.ElementType> = {
  Briefcase, ShoppingCart, Tv, Car, Laptop, Zap, Coffee, Package, Home,
};

const statCards = [
  {
    title: "Total Balance",
    value: "$76,022.13",
    change: "+2.5%",
    trend: "up" as const,
    icon: DollarSign,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Monthly Income",
    value: "$6,820.00",
    change: "+12.7%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Monthly Expenses",
    value: "$3,957.76",
    change: "-8.1%",
    trend: "down" as const,
    icon: CreditCard,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Net Savings",
    value: "$2,862.24",
    change: "+24.3%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "bg-violet-50 text-violet-600",
  },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-sm" style={{ color: entry.color, fontWeight: 500 }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function Dashboard() {
  const recentTransactions = transactions.slice(0, 7);
  const topBudgets = budgetCategories.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl tracking-tight" style={{ fontWeight: 600 }}>Good morning, Jordan</h1>
        <p className="text-muted-foreground mt-1">Here's your financial overview for February 2026.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge
                  variant="secondary"
                  className={`border-0 ${
                    stat.trend === "up"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl tracking-tight mt-0.5" style={{ fontWeight: 600 }}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
        {/* Income vs Expenses chart */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription className="mt-1">Last 6 months comparison</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Income
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#6366f1]" />
                  Expenses
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                  <Area type="monotone" dataKey="expenses" stroke="#6366f1" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly spending chart */}
        <Card className="xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Weekly Spending</CardTitle>
            <CardDescription className="mt-1">This week's daily expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySpending} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} name="Spent" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Recent transactions */}
        <Card className="xl:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription className="mt-1">Your latest financial activity</CardDescription>
              </div>
              <button className="text-sm text-primary hover:underline" style={{ fontWeight: 500 }}>View all</button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentTransactions.map((tx) => {
                const Icon = iconMap[tx.icon] || DollarSign;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-accent/50 transition-colors"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        tx.type === "income"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ fontWeight: 500 }}>{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.category} &middot; {tx.account}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm ${
                          tx.type === "income" ? "text-emerald-600" : "text-foreground"
                        }`}
                        style={{ fontWeight: 500 }}
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
        <Card className="xl:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription className="mt-1">February spending limits</CardDescription>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBudgets.map((budget) => {
                const percentage = Math.round((budget.spent / budget.allocated) * 100);
                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: budget.color }}
                        />
                        <span className="text-sm" style={{ fontWeight: 500 }}>{budget.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ${budget.spent.toFixed(0)} / ${budget.allocated}
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: budget.color,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{percentage}% used</span>
                      <span>${(budget.allocated - budget.spent).toFixed(0)} remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
