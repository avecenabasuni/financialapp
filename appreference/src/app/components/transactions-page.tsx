import { useState } from "react";
import {
  DollarSign,
  Briefcase,
  ShoppingCart,
  Tv,
  Car,
  Laptop,
  Zap,
  Coffee,
  Package,
  Home,
  TrendingUp,
  UtensilsCrossed,
  Fuel,
  Music,
  Code,
  Dumbbell,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { transactions } from "./mock-data";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  Briefcase, ShoppingCart, Tv, Car, Laptop, Zap, Coffee, Package, Home,
  TrendingUp, UtensilsCrossed, Fuel, Music, Code, Dumbbell,
};

const categories = ["All", "Salary", "Groceries", "Entertainment", "Transport", "Utilities", "Food & Drink", "Shopping", "Health", "Freelance", "Investment", "Housing"];

export function TransactionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"date" | "amount">("date");
  const [addTxOpen, setAddTxOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const filteredTransactions = transactions
    .filter((tx) => {
      const matchCategory = selectedCategory === "All" || tx.category === selectedCategory;
      const matchSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return Math.abs(b.amount) - Math.abs(a.amount);
    });

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
  const netAmount = totalIncome - totalExpenses;

  const handleExport = () => {
    toast.success("Transactions exported successfully!");
  };

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 7);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 700 }}>Transactions</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Track and manage all your financial activities.</p>
        </div>
        <button
          onClick={() => setAddTxOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 self-start"
          style={{ fontWeight: 600 }}
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-transparent" />
          <CardContent className="relative p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 shrink-0">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Income</p>
              <p className="text-lg text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 700 }}>
                ${totalIncome.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/8 to-transparent" />
          <CardContent className="relative p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400 shrink-0">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Expenses</p>
              <p className="text-lg text-red-600 dark:text-red-400" style={{ fontWeight: 700 }}>
                ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 to-transparent" />
          <CardContent className="relative p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Amount</p>
              <p className={`text-lg ${netAmount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} style={{ fontWeight: 700 }}>
                {netAmount >= 0 ? "+" : ""} ${Math.abs(netAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 w-full rounded-xl bg-muted/70 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-muted border border-transparent focus:border-primary/20 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort & Export */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSortOrder(sortOrder === "date" ? "amount" : "date")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 h-9 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sort: {sortOrder === "date" ? "Date" : "Amount"}
                </button>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 h-9 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {displayedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1 text-xs transition-all duration-150 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  style={{ fontWeight: selectedCategory === cat ? 600 : 400 }}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="rounded-lg px-2 py-1 text-xs bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction list */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {/* Table header */}
            <div className="hidden md:grid md:grid-cols-[1fr_130px_130px_110px_90px] gap-4 px-5 py-3 text-xs text-muted-foreground bg-muted/30 rounded-t-xl" style={{ fontWeight: 600 }}>
              <span>Transaction</span>
              <span>Category</span>
              <span>Account</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Date</span>
            </div>

            {filteredTransactions.map((tx) => {
              const Icon = iconMap[tx.icon] || DollarSign;
              return (
                <div
                  key={tx.id}
                  className="flex flex-col md:grid md:grid-cols-[1fr_130px_130px_110px_90px] gap-2 md:gap-4 px-5 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                        tx.type === "income"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm truncate" style={{ fontWeight: 500 }}>{tx.description}</span>
                  </div>
                  <div className="flex items-center md:pl-0 pl-12">
                    <Badge variant="secondary" className="border-0 text-xs bg-muted/70">
                      {tx.category}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground md:pl-0 pl-12">
                    {tx.account}
                  </div>
                  <div className="flex items-center md:justify-end md:pl-0 pl-12">
                    <span
                      className={`text-sm ${
                        tx.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-foreground"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {tx.type === "income" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center md:justify-end text-xs text-muted-foreground md:pl-0 pl-12">
                    {new Date(tx.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              );
            })}

            {filteredTransactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <Search className="h-7 w-7 opacity-40" />
                </div>
                <p className="text-sm" style={{ fontWeight: 600 }}>No transactions found</p>
                <p className="text-xs mt-1 opacity-70">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                  className="mt-3 text-xs text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddTransactionDialog open={addTxOpen} onOpenChange={setAddTxOpen} />
    </div>
  );
}
