import { create } from 'zustand';
import { api } from '@/services/api';

interface UserState {
  user: {
    name: string;
    email: string;
    initials: string;
    currency: string;
    preferences?: {
      notifications?: {
        transactions?: boolean;
        budgets?: boolean;
        reports?: boolean;
      };
    };
  };
  isLoading: boolean;
  error: string | null;

  fetchUser: () => Promise<void>;
  updateUser: (updates: Partial<UserState['user']>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: {
    name: '',
    email: '',
    initials: '',
    currency: 'IDR',
    preferences: {}
  },
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ data: any }>('/user');
      set({ user: response.data, isLoading: false });
    } catch (error: any) {
      // Silent error for user pref, maybe just use defaults
      console.error("Failed to fetch user prefs", error);
      set({ isLoading: false }); 
    }
  },

  updateUser: async (updates) => {
    const newUser = { ...get().user, ...updates };
    set({ user: newUser }); // Optimistic update
    
    try {
      await api.put('/user', newUser);
    } catch (error: any) {
      set({ error: error.message });
      // Revert if needed, but user pref is low risk
    }
  },
}));
