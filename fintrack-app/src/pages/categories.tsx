import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCategoryStore } from '@/store/useCategoryStore';
import CategoryIcon from '@/components/shared/category-icon';
import EmptyState from '@/components/shared/empty-state';
import AnimatedPage from '@/components/shared/animated-page';
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, FolderKanban } from 'lucide-react';
import AddCategoryModal from '@/components/modals/add-category-modal';
import EditCategoryModal from '@/components/modals/edit-category-modal';
import ConfirmDeleteModal from '@/components/modals/confirm-delete-modal';
import { useState } from 'react';
import { type Category } from '@/types';
import { useToast } from '@/context/toast-context';
import { useTransactionStore } from '@/store/useTransactionStore';

export default function Categories() {
  const { categories, deleteCategory } = useCategoryStore();
  const [expandedType, setExpandedType] = useState<string | null>('expense');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  if (categories.length === 0) {
    return (
      <>
        <EmptyState icon={FolderKanban} title="No Categories" description="Create categories to organize your transactions." actionLabel="+ Add Category" onAction={() => setShowAddCategory(true)} />
        <AddCategoryModal open={showAddCategory} onClose={() => setShowAddCategory(false)} />
      </>
    );
  }

  const expenses = categories.filter((c) => c.type === 'expense');
  const income = categories.filter((c) => c.type === 'income');

  const groupedExpenses = {
    needs: expenses.filter(c => c.group === 'needs'),
    wants: expenses.filter(c => c.group === 'wants' || !c.group), // Default to wants if undefined
    savings: expenses.filter(c => c.group === 'savings'),
  };

  const sections = [
    { id: 'income', label: 'Income', items: income, count: income.length },
    { id: 'needs', label: 'Needs', items: groupedExpenses.needs, count: groupedExpenses.needs.length },
    { id: 'wants', label: 'Wants', items: groupedExpenses.wants, count: groupedExpenses.wants.length },
    { id: 'savings', label: 'Savings', items: groupedExpenses.savings, count: groupedExpenses.savings.length },
  ];

  /* ... Undo Logic ... */
  const { addToast } = useToast();
  // We need to access transactions to restore them if undone
  const { transactions, updateTransaction } = useTransactionStore();
  const { addCategory } = useCategoryStore();

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    // 1. Find the category object to back up
    const categoryBackup = categories.find(c => c.id === categoryToDelete);
    if (!categoryBackup) return;

    // 2. Find affecting transactions to back up
    const transactionsBackup = transactions.filter(t => t.categoryId === categoryToDelete);

    // 3. Perform Delete (this will auto-uncategorize transactions in the store)
    deleteCategory(categoryToDelete);
    setCategoryToDelete(null);

    // 4. Show Undo Toast
    addToast(`Category "${categoryBackup.name}" deleted`, 'success', {
      label: 'Undo',
      onClick: () => {
        // A. Restore Category
        addCategory(categoryBackup);

        // B. Restore Transactions
        // We use the store's update action to re-link them.
        transactionsBackup.forEach(t => {
          updateTransaction(t.id, {
            categoryId: categoryBackup.id,
            categoryName: categoryBackup.name,
            categoryIcon: categoryBackup.icon,
            categoryColor: categoryBackup.color
          });
        });
      }
    });
  };

  return (
    <AnimatedPage className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <Button size="sm" className="gap-1.5" onClick={() => setShowAddCategory(true)}><Plus className="w-4 h-4" /> Add Category</Button>
      </div>

      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader className="py-3 cursor-pointer" onClick={() => setExpandedType(expandedType === section.id ? null : section.id)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {expandedType === section.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <CardTitle className="text-sm capitalize">{section.label}</CardTitle>
                <Badge variant="secondary" className="text-xs">{section.count}</Badge>
              </div>
            </div>
          </CardHeader>
          {expandedType === section.id && (
            <CardContent className="pt-0">
              <Separator className="mb-3" />
              <div className="space-y-1">
                {section.items.length === 0 ? (
                    <div className="text-xs text-muted-foreground py-2 text-center italic">No categories in this group.</div>
                ) : (
                    section.items.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-accent transition-colors group">
                        <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                        <span className="text-sm text-foreground flex-1">{cat.name}</span>
                        {cat.subcategories && <span className="text-xs text-muted-foreground">{cat.subcategories.length} sub</span>}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingCategory(cat)}><Pencil className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-expense hover:text-expense" onClick={() => setCategoryToDelete(cat.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                    </div>
                    ))
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
      <AddCategoryModal open={showAddCategory} onClose={() => setShowAddCategory(false)} />
      <EditCategoryModal open={!!editingCategory} category={editingCategory} onClose={() => setEditingCategory(null)} />
      <ConfirmDeleteModal 
        open={!!categoryToDelete} 
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description="Are you sure? Transactions linked to this category will not be deleted but will lose their category."
      />
    </AnimatedPage>
  );
}
