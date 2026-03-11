import { create } from "zustand";
import { api } from "@/services/api";

interface UserState {
  user: {
    name: string;
    email: string;
    initials: string;
    currency: string;
    language: string;
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
  updateUser: (updates: Partial<UserState["user"]>) => Promise<void>;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
}

const STORAGE_KEY = "fintrack-user-settings";

// Load settings from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load user settings from storage", e);
  }
  return null;
};

// Save settings to localStorage
const saveToStorage = (settings: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save user settings to storage", e);
  }
};

const storedSettings = loadFromStorage();

export const useUserStore = create<UserState>((set, get) => ({
  user: {
    name: storedSettings?.name || "",
    email: storedSettings?.email || "",
    initials: storedSettings?.initials || "",
    currency: storedSettings?.currency || "IDR",
    language: storedSettings?.language || "en",
    preferences: storedSettings?.preferences || {},
  },
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ data: any }>("/user");
      set({ user: response.data, isLoading: false });
    } catch (error: any) {
      // Silent error for user pref, maybe just use defaults
      console.error("Failed to fetch user prefs", error);
      set({ isLoading: false });
    }
  },

  updateUser: async (updates) => {
    const newUser = { ...get().user, ...updates };
    set({ user: newUser });
    saveToStorage(newUser);

    try {
      await api.put("/user", newUser);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  setCurrency: (currency) => {
    const newUser = { ...get().user, currency };
    set({ user: newUser });
    saveToStorage(newUser);
  },

  setLanguage: (language) => {
    const newUser = { ...get().user, language };
    set({ user: newUser });
    saveToStorage(newUser);
  },
}));
