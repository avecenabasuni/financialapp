import { Badge } from '@/components/ui/badge';
import CategoryIcon from '@/components/shared/category-icon';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/types';

interface TransactionRowProps {
  transaction: Transaction;
  onClick?: () => void;
}

export default function TransactionRow({ transaction, onClick }: TransactionRowProps) {
  const isIncome = transaction.type === 'income';

  return (
    <div 
      className={`flex items-center gap-3 py-2.5 ${onClick ? 'cursor-pointer hover:bg-muted/50 transition-colors rounded-lg px-2 -mx-2' : ''}`} 
      onClick={onClick}
    >
      <CategoryIcon icon={transaction.categoryIcon} color={transaction.categoryColor} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{transaction.categoryName}</div>
        <div className="text-xs text-muted-foreground truncate">{transaction.note}</div>
      </div>
      <Badge variant="secondary" className="text-xs font-normal">
        {transaction.walletName}
      </Badge>
      <span className={`text-sm font-medium tabular-nums whitespace-nowrap ${isIncome ? 'text-income' : 'text-expense'}`}>
        {isIncome ? '+' : '−'} {formatCurrency(transaction.amount)}
      </span>
    </div>
  );
}
