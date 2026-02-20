import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  notifications: {
    transactions: boolean;
    budgets: boolean;
    reports: boolean;
  };
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  toggleNotification: (key: keyof SettingsState['notifications']) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      currency: 'IDR',
      language: 'en',
      notifications: {
        transactions: true,
        budgets: true,
        reports: false,
      },
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      toggleNotification: (key) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: !state.notifications[key],
          },
        })),
    }),
    {
      name: 'fintrack-settings',
    }
  )
);
