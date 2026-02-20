import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/context/toast-context';
import CategoryIcon from '@/components/shared/category-icon';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useCategoryStore } from '@/store/useCategoryStore';
// import { categories } from '@/data/mock-data'; // Replaced by store
import { useRecurringStore, type Frequency } from '@/store/useRecurringStore';
import { Switch } from '@/components/ui/switch';
import { type Transaction } from '@/types';
import { Trash2, AlertCircle } from 'lucide-react';
import ConfirmDeleteModal from './confirm-delete-modal';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
}

export default function AddTransactionModal({ open, onClose, initialData }: AddTransactionModalProps) {
  const navigate = useNavigate();
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactionStore();
  const { wallets } = useWalletStore(); 
  const { categories } = useCategoryStore();
  const { addRule } = useRecurringStore();
  const { addToast } = useToast();
  
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Recurring State
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('monthly');

  // Auto-select first wallet when wallets are loaded
  useEffect(() => {
    if (open) {
      if (initialData) {
        setType(initialData.type as any);
        setAmount(initialData.amount.toString());
        setCategoryId(initialData.categoryId || '');
        setWalletId(initialData.walletId);
        setToWalletId(initialData.toWalletId || '');
        setDate(initialData.date.slice(0, 10)); // Ensure YYYY-MM-DD
        setNote(initialData.note || '');
      } else {
        // Reset defaults
        setType('expense');
        setAmount('');
        setCategoryId('');
        setNote('');
        setDate(new Date().toISOString().slice(0, 10));
        if (wallets.length > 0) setWalletId(wallets[0].id);
        if (wallets.length > 1) setToWalletId(wallets[1].id);
        setIsRecurring(false);
      }
    }
  }, [open, initialData, wallets]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleDelete = () => {
    if (!initialData) return;
    deleteTransaction(initialData.id);
    addToast('Transaction deleted', 'success', {
        label: 'Undo',
        onClick: () => {
            const { id, ...rest } = initialData;
            addTransaction(rest);
        }
    });
    onClose();
  };

  const calculateNextDue = (current: string, freq: Frequency): string => {
    const d = new Date(current);
    switch (freq) {
        case 'daily': return addDays(d, 1).toISOString();
        case 'weekly': return addWeeks(d, 1).toISOString();
        case 'monthly': return addMonths(d, 1).toISOString();
        case 'yearly': return addYears(d, 1).toISOString();
        default: return addDays(d, 1).toISOString();
    }
  };

  const handleSave = async () => {
    // Financial Precision: Enforce integer arithmetic.
    const amountNum = Math.floor(Number(amount));
    if (!amount || amountNum <= 0) {
      addToast('Please enter a valid amount', 'warning');
      return;
    }
    if (!walletId) {
      addToast('Please select a wallet', 'warning');
      return;
    }
    if (type !== 'transfer' && !categoryId) {
      addToast('Please select a category', 'warning');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const selectedWallet = wallets.find((w) => w.id === walletId);
    const selectedToWallet = wallets.find((w) => w.id === toWalletId);

    const transactionData = {
      amount: amountNum,
      type,
      categoryId: selectedCategory?.id || '',
      categoryName: type === 'transfer' ? 'Transfer' : selectedCategory?.name || '',
      categoryIcon: type === 'transfer' ? 'ArrowRightLeft' : selectedCategory?.icon || '',
      categoryColor: type === 'transfer' ? '#8b5cf6' : selectedCategory?.color || '',
      walletId,
      walletName: selectedWallet?.name || '',
      toWalletId: type === 'transfer' ? toWalletId : undefined,
      toWalletName: type === 'transfer' ? selectedToWallet?.name : undefined,
      date, // YYYY-MM-DD
      note,
    };

    try {
      if (initialData) {
        await updateTransaction(initialData.id, transactionData);
        addToast('Transaction updated', 'success');
      } else {
        await addTransaction(transactionData);
        
        // Handle Recurring
        if (isRecurring) {
          addRule({
              frequency,
              interval: 1,
              startDate: date,
              nextDue: calculateNextDue(date, frequency),
              active: true,
              template: transactionData
          });
          addToast(`Transaction added & set to repeat ${frequency}`, 'success');
        } else {
          addToast('Transaction saved', 'success');
        }
      }
      onClose();
    } catch (error: any) {
        console.error("Failed to save transaction:", error);
        addToast(error.message || 'Failed to save transaction', 'error');
    }
  };

  const hasNoWallets = wallets.length === 0;

  return (
    <>
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <DialogBody>
          {hasNoWallets ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">No Wallets Found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  You need to create a wallet before you can add any transactions.
                </p>
              </div>
              <Button onClick={() => { onClose(); navigate('/wallets'); }}>
                Create First Wallet
              </Button>
            </div>
          ) : (
            <>
              <Tabs value={type} onValueChange={(v) => setType(v as typeof type)}>
                <TabsList className="w-full">
                  <TabsTrigger value="expense" className="flex-1">Expense</TabsTrigger>
                  <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
                  <TabsTrigger value="transfer" className="flex-1">Transfer</TabsTrigger>
                </TabsList>
              </Tabs>

              {type === 'transfer' && wallets.length < 2 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    You need at least two wallets to make a transfer.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => { onClose(); navigate('/wallets'); }}>
                    Add Another Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {type !== 'transfer' && (
                    <div>
                      <Label>Category</Label>
                      {filteredCategories.length === 0 ? (
                         <div className="py-4 text-center border rounded-md border-dashed mt-2 bg-muted/20">
                           <p className="text-sm text-muted-foreground mb-2">No {type} categories found.</p>
                           <Button variant="outline" size="sm" onClick={() => { onClose(); navigate('/categories'); }}>
                             Create {type === 'expense' ? 'Expense' : 'Income'} Category
                           </Button>
                         </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {filteredCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setCategoryId(cat.id)}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors ${
                                categoryId === cat.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                              }`}
                            >
                              <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                              <span className="text-[10px] text-muted-foreground text-center leading-tight">{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <Label>Amount</Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">IDR</span>
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-11 tabular-nums"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{type === 'transfer' ? 'From Wallet' : 'Wallet'}</Label>
                    <div className="mt-1.5">
                      <select
                        className="w-full flex h-9 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                      >
                        {wallets.map((w) => (
                          <option key={w.id} value={w.id} className="bg-popover text-popover-foreground">
                            {w.name} (IDR {w.balance.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {type === 'transfer' && (
                    <div>
                      <Label>To Wallet</Label>
                       <div className="mt-1.5">
                        <select
                          className="w-full flex h-9 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                          value={toWalletId}
                          onChange={(e) => setToWalletId(e.target.value)}
                        >
                           {wallets
                            .filter((w) => w.id !== walletId)
                            .map((w) => (
                              <option key={w.id} value={w.id} className="bg-popover text-popover-foreground">
                                {w.name} (IDR {w.balance.toLocaleString()})
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Note</Label>
                      <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="mt-1.5" />
                    </div>
                  </div>

                  {/* Recurring Option (Only for new transactions) */}
                  {!initialData && (
                      <div className="flex items-center gap-4 py-2 border-t mt-2">
                          <div className="flex items-center space-x-2">
                              <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                              <Label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Repeat</Label>
                          </div>
                          
                          {isRecurring && (
                              <select
                                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                  value={frequency}
                                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                              >
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="yearly">Yearly</option>
                              </select>
                          )}
                      </div>
                  )}
                </div>
              )}
            </>
          )}
        </DialogBody>
        <DialogFooter className="items-center sm:justify-between flex-row">
            {initialData ? (
                <Button variant="destructive" size="icon" onClick={() => setShowDeleteConfirm(true)} className="mr-auto" aria-label="Delete Transaction">
                    <Trash2 className="w-4 h-4" />
                </Button>
            ) : <div />}
            {!hasNoWallets && (type !== 'transfer' || wallets.length >= 2) && (
              <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                  <Button onClick={handleSave}>{initialData ? 'Save Changes' : 'Save Transaction'}</Button>
              </div>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <ConfirmDeleteModal 
      open={showDeleteConfirm} 
      onClose={() => setShowDeleteConfirm(false)} 
      onConfirm={handleDelete} 
      title="Delete Transaction"
      description="Are you sure you want to delete this transaction? The wallet balance will be reverted."
    />
    </>
  );
}
