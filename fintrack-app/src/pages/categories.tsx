import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCategoryStore } from "@/store/useCategoryStore";
import CategoryIcon from "@/components/shared/category-icon";
import EmptyState from "@/components/shared/empty-state";
import AnimatedPage from "@/components/shared/animated-page";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  FolderKanban,
  Tag,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import AddCategoryModal from "@/components/modals/add-category-modal";
import EditCategoryModal from "@/components/modals/edit-category-modal";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import { useState } from "react";
import { type Category } from "@/types";
import { useToast } from "@/context/toast-context";
import { useTransactionStore } from "@/store/useTransactionStore";
import { cn } from "@/lib/utils";

const CategoryItem = ({
  cat,
  onEdit,
  onDelete,
}: {
  cat: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="group flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-accent/50 transition-all duration-200 cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-sm">
        <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
      </div>
      <span className="text-sm font-medium text-foreground flex-1">
        {cat.name}
      </span>
      {cat.subcategories && (
        <Badge variant="secondary" className="text-[10px] mr-2">
          {cat.subcategories.length} sub
        </Badge>
      )}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={() => onEdit(cat)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:scale-110 transition-all"
          onClick={() => onDelete(cat.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

const CategorySection = ({
  title,
  icon,
  color,
  items,
  expandedType,
  setExpandedType,
  onEdit,
  onDelete,
}: {
  title: string;
  icon: React.ReactNode;
  color: "emerald" | "blue" | "violet" | "amber";
  items: Category[];
  expandedType: string | null;
  setExpandedType: (id: string | null) => void;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}) => {
  const isExpanded = expandedType === title.toLowerCase();
  const colorClasses = {
    emerald:
      "from-emerald-500/10 to-green-500/5 text-emerald-500 border-emerald-500/20",
    blue: "from-blue-500/10 to-indigo-500/5 text-blue-500 border-blue-500/20",
    violet:
      "from-violet-500/10 to-purple-500/5 text-violet-500 border-violet-500/20",
    amber:
      "from-amber-500/10 to-orange-500/5 text-amber-500 border-amber-500/20",
  };

  const iconBgClasses = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    blue: "bg-blue-500/10 text-blue-500",
    violet: "bg-violet-500/10 text-violet-500",
    amber: "bg-amber-500/10 text-amber-500",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md border bg-gradient-to-br",
        colorClasses[color]
      )}
    >
      <CardHeader
        className="py-4 cursor-pointer hover:bg-accent/30 transition-colors"
        onClick={() => setExpandedType(isExpanded ? null : title.toLowerCase())}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center",
                iconBgClasses[color]
              )}
            >
              {icon}
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold capitalize">
                {title}
              </CardTitle>
              <Badge
                variant="secondary"
                className="text-[10px] font-medium bg-secondary/50"
              >
                {items.length}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 pb-3">
          <Separator className="mb-3 bg-border/50" />
          <div className="space-y-1">
            {items.length === 0 ? (
              <div className="text-xs text-muted-foreground py-6 text-center italic bg-secondary/20 rounded-xl">
                <FolderKanban className="w-6 h-6 mx-auto mb-2 opacity-30" />
                No categories in this group
              </div>
            ) : (
              items.map((cat) => (
                <CategoryItem
                  key={cat.id}
                  cat={cat}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default function Categories() {
  const { categories, deleteCategory, addCategory } = useCategoryStore();
  const [expandedType, setExpandedType] = useState<string | null>("income");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  if (categories.length === 0) {
    return (
      <>
        <EmptyState
          icon={FolderKanban}
          title="No Categories"
          description="Create categories to organize your transactions."
          actionLabel="+ Add Category"
          onAction={() => setShowAddCategory(true)}
        />
        <AddCategoryModal
          open={showAddCategory}
          onClose={() => setShowAddCategory(false)}
        />
      </>
    );
  }

  const expenses = categories.filter((c) => c.type === "expense");
  const income = categories.filter((c) => c.type === "income");

  const groupedExpenses = {
    needs: expenses.filter((c) => c.group === "needs"),
    wants:
      expenses.filter((c) => c.group === "wants" || !c.group) ||
      [] /* Default to wants if undefined */,
    savings: expenses.filter((c) => c.group === "savings"),
  };

  const sections = [
    {
      id: "income",
      label: "Income",
      items: income,
      count: income.length,
      icon: <TrendingUp className="w-4 h-4" />,
      color: "emerald" as const,
    },
    {
      id: "needs",
      label: "Needs",
      items: groupedExpenses.needs,
      count: groupedExpenses.needs.length,
      icon: <Wallet className="w-4 h-4" />,
      color: "blue" as const,
    },
    {
      id: "wants",
      label: "Wants",
      items: groupedExpenses.wants,
      count: groupedExpenses.wants.length,
      icon: <Tag className="w-4 h-4" />,
      color: "violet" as const,
    },
    {
      id: "savings",
      label: "Savings",
      items: groupedExpenses.savings,
      count: groupedExpenses.savings.length,
      icon: <TrendingDown className="w-4 h-4" />,
      color: "amber" as const,
    },
  ];

  const { addToast } = useToast();
  const { transactions, updateTransaction } = useTransactionStore();

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    const categoryBackup = categories.find((c) => c.id === categoryToDelete);
    if (!categoryBackup) return;

    const transactionsBackup = transactions.filter(
      (t) => t.categoryId === categoryToDelete
    );

    deleteCategory(categoryToDelete);
    setCategoryToDelete(null);

    addToast(`Category "${categoryBackup.name}" deleted`, "success", {
      label: "Undo",
      onClick: () => {
        addCategory(categoryBackup);
        transactionsBackup.forEach((t) => {
          updateTransaction(t.id, {
            categoryId: categoryBackup.id,
            categoryName: categoryBackup.name,
            categoryIcon: categoryBackup.icon,
            categoryColor: categoryBackup.color,
          });
        });
      },
    });
  };

  return (
    <AnimatedPage className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Categories
          </h1>
          <p className="text-muted-foreground text-sm">
            Organize your transactions with custom categories
          </p>
        </div>
        <Button
          onClick={() => setShowAddCategory(true)}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white gap-2 font-semibold px-6 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sections.map((section) => (
          <Card
            key={section.id}
            className="bg-gradient-to-br from-secondary/50 to-secondary/30 border-border/50 hover:shadow-md transition-all duration-200"
          >
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    section.color === "emerald" &&
                      "bg-emerald-500/10 text-emerald-500",
                    section.color === "blue" && "bg-blue-500/10 text-blue-500",
                    section.color === "violet" &&
                      "bg-violet-500/10 text-violet-500",
                    section.color === "amber" &&
                      "bg-amber-500/10 text-amber-500"
                  )}
                >
                  {section.icon}
                </div>
              </div>
              <p className="text-2xl font-bold">{section.count}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                {section.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <CategorySection
            key={section.id}
            title={section.label}
            icon={section.icon}
            color={section.color}
            items={section.items}
            expandedType={expandedType}
            setExpandedType={setExpandedType}
            onEdit={setEditingCategory}
            onDelete={setCategoryToDelete}
          />
        ))}
      </div>

      <AddCategoryModal
        open={showAddCategory}
        onClose={() => setShowAddCategory(false)}
      />
      <EditCategoryModal
        open={!!editingCategory}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      />
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
