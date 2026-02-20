import { NavLink } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { LayoutDashboard, ArrowRightLeft, BarChart3, FolderKanban, Wallet, PiggyBank, Settings, X, LogOut, Moon, Sun, Check, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/context/theme-context';
import { useNavigate } from 'react-router-dom';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Transactions', icon: ArrowRightLeft, path: '/transactions' },
  { label: 'Budgets', icon: PiggyBank, path: '/budgets' },
  { label: 'Analytics', icon: BarChart3, path: '/statistics' },
  { label: 'Accounts', icon: Wallet, path: '/wallets' },
  { label: 'Categories', icon: FolderKanban, path: '/categories' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
 

  const SidebarItem = ({ item, isActive }: { item: any, isActive: boolean }) => (
      <div className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:bg-accent hover:text-foreground font-normal",
        isCollapsed && "justify-center px-2"
      )}>
        <item.icon className={cn("w-5 h-5 transition-colors shrink-0", isActive ? "stroke-[2.5px]" : "stroke-2")} />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
        {isCollapsed && isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full" />}
      </div>
  );

  return (
    <aside className={cn(
      "fixed top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Logo + Toggle */}
      <div className={cn("flex items-center h-16 shrink-0 border-b border-border transition-all", isCollapsed ? "justify-center px-0" : "justify-between px-6")}>
        {!isCollapsed ? (
             <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg tracking-tight text-card-foreground truncate">MoneyFlow</span>
             </div>
        ) : (
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
        )}



         {/* Mobile Close */}
        <button onClick={onClose} className="lg:hidden p-1 text-muted-foreground hover:text-primary">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="px-3 py-4 space-y-4 flex-1 flex flex-col">
        {/* Add Transaction Button */}


        <nav className="space-y-1">
        {navItems.map((item) => (
             <TooltipProvider key={item.path} delayDuration={0}>
                 <Tooltip>
                     <TooltipTrigger asChild>
                        <NavLink to={item.path} end={item.path === '/'} onClick={onClose} className="block outline-none">
                            {({ isActive }) => <SidebarItem item={item} isActive={isActive} />}
                        </NavLink>
                     </TooltipTrigger>
                     {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                 </Tooltip>
             </TooltipProvider>
        ))}
        </nav>
      </div>

      {!isCollapsed && (
        <div className="px-4">
            <Separator className="bg-border" />
        </div>
      )}

      {/* User + Settings Dropdown */}
      <div className={cn("mt-auto p-4 transition-all relative", isCollapsed && "items-center flex flex-col px-2")}>
        
        {/* Desktop Collapse Toggle (Moved here) */}
        <button 
            onClick={onToggleCollapse} 
            className={cn(
                "hidden lg:flex items-center justify-center w-6 h-6 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-all absolute -right-3 top-[-12px] z-50 shadow-sm",
                isCollapsed && "-right-3"
            )}
        >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        <DropdownMenu>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <div className={cn(
                            "flex items-center gap-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group border border-transparent hover:border-border",
                            isCollapsed ? "justify-center p-2 w-10 h-10" : "px-3 py-2.5 w-full"
                        )}>
                        <Avatar className={cn("border border-border shrink-0 transition-all", isCollapsed ? "w-8 h-8" : "w-9 h-9")}>
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{user?.username?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 text-left">
                                <div className="text-sm font-medium text-card-foreground truncate">{user?.username || 'User'}</div>
                                <div className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</div>
                            </div>
                        )}
                        </div>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">My Account</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenuContent align={isCollapsed ? "center" : "end"} className="w-56 z-[100]" side="right" sideOffset={20}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Monitor className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="z-[100]">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                    {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
