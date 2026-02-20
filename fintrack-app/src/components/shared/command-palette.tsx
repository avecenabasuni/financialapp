import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRightLeft, Wallet, FolderKanban, PiggyBank, LayoutDashboard, BarChart3, Settings, X } from 'lucide-react';

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  type: 'transaction' | 'wallet' | 'category' | 'budget' | 'page';
  icon: React.ReactNode;
  path: string;
}

const PAGES: SearchResult[] = [
  { id: 'p-dash', label: 'Dashboard', sublabel: 'Overview', type: 'page', icon: <LayoutDashboard className="w-4 h-4" />, path: '/' },
  { id: 'p-txn', label: 'Transactions', sublabel: 'All transactions', type: 'page', icon: <ArrowRightLeft className="w-4 h-4" />, path: '/transactions' },
  { id: 'p-stats', label: 'Statistics', sublabel: 'Charts & trends', type: 'page', icon: <BarChart3 className="w-4 h-4" />, path: '/statistics' },
  { id: 'p-cat', label: 'Categories', sublabel: 'Manage categories', type: 'page', icon: <FolderKanban className="w-4 h-4" />, path: '/categories' },
  { id: 'p-wal', label: 'Wallets', sublabel: 'Manage wallets', type: 'page', icon: <Wallet className="w-4 h-4" />, path: '/wallets' },
  { id: 'p-bud', label: 'Budgets', sublabel: 'Budget limits', type: 'page', icon: <PiggyBank className="w-4 h-4" />, path: '/budgets' },
  { id: 'p-set', label: 'Settings', sublabel: 'App preferences', type: 'page', icon: <Settings className="w-4 h-4" />, path: '/settings' },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { transactions } = useTransactionStore();
  const { wallets } = useWalletStore();
  const { categories } = useCategoryStore();
  const { budgets } = useBudgetStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Build search results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return PAGES;

    const items: SearchResult[] = [];

    // Pages
    PAGES.forEach((p) => {
      if (p.label.toLowerCase().includes(q)) items.push(p);
    });

    // Transactions
    transactions.forEach((t) => {
      if (t.categoryName.toLowerCase().includes(q) || t.note?.toLowerCase().includes(q)) {
        items.push({
          id: t.id,
          label: t.categoryName,
          sublabel: `${t.type === 'expense' ? '-' : '+'}Rp ${t.amount.toLocaleString()} · ${t.date}`,
          type: 'transaction',
          icon: <ArrowRightLeft className="w-4 h-4" />,
          path: '/transactions',
        });
      }
    });

    // Wallets
    wallets.forEach((w) => {
      if (w.name.toLowerCase().includes(q)) {
        items.push({
          id: w.id,
          label: w.name,
          sublabel: `Rp ${w.balance.toLocaleString()}`,
          type: 'wallet',
          icon: <Wallet className="w-4 h-4" />,
          path: '/wallets',
        });
      }
    });

    // Categories
    categories.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        items.push({
          id: c.id,
          label: c.name,
          sublabel: c.type,
          type: 'category',
          icon: <FolderKanban className="w-4 h-4" />,
          path: '/categories',
        });
      }
    });

    // Budgets
    budgets.forEach((b) => {
      // Safe check for categoryName
      const catName = b.categoryName || 'Unknown Category';
      if (catName.toLowerCase().includes(q)) {
        items.push({
          id: b.id,
          label: `${catName} Budget`,
          sublabel: `Rp ${b.spent.toLocaleString()} / Rp ${b.amount.toLocaleString()}`,
          type: 'budget',
          icon: <PiggyBank className="w-4 h-4" />,
          path: '/budgets',
        });
      }
    });

    return items.slice(0, 12);
  }, [query, transactions, wallets, categories, budgets]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      navigate(results[activeIndex].path);
      onClose();
    }
    else if (e.key === 'Escape') onClose();
  };

  // Reset active index on query change
  useEffect(() => setActiveIndex(0), [query]);

  const typeLabels: Record<string, string> = {
    page: 'Pages', transaction: 'Transactions', wallet: 'Wallets', category: 'Categories', budget: 'Budgets',
  };

  // Group results
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] ??= []).push(r);
    return acc;
  }, {});

  let globalIdx = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search transactions, wallets, pages..."
                className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-secondary rounded">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No results found for "{query}"</div>
              ) : (
                Object.entries(grouped).map(([type, items]) => (
                  <div key={type} className="mb-1">
                    <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      {typeLabels[type] || type}
                    </div>
                    {items.map((item) => {
                      globalIdx++;
                      const idx = globalIdx;
                      return (
                        <button
                          key={item.id}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => { navigate(item.path); onClose(); }}
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                            idx === activeIndex ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span className="shrink-0 opacity-60">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium">{item.label}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{item.sublabel}</div>
                          </div>
                          {idx === activeIndex && <span className="text-[10px] text-muted-foreground">↵</span>}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
              <span><kbd className="px-1 py-0.5 bg-secondary rounded font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="px-1 py-0.5 bg-secondary rounded font-mono">↵</kbd> select</span>
              <span><kbd className="px-1 py-0.5 bg-secondary rounded font-mono">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
