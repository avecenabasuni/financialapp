import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/context/toast-context';
import CategoryIcon from '@/components/shared/category-icon';
import { useWalletStore } from '@/store/useWalletStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { type Wallet } from '@/types';

interface AddWalletModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Wallet | null;
}

const WALLET_TYPES = [
  { value: 'bank', label: 'Bank Account', icon: 'Landmark', color: '#3b82f6' },
  { value: 'cash', label: 'Cash', icon: 'Banknote', color: '#13ecda' },
  { value: 'ewallet', label: 'E-Wallet', icon: 'Smartphone', color: '#22c55e' },
  { value: 'credit', label: 'Credit Card', icon: 'CreditCard', color: '#a855f7' },
  { value: 'savings', label: 'Savings', icon: 'PiggyBank', color: '#f59e0b' },
] as const;

export default function AddWalletModal({ open, onClose, initialData }: AddWalletModalProps) {
  const { addWallet, updateWallet } = useWalletStore();
  const { addTransaction } = useTransactionStore();
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('bank');
  const [balance, setBalance] = useState('');

  const selectedType = WALLET_TYPES.find((t) => t.value === type) || WALLET_TYPES[0];

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setType(initialData.type);
        setBalance(initialData.balance.toString());
      } else {
        setName('');
        setType('bank');
        setBalance('');
      }
    }
  }, [open, initialData]);



  const executeSave = async () => {
     if (!name.trim()) return;

    const walletData = {
      name: name.trim(),
      type: type as 'bank' | 'cash' | 'ewallet' | 'credit' | 'savings' | 'other',
      balance: Math.floor(Number(balance)) || 0,
      color: selectedType.color,
      icon: selectedType.icon,
    };

    if (initialData) {
      await updateWallet(initialData.id, walletData);
      addToast('Wallet updated successfully');
      onClose();
    } else {
      try {
          const initialBalance = Math.floor(Number(balance)) || 0;
          
          // Create wallet with 0 balance first (or whatever balance, but we handle "initial transaction" separate)
          // To be clean, if we want an Initial Balance transaction, the wallet should effectively start at 0 before that transaction.
          // BUT, if we set balance in walletData, the backend might set it directly.
          // Let's set balance to 0 in creation, and add transaction.
          
          const newWallet = await addWallet({ ...walletData, balance: 0 });
          
          if (initialBalance !== 0) {
             await addTransaction({
                 amount: Math.abs(initialBalance),
                 type: initialBalance > 0 ? 'income' : 'expense',
                 walletId: newWallet.id,
                 date: new Date().toISOString(),
                 categoryId: '', // System/Initial
                 categoryName: 'System',
                 categoryIcon: 'Landmark',
                 categoryColor: '#64748b',
                 note: 'Initial Balance',
                 walletName: walletData.name
             });
          }
          
          addToast('Wallet added successfully');
          onClose();
      } catch (e) {
          console.error("Failed to add wallet", e);
          addToast('Failed to add wallet', 'error');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Wallet' : 'Add Wallet'}</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div><Label>Wallet Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bank Mandiri" className="mt-1.5" /></div>

          <div>
            <Label>Type</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {WALLET_TYPES.map((wt) => (
                <button key={wt.value} onClick={() => setType(wt.value)} className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors ${type === wt.value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}>
                  <CategoryIcon icon={wt.icon} color={wt.color} size="sm" />
                  <span className="text-[11px] text-muted-foreground leading-tight">{wt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Initial Balance</Label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">IDR</span>
              <Input type="number" step="1" min="0" value={balance} onChange={(e) => setBalance(e.target.value)} className="pl-11 tabular-nums" placeholder="0" />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={executeSave}>{initialData ? 'Save Changes' : 'Add Wallet'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
