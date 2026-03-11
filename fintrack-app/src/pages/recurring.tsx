import { useEffect, useState } from "react";
import AnimatedPage from "@/components/shared/animated-page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Repeat,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  useRecurringStore,
  type RecurringRule,
  type Frequency,
} from "@/store/useRecurringStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useWalletStore } from "@/store/useWalletStore";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddRecurringModal from "@/components/modals/add-recurring-modal";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import EmptyState from "@/components/shared/empty-state";
import CategoryIcon from "@/components/shared/category-icon";

const frequencyLabels: Record<Frequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

const frequencyIcon: Record<Frequency, React.ReactNode> = {
  daily: <Clock className="w-3.5 h-3.5" />,
  weekly: <Calendar className="w-3.5 h-3.5" />,
  monthly: <Calendar className="w-3.5 h-3.5" />,
  yearly: <Calendar className="w-3.5 h-3.5" />,
};

const StatCard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: "emerald" | "blue" | "violet" | "amber";
}) => {
  const colorClasses = {
    emerald:
      "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    blue: "bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20",
    violet:
      "bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20",
    amber:
      "bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20",
  };

  const iconColorClasses = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    violet: "text-violet-500",
    amber: "text-amber-500",
  };

  return (
    <Card
      className={cn(
        "border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
        colorClasses[color]
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
          </div>
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center",
              iconColorClasses[color]
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RecurringCard = ({
  rule,
  onEdit,
  onToggle,
  onDelete,
  formatCurrency,
}: {
  rule: RecurringRule;
  onEdit: (rule: RecurringRule) => void;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
}) => {
  const { template } = rule;
  const isExpense = template.type === "expense";

  const getDaysUntilDue = () => {
    const now = new Date();
    const due = new Date(rule.nextDue);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0;
  const isDueToday = daysUntilDue === 0;

  return (
    <Card className="group relative bg-gradient-to-br from-card to-card/95 border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center text-primary shadow-inner">
                <CategoryIcon icon={template.categoryIcon} size="md" />
              </div>
              {rule.active ? (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-muted rounded-full border-2 border-card flex items-center justify-center">
                  <PauseCircle className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-base">
                  {template.categoryName}
                </h4>
                <Badge
                  variant={rule.active ? "default" : "secondary"}
                  className="text-[10px] px-2 py-0.5 h-5"
                >
                  {rule.active ? "Active" : "Paused"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                {frequencyIcon[rule.frequency]}
                <span className="capitalize">
                  {rule.interval > 1
                    ? `Every ${rule.interval} ${rule.frequency}`
                    : frequencyLabels[rule.frequency]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div
                className={cn(
                  "font-bold text-lg",
                  isExpense ? "text-rose-600" : "text-emerald-600"
                )}
              >
                {isExpense ? "-" : "+"}
                {formatCurrency(template.amount)}
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                {isOverdue ? (
                  <Badge
                    variant="destructive"
                    className="text-[10px] px-2 py-0.5 h-5 font-medium"
                  >
                    {Math.abs(daysUntilDue)}d overdue
                  </Badge>
                ) : isDueToday ? (
                  <Badge
                    variant="default"
                    className="text-[10px] px-2 py-0.5 h-5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none"
                  >
                    Due today
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 h-5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none"
                  >
                    {daysUntilDue}d left
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-secondary/50"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => onEdit(rule)}
                  className="cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggle(rule.id, !rule.active)}
                  className="cursor-pointer"
                >
                  {rule.active ? (
                    <>
                      <PauseCircle className="w-4 h-4 mr-2" /> Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" /> Resume
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => onDelete(rule.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Next: {format(new Date(rule.nextDue), "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {template.walletName}
            </span>
          </div>
          <span>
            Started: {format(new Date(rule.startDate), "MMM d, yyyy")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Recurring() {
  const { rules, fetchRules, updateRule, deleteRule, isLoading } =
    useRecurringStore();
  const { categories } = useCategoryStore();
  const { wallets } = useWalletStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState<RecurringRule | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleEdit = (rule: RecurringRule) => {
    setRuleToEdit(rule);
    setIsModalOpen(true);
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await updateRule(id, { active });
    } catch (error) {
      console.error("Failed to toggle rule:", error);
    }
  };

  const handleDelete = async () => {
    if (!ruleToDelete) return;
    try {
      await deleteRule(ruleToDelete);
      setRuleToDelete(null);
    } catch (error) {
      console.error("Failed to delete rule:", error);
    }
  };

  // Stats calculations
  const activeRules = rules.filter((r) => r.active);
  const pausedRules = rules.filter((r) => !r.active);

  const monthlyTotal = rules.reduce((acc, rule) => {
    if (!rule.active) return acc;
    let monthlyAmount = rule.template.amount;
    if (rule.frequency === "yearly") monthlyAmount /= 12;
    if (rule.frequency === "weekly") monthlyAmount *= 4;
    if (rule.frequency === "daily") monthlyAmount *= 30;
    return acc + monthlyAmount;
  }, 0);

  const overdueCount = rules.filter((r) => {
    const now = new Date();
    const due = new Date(r.nextDue);
    return r.active && due < now;
  }).length;

  if (isLoading && rules.length === 0) {
    return (
      <AnimatedPage className="space-y-6">
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary" />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Recurring Transactions
          </h1>
          <p className="text-muted-foreground text-sm">
            Automate your regular income and expenses
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white gap-2 font-semibold px-6 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add Recurring
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Repeat className="w-5 h-5" />}
          title="Active Rules"
          value={activeRules.length}
          color="emerald"
        />
        <StatCard
          icon={<PauseCircle className="w-5 h-5" />}
          title="Paused"
          value={pausedRules.length}
          color="amber"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Monthly Total"
          value={formatCurrency(monthlyTotal)}
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Overdue"
          value={overdueCount}
          color="violet"
        />
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Your Recurring Rules</h3>
            <p className="text-sm text-muted-foreground">
              Automated transactions that repeat on a schedule
            </p>
          </div>
        </div>

        {rules.length === 0 ? (
          <EmptyState
            icon={Repeat}
            title="No Recurring Rules"
            description="Set up recurring transactions to automate your regular income and expenses like salary, rent, or subscriptions."
            actionLabel="+ Add Recurring Rule"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <RecurringCard
                key={rule.id}
                rule={rule}
                onEdit={handleEdit}
                onToggle={handleToggle}
                onDelete={(id) => setRuleToDelete(id)}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddRecurringModal
        open={isModalOpen || !!ruleToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setRuleToEdit(null);
        }}
        rule={ruleToEdit}
        categories={categories}
        wallets={wallets}
      />
      <ConfirmDeleteModal
        open={!!ruleToDelete}
        onClose={() => setRuleToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Recurring Rule"
        description="Are you sure you want to delete this recurring rule? This will not delete any transactions that have already been created."
      />
    </AnimatedPage>
  );
}
