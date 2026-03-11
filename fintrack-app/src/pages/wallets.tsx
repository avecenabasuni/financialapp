import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWalletStore } from "@/store/useWalletStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { formatCurrency } from "@/lib/utils";
import TransactionRow from "@/components/shared/transaction-row";
import EmptyState from "@/components/shared/empty-state";
import AnimatedPage from "@/components/shared/animated-page";
import AddWalletModal from "@/components/modals/add-wallet-modal";
import TransferModal from "@/components/modals/transfer-modal";
import {
  Plus,
  ArrowUpDown,
  Wallet,
  Trash2,
  CreditCard,
  PiggyBank,
  DollarSign,
  Shield,
  Eye,
  EyeOff,
  ArrowUpRight,
  MoreVertical,
  PieChart as PieChartIcon,
  TrendingUp,
  Building2,
  Landmark,
  CreditCard as CreditCardIcon,
  RefreshCw,
} from "lucide-react";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import { useState, useMemo } from "react";
import { type Wallet as WalletType } from "@/types";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const walletTypeColors: Record<string, string> = {
  cash: "#10b981",
  bank: "#3b82f6",
  ewallet: "#8b5cf6",
  savings: "#f59e0b",
  credit: "#ef4444",
  investment: "#06b6d4",
  other: "#64748b",
};

const walletIcons: Record<string, React.ElementType> = {
  cash: Building2,
  bank: Landmark,
  ewallet: CreditCardIcon,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
};

