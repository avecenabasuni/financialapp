import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingDown,
  Target,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  DollarSign,
  Calendar,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useTransactionStore } from "@/store/useTransactionStore";

interface Tip {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  action: string;
  tag: string;
  tagColor: string;
}

export function FinancialTipsCard() {
  const [currentTip, setCurrentTip] = useState(0);
  const { transactions } = useTransactionStore();

  // Calculate some dynamic values for tips
  const monthlyExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Generate dynamic tips based on actual data
  const tips: Tip[] = [
    {
      id: 1,
      title: "Build your emergency fund",
      description: `Aim for 3-6 months of expenses. Based on your spending, target $${(
        monthlyExpenses * 3
      ).toLocaleString(undefined, { maximumFractionDigits: 0 })} - $${(
        monthlyExpenses * 6
      ).toLocaleString(undefined, { maximumFractionDigits: 0 })}.`,
      icon: Shield,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/15",
      action: "View Goals",
      tag: "Tip",
      tagColor:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    {
      id: 2,
      title: "Track your spending patterns",
      description:
        "Review your transactions weekly to identify areas where you can cut back and save more.",
      icon: TrendingDown,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/15",
      action: "View Analytics",
      tag: "Insight",
      tagColor:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    },
    {
      id: 3,
      title: "Set specific savings goals",
      description:
        "Break down large financial goals into smaller, manageable monthly targets.",
      icon: Target,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/15",
      action: "Create Goal",
      tag: "Milestone",
      tagColor:
        "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    },
    {
      id: 4,
      title: "Review recurring subscriptions",
      description:
        "Cancel unused subscriptions to save money. Small amounts add up over time!",
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/15",
      action: "View Subscriptions",
      tag: "Tip",
      tagColor:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    },
    {
      id: 5,
      title: "Celebrate your progress",
      description: `You're doing great! Keep tracking your finances to build healthy money habits.`,
      icon: DollarSign,
      color: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-500/15",
      action: "Keep Going",
      tag: "Encouragement",
      tagColor:
        "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
    },
  ];

  const tip = tips[currentTip];

  const prev = () => setCurrentTip((c) => (c > 0 ? c - 1 : tips.length - 1));
  const next = () => setCurrentTip((c) => (c < tips.length - 1 ? c + 1 : 0));

  return (
    <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-1.5 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Smart Insights
          </CardTitle>
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-center gap-1">
              {tips.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTip(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentTip
                      ? "w-5 bg-primary"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tip.bg} ${tip.color} transition-all duration-300`}
          >
            <tip.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold">{tip.title}</p>
              <span
                className={`text-[9px] rounded-full px-1.5 py-0.5 shrink-0 font-bold ${tip.tagColor}`}
              >
                {tip.tag}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tip.description}
            </p>
            <button className="flex items-center gap-1 mt-2.5 text-xs text-primary hover:text-primary/80 transition-colors group font-semibold">
              {tip.action}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
