import { NavLink, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  BarChart3,
  Wallet,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Target,
  Receipt,
  Plus,
  Command,
  Sun,
  Moon,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { NotificationsPanel } from "./notifications-panel";
import { CommandPalette } from "./command-palette";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", color: "text-primary" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions", color: "text-blue-500" },
  { to: "/budgets", icon: PieChart, label: "Budgets", color: "text-violet-500" },
  { to: "/bills", icon: Receipt, label: "Bills", color: "text-amber-500" },
  { to: "/analytics", icon: BarChart3, label: "Analytics", color: "text-rose-500" },
  { to: "/accounts", icon: Wallet, label: "Accounts", color: "text-cyan-500" },
  { to: "/goals", icon: Target, label: "Goals", color: "text-emerald-500" },
];

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/budgets": "Budgets",
  "/bills": "Bills & Subscriptions",
  "/analytics": "Analytics",
  "/accounts": "Accounts",
  "/goals": "Goals",
  "/settings": "Settings",
};

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg" />
  );

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
      title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4.5 w-4.5" />
      ) : (
        <Moon className="h-4.5 w-4.5" />
      )}
    </button>
  );
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [addTxOpen, setAddTxOpen] = useState(false);
  const location = useLocation();

  const currentPage = pageNames[location.pathname] ?? "MoneyFlow";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Toaster position="top-right" richColors />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base tracking-tight" style={{ fontWeight: 700 }}>MoneyFlow</span>
              <div className="flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                <span className="text-[10px] text-muted-foreground">Personal</span>
              </div>
            </div>
          </div>
          <button
            className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick add button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => { setAddTxOpen(true); setSidebarOpen(false); }}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 py-2.5 text-sm text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:opacity-95 transition-all duration-200"
            style={{ fontWeight: 600 }}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
            Add Transaction
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <p className="px-3 py-1.5 text-[10px] text-muted-foreground uppercase tracking-widest" style={{ fontWeight: 600 }}>
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`
              }
              end={item.to === "/"}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-primary" />
                  )}
                  <item.icon className={`h-4.5 w-4.5 shrink-0 transition-colors ${isActive ? "text-primary" : "group-hover:" + item.color}`} />
                  <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                  {item.to === "/bills" && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-[10px]" style={{ fontWeight: 700 }}>
                      1
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border p-3 space-y-0.5">
          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-primary" />
                )}
                <Settings className="h-4.5 w-4.5" />
                <span style={{ fontWeight: isActive ? 600 : 400 }}>Settings</span>
              </>
            )}
          </NavLink>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/50 transition-colors cursor-pointer group">
            <div className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary text-xs" style={{ fontWeight: 700 }}>JD</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ fontWeight: 600 }}>Jordan Davis</p>
              <p className="text-xs text-muted-foreground truncate">Personal Plan</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page title */}
            <div className="hidden lg:block">
              <h2 className="text-sm" style={{ fontWeight: 600 }}>{currentPage}</h2>
            </div>

            <button
              onClick={() => setCommandOpen(true)}
              className="relative flex items-center gap-2 h-9 w-56 xl:w-72 rounded-xl bg-muted/80 pl-3 pr-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-150 border border-transparent hover:border-border"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 text-left truncate">Search anything...</span>
              <kbd className="hidden md:flex h-5 items-center gap-0.5 rounded-md border border-border bg-card px-1.5 text-[10px] shrink-0">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mobile search */}
            <button
              onClick={() => setCommandOpen(true)}
              className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Quick add (mobile) */}
            <button
              onClick={() => setAddTxOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors lg:hidden shadow-md shadow-primary/20"
            >
              <Plus className="h-4.5 w-4.5" />
            </button>

            <ThemeToggle />

            {/* Notifications */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-150"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
            </button>

            <div className="h-5 w-px bg-border mx-0.5" />

            <div className="hidden sm:flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/15 cursor-default text-xs px-2.5">
                Mar 2026
              </Badge>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
          <Outlet />
        </main>
      </div>

      {/* Overlays */}
      <NotificationsPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onAddTransaction={() => setAddTxOpen(true)}
      />
      <AddTransactionDialog open={addTxOpen} onOpenChange={setAddTxOpen} />
    </div>
  );
}
