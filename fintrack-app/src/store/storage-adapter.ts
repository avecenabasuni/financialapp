import type { StateStorage } from 'zustand/middleware';

const safeLocalStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.error(`[Persistence Error] Failed to load ${name}:`, error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error(`[Persistence Error] Failed to save ${name}:`, error);
      // Optional: Dispatch a custom event to notify UI components (e.g. Toasts)
      window.dispatchEvent(new CustomEvent('persistence-error', { 
        detail: { message: 'Failed to save data. LocalStorage might be full.' } 
      }));
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error(`[Persistence Error] Failed to remove ${name}:`, error);
    }
  },
};

export default safeLocalStorage;
