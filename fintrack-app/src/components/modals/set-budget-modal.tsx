import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useCategoryStore } from '@/store/useCategoryStore';
// import { categories } from '@/data/mock-data'; // Removed mock data
import CategoryIcon from '@/components/shared/category-icon';
import { formatCurrency } from '@/lib/utils';
import ConfirmDeleteModal from './confirm-delete-modal';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/toast-context';

interface SetBudgetModalProps {
  open: boolean;
  onClose: () => void;
  defaultCategoryId?: string;
  month?: string;
}

export default function SetBudgetModal({ open, onClose, defaultCategoryId, month }: SetBudgetModalProps) {
  const { budgets, addBudget, updateBudget, deleteBudget, currentMonth } = useBudgetStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { addToast } = useToast();
  
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  // Fetch categories on mount if not already available
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // State
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');
  const [enableAlert, setEnableAlert] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived
  const selectedCat = categories.find((c) => c.id === categoryId);
  const existingBudget = budgets.find((b) => b.categoryId === categoryId);

  // Effect: Reset on Open
  useEffect(() => {
    if (open) {
      if (defaultCategoryId) {
        setCategoryId(defaultCategoryId);
      } else {
        setCategoryId(''); // Reset selection when opening generic modal
      }
      setLimit('');
      setIsSubmitting(false);
    }
  }, [open, defaultCategoryId]);

  // Effect: Load Existing Budget Data
  useEffect(() => {
    if (existingBudget) {
      setLimit(String(existingBudget.amount));
    }
  }, [existingBudget]);

  const handleSave = async () => {
    if (!limit || Number(limit) <= 0 || !selectedCat) {
        addToast('Please select a category and enter a valid amount.', 'error');
        return;
    }
    
    // Note: We are setting budget for the CURRENT month by default in this modal
    // If the user wants to set budget for other months, we might need a month selectors.
    // However, usually "Set Budget" implies "for this month" or "recurring".
    // For now, consistent with logic, we use the STORE's current viewed month if we want it to reflect instantly,
    // OR we use the actual current month. 
    // The requirement is usually "Set budget for THIS month".
    // Let's stick to "Current Viewed Month" if it makes sense? 
    // No, "Set Budget" usually means "Plan for now". 
    // Actually, if I am viewing "January" (past) and I click "Set Budget", I probably want to edit January's budget.
    // So let's use the `currentMonth` from the store if possible, or default to now.
    
    // If month prop is passed, use it. Otherwise try store's currentMonth, or default to now.
    const budgetMonth = month || currentMonth || new Date().toISOString().slice(0, 7);

    setIsSubmitting(true);
    try {
        if (existingBudget) {
            await updateBudget(existingBudget.id, { amount: Math.floor(Number(limit)) });
            addToast('Budget updated successfully', 'success');
        } else {
            await addBudget({
                categoryId: selectedCat.id,
                categoryName: selectedCat.name,
                categoryIcon: selectedCat.icon,
                categoryColor: selectedCat.color,
                amount: Math.floor(Number(limit)),
                spent: 0,
                month: budgetMonth,
            });
            addToast('Budget set successfully', 'success');
        }
        onClose();
    } catch (error) {
        addToast('Failed to save budget. Please try again.', 'error');
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
     if (!existingBudget) return;
     setIsSubmitting(true);
     try {
         await deleteBudget(existingBudget.id);
         addToast('Budget deleted', 'success');
         setShowDeleteConfirm(false);
         onClose();
     } catch (error) {
         addToast('Failed to delete budget', 'error');
     } finally {
         setIsSubmitting(false);
     }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={(o) => { if(!o && !isSubmitting) onClose(); }}>
      <DialogContent className="max-w-[400px] p-6 gap-6">
        <DialogHeader>
          <DialogTitle>{existingBudget ? 'Edit Budget' : 'Set Budget'}</DialogTitle>
          <DialogDescription>
            Set a monthly spending limit for {selectedCat ? selectedCat.name : 'a category'}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            {defaultCategoryId && selectedCat ? (
                // Read-only view for pre-selected category
                <div className="flex items-center gap-3 p-3 rounded-xl border bg-card/50 shadow-sm">
                    <CategoryIcon icon={selectedCat.icon} color={selectedCat.color} />
                    <span className="font-medium text-sm">{selectedCat.name}</span>
                </div>
            ) : (
                // Dropdown for new budget
                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={isSubmitting}>
                        <Button variant="outline" className="w-full justify-between px-3 h-11 bg-transparent hover:bg-muted/50">
                            {selectedCat ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedCat.color }} />
                                    <span>{selectedCat.name}</span>
                                </div>
                            ) : (
                                <span className="text-muted-foreground">Select a category</span>
                            )}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[350px] max-h-[300px] overflow-y-auto" align="start">
                        {expenseCategories.map((c) => (
                            <DropdownMenuItem key={c.id} onClick={() => setCategoryId(c.id)} className="gap-2 py-2.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                                <span>{c.name}</span>
                                {budgets.find((b) => b.categoryId === c.id) && (
                                    <span className="ml-auto text-xs text-muted-foreground mr-2">(Has Budget)</span>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label>Monthly Limit</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">
                Rp
              </span>
              <Input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="pl-10 h-11 text-lg font-semibold tabular-nums bg-transparent"
                placeholder="0"
                autoFocus={!defaultCategoryId} // Focus if not pre-selected
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Current Progress (if editing) */}
          {existingBudget && (
            <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50">
               <div className="flex justify-between items-end mb-2">
                   <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Spending</span>
                   <span className="text-sm font-semibold tabular-nums">
                       {formatCurrency(existingBudget.spent)}
                   </span>
               </div>
               <Progress value={(existingBudget.spent / existingBudget.amount) * 100} className="h-2" />
               <div className="flex justify-between text-xs mt-1">
                   <span className={cn("font-medium", (existingBudget.spent > existingBudget.amount) ? "text-destructive" : "text-muted-foreground")}>
                       {Math.round((existingBudget.spent / existingBudget.amount) * 100)}% used
                   </span>
                   <span className="text-muted-foreground">Limit: {formatCurrency(existingBudget.amount)}</span>
               </div>
            </div>
          )}

          {/* Alert Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50 shadow-sm">
            <div className="space-y-0.5">
                <Label className="text-base font-medium">Budget Alert</Label>
                <p className="text-xs text-muted-foreground">Notify when 80% used</p>
            </div>
            <Switch checked={enableAlert} onCheckedChange={setEnableAlert} disabled={isSubmitting} />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
           {existingBudget && (
             <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="w-full sm:w-auto" disabled={isSubmitting}>
                 Delete
             </Button>
           )}
           <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
             <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none h-10" disabled={isSubmitting}>Cancel</Button>
             <Button onClick={handleSave} className="flex-1 sm:flex-none h-10" disabled={!limit || !selectedCat || isSubmitting}>
                 {isSubmitting ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                     </>
                 ) : (
                     existingBudget ? 'Save Changes' : 'Set Budget'
                 )}
             </Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ConfirmDeleteModal 
      open={showDeleteConfirm} 
      onClose={() => setShowDeleteConfirm(false)} 
      onConfirm={handleDelete} 
      title="Delete Budget"
      description={`Are you sure you want to delete the budget for ${selectedCat?.name}? This action cannot be undone.`}
    />
    </>
  );
}
