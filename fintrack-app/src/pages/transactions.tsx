
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import CategoryIcon from '@/components/shared/category-icon';
import AnimatedPage from '@/components/shared/animated-page';
import { ArrowRightLeft, ArrowUpRight, ArrowDownRight, Filter, Download, X, Plus, MoreHorizontal } from 'lucide-react';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { type Transaction } from '@/types';
import ExportDataModal from '@/components/modals/export-data-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import { useToast } from '@/context/toast-context';

export default function Transactions() {
  const { transactions, openAddModal, deleteTransaction } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { addToast } = useToast();
  
  // Filter States
  const [activeType, setActiveType] = useState<string>('All'); // All, Income, Expense
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Date Filter State
  const [viewMode, setViewMode] = useState<'month' | 'range'>('month');
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10)
  });


  // 1. Date Filter (Base Data for Stats)
  const dateFilteredTransactions = useMemo(() => {
    let result = transactions;

    if (viewMode === 'month' && monthFilter) {
        result = result.filter(t => t.date.startsWith(monthFilter));
    } else if (viewMode === 'range' && dateRange.start && dateRange.end) {
        result = result.filter(t => t.date >= dateRange.start && t.date <= dateRange.end);
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, viewMode, monthFilter, dateRange]);

  // 2. Full Filter (For List) based on Date Data
  const filteredListTransactions = useMemo(() => {
    let result = dateFilteredTransactions;

    // Type Filter
    if (activeType !== 'All') {
        result = result.filter(t => t.type === activeType.toLowerCase());
    }

    // Category Filter (Multi-select)
    if (selectedCategoryIds.length > 0) {
        result = result.filter(t => selectedCategoryIds.includes(t.categoryId));
    }

    return result;
  }, [dateFilteredTransactions, activeType, selectedCategoryIds]);

  // Stats for Date-Filtered Data ONLY (ignores Type/Category filters)
  const stats = useMemo(() => {
    const income = dateFilteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = dateFilteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, total: income - expense };
  }, [dateFilteredTransactions]);

  // Group Transactions by Day
  const groupedTransactions = useMemo(() => {
    const groups: { date: string; transactions: Transaction[]; dailyIncome: number; dailyExpense: number }[] = [];
    
    filteredListTransactions.forEach(t => {
        const dateKey = t.date; // Assuming YYYY-MM-DD
        let group = groups.find(g => g.date === dateKey);
        
        if (!group) {
            group = { date: dateKey, transactions: [], dailyIncome: 0, dailyExpense: 0 };
            groups.push(group);
        }
        
        group.transactions.push(t);
        if (t.type === 'income') group.dailyIncome += t.amount;
        if (t.type === 'expense') group.dailyExpense += t.amount;
    });

    return groups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredListTransactions]);

  const handleEditTransaction = (t: Transaction) => {
    openAddModal(t);
  };

  const handleDeleteTransaction = async () => {
      if (!transactionToDelete) return;
      try {
          await deleteTransaction(transactionToDelete.id);
          addToast('Transaction deleted', 'success');
          setTransactionToDelete(null);
      } catch (error) {
          addToast('Failed to delete transaction', 'error');
      }
  };

  const clearFilters = () => {
    setActiveType('All');
    setSelectedCategoryIds([]);
    setMonthFilter(new Date().toISOString().slice(0, 7));
  };

  // Helper to format date header
  const formatDateHeader = (dateStr: string) => {
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (dateStr === today.toISOString().slice(0, 10)) return 'Today, ' + new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
      if (dateStr === yesterday.toISOString().slice(0, 10)) return 'Yesterday, ' + new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

      return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  // Helper to format currency
  const formatCurrencyLocal = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <AnimatedPage className="space-y-6">
      <ExportDataModal open={exportOpen} onClose={() => setExportOpen(false)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage and track your financial activity.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-950">
             <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/30">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Income</p>
                        <h3 className="text-2xl font-bold text-emerald-600">{formatCurrencyLocal(stats.income)}</h3>
                    </div>
                </div>
             </CardContent>
        </Card>
        <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-zinc-950">
             <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 dark:bg-rose-900/30">
                        <ArrowDownRight className="h-5 w-5" />
                    </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Expense</p>
                        <h3 className="text-2xl font-bold text-rose-600">{formatCurrencyLocal(stats.expense)}</h3>
                    </div>
                </div>
             </CardContent>
        </Card>
        <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-zinc-950">
             <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30">
                        <ArrowRightLeft className="h-5 w-5" />
                    </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Net Total</p>
                        <h3 className={cn("text-2xl font-bold", stats.total >= 0 ? "text-emerald-600" : "text-rose-600")}>
                            {formatCurrencyLocal(stats.total)}
                        </h3>
                    </div>
                </div>
             </CardContent>
        </Card>
      </div>

       {/* Filter Bar - Consistent rounded-xl */}
       <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
         
         {/* Left: Type Pills & Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Type Pills */}
              <div className="flex items-center h-9 px-1 rounded-lg border bg-background">
                     <div className="flex bg-muted rounded-md p-0.5">
                         {['All', 'Income', 'Expense'].map(type => (
                             <button
                                 key={type}
                                 onClick={() => setActiveType(type)}
                                 className={cn(
                                     "px-2 py-0.5 rounded text-xs font-medium transition-all",
                                     activeType === type 
                                         ? "bg-background text-foreground shadow-sm" 
                                         : "text-muted-foreground hover:text-foreground"
                                 )}
                             >
                                 {type}
                             </button>
                         ))}
                     </div>
                 </div>

             {/* Separator */}
             <div className="h-6 w-[1px] bg-border hidden sm:block" />

              {/* Category Filter Dropdown */}
              <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant={selectedCategoryIds.length > 0 ? "secondary" : "outline"} size="sm" className="h-9 gap-2 rounded-lg">
                         <Filter className="w-3.5 h-3.5" />
                         {selectedCategoryIds.length === 0 
                             ? 'Category' 
                             : selectedCategoryIds.length === 1 
                                 ? categories.find(c => c.id === selectedCategoryIds[0])?.name || 'Category'
                                 : `${selectedCategoryIds.length} Selected`}
                         {selectedCategoryIds.length > 0 && (
                              <div 
                                 role="button"
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     e.preventDefault();
                                     setSelectedCategoryIds([]);
                                 }}
                                 className="ml-1 hover:bg-background/20 rounded-full p-0.5 cursor-pointer"
                              >
                                 <X className="w-3 h-3" />
                              </div>
                         )}
                     </Button>
                   </DropdownMenuTrigger>
                     <DropdownMenuContent align="start" className="w-[220px] max-h-[300px] overflow-y-auto rounded-lg">
                     <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSelectedCategoryIds([]); }}>
                         <div className="flex items-center gap-2 w-full">
                             <div className={cn("w-4 h-4 border rounded flex items-center justify-center", selectedCategoryIds.length === 0 ? "bg-primary border-primary" : "border-muted-foreground")}>
                                 {selectedCategoryIds.length === 0 && <X className="w-3 h-3 text-primary-foreground" />}
                             </div>
                             <span>All Categories</span>
                         </div>
                     </DropdownMenuItem>
                     {categories.map(cat => {
                         const isSelected = selectedCategoryIds.includes(cat.id);
                         return (
                             <DropdownMenuItem 
                                 key={cat.id} 
                                 onSelect={(e) => {
                                     e.preventDefault();
                                     setSelectedCategoryIds(prev => 
                                         isSelected 
                                             ? prev.filter(id => id !== cat.id)
                                             : [...prev, cat.id]
                                     );
                                 }}
                             >
                                 <div className="flex items-center gap-2 w-full">
                                     <div className={cn(
                                         "w-4 h-4 border rounded flex items-center justify-center transition-colors", 
                                         isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                                     )}>
                                         {isSelected && <div className="w-2 h-2 bg-primary-foreground rounded-sm" />}
                                     </div>
                                     <CategoryIcon icon={cat.icon} color={cat.color} className="w-4 h-4" />
                                     <span className="flex-1 truncate">{cat.name}</span>
                                 </div>
                             </DropdownMenuItem>
                         );
                     })}
                   </DropdownMenuContent>
              </DropdownMenu>
         </div>

         {/* Right: Date & Actions */}
         <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              
              {/* Date Toggle & Inputs */}
              <div className="flex items-center gap-2 h-9 px-1 rounded-lg border bg-background w-full sm:w-auto">
                  {/* View Mode Toggle */}
                  <div className="flex bg-muted rounded-md p-0.5 shrink-0">
                     <button
                         onClick={() => setViewMode('month')}
                         className={cn(
                             "px-2 py-0.5 rounded text-xs font-medium transition-all",
                             viewMode === 'month' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                         )}
                     >
                         Month
                     </button>
                     <button
                         onClick={() => setViewMode('range')}
                         className={cn(
                             "px-2 py-0.5 rounded text-xs font-medium transition-all",
                             viewMode === 'range' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                         )}
                     >
                         Range
                     </button>
                  </div>

                  {/* Inputs */}
                  {viewMode === 'month' ? (
                     <Input 
                         type="month" 
                         value={monthFilter}
                         onChange={(e) => setMonthFilter(e.target.value)} 
                         className="h-7 w-auto text-xs border-none bg-transparent focus-visible:ring-0 shadow-none px-2 rounded"
                     />
                  ) : (
                     <div className="flex items-center gap-1 px-2">
                         <input
                             type="date"
                             value={dateRange.start}
                             onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                             className="bg-transparent text-xs border-none focus:outline-none w-[80px] text-right"
                         />
                         <span className="text-muted-foreground">-</span>
                         <input
                             type="date"
                             value={dateRange.end}
                             onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                             className="bg-transparent text-xs border-none focus:outline-none w-[80px]"
                         />
                     </div>
                  )}
              </div>

              <Button variant="outline" size="sm" className="h-9 gap-2 w-full sm:w-auto rounded-lg" onClick={() => setExportOpen(true)}>
                 <Download className="h-3.5 w-3.5" /> 
                 <span className="hidden sm:inline">Export</span>
              </Button>
         </div>
       </div>

       {/* Daily Grouped List */}
       <div className="space-y-6">
            {groupedTransactions.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-card rounded-xl border border-dashed">
                    <Filter className="h-8 w-8 opacity-20 mb-2" />
                    <p>No transactions found matching your filters.</p>
                     {(activeType !== 'All' || selectedCategoryIds.length > 0) && (
                        <Button variant="link" onClick={clearFilters} className="text-primary h-auto p-0 mt-1">
                            Clear Filters
                        </Button>
                    )}
                 </div>
            ) : (
                groupedTransactions.map(group => (
                    <div key={group.date} className="space-y-2">
                        {/* Daily Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 rounded-xl gap-2">
                            <h3 className="text-sm font-semibold text-foreground">{formatDateHeader(group.date)}</h3>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="text-muted-foreground">
                                    Income: <span className="text-emerald-600 font-medium">{formatCurrencyLocal(group.dailyIncome)}</span>
                                </span>
                                <span className="text-muted-foreground">
                                    Expense: <span className="text-rose-600 font-medium">{formatCurrencyLocal(group.dailyExpense)}</span>
                                </span>
                            </div>
                        </div>

                         {/* Transactions Table for this Day */}
                        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[30%]">Transaction</TableHead>
                                    <TableHead className="w-[20%]">Category</TableHead>
                                    <TableHead className="w-[20%]">Account</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {group.transactions.map((t) => {
                                        const category = categories.find(c => c.id === t.categoryId);
                                        return (
                                            <TableRow 
                                                key={t.id} 
                                                className="group hover:bg-muted/50 transition-colors"
                                            >
                                                <TableCell className="font-medium cursor-pointer" onClick={() => handleEditTransaction(t)}>
                                                    <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                                                        t.type === 'income' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" : "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
                                                    )}>
                                                        {t.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <div className="truncate max-w-[150px] sm:max-w-[200px]" title={t.note || t.categoryName}>{t.note || t.categoryName}</div>
                                                        {t.note && t.note !== t.categoryName && <div className="text-xs text-muted-foreground truncate max-w-[150px]">{t.categoryName}</div>}
                                                    </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="cursor-pointer" onClick={() => handleEditTransaction(t)}>
                                                    {category ? (
                                                        <Badge variant="outline" className="gap-1 font-normal" style={{ 
                                                            backgroundColor: category.color + '10', 
                                                            borderColor: category.color + '20',
                                                            color: category.color 
                                                        }}>
                                                            <CategoryIcon icon={category.icon} color={category.color} className="w-3 h-3" />
                                                            {category.name}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="font-normal text-muted-foreground">Uncategorized</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground cursor-pointer" onClick={() => handleEditTransaction(t)}>{t.walletName}</TableCell>
                                                <TableCell className={cn(
                                                    "text-right font-medium cursor-pointer",
                                                    t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                                                )} onClick={() => handleEditTransaction(t)}>
                                                    {t.type === 'income' ? '+' : '-'}{formatCurrencyLocal(t.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditTransaction(t)}>
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setTransactionToDelete(t)}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))
            )}

        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
            <Button
                onClick={() => openAddModal()}
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105"
            >
                <Plus className="h-6 w-6" />
            </Button>
        </div>

        <ConfirmDeleteModal
            open={!!transactionToDelete}
            onClose={() => setTransactionToDelete(null)}
            onConfirm={handleDeleteTransaction}
            title="Delete Transaction"
            description="Are you sure you want to delete this transaction? This will revert the balance changes to your wallet."
        />
    </AnimatedPage>
  );
}
