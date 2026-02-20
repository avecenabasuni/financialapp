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
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { transactions } from "./mock-data";

const iconMap: Record<string, React.ElementType> = {
  Briefcase, ShoppingCart, Tv, Car, Laptop, Zap, Coffee, Package, Home,
  TrendingUp, UtensilsCrossed, Fuel, Music, Code, Dumbbell,
};

const categories = ["All", "Salary", "Groceries", "Entertainment", "Transport", "Utilities", "Food & Drink", "Shopping", "Health", "Freelance", "Investment", "Housing"];

export function TransactionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"date" | "amount">("date");

  const filteredTransactions = transactions
    .filter((tx) => {
      const matchCategory = selectedCategory === "All" || tx.category === selectedCategory;
      const matchSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return Math.abs(b.amount) - Math.abs(a.amount);
    });

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 600 }}>Transactions</h1>
          <p className="text-muted-foreground mt-1">Track and manage all your financial activities.</p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-colors self-start">
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Income</p>
              <p className="text-lg text-emerald-600" style={{ fontWeight: 600 }}>${totalIncome.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Expenses</p>
              <p className="text-lg text-red-600" style={{ fontWeight: 600 }}>${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ArrowUpDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Transactions</p>
              <p className="text-lg" style={{ fontWeight: 600 }}>{transactions.length} total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-lg bg-muted pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {cat}
                </button>
              ))}
              <button className="shrink-0 rounded-lg px-2 py-1.5 text-xs bg-muted text-muted-foreground hover:bg-accent">
                <Filter className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Sort & Export */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === "date" ? "amount" : "date")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sortOrder === "date" ? "Date" : "Amount"}
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors">
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction list */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {/* Table header */}
            <div className="hidden md:grid md:grid-cols-[1fr_120px_120px_100px_80px] gap-4 px-5 py-3 text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
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
                  className="flex flex-col md:grid md:grid-cols-[1fr_120px_120px_100px_80px] gap-2 md:gap-4 px-5 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        tx.type === "income"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm truncate" style={{ fontWeight: 500 }}>{tx.description}</span>
                  </div>
                  <div className="flex items-center md:pl-0 pl-12">
                    <Badge variant="secondary" className="border-0 text-xs">
                      {tx.category}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground md:pl-0 pl-12">
                    {tx.account}
                  </div>
                  <div className="flex items-center md:justify-end md:pl-0 pl-12">
                    <span
                      className={`text-sm ${
                        tx.type === "income" ? "text-emerald-600" : "text-foreground"
                      }`}
                      style={{ fontWeight: 500 }}
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
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-8 w-8 mb-2" />
                <p className="text-sm">No transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
