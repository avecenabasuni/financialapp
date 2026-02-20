import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Bell, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  onMenuToggle: () => void;
  onSearchClick: () => void;
}

import { useNotificationStore } from '@/store/useNotificationStore';
import { cn } from '@/lib/utils';

interface TopBarProps {
  onMenuToggle: () => void;
  onSearchClick: () => void;
}

export default function TopBar({ onMenuToggle, onSearchClick }: TopBarProps) {
  const [shortcut, setShortcut] = useState('Ctrl + K');
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if user is on MacOS
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    setShortcut(isMac ? '⌘K' : 'Ctrl + K');
  }, []);

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
          <Menu className="w-5 h-5" />
        </Button>
        <button onClick={onSearchClick} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors text-sm text-muted-foreground w-80">
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-background rounded border border-border">{shortcut}</kbd>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={20} className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto px-2 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => markAllAsRead()}
                >
                    Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
               {notifications.length === 0 ? (
                   <div className="p-4 text-center text-muted-foreground text-xs">
                       No notifications yet.
                   </div>
               ) : (
                   notifications.map((notification) => (
                    <div key={notification.id}>
                        <DropdownMenuItem 
                            className={cn(
                                "cursor-pointer flex flex-col items-start gap-1 p-3 focus:bg-accent",
                                notification.is_read === 0 && "bg-primary/5"
                            )}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <span className={cn("text-sm", notification.is_read === 0 ? "font-semibold" : "font-medium")}>
                                    {notification.title}
                                </span>
                                <span className="text-[10px] text-muted-foreground ml-auto">
                                    {new Date(notification.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {notification.message}
                            </p>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </div>
                   ))
               )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
