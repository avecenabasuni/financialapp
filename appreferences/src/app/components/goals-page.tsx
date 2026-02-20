import {
  Target,
  Plus,
  Shield,
  Palmtree,
  Car,
  Home,
  MoreVertical,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { goals } from "./mock-data";

const iconMap: Record<string, React.ElementType> = {
  Shield, Palmtree, Car, Home,
};

export function GoalsPage() {
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);
  const overallProgress = Math.round((totalCurrent / totalTarget) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 600 }}>Savings Goals</h1>
          <p className="text-muted-foreground mt-1">Track your progress towards financial milestones.</p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-colors self-start">
          <Plus className="h-4 w-4" />
          New Goal
        </button>
      </div>

      {/* Overall progress */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-500/5" />
        <CardContent className="relative p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Savings Progress</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl" style={{ fontWeight: 600 }}>${totalCurrent.toLocaleString()}</p>
                <p className="text-lg text-muted-foreground">/ ${totalTarget.toLocaleString()}</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{overallProgress}% achieved across {goals.length} goals</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-card border border-border p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <p className="text-lg" style={{ fontWeight: 600 }}>{goals.length}</p>
                <p className="text-xs text-muted-foreground">Active Goals</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-4 text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-lg" style={{ fontWeight: 600 }}>$1,250</p>
                <p className="text-xs text-muted-foreground">Monthly Avg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const Icon = iconMap[goal.icon] || Target;
          const progress = Math.round((goal.current / goal.target) * 100);
          const remaining = goal.target - goal.current;
          const deadlineDate = new Date(goal.deadline);
          const today = new Date();
          const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const monthsLeft = Math.ceil(daysLeft / 30);
          const monthlyNeeded = remaining / Math.max(monthsLeft, 1);

          const colors = [
            { bg: "bg-emerald-50", text: "text-emerald-600", bar: "#10b981" },
            { bg: "bg-sky-50", text: "text-sky-600", bar: "#0ea5e9" },
            { bg: "bg-amber-50", text: "text-amber-600", bar: "#f59e0b" },
            { bg: "bg-violet-50", text: "text-violet-600", bar: "#8b5cf6" },
          ];
          const color = colors[goals.indexOf(goal) % colors.length];

          return (
            <Card key={goal.id} className="group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color.bg} ${color.text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm" style={{ fontWeight: 500 }}>{goal.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {deadlineDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl" style={{ fontWeight: 600 }}>${goal.current.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">/ ${goal.target.toLocaleString()}</span>
                    </div>
                    <span className={`text-sm ${color.text}`} style={{ fontWeight: 600 }}>{progress}%</span>
                  </div>
                  <div className="mt-3 relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progress}%`, backgroundColor: color.bar }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{daysLeft} days left</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Need <span style={{ fontWeight: 500 }} className="text-foreground">${Math.round(monthlyNeeded).toLocaleString()}</span>/mo
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add new goal card */}
        <Card className="border-dashed border-2 hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
          <CardContent className="p-5 flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Plus className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground mt-3" style={{ fontWeight: 500 }}>Add a New Goal</p>
            <p className="text-xs text-muted-foreground mt-1">Set a target and start saving</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
