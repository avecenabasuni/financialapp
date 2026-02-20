import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ArrowDown } from 'lucide-react';
import { useWalletStore } from '@/store/useWalletStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useToast } from '@/context/toast-context';

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TransferModal({ open, onClose }: TransferModalProps) {
  const { wallets, updateWalletBalance } = useWalletStore();
  const { addTransaction } = useTransactionStore();
  const { addToast } = useToast();
  
  const [fromWallet, setFromWallet] = useState('');
  const [toWallet, setToWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Auto-select wallets
  useEffect(() => {
    if (open && wallets.length > 0) {
      if (!fromWallet) setFromWallet(wallets[0].id);
      if (!toWallet && wallets.length > 1) setToWallet(wallets[1].id);
    }
  }, [open, wallets, fromWallet, toWallet]);

  const handleTransfer = () => {
    const amountNum = Number(amount);
    
    if (!amount || amountNum <= 0) {
      addToast('Please enter a valid amount', 'warning');
      return;
    }
    
    if (fromWallet === toWallet) {
      addToast('Source and destination wallets must be different', 'warning');
      return;
    }

    const from = wallets.find((w) => w.id === fromWallet);
    const to = wallets.find((w) => w.id === toWallet);

    if (!from || !to) {
       addToast('Invalid wallet selection', 'warning');
       return;
    }
    
    if (from.balance < amountNum) {
      addToast('Insufficient funds in source wallet', 'warning');
      return;
    }

    addTransaction({
      amount: amountNum,
      type: 'transfer',
      categoryId: '',
      categoryName: 'Transfer',
      categoryIcon: 'ArrowRightLeft',
      categoryColor: '#8b5cf6',
      walletId: fromWallet,
      walletName: from?.name || '',
      toWalletId: toWallet,
      toWalletName: to?.name || '',
      date: new Date().toISOString().slice(0, 10),
      note,
    });

    updateWalletBalance(fromWallet, -amountNum);
    updateWalletBalance(toWallet, amountNum);

    setAmount('');
    setNote('');
    onClose();
    addToast('Transfer successful');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if(!o) onClose(); }}>
      <DialogContent className="max-w-sm" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Transfer</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Label>From</Label>
            <div className="mt-1.5">
              <select
                className="w-full flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                value={fromWallet}
                onChange={(e) => setFromWallet(e.target.value)}
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id} className="bg-popover text-popover-foreground">
                    {w.name} (IDR {w.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center"><ArrowDown className="w-5 h-5 text-muted-foreground" /></div>
          <div>
            <Label>To</Label>
             <div className="mt-1.5">
              <select
                className="w-full flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                value={toWallet}
                onChange={(e) => setToWallet(e.target.value)}
              >
                {wallets.filter((w) => w.id !== fromWallet).map((w) => (
                  <option key={w.id} value={w.id} className="bg-popover text-popover-foreground">
                    {w.name} (IDR {w.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Amount</Label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">IDR</span>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-11 tabular-nums" placeholder="0" />
            </div>
          </div>
          <div><Label>Note</Label><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="mt-1.5" /></div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleTransfer}>Transfer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
