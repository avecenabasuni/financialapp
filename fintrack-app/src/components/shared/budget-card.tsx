import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { Budget } from "@/types"
import { cn, formatCurrency } from "@/lib/utils"
import CategoryIcon from "@/components/shared/category-icon"
import { AlertTriangle, MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BudgetCardProps {
  budget: Budget
  onClick?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function BudgetCard({ budget, onClick, onEdit, onDelete }: BudgetCardProps) {
  const percentage = Math.round((budget.spent / budget.amount) * 100)
  const isOver = percentage > 100
  const remaining = budget.amount - budget.spent
  
  // Calculate days remaining in the month
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysLeft = daysInMonth - today.getDate()

  const indicatorColor = isOver
    ? 'bg-destructive'
    : percentage > 85
      ? 'bg-amber-500'
      : 'bg-emerald-500'

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group",
        isOver ? "border-destructive/50" : ""
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
        <div className="flex items-center gap-3">
          <CategoryIcon icon={budget.categoryIcon} color={budget.categoryColor} />
          <div>
            <CardTitle className="text-base font-semibold">{budget.categoryName}</CardTitle>
            <p className="text-xs text-muted-foreground">{budget.month}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
            {isOver && <AlertTriangle className="h-5 w-5 text-destructive mr-1" />}
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(budget.categoryId); }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={(e) => { e.stopPropagation(); onDelete?.(budget.id); }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-end justify-between mb-2">
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{formatCurrency(budget.spent)}</span>
                <span className="text-sm text-muted-foreground">/ {formatCurrency(budget.amount)}</span>
            </div>
            <span className={cn("text-sm font-medium", isOver ? "text-destructive" : "text-primary")}>
                {percentage}%
            </span>
        </div>

        <Progress value={Math.min(percentage, 100)} className="h-2 mb-4" indicatorClassName={indicatorColor} />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
                <span>{daysLeft} days left</span>
            </div>
            
            <div className="font-medium">
                {isOver ? (
                    <span className="text-destructive">Over by {formatCurrency(Math.abs(remaining))}</span>
                ) : (
                    <span className="text-emerald-500">{formatCurrency(remaining)} remaining</span>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
