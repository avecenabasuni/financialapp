import { create } from 'zustand';
import { api } from '@/services/api';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  nextBillingDate: string;
  status: 'active' | 'paused' | 'cancelled';
  categoryId?: string;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  fetchSubscriptions: () => Promise<void>;
  addSubscription: (sub: Partial<Subscription>) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  isLoading: false,
  error: null,

  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ success: boolean; data: Subscription[] }>('/subscriptions');
      if (response.success) {
        set({ subscriptions: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addSubscription: async (sub) => {
    set({ isLoading: true, error: null });
    try {
      // transform frontend camelCase to backend snake_case if necessary 
      // api route for POST uses basic fields so we will map it locally
      const payload = {
        name: sub.name,
        amount: sub.amount,
        frequency: sub.frequency,
        next_billing_date: sub.nextBillingDate,
        status: sub.status || 'active',
        category_id: sub.categoryId
      };
      await api.post('/subscriptions', payload);
      await get().fetchSubscriptions();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateSubscription: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const payload: any = { ...updates };
      // Map back to snake_case if necessary for the PUT endpoint
      if (updates.nextBillingDate) payload.next_billing_date = updates.nextBillingDate;
      if (updates.categoryId) payload.category_id = updates.categoryId;

      await api.put(`/subscriptions/${id}`, payload);
      await get().fetchSubscriptions();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteSubscription: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/subscriptions/${id}`);
      await get().fetchSubscriptions();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
