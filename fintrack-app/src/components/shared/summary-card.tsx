import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  trend?: number;
  icon: LucideIcon;
  iconColor?: string; // e.g., "text-emerald-600"
  iconBg?: string;    // e.g., "bg-emerald-100"
  inverseTrend?: boolean; // If true, positive trend is red (bad), negative is green (good)
}

export default function SummaryCard({ title, amount, trend, icon: Icon, iconColor, iconBg, inverseTrend }: SummaryCardProps) {
  const isPositiveChange = trend && trend > 0;
  // If inverseTrend is true (e.g. Expenses), then a positive change (increase) is BAD (not good).
  // If inverseTrend is false (Income), positive change is GOOD.
  const isGood = inverseTrend ? !isPositiveChange : isPositiveChange;
  
  return (
    <Card className="shadow-sm border-none shadow-black/5">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-2.5 rounded-xl", iconBg || "bg-muted", iconColor || "text-foreground")}>
            <Icon className="w-5 h-5" />
          </div>
          {trend !== undefined && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              isGood 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}>
              {isPositiveChange ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(amount)}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
