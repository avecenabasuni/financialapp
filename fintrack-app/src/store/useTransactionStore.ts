import { create } from 'zustand';
import { api } from '@/services/api';
import { type Transaction } from '@/types';
import { useWalletStore } from './useWalletStore';
import { useBudgetStore } from './useBudgetStore';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteTransactionsByWallet: (walletId: string) => Promise<void>;
  
  // Helpers to keep TS happy, but logic is moved to server/fetch
  updateCategoryDetails: (categoryId: string, updates: { name: string; icon: string; color: string }) => void;
  uncategorizeTransactions: (categoryId: string) => void;
  
  reset: () => void;
  
  // UI State for Global Modal
  isAddModalOpen: boolean;
  editingTransaction: Transaction | null;
  openAddModal: (transaction?: Transaction) => void;
  closeAddModal: () => void;
}


export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ data: Transaction[] }>('/transactions');
      set({ transactions: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        ...transaction,
        category_id: transaction.categoryId,
        wallet_id: transaction.walletId,
        to_wallet_id: transaction.toWalletId,
      };
      await api.post('/transactions', payload);
      
      // Refresh all related data
      await Promise.all([
        get().fetchTransactions(),
        useWalletStore.getState().fetchWallets(),
        useBudgetStore.getState().fetchBudgets(), // If budgets implemented
      ]);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateTransaction: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
       const payload: any = { ...updates };
       if (updates.categoryId) payload.category_id = updates.categoryId;
       if (updates.walletId) payload.wallet_id = updates.walletId;
       if (updates.toWalletId) payload.to_wallet_id = updates.toWalletId;

      await api.put(`/transactions/${id}`, payload);
      
      await Promise.all([
        get().fetchTransactions(),
        useWalletStore.getState().fetchWallets(),
        useBudgetStore.getState().fetchBudgets(),
      ]);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/transactions/${id}`);
      
      await Promise.all([
        get().fetchTransactions(),
        useWalletStore.getState().fetchWallets(),
        useBudgetStore.getState().fetchBudgets(),
      ]);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteTransactionsByWallet: async (_walletId) => {
     // Server cascades deletion if wallet is deleted (schema enforcement)
     // Or we implement a specific route. For now, assuming wallet deletion on server handles it (cascade).
     // If not, we iterate. But implementing purely on frontend is now wrong.
     // We'll just refresh.
     await get().fetchTransactions();
  },

  updateCategoryDetails: () => {
    // Logic handled by server and re-fetch
    set({ isLoading: true }); // Signal loading
    get().fetchTransactions().finally(() => set({ isLoading: false }));
  },

  uncategorizeTransactions: () => {
    // Logic handled by server and re-fetch
    set({ isLoading: true });
    get().fetchTransactions().finally(() => set({ isLoading: false }));
  },

  reset: () => set({ transactions: [], error: null, isLoading: false }),

  // UI Actions
  isAddModalOpen: false,
  editingTransaction: null,
  openAddModal: (transaction) => set({ isAddModalOpen: true, editingTransaction: transaction || null }),
  closeAddModal: () => set({ isAddModalOpen: false, editingTransaction: null }),
}));
