import { create } from 'zustand';
import { api } from '@/services/api';
import { type Wallet } from '@/types';

interface WalletState {
  wallets: Wallet[];
  isLoading: boolean;
  error: string | null;
  
  fetchWallets: () => Promise<void>;
  addWallet: (wallet: Omit<Wallet, 'id'>) => Promise<Wallet>;
  updateWallet: (id: string, updates: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  reset: () => void;
  
  // Helper for optimistic/manual updates if needed (though we rely on fetch usually)
  updateWalletBalance: (id: string, amount: number) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],
  isLoading: false,
  error: null,

  fetchWallets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ data: Wallet[] }>('/wallets');
      set({ wallets: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addWallet: async (wallet) => {
    set({ isLoading: true, error: null });
    try {
      const newWallet = await api.post<Wallet>('/wallets', wallet);
      await get().fetchWallets();
      return newWallet;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateWallet: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/wallets/${id}`, updates);
      await get().fetchWallets();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteWallet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/wallets/${id}`);
      await get().fetchWallets();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Legacy/Helper: strictly for client-side optimistic updates if strictly needed
  // But generally transaction store triggers fetchWallets
  updateWalletBalance: (id, amount) => {
    set((state) => ({
      wallets: state.wallets.map((w) =>
        w.id === id ? { ...w, balance: w.balance + amount } : w
      ),
    }));
  },

  reset: () => set({ wallets: [], error: null, isLoading: false }),
}));
