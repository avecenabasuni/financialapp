import { create } from 'zustand';
import { api } from '@/services/api';
import { type Category } from '@/types';
import { useTransactionStore } from './useTransactionStore';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reset: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ data: Category[] }>('/categories');
      set({ categories: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/categories', category);
      await get().fetchCategories();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/categories/${id}`, updates);
      await get().fetchCategories();
      
      // Cascading update trigger (Frontend cache update to keep UI snappy if needed, 
      // but ideally we re-fetch transactions too)
      useTransactionStore.getState().fetchTransactions(); 
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/categories/${id}`);
      await get().fetchCategories();
      useTransactionStore.getState().fetchTransactions();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  reset: () => set({ categories: [], error: null, isLoading: false }),
}));
