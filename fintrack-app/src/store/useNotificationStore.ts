import { create } from 'zustand';
import { api } from '@/services/api';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: number;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ results: AppNotification[]; unreadCount: number }>('/notifications');
      set({ notifications: response.results, unreadCount: response.unreadCount, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
        set((state) => {
            const index = state.notifications.findIndex((n) => n.id === id);
            if (index !== -1 && state.notifications[index].is_read === 0) {
                const newNotifications = [...state.notifications];
                newNotifications[index] = { ...newNotifications[index], is_read: 1 };
                return {
                    notifications: newNotifications,
                    unreadCount: Math.max(0, state.unreadCount - 1)
                };
            }
            return {};
        });
      await api.patch(`/notifications/${id}/read`, {});
    } catch (error: any) {
      console.error(error);
    }
  },

  markAllAsRead: async () => {
    try {
      set((state) => ({ notifications: state.notifications.map(n => ({ ...n, is_read: 1 })), unreadCount: 0 }));
      await api.patch('/notifications/read-all', {});
    } catch (error: any) {
      console.error(error);
    }
  },
}));
