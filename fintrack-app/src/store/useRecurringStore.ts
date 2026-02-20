import { create } from 'zustand';
import { api } from '@/services/api';
import { type Transaction } from '@/types';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringRule {
  id: string;
  frequency: Frequency;
  interval: number;
  startDate: string;
  nextDue: string;
  lastGenerated?: string;
  template: Omit<Transaction, 'id' | 'date' | 'createdAt'>;
  active: boolean;
}

interface RecurringState {
  rules: RecurringRule[];
  isLoading: boolean;
  error: string | null;

  fetchRules: () => Promise<void>;
  addRule: (rule: Omit<RecurringRule, 'id'>) => Promise<void>;
  updateRule: (id: string, updates: Partial<RecurringRule>) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
  reset: () => void;
}

export const useRecurringStore = create<RecurringState>((set, get) => ({
  rules: [],
  isLoading: false,
  error: null,

  fetchRules: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ data: any[] }>('/recurring');
      // Backend returns template as object already (parsed)
      // Map backend fields to frontend types if needed, but schema matches closely
      const rules = response.data.map((r) => ({
          id: r.id,
          frequency: r.frequency,
          interval: r.interval,
          startDate: r.start_date, // Map from snake_case
          nextDue: r.next_due,
          lastGenerated: r.last_generated,
          template: r.template,
          active: r.active
      }));
      set({ rules, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addRule: async (rule) => {
    set({ isLoading: true, error: null });
    try {
      // Convert to snake_case for API
      const payload = {
        frequency: rule.frequency,
        interval: rule.interval,
        start_date: rule.startDate,
        next_due: rule.nextDue,
        template_json: JSON.stringify(rule.template),
        is_active: rule.active
      };
      await api.post('/recurring', payload);
      await get().fetchRules();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateRule: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const payload: any = {};
      if (updates.frequency) payload.frequency = updates.frequency;
      if (updates.interval) payload.interval = updates.interval;
      if (updates.startDate) payload.start_date = updates.startDate;
      if (updates.nextDue) payload.next_due = updates.nextDue;
      if (updates.template) payload.template_json = JSON.stringify(updates.template);
      if (updates.active !== undefined) payload.is_active = updates.active;

      await api.put(`/recurring/${id}`, payload);
      await get().fetchRules();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteRule: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/recurring/${id}`);
      await get().fetchRules();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  reset: () => set({ rules: [], error: null, isLoading: false }),
}));
