import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useSubscriptionStore, type Subscription } from '@/store/useSubscriptionStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useToast } from '@/context/toast-context';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(1, 'Amount is required'),
  categoryId: z.string().min(1, 'Category is required'),
  frequency: z.enum(['monthly', 'yearly']),
  nextBillingDate: z.string().min(1, 'Billing Date is required'),
  status: z.enum(['active', 'paused', 'cancelled']),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface AddSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  subscription?: Subscription | null;
}

export default function AddSubscriptionModal({ open, onClose, subscription }: AddSubscriptionModalProps) {
  const { addSubscription, updateSubscription } = useSubscriptionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { addToast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: '',
      amount: 0,
      categoryId: '',
      frequency: 'monthly',
      nextBillingDate: new Date().toISOString().split('T')[0],
      status: 'active'
    }
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (subscription && open) {
      setValue('name', subscription.name);
      setValue('amount', subscription.amount);
      setValue('categoryId', subscription.categoryId || '');
      setValue('frequency', subscription.frequency as any);
      setValue('nextBillingDate', subscription.nextBillingDate.split('T')[0]);
      setValue('status', subscription.status as any);
    } else if (open) {
      reset({
         name: '',
         amount: 0,
         categoryId: categories.length > 0 ? categories[0].id : '',
         frequency: 'monthly',
         nextBillingDate: new Date().toISOString().split('T')[0],
         status: 'active'
      });
    }
  }, [subscription, open, setValue, reset, categories]);

  const onSubmit = async (data: SubscriptionFormValues) => {
    try {
      if (subscription) {
         await updateSubscription(subscription.id, { ...data, amount: Number(data.amount) });
         addToast('Subscription updated successfully');
      } else {
         await addSubscription({ ...data, amount: Number(data.amount) });
         addToast('Subscription created successfully');
      }
      onClose();
    } catch (error) {
       addToast('Failed to save subscription', 'error');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{subscription ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input id="name" placeholder="e.g. Netflix, Spotify, Gym" {...register('name')} />
              {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                    <Label htmlFor="amount">Cost (IDR)</Label>
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
                    <Label htmlFor="frequency">Billing Cycle</Label>
                    <Select id="frequency" {...register('frequency')}>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select id="categoryId" {...register('categoryId')}>
                <option value="" disabled>Select a category</option>
                {categories.map(c => (
                     <option key={c.id} value={c.id}>
                        {c.name}
                     </option>
                ))}
              </Select>
              {errors.categoryId && <p className="text-xs text-rose-500">{errors.categoryId.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nextBillingDate">Next Billing Date</Label>
                    <Input id="nextBillingDate" type="date" {...register('nextBillingDate')} />
                    {errors.nextBillingDate && <p className="text-xs text-rose-500">{errors.nextBillingDate.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select id="status" {...register('status')}>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                    </Select>
                </div>
            </div>

          </DialogBody>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{subscription ? 'Save Changes' : 'Add Subscription'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
