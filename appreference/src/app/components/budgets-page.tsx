import { useState } from "react";
import {
  Plus,
  Home,
  ShoppingCart,
  Car,
  Tv,
  Zap,
  UtensilsCrossed,
  ShoppingBag,
  Heart,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  TrendingDown,
  Target,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { budgetCategories } from "./mock-data";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  Home, ShoppingCart, Car, Tv, Zap, UtensilsCrossed, ShoppingBag, Heart,
};

export function BudgetsPage() {
  const [hoveredBudget, setHoveredBudget] = useState<string | null>(null);

  const totalAllocated = budgetCategories.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgetCategories.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalAllocated) * 100);

  const pieData = budgetCategories.map((b) => ({
    name: b.name,
    value: b.spent,
    color: b.color,
  }));

  const onBudget = budgetCategories.filter((b) => (b.spent / b.allocated) < 0.9).length;
  const nearLimit = budgetCategories.filter((b) => (b.spent / b.allocated) >= 0.9).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 700 }}>Budgets</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Set spending limits and track your progress.</p>
        </div>
        <button
          onClick={() => toast.info("Budget creation coming soon!")}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 self-start"
          style={{ fontWeight: 600 }}
        >
          <Plus className="h-4 w-4" />
          New Budget
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Pie chart */}
        <Card className="xl:col-span-1 border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Spending Distribution</CardTitle>
            <CardDescription className="mt-0.5 text-xs">Where your money goes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} opacity={hoveredBudget && hoveredBudget !== entry.name ? 0.4 : 1} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(0)}`, ""]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      fontSize: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-lg" style={{ fontWeight: 700 }}>${totalSpent.toFixed(0)}</p>
                <p className="text-[10px] text-muted-foreground">spent</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 w-full">
              {pieData.map((item) => (
                <button
                  key={item.name}
                  className="flex items-center gap-1.5 text-xs text-left hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setHoveredBudget(item.name)}
                  onMouseLeave={() => setHoveredBudget(null)}
                >
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="xl:col-span-2 border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Monthly Summary</CardTitle>
            <CardDescription className="mt-0.5 text-xs">February 2026 budget overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Wallet className="h-3 w-3" /> Total Budget
                </p>
                <p className="text-xl" style={{ fontWeight: 700 }}>${totalAllocated.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> Total Spent
                </p>
                <p className="text-xl text-orange-600 dark:text-orange-400" style={{ fontWeight: 700 }}>
                  ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3" /> Remaining
                </p>
                <p className="text-xl text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 700 }}>
                  ${totalRemaining.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Overall progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Overall Progress</span>
                <span style={{ fontWeight: 600 }}>{overallPercentage}% used</span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-700"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
              <div className="flex items-center gap-3 mt-3">
                {overallPercentage < 80 ? (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border-0 gap-1 text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    On Track
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border-0 gap-1 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    Approaching Limit
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {onBudget} categories on track · {nearLimit} nearing limit
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-border/60">
              <div className="text-center">
                <p className="text-lg" style={{ fontWeight: 700 }}>{budgetCategories.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-lg text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 700 }}>{onBudget}</p>
                <p className="text-xs text-muted-foreground">On Budget</p>
              </div>
              <div className="text-center">
                <p className="text-lg text-amber-600 dark:text-amber-400" style={{ fontWeight: 700 }}>{nearLimit}</p>
                <p className="text-xs text-muted-foreground">Near Limit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {budgetCategories.map((budget) => {
          const Icon = iconMap[budget.icon] || Home;
          const percentage = Math.round((budget.spent / budget.allocated) * 100);
          const isNearLimit = percentage >= 85;
          const isOverBudget = percentage >= 100;
          const remaining = budget.allocated - budget.spent;

          return (
            <Card
              key={budget.id}
              className="relative overflow-hidden group cursor-pointer border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300"
              onMouseEnter={() => setHoveredBudget(budget.name)}
              onMouseLeave={() => setHoveredBudget(null)}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${budget.color}10 0%, transparent 100%)` }}
              />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${budget.color}18`, color: budget.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <button
                    className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-accent p-0.5"
                    onClick={(e) => { e.stopPropagation(); toast.info(`Managing ${budget.name} budget`); }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm" style={{ fontWeight: 600 }}>{budget.name}</h3>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl" style={{ fontWeight: 700 }}>${budget.spent.toFixed(0)}</span>
                    <span className="text-xs text-muted-foreground">/ ${budget.allocated}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: isOverBudget ? "#ef4444" : isNearLimit ? "#f59e0b" : budget.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs ${isOverBudget ? "text-red-500 dark:text-red-400" : isNearLimit ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}
                      style={{ fontWeight: isNearLimit ? 600 : 400 }}
                    >
                      {percentage}%
                    </span>
                    {isNearLimit ? (
                      <Badge
                        variant="secondary"
                        className={`border-0 text-[10px] px-1.5 py-0 ${isOverBudget ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400" : "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"}`}
                      >
                        {isOverBudget ? "Over!" : "Near limit"}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">${remaining.toFixed(0)} left</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add budget card */}
        <button
          onClick={() => toast.info("Budget creation coming soon!")}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 min-h-[160px] cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
            <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-sm text-muted-foreground group-hover:text-foreground mt-2 transition-colors" style={{ fontWeight: 500 }}>
            Add Category
          </p>
        </button>
      </div>
    </div>
  );
}
