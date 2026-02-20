import {
  CreditCard,
  Building2,
  TrendingUp,
  Plus,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  RefreshCw,
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
} from "recharts";

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
  Savings: Building2,
  Credit: CreditCard,
  Investment: TrendingUp,
};

export function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalAssets = accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter((a) => a.balance < 0).reduce((s, a) => s + Math.abs(a.balance), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 600 }}>Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all your financial accounts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBalances ? "Hide" : "Show"} Balances
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            Link Account
          </button>
        </div>
      </div>

      {/* Net Worth Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
        <CardContent className="relative p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Net Worth</p>
              <p className="text-3xl mt-1" style={{ fontWeight: 600 }}>
                {showBalances ? `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "••••••"}
              </p>
              <Badge variant="secondary" className="mt-2 bg-emerald-50 text-emerald-600 border-0 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +5.2% this month
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="text-2xl mt-1 text-emerald-600" style={{ fontWeight: 600 }}>
                {showBalances ? `$${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "••••••"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Across {accounts.filter((a) => a.balance > 0).length} accounts</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Liabilities</p>
              <p className="text-2xl mt-1 text-red-600" style={{ fontWeight: 600 }}>
                {showBalances ? `$${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "••••••"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{accounts.filter((a) => a.balance < 0).length} account</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accounts.map((account) => {
          const Icon = accountIcons[account.type] || Building2;
          const isPositive = account.balance >= 0;
          return (
            <Card key={account.id} className="group relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: account.color }}
              />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${account.color}15`, color: account.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm" style={{ fontWeight: 500 }}>{account.name}</h3>
                      <p className="text-xs text-muted-foreground">{account.institution} &middot; ****{account.lastFour}</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-5">
                  <p className="text-xs text-muted-foreground">Current Balance</p>
                  <p
                    className={`text-2xl mt-0.5 ${isPositive ? "" : "text-red-600"}`}
                    style={{ fontWeight: 600 }}
                  >
                    {showBalances
                      ? `${isPositive ? "" : "-"}$${Math.abs(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : "••••••"}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="secondary" className="border-0">
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

      {/* Balance History Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Balance History</CardTitle>
              <CardDescription className="mt-1">Account balance trends over time</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#6366f1]" />
                Checking
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                Savings
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
                Investment
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accountBalanceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="checkingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="savingsGradAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
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
