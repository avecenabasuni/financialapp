import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { formatCurrency } from "@/lib/utils";
import EmptyState from "@/components/shared/empty-state";
import AnimatedPage from "@/components/shared/animated-page";
import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  Zap,
  Download,
} from "lucide-react";

// Custom Tooltip for charts
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl shadow-black/10">
        <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p
            key={idx}
            className="text-xs font-semibold"
            style={{ color: entry.color }}
          >
            {entry.name}: {formatCurrency(entry.value || 0)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Quick Insight Card Component (appreference style)
interface QuickInsightCardProps {
  title: string;
  value: string;
  detail: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  gradient: string;
  change: string;
  changeUp: boolean;
}

function QuickInsightCard({
  title,
  value,
  detail,
  icon: Icon,
  color,
  bg,
  gradient,
  change,
  changeUp,
}: QuickInsightCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <CardContent className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${color}`}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
          <Badge
            variant="secondary"
            className={`border-0 text-xs ${
              changeUp
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
            }`}
          >
            {change}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-lg mt-0.5 font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
      </CardContent>
    </Card>
  );
}

export default function Statistics() {
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();

  return (
    <StatisticsContent transactions={transactions} categories={categories} />
  );
}

function StatisticsContent({
  transactions,
  categories,
}: {
  transactions: any[];
  categories: any[];
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const analyticsData = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let totalIncome = 0;
    let totalExpense = 0;
    let currentMonthExpense = 0;
    let lastMonthExpense = 0;
    const monthlyNet: Record<string, number> = {};
    const currentMonthCategoryExpense: Record<
      string,
      { value: number; name: string }
    > = {};
    const sixMonthCategoryExpense: Record<string, number> = {};
    const radarCurrentMonth: Record<string, number> = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    const expenseList: any[] = [];

    transactions.forEach((t: any) => {
      const d = new Date(t.date);
      const isCurrentMonth =
        d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      const isLastMonth =
        d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      const isWithin6Months = d >= sixMonthsAgo;
      const monthShort = d.toLocaleDateString("en-US", { month: "short" });

      if (t.type === "income") {
        if (isCurrentMonth) totalIncome += t.amount;
        if (!monthlyNet[monthShort]) monthlyNet[monthShort] = 0;
        monthlyNet[monthShort] += t.amount;
      } else {
        if (isCurrentMonth) totalExpense += t.amount;
        if (!monthlyNet[monthShort]) monthlyNet[monthShort] = 0;
        monthlyNet[monthShort] -= t.amount;

        if (isCurrentMonth) {
          currentMonthExpense += t.amount;
          if (!currentMonthCategoryExpense[t.categoryId]) {
            currentMonthCategoryExpense[t.categoryId] = {
              value: 0,
              name: t.categoryName,
            };
          }
          currentMonthCategoryExpense[t.categoryId].value += t.amount;
          if (!radarCurrentMonth[t.categoryName])
            radarCurrentMonth[t.categoryName] = 0;
          radarCurrentMonth[t.categoryName] += t.amount;
          expenseList.push(t);
        }
        if (isLastMonth) lastMonthExpense += t.amount;
        if (isWithin6Months) {
          if (!sixMonthCategoryExpense[t.categoryName])
            sixMonthCategoryExpense[t.categoryName] = 0;
          sixMonthCategoryExpense[t.categoryName] += t.amount;
        }
      }
    });

    // Highest Saving Month
    let highestSavingMonth = "N/A";
    let highestSavingValue = 0;
    Object.entries(monthlyNet).forEach(([month, net]) => {
      if (net > highestSavingValue) {
        highestSavingValue = net;
        highestSavingMonth = month;
      }
    });

    // Top Spending Category
    let topSpendingCategory = "N/A";
    let topSpendingValue = 0;
    Object.values(currentMonthCategoryExpense).forEach((cat: any) => {
      if (cat.value > topSpendingValue) {
        topSpendingValue = cat.value;
        topSpendingCategory = cat.name;
      }
    });

    // Spending Trend
    let spendingTrendValue = 0;
    let spendingTrendDirection = "Neutral";
    if (lastMonthExpense > 0) {
      spendingTrendValue =
        ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
      spendingTrendDirection =
        spendingTrendValue > 0 ? "Increasing" : "Decreasing";
    }

    // Savings Rate
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Radar Data
    const top6MCats = Object.entries(sixMonthCategoryExpense)
      .map(([name, val]) => ({ name, val: val / 6 }))
      .sort((a, b) => b.val - a.val)
      .slice(0, 6);

    const radarData = top6MCats.map((cat) => ({
      subject: cat.name,
      current: radarCurrentMonth[cat.name] || 0,
      average: cat.val,
    }));

    // Monthly data for charts
    const monthlyData: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString("en-US", { month: "short" });
      const net = monthlyNet[key] || 0;
      monthlyData.push({
        month: key,
        income: 0,
        expenses: 0,
        savings: net > 0 ? net : 0,
        rate: 0,
      });
    }

    // Fill in actual values
    transactions.forEach((t: any) => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString("en-US", { month: "short" });
      const monthData = monthlyData.find((m) => m.month === key);
      if (monthData) {
        if (t.type === "income") {
          monthData.income += t.amount;
        } else {
          monthData.expenses += t.amount;
        }
      }
    });

    // Calculate savings rate for each month
    monthlyData.forEach((m) => {
      m.rate = m.income > 0 ? ((m.income - m.expenses) / m.income) * 100 : 0;
      m.savings = m.income - m.expenses;
    });

    return {
      income: totalIncome,
      expense: totalExpense,
      highestSavingMonth,
      highestSavingValue,
      topSpendingCategory,
      topSpendingValue,
      spendingTrendValue,
      spendingTrendDirection,
      savingsRate,
      radarData,
      currentMonthExpenseList: expenseList,
      monthlyData,
    };
  }, [transactions, categories]);

  // Trend data for charts (last 6 months)
  const trendData = useMemo(() => {
    const map: Record<string, any> = {};
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString("en-US", { month: "short" });
      months.push(key);
      map[key] = { name: key, income: 0, expense: 0 };
    }

    transactions.forEach((t: any) => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString("en-US", { month: "short" });
      if (map[key]) {
        if (t.type === "income") map[key].income += t.amount;
        else map[key].expense += t.amount;
      }
    });

    return months.map((m) => {
      const item = map[m];
      const net = item.income - item.expense;
      item.net = net;
      item.savingsRate = item.income > 0 ? (net / item.income) * 100 : 0;
      return item;
    });
  }, [transactions]);

  // Category breakdown
  const expenseByCategory = useMemo(() => {
    const grouped = analyticsData.currentMonthExpenseList.reduce(
      (acc: any, t: any) => {
        const existing = acc.find((c: any) => c.name === t.categoryName);
        if (existing) {
          existing.value += t.amount;
        } else {
          acc.push({
            name: t.categoryName,
            value: t.amount,
            color: t.categoryColor || "#cbd5e1",
            icon: t.categoryIcon || "HelpCircle",
          });
        }
        return acc;
      },
      []
    );
    return grouped.sort((a: any, b: any) => b.value - a.value);
  }, [analyticsData.currentMonthExpenseList]);

  const totalSpend = expenseByCategory.reduce(
    (sum: number, cat: any) => sum + cat.value,
    0
  );

  // Quick insights data
  const insights = [
    {
      title: "Highest Saving Month",
      value: analyticsData.highestSavingMonth,
      detail: `${formatCurrency(analyticsData.highestSavingValue)} saved`,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/15",
      gradient: "from-emerald-500/10 to-transparent",
      change: "+63.6%",
      changeUp: true,
    },
    {
      title: "Top Spending Category",
      value: analyticsData.topSpendingCategory,
      detail: `${formatCurrency(analyticsData.topSpendingValue)} this month`,
      icon: ArrowUpRight,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/15",
      gradient: "from-violet-500/10 to-transparent",
      change: "45.5%",
      changeUp: false,
    },
    {
      title: "Spending Trend",
      value: analyticsData.spendingTrendDirection,
      detail: `${
        analyticsData.spendingTrendValue > 0 ? "+" : ""
      }${analyticsData.spendingTrendValue.toFixed(1)}% vs last month`,
      icon:
        analyticsData.spendingTrendDirection === "Decreasing"
          ? TrendingDown
          : TrendingUp,
      color:
        analyticsData.spendingTrendDirection === "Decreasing"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400",
      bg: "bg-primary/10",
      gradient: "from-primary/10 to-transparent",
      change: `${
        analyticsData.spendingTrendValue > 0 ? "+" : ""
      }${analyticsData.spendingTrendValue.toFixed(1)}%`,
      changeUp: analyticsData.spendingTrendDirection === "Decreasing",
    },
    {
      title: "Savings Rate",
      value: `${analyticsData.savingsRate.toFixed(0)}%`,
      detail: "Of total income",
      icon: Zap,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/15",
      gradient: "from-amber-500/10 to-transparent",
      change: "+5.2%",
      changeUp: true,
    },
  ];

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No Analytics Yet"
        description="Add transactions to see your financial insights."
      />
    );
  }

  return (
    <AnimatedPage className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Deep insights into your financial patterns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 6 Months
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => toast.success("Report downloaded!")}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((insight, idx) => (
          <QuickInsightCard key={idx} {...insight} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-muted/60">
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
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

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Net Cash Flow */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Net Cash Flow
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      Monthly income minus expenses
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
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trendData}
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
                        tickFormatter={(v) => `$${v / 1000}k`}
                      />
                      <RechartsTooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(148,163,184,0.08)", radius: 6 }}
                      />
                      <Bar
                        dataKey="income"
                        fill="#10b981"
                        radius={[5, 5, 0, 0]}
                        name="Income"
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="expense"
                        fill="#8b5cf6"
                        radius={[5, 5, 0, 0]}
                        name="Expenses"
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Spending Radar */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Spending Pattern
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Current vs average spending by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={analyticsData.radarData}>
                      <PolarGrid stroke="rgba(148,163,184,0.2)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                      />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Average"
                        dataKey="average"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.08}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 text-xs mt-2">
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

        {/* Spending Tab */}
        <TabsContent value="spending" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Category Breakdown Donut */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Category Breakdown
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Spending by category this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={115}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {expenseByCategory.map((entry: any, idx: number) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: any) => [`$${value || 0}`, ""]}
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
                    <p className="text-xl font-bold">
                      {formatCurrency(totalSpend)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Ranking */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Spending Ranking
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Categories sorted by amount spent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenseByCategory.map((cat: any, idx: number) => {
                    const pct =
                      totalSpend > 0
                        ? Math.round((cat.value / totalSpend) * 100)
                        : 0;
                    return (
                      <div key={cat.name} className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-4 shrink-0 font-semibold">
                            {idx + 1}
                          </span>
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-xs flex-1 font-medium">
                            {cat.name}
                          </span>
                          <span className="text-xs font-semibold">
                            {formatCurrency(cat.value)}
                          </span>
                          <Badge
                            variant="secondary"
                            className="border-0 text-[10px] px-1.5 py-0 min-w-[32px] justify-center"
                          >
                            {pct}%
                          </Badge>
                        </div>
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted ml-7">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: cat.color,
                            }}
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

        {/* Savings Tab */}
        <TabsContent value="savings" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Savings Trend */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Savings Trend
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      Monthly savings over time
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="border-0 text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                  >
                    +78.9% growth
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="savingsGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="100%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
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
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="net"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#savingsGrad)"
                        name="Savings"
                        dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Savings Rate History */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Savings Rate History
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Percentage of income saved each month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
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
                        tickFormatter={(v) => `${v.toFixed(0)}%`}
                      />
                      <RechartsTooltip
                        formatter={(value: any) => [
                          `${(value || 0).toFixed(1)}%`,
                          "Savings Rate",
                        ]}
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
                        dataKey="savingsRate"
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

          {/* Monthly Breakdown Table */}
          <Card className="border-border/60 mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Monthly Breakdown
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Income, expenses, and savings per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold">
                        Month
                      </th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold">
                        Income
                      </th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold">
                        Expenses
                      </th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold">
                        Saved
                      </th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold">
                        Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendData.map((d) => {
                      const saved = d.income - d.expense;
                      const rate = d.income > 0 ? (saved / d.income) * 100 : 0;
                      return (
                        <tr
                          key={d.name}
                          className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-2.5 px-3 text-xs font-medium">
                            {d.name}
                          </td>
                          <td className="py-2.5 px-3 text-xs text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                            +{formatCurrency(d.income)}
                          </td>
                          <td className="py-2.5 px-3 text-xs text-right font-medium">
                            {formatCurrency(d.expense)}
                          </td>
                          <td className="py-2.5 px-3 text-xs text-right text-primary font-semibold">
                            {formatCurrency(saved)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge
                              variant="secondary"
                              className={`border-0 text-[10px] ${
                                rate >= 30
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                                  : "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                              }`}
                            >
                              {rate.toFixed(0)}%
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
    </AnimatedPage>
  );
}
