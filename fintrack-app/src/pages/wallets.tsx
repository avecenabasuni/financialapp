import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWalletStore } from '@/store/useWalletStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { formatCurrency } from '@/lib/utils';
import CategoryIcon from '@/components/shared/category-icon';
import TransactionRow from '@/components/shared/transaction-row';
import EmptyState from '@/components/shared/empty-state';
import AnimatedPage from '@/components/shared/animated-page';
import AddWalletModal from '@/components/modals/add-wallet-modal';
import TransferModal from '@/components/modals/transfer-modal';
import { Plus, ArrowUpDown, Wallet, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import { useState } from 'react';
import { type Wallet as WalletType } from '@/types';

export default function Wallets() {
  const { wallets } = useWalletStore();
  const { transactions } = useTransactionStore();
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<string | null>(null);

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);

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
        <EmptyState icon={Wallet} title="No Wallets Yet" description="Add a wallet to start tracking your balances." actionLabel="+ Add Wallet" onAction={() => setShowAddWallet(true)} />
        <AddWalletModal open={showAddWallet} onClose={handleCloseWalletModal} />
      </>
    );
  }

  return (
    <>
    <AnimatedPage className="space-y-6">
      <Card>
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
            <div className="text-2xl font-semibold text-foreground tabular-nums">{formatCurrency(totalBalance)}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowTransferModal(true)}><ArrowUpDown className="w-3.5 h-3.5" /> Transfer</Button>
            <Button size="sm" className="gap-1.5" onClick={() => setShowAddWallet(true)}><Plus className="w-3.5 h-3.5" /> Add Wallet</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map((w) => (
          <Card key={w.id} className="hover:border-primary/30 transition-colors group relative cursor-pointer" onClick={() => handleEditWallet(w)}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <CategoryIcon icon={w.icon} color={w.color} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{w.name}</div>
                  <Badge variant="secondary" className="text-[10px] mt-0.5">{w.type}</Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { 
                    e.stopPropagation(); 
                    setWalletToDelete(w.id);
                }}>
                    <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xl font-semibold text-foreground tabular-nums">{formatCurrency(w.balance)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {transactions.slice(0, 4).map((t) => (<TransactionRow key={t.id} transaction={t} />))}
          </div>
        </CardContent>
      </Card>
    </AnimatedPage>
    <AddWalletModal open={showAddWallet} onClose={handleCloseWalletModal} initialData={editingWallet} />
    <TransferModal open={showTransferModal} onClose={() => setShowTransferModal(false)} />
    <ConfirmDeleteModal
      open={!!walletToDelete}
      onClose={() => setWalletToDelete(null)}
      onConfirm={() => {
        if (walletToDelete) {
          useWalletStore.getState().deleteWallet(walletToDelete);
          useTransactionStore.getState().deleteTransactionsByWallet(walletToDelete);
        }
      }}
      title="Delete Wallet"
      description="Are you sure? This will permanently delete the wallet AND ALL its transactions. This cannot be undone."
    />
    </>
  );
}
