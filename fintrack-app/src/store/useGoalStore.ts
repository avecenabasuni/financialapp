import { create } from 'zustand';
import { api } from '@/services/api';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  contribute: (id: string, amount: number, wallet_id: string, date: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ success: boolean; data: Goal[] }>('/goals');
      if (response.success) {
        set({ goals: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addGoal: async (goal) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/goals', goal);
      await get().fetchGoals();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateGoal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/goals/${id}`, updates);
      await get().fetchGoals();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/goals/${id}`);
      await get().fetchGoals();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  contribute: async (id, amount, wallet_id, date) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/goals/${id}/contribute`, { amount, wallet_id, date });
      await get().fetchGoals();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
