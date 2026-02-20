import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useGoalStore, type Goal } from '@/store/useGoalStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useToast } from '@/context/toast-context';

const contributeSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  walletId: z.string().min(1, 'Please select a source wallet'),
  date: z.string().min(1, 'Date is required')
});

type ContributeFormValues = z.infer<typeof contributeSchema>;

interface ContributeModalProps {
  open: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export default function ContributeModal({ open, onClose, goal }: ContributeModalProps) {
  const { contribute } = useGoalStore();
  const { wallets, fetchWallets } = useWalletStore();
  const { addToast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContributeFormValues>({
    resolver: zodResolver(contributeSchema),
    defaultValues: {
      amount: 0,
      walletId: '',
      date: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        amount: 0,
        walletId: wallets.length > 0 ? wallets[0].id : '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchWallets();
    }
  }, [open, wallets, fetchWallets, reset]);

  const onSubmit = async (data: ContributeFormValues) => {
    if (!goal) return;
    try {
      await contribute(goal.id, data.amount, data.walletId, data.date);
      addToast(`Successfully added funds to ${goal.name}`);
      onClose();
    } catch (error: any) {
      addToast(error.message || 'Failed to add funds', 'error');
    }
  };

  if (!goal) return null;

  const getRemainingAmount = () => {
      const remaining = goal.targetAmount - goal.currentAmount;
      return remaining > 0 ? remaining : 0;
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Add Funds: {goal.name}</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-4">
            
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm mb-4 border border-emerald-100">
                You need <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0}).format(getRemainingAmount())}</strong> to reach your target!
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Contribution Amount (IDR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">Rp</span>
                <Input 
                  id="amount" 
                  type="number" 
                  className="pl-9" 
                  placeholder="0" 
                  {...register('amount', { valueAsNumber: true })} 
                />
              </div>
              {errors.amount && <p className="text-xs text-rose-500">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="walletId">Source Wallet</Label>
              <Select id="walletId" {...register('walletId')}>
                <option value="" disabled>Select a wallet</option>
                {wallets.map(w => (
                     <option key={w.id} value={w.id}>
                        {w.name} ({new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(w.balance)})
                     </option>
                ))}
              </Select>
              {errors.walletId && <p className="text-xs text-rose-500">{errors.walletId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-xs text-rose-500">{errors.date.message}</p>}
            </div>

          </DialogBody>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">Confirm Deposit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
