import { Progress } from '@/components/ui/progress';
import CategoryIcon from '@/components/shared/category-icon';
import { formatCurrency } from '@/lib/utils';
import type { Budget } from '@/types';

interface BudgetProgressProps {
  budget: Budget;
  onClick?: () => void;
}

export default function BudgetProgress({ budget, onClick }: BudgetProgressProps) {
  const percentage = Math.round((budget.spent / budget.amount) * 100);
  const remaining = budget.amount - budget.spent;
  const isOver = percentage > 100;

  const indicatorColor = isOver
    ? 'bg-expense'
    : percentage > 75
      ? 'bg-warning'
      : 'bg-primary';

  return (
    <div 
        className={`flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
      <CategoryIcon icon={budget.categoryIcon} color={budget.categoryColor} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-foreground">{budget.categoryName}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
          </span>
        </div>
        <Progress value={Math.min(percentage, 100)} indicatorClassName={indicatorColor} />
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{percentage}% used</span>
          <span className={`text-xs ${isOver ? 'text-expense' : 'text-muted-foreground'}`}>
            {isOver ? `${percentage}% over budget` : `${formatCurrency(remaining)} remaining`}
          </span>
        </div>
      </div>
    </div>
  );
}
