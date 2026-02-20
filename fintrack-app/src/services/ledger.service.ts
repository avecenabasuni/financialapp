import { useWalletStore } from '@/store/useWalletStore';
import { useTransactionStore } from '@/store/useTransactionStore';

export const LedgerService = {
  /**
   * Reconciles wallet balances with transaction history.
   * STRICT MODE: Transactions are the Source of Truth.
   * 1. Cleans up any cascading "System" transactions from previous bugs.
   * 2. Recalculates exact balance from history.
   * 3. Updates Wallet Store to match history.
   */
  reconcileWallets: () => {
    const { wallets, updateWalletBalance } = useWalletStore.getState();
    const { transactions, deleteTransaction } = useTransactionStore.getState();

    // 1. CLEANUP: Remove "System" transactions causing bloat
    const bloatedTransactions = transactions.filter(t => t.categoryName === 'System' && t.note === 'System Balance Reconciliation');
    if (bloatedTransactions.length > 0) {
      console.warn(`[Ledger] Cleaning up ${bloatedTransactions.length} system transactions.`);
      bloatedTransactions.forEach(t => deleteTransaction(t.id));
    }

    // Refresh transactions after delete
    const freshTransactions = useTransactionStore.getState().transactions;

    wallets.forEach(wallet => {
      const walletTransactions = freshTransactions.filter(
        t => t.walletId === wallet.id || t.toWalletId === wallet.id
      );

      const calculatedBalance = walletTransactions.reduce((acc, t) => {
        if (t.walletId === wallet.id) {
            if (t.type === 'income') return acc + t.amount;
            if (t.type === 'expense') return acc - t.amount;
            if (t.type === 'transfer') return acc - t.amount;
        }
        if (t.toWalletId === wallet.id && t.type === 'transfer') {
            return acc + t.amount;
        }
        return acc;
      }, 0);

      const diff = wallet.balance - calculatedBalance;

      if (Math.abs(diff) > 0) {
        console.log(`[Ledger] Correcting balance for ${wallet.name}. Was ${wallet.balance}, Now ${calculatedBalance}`);
        // Strict Sync: Force wallet to match transactions
        // We calculate the difference needed to reach calculatedBalance
        // Current: 1000. Target: 900. Diff: 100. We need -100.
        // updateWalletBalance adds to existing. So we add (Target - Current) = -100.
        updateWalletBalance(wallet.id, calculatedBalance - wallet.balance);
      }
    });
  }
};
