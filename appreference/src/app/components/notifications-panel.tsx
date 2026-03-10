import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  AlertCircle,
  Bell,
  Check,
  Trash2,
  BellOff,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { notifications } from "./mock-data";
import { useState } from "react";

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/15",
  },
  success: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/15",
  },
  alert: {
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/15",
  },
};

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadItems = items.filter((n) => !n.read);
  const readItems = items.filter((n) => n.read);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-card">
        <SheetHeader className="p-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-base" style={{ fontWeight: 700 }}>Notifications</SheetTitle>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 h-5 min-w-[20px] justify-center">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                style={{ fontWeight: 600 }}
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>
          <SheetDescription className="text-xs">Stay on top of your finances</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <BellOff className="h-7 w-7 opacity-30" />
              </div>
              <p className="text-sm" style={{ fontWeight: 600 }}>All caught up!</p>
              <p className="text-xs mt-1 opacity-70">No new notifications</p>
            </div>
          ) : (
            <div>
              {unreadItems.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>New</p>
                  </div>
                  <div className="divide-y divide-border/50">
                    {unreadItems.map((notif) => {
                      const config = typeConfig[notif.type];
                      const Icon = config.icon;
                      return (
                        <div
                          key={notif.id}
                          className="flex gap-3 px-4 py-3.5 hover:bg-accent/30 cursor-pointer group bg-primary/[0.02] transition-colors"
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm truncate" style={{ fontWeight: 600 }}>
                                {notif.title}
                              </p>
                              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                              {notif.time}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notif.id);
                            }}
                            className="shrink-0 text-muted-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all self-center rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {readItems.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Earlier</p>
                  </div>
                  <div className="divide-y divide-border/50">
                    {readItems.map((notif) => {
                      const config = typeConfig[notif.type];
                      const Icon = config.icon;
                      return (
                        <div
                          key={notif.id}
                          className="flex gap-3 px-4 py-3.5 hover:bg-accent/30 cursor-pointer group opacity-70 hover:opacity-100 transition-all"
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate" style={{ fontWeight: 500 }}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                              {notif.time}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notif.id);
                            }}
                            className="shrink-0 text-muted-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all self-center rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border p-3">
          <button className="w-full rounded-xl py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors" style={{ fontWeight: 600 }}>
            View All Notifications
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
