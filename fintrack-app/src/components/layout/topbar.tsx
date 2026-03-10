import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";

interface TopBarProps {
  onMenuToggle: () => void;
  onSearchClick: () => void;
  onNotificationsClick?: () => void;
}

export default function TopBar({
  onMenuToggle,
  onSearchClick,
  onNotificationsClick,
}: TopBarProps) {
  const [shortcut, setShortcut] = useState("Ctrl + K");
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if user is on MacOS
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    setShortcut(isMac ? "⌘K" : "Ctrl + K");
  }, []);

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <button
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors text-sm text-muted-foreground w-80"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-background rounded border border-border">
            {shortcut}
          </kbd>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={onNotificationsClick}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background" />
          )}
        </Button>
      </div>
    </header>
  );
}
