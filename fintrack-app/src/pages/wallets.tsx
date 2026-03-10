import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWalletStore } from "@/store/useWalletStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { formatCurrency } from "@/lib/utils";
import CategoryIcon from "@/components/shared/category-icon";
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
  TrendingUp,
  PiggyBank,
  DollarSign,
  Shield,
} from "lucide-react";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import { useState } from "react";
import { type Wallet as WalletType } from "@/types";
import { cn } from "@/lib/utils";

const WalletCard = ({
  wallet,
  onEdit,
  onDelete,
}: {
  wallet: WalletType;
  onEdit: (wallet: WalletType) => void;
  onDelete: (id: string) => void;
}) => {
  const getGradient = (type: string) => {
    switch (type) {
      case "cash":
        return "from-emerald-500/10 to-green-500/5 border-emerald-500/20";
      case "bank":
        return "from-blue-500/10 to-indigo-500/5 border-blue-500/20";
      case "e-wallet":
        return "from-violet-500/10 to-purple-500/5 border-violet-500/20";
      case "savings":
        return "from-amber-500/10 to-orange-500/5 border-amber-500/20";
      default:
        return "from-secondary to-secondary/50 border-border/50";
    }
  };

  const getIconGradient = (type: string) => {
    switch (type) {
      case "cash":
        return "from-emerald-500 to-green-500";
      case "bank":
        return "from-blue-500 to-indigo-500";
      case "e-wallet":
        return "from-violet-500 to-purple-500";
      case "savings":
        return "from-amber-500 to-orange-500";
      default:
        return "from-primary to-primary/80";
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border",
        getGradient(wallet.type)
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
                getIconGradient(wallet.type)
              )}
            >
              <CategoryIcon icon={wallet.icon} color={wallet.color} />
            </div>
            <div>
              <h3 className="font-semibold text-base">{wallet.name}</h3>
              <Badge
                variant="secondary"
                className="text-[10px] mt-1.5 capitalize bg-secondary/80"
              >
                {wallet.type}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(wallet.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Balance</p>
          <p className="text-2xl font-bold tracking-tight">
            {formatCurrency(wallet.balance)}
          </p>
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

export default function Wallets() {
  const { wallets, deleteWallet } = useWalletStore();
  const { transactions, deleteTransactionsByWallet } = useTransactionStore();
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<string | null>(null);

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);
  const cashWallets = wallets.filter((w) => w.type === "cash");
  const bankWallets = wallets.filter((w) => w.type === "bank");
  const ewalletWallets = wallets.filter((w) => w.type === "ewallet");

  const cashBalance = cashWallets.reduce((s, w) => s + w.balance, 0);
  const bankBalance = bankWallets.reduce((s, w) => s + w.balance, 0);
  const ewalletBalance = ewalletWallets.reduce((s, w) => s + w.balance, 0);

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

        {/* Main Balance Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-lg shadow-primary/5">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Balance
                  </p>
                  <p className="text-4xl font-bold tracking-tight">
                    {formatCurrency(totalBalance)}
                  </p>
                </div>
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
          </CardContent>
        </Card>

        {/* Balance Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<PiggyBank className="w-5 h-5" />}
            title="Cash"
            value={formatCurrency(cashBalance)}
            color="emerald"
          />
          <StatCard
            icon={<Shield className="w-5 h-5" />}
            title="Bank"
            value={formatCurrency(bankBalance)}
            color="blue"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            title="E-Wallet"
            value={formatCurrency(ewalletBalance)}
            color="violet"
          />
        </div>

        {/* Wallets Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((w) => (
              <WalletCard
                key={w.id}
                wallet={w}
                onEdit={handleEditWallet}
                onDelete={(id) => setWalletToDelete(id)}
              />
            ))}
          </div>
        </div>

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