const WalletCard = ({
  wallet,
  onEdit,
  onDelete,
  showBalance,
}: {
  wallet: WalletType;
  onEdit: (wallet: WalletType) => void;
  onDelete: (id: string) => void;
  showBalance: boolean;
}) => {
  const Icon = walletIcons[wallet.type] || Building2;
  const color = walletTypeColors[wallet.type] || walletTypeColors.other;
  const isPositive = wallet.balance >= 0;
  const maskBalance = () => "••••••";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300 cursor-pointer"
      )}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-all"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
        }}
      />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
              style={{ backgroundColor: `${color}15`, color }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{wallet.name}</h3>
              <p className="text-xs text-muted-foreground">{wallet.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(wallet);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(wallet.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">Current Balance</p>
          <p
            className={cn(
              "text-2xl mt-0.5 font-bold",
              !isPositive && "text-red-600 dark:text-red-400"
            )}
          >
            {showBalance
              ? `${isPositive ? "" : "-"}${formatCurrency(
                  Math.abs(wallet.balance)
                )}`
              : maskBalance()}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge
            variant="secondary"
            className="border-0 text-xs"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {wallet.type}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            Updated today
          </div>
        </div>
        <button
          onClick={() => onEdit(wallet)}
          className="absolute inset-0 w-full h-full cursor-pointer"
          aria-label={`Edit ${wallet.name}`}
        />
      </CardContent>
    </Card>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: "emerald" | "blue" | "violet" | "amber";
}) => {
  const colors = {
    emerald: "text-emerald-500 bg-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/10",
    violet: "text-violet-500 bg-violet-500/10",
    amber: "text-amber-500 bg-amber-500/10",
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          colors[color]
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
};

// Asset Allocation Card Component
const AssetAllocationCard = ({
  wallets,
  showBalance,
}: {
  wallets: WalletType[];
  showBalance: boolean;
}) => {
  const maskBalance = () => "••••••";

  const assetWallets = wallets.filter((w) => w.balance >= 0);
  const totalAssets = assetWallets.reduce((s, w) => s + w.balance, 0);

  const pieData = assetWallets.map((w) => ({
    name: w.name,
    value: w.balance,
    color: walletTypeColors[w.type] || walletTypeColors.other,
    type: w.type,
  }));

  return (
    <Card className="border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">
            Asset Allocation
          </CardTitle>
        </div>
        <CardDescription className="text-xs mt-0.5">
          Distribution across accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[160px]">
          {assetWallets.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
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
                <RechartsTooltip
                  formatter={(value: number | undefined) => [
                    showBalance ? formatCurrency(value ?? 0) : maskBalance(),
                    "",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No assets to display
            </div>
          )}
        </div>
        <div className="space-y-2.5 mt-3">
          {pieData.map((item) => {
            const pct =
              totalAssets > 0
                ? Math.round((item.value / totalAssets) * 100)
                : 0;
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </span>
                  <span className="text-muted-foreground">{pct}%</span>
                </div>
                <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Balance History Chart Component
const BalanceHistoryChart = ({
  wallets,
  showBalance,
}: {
  wallets: WalletType[];
  showBalance: boolean;
}) => {
  const maskBalance = () => "••••••";

  // Generate mock historical data (in real app, this would come from transactions)
  const historicalData = useMemo(() => {
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
    const cashWallets = wallets.filter((w) => w.type === "cash");
    const bankWallets = wallets.filter((w) => w.type === "bank");
    const ewalletWallets = wallets.filter((w) => w.type === "ewallet");

    const cashBalance = cashWallets.reduce((s, w) => s + w.balance, 0);
    const bankBalance = bankWallets.reduce((s, w) => s + w.balance, 0);
    const ewalletBalance = ewalletWallets.reduce((s, w) => s + w.balance, 0);

    // Generate progressive data
    return months.map((month, idx) => {
      const progress = (idx + 1) / months.length;
      return {
        month,
        cash: Math.round(cashBalance * (0.7 + 0.3 * progress)),
        bank: Math.round(bankBalance * (0.7 + 0.3 * progress)),
        ewallet: Math.round(ewalletBalance * (0.7 + 0.3 * progress)),
      };
    });
  }, [wallets]);

  const totalCash = wallets
    .filter((w) => w.type === "cash")
    .reduce((s, w) => s + w.balance, 0);
  const totalBank = wallets
    .filter((w) => w.type === "bank")
    .reduce((s, w) => s + w.balance, 0);
  const totalEwallet = wallets
    .filter((w) => w.type === "ewallet")
    .reduce((s, w) => s + w.balance, 0);

  return (
    <Card className="border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Balance History
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Account balance trends over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#10b981" }}
              />
              Cash
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#3b82f6" }}
              />
              Bank
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#8b5cf6" }}
              />
              E-Wallet
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          {totalCash > 0 || totalBank > 0 || totalEwallet > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={historicalData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="bankGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ewalletGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)}
                />
                <RechartsTooltip
                  formatter={(value: number | undefined) => [
                    showBalance ? formatCurrency(value ?? 0) : maskBalance(),
                    "",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                {totalCash > 0 && (
                  <Area
                    type="monotone"
                    dataKey="cash"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#cashGrad)"
                    name="Cash"
                  />
                )}
                {totalBank > 0 && (
                  <Area
                    type="monotone"
                    dataKey="bank"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#bankGrad)"
                    name="Bank"
                  />
                )}
                {totalEwallet > 0 && (
                  <Area
                    type="monotone"
                    dataKey="ewallet"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#ewalletGrad)"
                    name="E-Wallet"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No balance history to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Wallets() {
  const { wallets, deleteWallet } = useWalletStore();
  const { transactions, deleteTransactionsByWallet } = useTransactionStore();
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<string | null>(null);
  const [showBalances, setShowBalances] = useState(true);

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);
  const cashWallets = wallets.filter((w) => w.type === "cash");
  const bankWallets = wallets.filter((w) => w.type === "bank");
  const ewalletWallets = wallets.filter((w) => w.type === "ewallet");

  const cashBalance = cashWallets.reduce((s, w) => s + w.balance, 0);
  const bankBalance = bankWallets.reduce((s, w) => s + w.balance, 0);
  const ewalletBalance = ewalletWallets.reduce((s, w) => s + w.balance, 0);

  const totalAssets = wallets
    .filter((w) => w.balance >= 0)
    .reduce((s, w) => s + w.balance, 0);
  const totalLiabilities = wallets
    .filter((w) => w.balance < 0)
    .reduce((_, w) => Math.abs(w.balance), 0);

  const maskBalance = () => "••••••";

  const handleEditWallet = (wallet: WalletType) => {
    setEditingWallet(wallet);
    setShowAddWallet(true);
  };

  const handleCloseWalletModal = () => {
    setShowAddWallet(false);
    setEditingWallet(null);
  };

  if (wallets.length === 0) {
    return (
      <>
        <EmptyState
          icon={Wallet}
          title="No Wallets Yet"
          description="Add a wallet to start tracking your balances."
          actionLabel="+ Add Wallet"
          onAction={() => setShowAddWallet(true)}
        />
        <AddWalletModal open={showAddWallet} onClose={handleCloseWalletModal} />
      </>
    );
  }

  return (
    <>
      <AnimatedPage className="space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Wallets
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your accounts and balances
            </p>
          </div>
          <Button
            onClick={() => setShowAddWallet(true)}
            className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white gap-2 font-semibold px-6 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Wallet
          </Button>
        </div>

        {/* Net Worth Card */}
        <Card className="relative overflow-hidden border-border/60 hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-violet-500/5" />
          <CardContent className="relative p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Net Worth
                </p>
                <p className="text-3xl mt-1.5 font-bold">
                  {showBalances ? formatCurrency(totalBalance) : maskBalance()}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border-0 gap-1 text-xs"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  +5.2% this month
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Total Assets
                </p>
                <p className="text-2xl mt-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  {showBalances ? formatCurrency(totalAssets) : maskBalance()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {wallets.filter((w) => w.balance >= 0).length} accounts
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Total Liabilities
                </p>
                <p className="text-2xl mt-1.5 text-red-600 dark:text-red-400 font-bold">
                  {showBalances
                    ? formatCurrency(totalLiabilities)
                    : maskBalance()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {wallets.filter((w) => w.balance < 0).length} account
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-2 hover:shadow-lg transition-all duration-200"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showBalances ? "Hide" : "Show"} Balances
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-2 hover:shadow-lg hover:scale-105 transition-all duration-200"
              onClick={() => setShowTransferModal(true)}
            >
              <ArrowUpDown className="w-4 h-4" />
              Transfer
            </Button>
            <Button
              size="sm"
              className="gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all duration-200"
              onClick={() => setShowAddWallet(true)}
            >
              <Plus className="w-4 h-4" />
              Add Wallet
            </Button>
          </div>
        </div>

        {/* Balance Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<PiggyBank className="w-5 h-5" />}
            title="Cash"
            value={showBalances ? formatCurrency(cashBalance) : maskBalance()}
            color="emerald"
          />
          <StatCard
            icon={<Shield className="w-5 h-5" />}
            title="Bank"
            value={showBalances ? formatCurrency(bankBalance) : maskBalance()}
            color="blue"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            title="E-Wallet"
            value={
              showBalances ? formatCurrency(ewalletBalance) : maskBalance()
            }
            color="violet"
          />
        </div>

        {/* Wallets Grid + Asset Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Wallet Cards */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Your Wallets</h3>
                  <p className="text-sm text-muted-foreground">
                    {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}{" "}
                    connected
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wallets.map((w) => (
                  <WalletCard
                    key={w.id}
                    wallet={w}
                    onEdit={handleEditWallet}
                    onDelete={(id) => setWalletToDelete(id)}
                    showBalance={showBalances}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="lg:col-span-1">
            <AssetAllocationCard wallets={wallets} showBalance={showBalances} />
          </div>
        </div>

        {/* Balance History Chart */}
        <BalanceHistoryChart wallets={wallets} showBalance={showBalances} />

        {/* Recent Activity */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent Activity
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Latest transactions across all wallets
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {transactions.length} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="divide-y divide-border/50">
                {transactions.slice(0, 5).map((t) => (
                  <TransactionRow key={t.id} transaction={t} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedPage>

      {/* Floating Action Button for mobile */}
      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        <Button
          onClick={() => setShowAddWallet(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <AddWalletModal
        open={showAddWallet}
        onClose={handleCloseWalletModal}
        initialData={editingWallet}
      />
      <TransferModal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
      <ConfirmDeleteModal
        open={!!walletToDelete}
        onClose={() => setWalletToDelete(null)}
        onConfirm={() => {
          if (walletToDelete) {
            deleteWallet(walletToDelete);
            deleteTransactionsByWallet(walletToDelete);
          }
        }}
        title="Delete Wallet"
        description="Are you sure? This will permanently delete the wallet AND ALL its transactions. This cannot be undone."
      />
    </>
  );
}
