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

const iconMap: Record<string, React.ElementType> = {
  Home, ShoppingCart, Car, Tv, Zap, UtensilsCrossed, ShoppingBag, Heart,
};

export function BudgetsPage() {
  const totalAllocated = budgetCategories.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgetCategories.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalAllocated) * 100);

  const pieData = budgetCategories.map((b) => ({
    name: b.name,
    value: b.spent,
    color: b.color,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 600 }}>Budgets</h1>
          <p className="text-muted-foreground mt-1">Set spending limits and track your progress.</p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-colors self-start">
          <Plus className="h-4 w-4" />
          New Budget
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Pie chart */}
        <Card className="xl:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Spending Distribution</CardTitle>
            <CardDescription className="mt-1">Where your money goes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, ""]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Monthly Summary</CardTitle>
            <CardDescription className="mt-1">February 2026 budget overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Budget</p>
                <p className="text-2xl" style={{ fontWeight: 600 }}>${totalAllocated.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-2xl text-orange-600" style={{ fontWeight: 600 }}>${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-2xl text-emerald-600" style={{ fontWeight: 600 }}>${totalRemaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Overall progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span style={{ fontWeight: 500 }}>{overallPercentage}% used</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
              <div className="flex items-center gap-2 mt-3">
                {overallPercentage < 80 ? (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-0 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    On Track
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-0 gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Approaching Limit
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {Math.round((1 - totalSpent / totalAllocated) * 100)}% of budget remaining with {28 - 18} days left
                </span>
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
          const isOverBudget = percentage >= 90;
          const remaining = budget.allocated - budget.spent;

          return (
            <Card key={budget.id} className="relative overflow-hidden group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${budget.color}15`, color: budget.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm" style={{ fontWeight: 500 }}>{budget.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl" style={{ fontWeight: 600 }}>${budget.spent.toFixed(0)}</span>
                    <span className="text-sm text-muted-foreground">/ ${budget.allocated}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: isOverBudget ? "#ef4444" : budget.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={isOverBudget ? "text-red-600" : "text-muted-foreground"} style={{ fontWeight: 500 }}>
                      {percentage}%
                    </span>
                    <span className="text-muted-foreground">${remaining.toFixed(0)} left</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
