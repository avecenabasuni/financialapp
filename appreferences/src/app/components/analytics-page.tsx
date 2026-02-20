import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
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

const cashflowData = [
  { month: "Sep", net: 1600 },
  { month: "Oct", net: 1600 },
  { month: "Nov", net: 2100 },
  { month: "Dec", net: 2100 },
  { month: "Jan", net: 1750 },
  { month: "Feb", net: 2863 },
];

const insights = [
  {
    title: "Highest Saving Month",
    value: "February",
    detail: "$2,863 saved",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Top Spending Category",
    value: "Housing",
    detail: "$1,800 this month",
    icon: ArrowUpRight,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "Spending Trend",
    value: "Decreasing",
    detail: "-8.1% vs last month",
    icon: TrendingDown,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Savings Rate",
    value: "42%",
    detail: "Of total income",
    icon: ArrowUpRight,
    color: "text-amber-600",
    bg: "bg-amber-50",
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

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 600 }}>Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your financial patterns.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">
            <Calendar className="h-4 w-4" />
            Last 6 Months
          </button>
        </div>
      </div>

      {/* Quick insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <Card key={insight.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${insight.bg} ${insight.color}`}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{insight.title}</p>
                  <p className="text-lg" style={{ fontWeight: 600 }}>{insight.value}</p>
                  <p className="text-xs text-muted-foreground">{insight.detail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Net Cash Flow */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Net Cash Flow</CardTitle>
                <CardDescription className="mt-1">Monthly income minus expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" maxBarSize={30} />
                      <Bar dataKey="expenses" fill="#6366f1" radius={[6, 6, 0, 0]} name="Expenses" maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Spending Radar */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Spending Pattern</CardTitle>
                <CardDescription className="mt-1">Current vs average spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar name="Current" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                      <Radar name="Average" dataKey="average" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-2 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    Current Month
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#6366f1]" />
                    6-Month Average
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Category breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription className="mt-1">Spending by category this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
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
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category list */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Spending Ranking</CardTitle>
                <CardDescription className="mt-1">Categories sorted by amount spent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryBreakdown
                    .sort((a, b) => b.value - a.value)
                    .map((cat, idx) => {
                      const total = categoryBreakdown.reduce((s, c) => s + c.value, 0);
                      const pct = Math.round((cat.value / total) * 100);
                      return (
                        <div key={cat.name} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-5">{idx + 1}</span>
                          <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm flex-1" style={{ fontWeight: 500 }}>{cat.name}</span>
                          <span className="text-sm" style={{ fontWeight: 500 }}>${cat.value}</span>
                          <Badge variant="secondary" className="border-0 text-xs w-12 justify-center">
                            {pct}%
                          </Badge>
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Savings Trend</CardTitle>
                <CardDescription className="mt-1">Monthly savings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={savingsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2.5} fill="url(#savingsGrad)" name="Savings" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Savings rate */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Savings Rate History</CardTitle>
                <CardDescription className="mt-1">Percentage of income saved each month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData.map((d) => ({
                        month: d.month,
                        rate: Math.round(((d.income - d.expenses) / d.income) * 100),
                      }))}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Savings Rate"]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} name="Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
