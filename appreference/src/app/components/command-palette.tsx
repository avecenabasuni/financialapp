import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  BarChart3,
  Wallet,
  Target,
  Settings,
  Receipt,
  Plus,
  Search,
  ArrowRight,
  Briefcase,
  ShoppingCart,
  Home,
  TrendingUp,
  Command,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  action: () => void;
  group: string;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction: () => void;
}

export function CommandPalette({ open, onOpenChange, onAddTransaction }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const items: CommandItem[] = [
    // Quick actions
    {
      id: "add-tx",
      label: "Add Transaction",
      sublabel: "Record new income or expense",
      icon: Plus,
      action: () => { onOpenChange(false); onAddTransaction(); },
      group: "Quick Actions",
    },
    // Navigation
    { id: "nav-dash", label: "Dashboard", sublabel: "Go to overview", icon: LayoutDashboard, action: () => { navigate("/"); onOpenChange(false); }, group: "Navigation" },
    { id: "nav-tx", label: "Transactions", sublabel: "View all transactions", icon: ArrowLeftRight, action: () => { navigate("/transactions"); onOpenChange(false); }, group: "Navigation" },
    { id: "nav-budgets", label: "Budgets", sublabel: "Manage spending limits", icon: PieChart, action: () => { navigate("/budgets"); onOpenChange(false); }, group: "Navigation" },
    { id: "nav-analytics", label: "Analytics", sublabel: "Financial insights", icon: BarChart3, action: () => { navigate("/analytics"); onOpenChange(false); }, group: "Navigation" },
    { id: "nav-accounts", label: "Accounts", sublabel: "Manage accounts", icon: Wallet, action: () => { navigate("/accounts"); onOpenChange(false); }, group: "Navigation" },
    { id: "nav-goals", label: "Goals", sublabel: "Savings targets", icon: Target, action: () => { navigate("/goals"); onOpenChange(false); }, group: "Navigation" },
    { id: "nav-bills", label: "Bills & Subscriptions", sublabel: "Recurring payments", icon: Receipt, action: () => { navigate("/bills"); onOpenChange(false); }, group: "Navigation" },
    { id: "nav-settings", label: "Settings", sublabel: "App preferences", icon: Settings, action: () => { navigate("/settings"); onOpenChange(false); }, group: "Navigation" },
    // Recent transactions
    { id: "tx-salary", label: "Salary Deposit", sublabel: "+$5,200.00 · Feb 18", icon: Briefcase, action: () => { navigate("/transactions"); onOpenChange(false); }, group: "Recent Transactions" },
    { id: "tx-groceries", label: "Whole Foods Market", sublabel: "-$127.45 · Feb 17", icon: ShoppingCart, action: () => { navigate("/transactions"); onOpenChange(false); }, group: "Recent Transactions" },
    { id: "tx-rent", label: "Rent Payment", sublabel: "-$1,800.00 · Feb 1", icon: Home, action: () => { navigate("/transactions"); onOpenChange(false); }, group: "Recent Transactions" },
  ];

  const filtered = query.trim()
    ? items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          (item.sublabel && item.sublabel.toLowerCase().includes(query.toLowerCase()))
      )
    : items;

  const groups = Array.from(new Set(filtered.map((item) => item.group)));

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  // Build a flat list with indices for each group item
  let runningIndex = -1;

  return (
    <div className="fixed inset-0 z-[100]" onClick={() => onOpenChange(false)}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-x-0 top-[10%] sm:top-[15%] mx-auto w-full max-w-lg px-4">
        <div
          className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-border/60 px-4">
            <Search className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search actions, pages, transactions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:flex h-6 items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 text-[10px] text-muted-foreground shrink-0">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[380px] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-3">
                  <Search className="h-6 w-6 opacity-30" />
                </div>
                <p className="text-sm" style={{ fontWeight: 600 }}>No results found</p>
                <p className="text-xs mt-0.5 opacity-70">Try a different search term</p>
              </div>
            ) : (
              groups.map((group) => {
                const groupItems = filtered.filter((item) => item.group === group);
                return (
                  <div key={group} className="mb-1">
                    <p className="px-2 py-1.5 text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>
                      {group}
                    </p>
                    {groupItems.map((item) => {
                      runningIndex++;
                      const currentIndex = runningIndex;
                      const isSelected = currentIndex === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-100 ${
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-accent/50"
                          }`}
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isSelected ? "bg-primary/15" : "bg-muted"
                          }`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate" style={{ fontWeight: isSelected ? 600 : 500 }}>{item.label}</p>
                            {item.sublabel && (
                              <p className="text-xs text-muted-foreground truncate">{item.sublabel}</p>
                            )}
                          </div>
                          {isSelected && (
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border/60 px-4 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/20">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="h-5 w-5 flex items-center justify-center rounded border border-border bg-card text-[10px]">↑</kbd>
                <kbd className="h-5 w-5 flex items-center justify-center rounded border border-border bg-card text-[10px]">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="h-5 flex items-center justify-center rounded border border-border bg-card px-1.5 text-[10px]">Enter</kbd>
                Select
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Command className="h-3 w-3" />
              <span>K to toggle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
