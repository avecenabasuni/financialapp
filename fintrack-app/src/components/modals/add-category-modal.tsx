import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useToast } from '@/context/toast-context';
import CategoryIcon from '@/components/shared/category-icon';

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'];
const ICONS = ['Wallet', 'ShoppingBag', 'Utensils', 'Car', 'Home', 'Zap', 'Gamepad2', 'Plane', 'Shirt', 'Gift', 'GraduationCap', 'HeartPulse', 'Briefcase', 'PiggyBank', 'TrendingUp', 'Scissors'];

export default function AddCategoryModal({ open, onClose }: AddCategoryModalProps) {
  const { addCategory } = useCategoryStore();
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [group, setGroup] = useState<'needs' | 'wants' | 'savings'>('wants');
  const [icon, setIcon] = useState('ShoppingBag');
  const [color, setColor] = useState(COLORS[0]);

  const handleSave = () => {
    if (!name.trim()) return;

    addCategory({
        name: name.trim(),
        type,
        group: type === 'expense' ? group : undefined,
        icon,
        color,
      });

    setName('');
    setType('expense');
    setGroup('wants');
    setIcon('ShoppingBag');
    setColor(COLORS[0]);
    onClose();
    addToast('Category added successfully');
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Tabs value={type} onValueChange={(v) => setType(v as 'expense' | 'income')} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="expense" className="flex-1">Expense</TabsTrigger>
              <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
            </TabsList>
          </Tabs>

          {type === 'expense' && (
            <div>
              <Label>Group</Label>
              <Tabs value={group} onValueChange={(v) => setGroup(v as 'needs' | 'wants' | 'savings')} className="w-full mt-1.5">
                <TabsList className="w-full h-8">
                  <TabsTrigger value="needs" className="flex-1 text-xs h-7">Needs</TabsTrigger>
                  <TabsTrigger value="wants" className="flex-1 text-xs h-7">Wants</TabsTrigger>
                  <TabsTrigger value="savings" className="flex-1 text-xs h-7">Savings</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Groceries" className="mt-1.5" />
          </div>

          <div>
            <Label>Icon</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`flex items-center justify-center p-2 rounded-md transition-all ${icon === ic ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
                >
                  <CategoryIcon icon={ic} size="sm" className={icon === ic ? 'text-primary-foreground' : ''} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Color</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-primary' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
