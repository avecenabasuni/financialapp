import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGoalStore, type Goal } from '@/store/useGoalStore';
import { useToast } from '@/context/toast-context';

const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  targetAmount: z.number().min(1, 'Target amount must be greater than 0'),
  deadline: z.string().optional(),
  color: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
  goal?: Goal | null;
}

export default function AddGoalModal({ open, onClose, goal }: AddGoalModalProps) {
  const { addGoal, updateGoal } = useGoalStore();
  const { addToast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      targetAmount: 0,
      deadline: '',
      color: 'bg-primary'
    }
  });

  useEffect(() => {
    if (goal && open) {
      setValue('name', goal.name);
      setValue('targetAmount', goal.targetAmount);
      setValue('deadline', goal.deadline ? goal.deadline.split('T')[0] : '');
      setValue('color', goal.color || 'bg-primary');
    } else if (open) {
      reset();
    }
  }, [goal, open, setValue, reset]);

  const onSubmit = async (data: GoalFormValues) => {
    try {
      if (goal) {
         await updateGoal(goal.id, { ...data, targetAmount: Number(data.targetAmount) });
         addToast('Goal updated successfully');
      } else {
         await addGoal({ ...data, targetAmount: Number(data.targetAmount) });
         addToast('Goal created successfully');
      }
      onClose();
    } catch (error) {
       addToast('Failed to save goal', 'error');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input id="name" placeholder="e.g. New Car, Vacation" {...register('name')} />
              {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount (IDR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">Rp</span>
                <Input 
                  id="targetAmount" 
                  type="number" 
                  className="pl-9" 
                  placeholder="0" 
                  {...register('targetAmount', { valueAsNumber: true })} 
                />
              </div>
              {errors.targetAmount && <p className="text-xs text-rose-500">{errors.targetAmount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input id="deadline" type="date" {...register('deadline')} />
            </div>

            {/* Simple Color Picker mapped to tailwind bg classes */}
            <div className="space-y-2">
               <Label>Theme Color</Label>
               <div className="flex gap-2">
                  {['bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-purple-500'].map(color => (
                     <button
                        type="button"
                        key={color}
                        className={`w-8 h-8 rounded-full ${color} focus:ring-2 focus:ring-offset-2 ring-primary transition-all hover:scale-110`}
                        onClick={() => setValue('color', color)}
                     />
                  ))}
               </div>
            </div>

          </DialogBody>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{goal ? 'Save Changes' : 'Create Goal'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
