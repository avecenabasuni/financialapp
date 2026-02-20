import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ token: string; user: User }>('/auth/login', { username, password });
          set({ 
            token: response.token, 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ error: error.message || 'Login failed', isLoading: false });
          throw error;
        }
      },

      register: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/register', { username, password });
          // Auto login or just redirect? Let's just finish and let component handle redirect to login
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Registration failed', isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Optional: clear entire app state if needed
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
            // Verify token validity with backend if needed, or just trust it until 401
            // For now, let's hit /auth/me to verify and get fresh user data
            // But api interceptor might block us if we don't have user yet? 
            // We have token in store, api should use it.
            // But wait, api.ts needs to know about the token.
            // We'll solve this by making api.ts read from localStorage or useAuthStore.getState().token
        } catch (e) {
            get().logout();
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }), // Only persist these
    }
  )
);
