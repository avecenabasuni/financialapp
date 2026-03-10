import { useState } from "react";
import {
  Target,
  Plus,
  Shield,
  Car,
  Home,
  MoreVertical,
  Calendar,
  TrendingUp,
  Clock,
  Wallet,
  ChevronRight,
  Palmtree,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { goals } from "./mock-data";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const iconMap: Record<string, React.ElementType> = {
  Shield, Palmtree, Car, Home,
};

const goalProgressHistory = [
  { month: "Sep", emergencyFund: 8000, vacation: 800, newCar: 4000, homeDown: 12000 },
  { month: "Oct", emergencyFund: 9200, vacation: 1200, newCar: 5200, homeDown: 14500 },
  { month: "Nov", emergencyFund: 10400, vacation: 1600, newCar: 6100, homeDown: 16200 },
  { month: "Dec", emergencyFund: 11200, vacation: 2000, newCar: 6800, homeDown: 17800 },
  { month: "Jan", emergencyFund: 11800, vacation: 2400, newCar: 7600, homeDown: 19400 },
  { month: "Feb", emergencyFund: 12400, vacation: 2800, newCar: 8500, homeDown: 21000 },
];

const colorPalette = [
  { bg: "bg-emerald-50 dark:bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", bar: "#10b981", gradient: "from-emerald-500/20 to-transparent" },
  { bg: "bg-sky-50 dark:bg-sky-500/15", text: "text-sky-600 dark:text-sky-400", bar: "#0ea5e9", gradient: "from-sky-500/20 to-transparent" },
  { bg: "bg-amber-50 dark:bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", bar: "#f59e0b", gradient: "from-amber-500/20 to-transparent" },
  { bg: "bg-violet-50 dark:bg-violet-500/15", text: "text-violet-600 dark:text-violet-400", bar: "#8b5cf6", gradient: "from-violet-500/20 to-transparent" },
];

export function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);
  const overallProgress = Math.round((totalCurrent / totalTarget) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 700 }}>Savings Goals</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Track your progress towards financial milestones.</p>
        </div>
        <button
          onClick={() => toast.info("Goal creation coming soon!")}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 self-start"
          style={{ fontWeight: 600 }}
        >
          <Plus className="h-4 w-4" />
          New Goal
        </button>
      </div>

      {/* Overall progress hero */}
      <Card className="relative overflow-hidden border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-violet-500/5" />
        <CardContent className="relative p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Total Savings Progress</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-3xl" style={{ fontWeight: 700 }}>${totalCurrent.toLocaleString()}</p>
                <p className="text-base text-muted-foreground">/ ${totalTarget.toLocaleString()}</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{overallProgress}% achieved</span>
                  <span style={{ fontWeight: 600 }}>${(totalTarget - totalCurrent).toLocaleString()} to go</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-emerald-400 to-primary/80 transition-all duration-1000"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{overallProgress}% achieved across {goals.length} active goals</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="rounded-xl bg-card border border-border/60 p-4 text-center hover:shadow-md transition-all">
                <div className="flex justify-center mb-1.5">
                  <Target className="h-4.5 w-4.5 text-primary" />
                </div>
                <p className="text-lg" style={{ fontWeight: 700 }}>{goals.length}</p>
                <p className="text-xs text-muted-foreground">Active Goals</p>
              </div>
              <div className="rounded-xl bg-card border border-border/60 p-4 text-center hover:shadow-md transition-all">
                <div className="flex justify-center mb-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-lg" style={{ fontWeight: 700 }}>$1,250</p>
                <p className="text-xs text-muted-foreground">Monthly Avg</p>
              </div>
              <div className="rounded-xl bg-card border border-border/60 p-4 text-center hover:shadow-md transition-all">
                <div className="flex justify-center mb-1.5">
                  <Wallet className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-lg" style={{ fontWeight: 700 }}>${(totalTarget - totalCurrent).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress chart */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Goal Progress History</CardTitle>
              <CardDescription className="mt-0.5 text-xs">Savings growth over the last 6 months</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              {goals.map((g, i) => (
                <span key={g.id} className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorPalette[i].bar }} />
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={goalProgressHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="emergencyFund" stroke="#10b981" strokeWidth={2} fill="url(#g1)" name="Emergency Fund" />
                <Area type="monotone" dataKey="vacation" stroke="#0ea5e9" strokeWidth={2} fill="url(#g2)" name="Vacation Fund" />
                <Area type="monotone" dataKey="newCar" stroke="#f59e0b" strokeWidth={2} fill="url(#g3)" name="New Car" />
                <Area type="monotone" dataKey="homeDown" stroke="#8b5cf6" strokeWidth={2} fill="url(#g4)" name="Home Down Payment" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Goal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal, index) => {
          const Icon = iconMap[goal.icon] || Target;
          const progress = Math.round((goal.current / goal.target) * 100);
          const remaining = goal.target - goal.current;
          const deadlineDate = new Date(goal.deadline);
          const today = new Date();
          const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const monthsLeft = Math.max(Math.ceil(daysLeft / 30), 1);
          const monthlyNeeded = remaining / monthsLeft;
          const color = colorPalette[index % colorPalette.length];
          const isSelected = selectedGoal === goal.id;

          return (
            <Card
              key={goal.id}
              className={`group relative overflow-hidden cursor-pointer border-border/60 transition-all duration-300 ${isSelected ? "shadow-lg shadow-black/10 ring-1 ring-primary/20" : "hover:shadow-md hover:shadow-black/5"}`}
              onClick={() => setSelectedGoal(isSelected ? null : goal.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color.bg} ${color.text} transition-transform group-hover:scale-105`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm" style={{ fontWeight: 600 }}>{goal.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {deadlineDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-card p-0.5"
                    onClick={(e) => { e.stopPropagation(); toast.info(`Managing ${goal.name}`); }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl" style={{ fontWeight: 700 }}>${goal.current.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">/ ${goal.target.toLocaleString()}</span>
                    </div>
                    <span className={`text-sm ${color.text}`} style={{ fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div className="mt-3 relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, backgroundColor: color.bar }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Need</span>
                    <span className="text-xs" style={{ fontWeight: 700 }}>${Math.round(monthlyNeeded).toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                    <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>Contribution Options</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[500, 1000, 2000].map((amount) => (
                        <button
                          key={amount}
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success(`$${amount} contribution recorded for ${goal.name}!`);
                          }}
                          className={`rounded-lg py-1.5 text-xs border border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all ${color.text}`}
                          style={{ fontWeight: 600 }}
                        >
                          +${amount}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Add new goal card */}
        <button
          onClick={() => toast.info("Goal creation coming soon!")}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 min-h-[200px] cursor-pointer group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors group-hover:rotate-90 duration-300" />
          </div>
          <p className="text-sm text-muted-foreground group-hover:text-foreground mt-3 transition-colors" style={{ fontWeight: 500 }}>Add a New Goal</p>
          <p className="text-xs text-muted-foreground mt-0.5 opacity-70">Set a target and start saving</p>
        </button>
      </div>
    </div>
  );
}
