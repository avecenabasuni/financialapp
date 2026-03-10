import { useState } from "react";
import {
  Bell,
  Check,
  Trash2,
  Settings,
  AlertCircle,
  Info,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  time: string;
  read: boolean;
}

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Budget Alert",
    message: "You've spent 80% of your Food budget this month",
    type: "warning",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Bill Due Soon",
    message: "Your electricity bill of $120 is due in 3 days",
    type: "alert",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "Savings Goal Reached",
    message: "Congratulations! You've reached your Emergency Fund goal",
    type: "success",
    time: "Yesterday",
    read: false,
  },
  {
    id: "4",
    title: "Weekly Summary",
    message: "You saved 15% more than last week. Great job!",
    type: "info",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    title: "Unusual Spending",
    message: "Your shopping expenses are 30% higher than usual",
    type: "alert",
    time: "3 days ago",
    read: true,
  },
];

const iconMap = {
  info: Info,
  warning: AlertCircle,
  success: TrendingUp,
  alert: AlertCircle,
};

const colorMap = {
  info: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  warning:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  success:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  alert: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

export function NotificationsPanel({
  open,
  onOpenChange,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={() => onOpenChange(false)}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllAsRead}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              Mark all read
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-4">
          <button className="flex-1 py-2.5 text-sm font-medium text-primary border-b-2 border-primary">
            All
          </button>
          <button className="flex-1 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            Unread
          </button>
          <button className="flex-1 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            Archived
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 h-[calc(100%-140px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Bell className="h-8 w-8 opacity-30" />
              </div>
              <p className="text-sm font-semibold">No notifications</p>
              <p className="text-xs mt-0.5 opacity-70">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = iconMap[notification.type];
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative rounded-xl border p-3 transition-all duration-200",
                    notification.read
                      ? "border-border/60 bg-muted/30"
                      : "border-primary/30 bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        colorMap[notification.type]
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            !notification.read && "text-primary"
                          )}
                        >
                          {notification.title}
                        </p>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground">
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-[10px] text-primary hover:text-primary/80 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border px-4 py-3 bg-card">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
            Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
}
