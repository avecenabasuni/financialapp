import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  PiggyBank,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useWalletStore } from "@/store/useWalletStore";

interface ScoreBreakdown {
  label: string;
  score: number;
  icon: React.ElementType;
  detail: string;
  color: string;
}

export function HealthScoreCard() {
  const [showDetail, setShowDetail] = useState(false);
  const { transactions } = useTransactionStore();
  const { budgets } = useBudgetStore();
  const { wallets } = useWalletStore();

  // Calculate metrics from real data
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Savings Rate Score (0-100)
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const savingsScore = Math.min(100, Math.max(0, Math.round(savingsRate * 2)));

  // Budget Adherence Score
  const budgetAdherence =
    budgets.length > 0
      ? Math.round(
          budgets.reduce((acc, b) => {
            const adherence =
              b.spent <= b.amount
                ? 100
                : Math.max(0, 100 - ((b.spent - b.amount) / b.amount) * 100);
            return acc + adherence;
          }, 0) / budgets.length
        )
      : 75;

  // Debt Ratio Score (simplified - based on expense vs income)
  const debtRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const debtScore = Math.max(0, Math.round(100 - debtRatio));

  // Investment/Wealth Score (based on total balance)
  const wealthScore = Math.min(100, Math.round((totalBalance / 10000) * 10));

  const scoreBreakdown: ScoreBreakdown[] = [
    {
      label: "Savings Rate",
      score: savingsScore,
      icon: PiggyBank,
      detail: `${savingsRate.toFixed(1)}% of income saved`,
      color: "#10b981",
    },
    {
      label: "Budget Adherence",
      score: budgetAdherence,
      icon: Shield,
      detail: `${budgets.filter((b) => b.spent <= b.amount).length}/${
        budgets.length
      } on track`,
      color: "#6366f1",
    },
    {
      label: "Debt Ratio",
      score: debtScore,
      icon: CreditCard,
      detail: `${debtRatio.toFixed(1)}% expense ratio`,
      color: "#f59e0b",
    },
    {
      label: "Wealth Score",
      score: wealthScore,
      icon: Wallet,
      detail: `$${totalBalance.toLocaleString()} total`,
      color: "#8b5cf6",
    },
  ];

  const overallScore = Math.round(
    scoreBreakdown.reduce((s, b) => s + b.score, 0) / scoreBreakdown.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;
  const scoreColor = getScoreColor(overallScore);

  return (
    <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5" />
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Financial Health
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Your overall score
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowDetail(!showDetail)}
          >
            <Info className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-center gap-5">
          {/* Circular score */}
          <div className="relative shrink-0 group">
            <svg
              width="90"
              height="90"
              viewBox="0 0 90 90"
              className="-rotate-90"
            >
              {/* Background track */}
              <circle
                cx="45"
                cy="45"
                r="38"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-muted/60"
              />
              {/* Score arc */}
              <circle
                cx="45"
                cy="45"
                r="38"
                fill="none"
                stroke={scoreColor}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-xl font-extrabold"
                style={{ color: scoreColor }}
              >
                {overallScore}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                /100
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-2">
            {scoreBreakdown.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 group/item"
              >
                <item.icon
                  className="h-3 w-3 shrink-0"
                  style={{ color: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-muted-foreground truncate">
                      {item.label}
                    </span>
                    <span
                      className="text-[10px] ml-1 shrink-0 font-bold"
                      style={{ color: getScoreColor(item.score) }}
                    >
                      {item.score}
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score status */}
        <div
          className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2 ${
            overallScore >= 80
              ? "bg-emerald-50 dark:bg-emerald-500/10"
              : "bg-amber-50 dark:bg-amber-500/10"
          }`}
        >
          {overallScore >= 80 ? (
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <p
            className={`text-xs ${
              overallScore >= 80
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            <span className="font-semibold">
              {getScoreLabel(overallScore)}!
            </span>{" "}
            {overallScore >= 80
              ? "Your finances are in great shape."
              : "Some areas need attention."}
          </p>
          <Badge
            variant="secondary"
            className={`ml-auto border-0 text-[10px] gap-0.5 shrink-0 ${
              overallScore >= 80
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
            }`}
          >
            <ArrowUpRight className="h-2.5 w-2.5" />
            +3 pts
          </Badge>
        </div>

        {/* Detail breakdown */}
        {showDetail && (
          <div className="mt-3 space-y-2 pt-3 border-t border-border/60">
            {scoreBreakdown.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.detail}</span>
                </div>
                <span
                  className="font-semibold"
                  style={{ color: getScoreColor(item.score) }}
                >
                  {item.score}/100
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
