import {
  CreditCard,
  Building2,
  TrendingUp,
  Plus,
  MoreVertical,
  ArrowUpRight,
  Eye,
  EyeOff,
  RefreshCw,
  Landmark,
  PieChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { accounts } from "./mock-data";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

const accountBalanceHistory = [
  { month: "Sep", checking: 6800, savings: 20100, investment: 38400 },
  { month: "Oct", checking: 7200, savings: 21200, investment: 40100 },
  { month: "Nov", checking: 8100, savings: 22000, investment: 41800 },
  { month: "Dec", checking: 7500, savings: 23100, investment: 43200 },
  { month: "Jan", checking: 7900, savings: 23800, investment: 44100 },
  { month: "Feb", checking: 8452, savings: 24680, investment: 45230 },
];

const accountIcons: Record<string, React.ElementType> = {
  Checking: Building2,
  Savings: Landmark,
  Credit: CreditCard,
  Investment: TrendingUp,
};

const accountTypeColors: Record<string, string> = {
  Checking: "#6366f1",
  Savings: "#10b981",
  Credit: "#f59e0b",
  Investment: "#8b5cf6",
};

export function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalAssets = accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter((a) => a.balance < 0).reduce((s, a) => s + Math.abs(a.balance), 0);

  const pieData = accounts
    .filter((a) => a.balance > 0)
    .map((a) => ({
      name: a.name,
      value: a.balance,
      color: a.color,
    }));

  const maskBalance = (val: string) => "••••••";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 700 }}>Accounts</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Manage and monitor all your financial accounts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 h-9 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBalances ? "Hide" : "Show"} Balances
          </button>
          <button
            onClick={() => toast.info("Account linking coming soon!")}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            style={{ fontWeight: 600 }}
          >
            <Plus className="h-4 w-4" />
            Link Account
          </button>
        </div>
      </div>

      {/* Net Worth Card */}
      <Card className="relative overflow-hidden border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-violet-500/5" />
        <CardContent className="relative p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Net Worth</p>
              <p className="text-3xl mt-1.5" style={{ fontWeight: 700 }}>
                {showBalances ? `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : maskBalance("")}
              </p>
              <Badge variant="secondary" className="mt-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border-0 gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3" />
                +5.2% this month
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Total Assets</p>
              <p className="text-2xl mt-1.5 text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 700 }}>
                {showBalances ? `$${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : maskBalance("")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Across {accounts.filter((a) => a.balance > 0).length} accounts</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Total Liabilities</p>
              <p className="text-2xl mt-1.5 text-red-600 dark:text-red-400" style={{ fontWeight: 700 }}>
                {showBalances ? `$${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : maskBalance("")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{accounts.filter((a) => a.balance < 0).length} account</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account cards + allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Account cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accounts.map((account) => {
            const Icon = accountIcons[account.type] || Building2;
            const isPositive = account.balance >= 0;
            return (
              <Card
                key={account.id}
                className="group relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300 cursor-pointer"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 transition-all"
                  style={{ backgroundColor: account.color }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${account.color}08 0%, transparent 60%)` }}
                />
                <CardContent className="relative p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                        style={{ backgroundColor: `${account.color}15`, color: account.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm" style={{ fontWeight: 600 }}>{account.name}</h3>
                        <p className="text-xs text-muted-foreground">{account.institution} · ****{account.lastFour}</p>
                      </div>
                    </div>
                    <button
                      className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-muted p-0.5"
                      onClick={() => toast.info(`Viewing ${account.name} details`)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground">Current Balance</p>
                    <p
                      className={`text-2xl mt-0.5 ${isPositive ? "" : "text-red-600 dark:text-red-400"}`}
                      style={{ fontWeight: 700 }}
                    >
                      {showBalances
                        ? `${isPositive ? "" : "-"}$${Math.abs(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : maskBalance("")}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="secondary" className="border-0 text-xs">
                      {account.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <RefreshCw className="h-3 w-3" />
                      Updated today
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Asset allocation */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Asset Allocation</CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">Distribution across accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <RPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [showBalances ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "••••••", ""]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      fontSize: "12px",
                    }}
                  />
                </RPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5 mt-3">
              {pieData.map((item) => {
                const pct = Math.round((item.value / totalAssets) * 100);
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span style={{ fontWeight: 500 }}>{item.name}</span>
                      </span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance History Chart */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Balance History</CardTitle>
              <CardDescription className="mt-0.5 text-xs">Account balance trends over time</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              {[
                { label: "Checking", color: "#6366f1" },
                { label: "Savings", color: "#10b981" },
                { label: "Investment", color: "#8b5cf6" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accountBalanceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="checkingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="savingsGradAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
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
                  formatter={(value: number) => [showBalances ? `$${value.toLocaleString()}` : "••••••", ""]}
                />
                <Area type="monotone" dataKey="checking" stroke="#6366f1" strokeWidth={2} fill="url(#checkingGrad)" name="Checking" />
                <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} fill="url(#savingsGradAcc)" name="Savings" />
                <Area type="monotone" dataKey="investment" stroke="#8b5cf6" strokeWidth={2} fill="url(#investGrad)" name="Investment" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
