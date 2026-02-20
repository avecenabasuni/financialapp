import { create } from 'zustand';
import { api } from '@/services/api';
import { type Budget } from '@/types';

interface BudgetState {
  budgets: Budget[];
  currentMonth: string; // Track currently viewed month
  isLoading: boolean;
  error: string | null;

  fetchBudgets: (month?: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string, month?: string) => Promise<void>; // Added month param for context if needed
  reset: () => void;
  
  // Helpers
  updateBudgetSpent: (categoryId: string, amount: number) => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  currentMonth: new Date().toISOString().slice(0, 7), // Default to current month
  isLoading: false,
  error: null,

  fetchBudgets: async (month?: string) => {
    set({ isLoading: true, error: null });
    try {
      const targetMonth = month || get().currentMonth;
      const response = await api.get<{ data: any[] }>(`/budgets?month=${targetMonth}`);
      
      const mappedBudgets: Budget[] = response.data.map((b: any) => ({
        id: b.id,
        categoryId: b.category_id,
        amount: b.amount,
        spent: b.spent, // Server calculated
        month: b.month,
        categoryName: b.category_name,
        categoryIcon: b.category_icon,
        categoryColor: b.category_color,
      }));

      set({ budgets: mappedBudgets, isLoading: false, currentMonth: targetMonth });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addBudget: async (budget) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
          category_id: budget.categoryId,
          amount: budget.amount,
          month: budget.month
      };
      await api.post('/budgets', payload);
      // Refetch the currently viewed month to see if this affects it
      // (e.g. if we added a budget for the viewed month)
      await get().fetchBudgets(get().currentMonth);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateBudget: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const payload: any = {};
      if (updates.amount !== undefined) payload.amount = updates.amount;
      
      await api.put(`/budgets/${id}`, payload);
      await get().fetchBudgets(get().currentMonth);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteBudget: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/budgets/${id}`);
      await get().fetchBudgets(get().currentMonth);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateBudgetSpent: (_categoryId, _amount) => {
      // Logic handled by server aggregation
  },

  reset: () => set({ budgets: [], error: null, isLoading: false }),
}));
