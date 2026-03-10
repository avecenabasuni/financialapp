import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  BarChart2,
  Zap,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts";
import { monthlyData, categoryBreakdown } from "./mock-data";
import { toast } from "sonner";

const savingsData = [
  { month: "Sep", savings: 1600 },
  { month: "Oct", savings: 1600 },
  { month: "Nov", savings: 2100 },
  { month: "Dec", savings: 2100 },
  { month: "Jan", savings: 1750 },
  { month: "Feb", savings: 2863 },
];

const radarData = [
  { category: "Housing", current: 90, average: 75 },
  { category: "Food", current: 68, average: 70 },
  { category: "Transport", current: 72, average: 65 },
  { category: "Entertainment", current: 84, average: 80 },
  { category: "Utilities", current: 57, average: 60 },
  { category: "Shopping", current: 95, average: 70 },
  { category: "Health", current: 50, average: 55 },
];

const insights = [
  {
    title: "Highest Saving Month",
    value: "February",
    detail: "$2,863 saved",
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    gradient: "from-emerald-500/10 to-transparent",
    change: "+63.6%",
    changeUp: true,
  },
  {
    title: "Top Spending Category",
    value: "Housing",
    detail: "$1,800 this month",
    icon: ArrowUpRight,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/15",
    gradient: "from-violet-500/10 to-transparent",
    change: "45.5%",
    changeUp: false,
  },
  {
    title: "Spending Trend",
    value: "Decreasing",
    detail: "-8.1% vs last month",
    icon: TrendingDown,
    color: "text-primary",
    bg: "bg-primary/10",
    gradient: "from-primary/10 to-transparent",
    change: "-8.1%",
    changeUp: true,
  },
  {
    title: "Savings Rate",
    value: "42%",
    detail: "Of total income",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/15",
    gradient: "from-amber-500/10 to-transparent",
    change: "+5.2%",
    changeUp: true,
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

export function AnalyticsPage() {
  // Fix: avoid mutating imported array with spread + sort
  const sortedCategoryBreakdown = [...categoryBreakdown].sort((a, b) => b.value - a.value);
  const totalSpend = categoryBreakdown.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 700 }}>Analytics</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Deep insights into your financial patterns.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-border px-3 h-9 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Calendar className="h-4 w-4" />
            Last 6 Months
          </button>
          <button
            onClick={() => toast.success("Report downloaded!")}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 h-9 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Quick insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <Card key={insight.title} className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300 group">
            <div className={`absolute inset-0 bg-gradient-to-br ${insight.gradient}`} />
            <CardContent className="relative p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${insight.bg} ${insight.color}`}>
                  <insight.icon className="h-4.5 w-4.5" />
                </div>
                <Badge
                  variant="secondary"
                  className={`border-0 text-xs ${insight.changeUp ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"}`}
                >
                  {insight.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{insight.title}</p>
              <p className="text-lg mt-0.5" style={{ fontWeight: 700 }}>{insight.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{insight.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart2 className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="spending" className="gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Spending
          </TabsTrigger>
          <TabsTrigger value="savings" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            Savings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Net Cash Flow */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Net Cash Flow</CardTitle>
                    <CardDescription className="mt-0.5 text-xs">Monthly income minus expenses</CardDescription>
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
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)", radius: 6 }} />
                      <Bar dataKey="income" fill="#10b981" radius={[5, 5, 0, 0]} name="Income" maxBarSize={28} />
                      <Bar dataKey="expenses" fill="#8b5cf6" radius={[5, 5, 0, 0]} name="Expenses" maxBarSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Spending Radar */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Spending Pattern</CardTitle>
                <CardDescription className="mt-0.5 text-xs">Current vs average spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(148,163,184,0.2)" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar name="Current" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                      <Radar name="Average" dataKey="average" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.08} strokeWidth={2} strokeDasharray="4 4" />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Current Month
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                    6-Month Average
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Category breakdown donut */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Category Breakdown</CardTitle>
                <CardDescription className="mt-0.5 text-xs">Spending by category this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={115}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryBreakdown.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`$${value}`, ""]}
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
                    <p className="text-xl" style={{ fontWeight: 700 }}>${totalSpend.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category ranking */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Spending Ranking</CardTitle>
                <CardDescription className="mt-0.5 text-xs">Categories sorted by amount spent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedCategoryBreakdown.map((cat, idx) => {
                    const pct = Math.round((cat.value / totalSpend) * 100);
                    return (
                      <div key={cat.name} className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-4 shrink-0" style={{ fontWeight: 600 }}>{idx + 1}</span>
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="text-xs flex-1" style={{ fontWeight: 500 }}>{cat.name}</span>
                          <span className="text-xs" style={{ fontWeight: 600 }}>${cat.value.toLocaleString()}</span>
                          <Badge variant="secondary" className="border-0 text-[10px] px-1.5 py-0 min-w-[32px] justify-center">
                            {pct}%
                          </Badge>
                        </div>
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted ml-7">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="savings" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Savings trend */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Savings Trend</CardTitle>
                    <CardDescription className="mt-0.5 text-xs">Monthly savings over time</CardDescription>
                  </div>
                  <Badge variant="secondary" className="border-0 text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                    +78.9% growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={savingsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2.5} fill="url(#savingsGrad)" name="Savings" dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Savings rate */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Savings Rate History</CardTitle>
                <CardDescription className="mt-0.5 text-xs">Percentage of income saved each month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData.map((d) => ({
                        month: d.month,
                        rate: Math.round(((d.income - d.expenses) / d.income) * 100),
                      }))}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Savings Rate"]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid var(--border)",
                          background: "var(--card)",
                          fontSize: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        name="Rate"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly comparison table */}
          <Card className="border-border/60 mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Monthly Breakdown</CardTitle>
              <CardDescription className="mt-0.5 text-xs">Income, expenses, and savings per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left py-2 px-3 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>Month</th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>Income</th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>Expenses</th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>Saved</th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((d) => {
                      const saved = d.income - d.expenses;
                      const rate = Math.round((saved / d.income) * 100);
                      return (
                        <tr key={d.month} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3 text-xs" style={{ fontWeight: 500 }}>{d.month}</td>
                          <td className="py-2.5 px-3 text-xs text-right text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 600 }}>+${d.income.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-xs text-right" style={{ fontWeight: 500 }}>${d.expenses.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-xs text-right text-primary" style={{ fontWeight: 600 }}>${saved.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge variant="secondary" className={`border-0 text-[10px] ${rate >= 30 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"}`}>
                              {rate}%
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}