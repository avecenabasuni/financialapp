import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Lightbulb,
  TrendingDown,
  PiggyBank,
  Target,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const tips = [
  {
    id: 1,
    title: "Reduce dining out spending",
    description: "You spent 28% more on Food & Drink compared to last month. Try meal prepping to save ~$85/month.",
    icon: TrendingDown,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/15",
    action: "View Spending",
    tag: "Tip",
    tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  },
  {
    id: 2,
    title: "Emergency fund on track",
    description: "At your current rate, you'll reach your $15,000 goal by May 2026 — 1 month ahead of schedule!",
    icon: Target,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    action: "View Goal",
    tag: "Milestone",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  {
    id: 3,
    title: "Consider a high-yield savings",
    description: "Moving $10,000 from checking to a high-yield savings account could earn ~$500/year in interest.",
    icon: PiggyBank,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/15",
    action: "Learn More",
    tag: "Insight",
    tagColor: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  },
];

export function FinancialTipsCard() {
  const [currentTip, setCurrentTip] = useState(0);
  const tip = tips[currentTip];

  const prev = () => setCurrentTip((c) => (c > 0 ? c - 1 : tips.length - 1));
  const next = () => setCurrentTip((c) => (c < tips.length - 1 ? c + 1 : 0));

  return (
    <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-1.5" style={{ fontWeight: 600 }}>
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
                    idx === currentTip ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
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
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tip.bg} ${tip.color} transition-all duration-300`}>
            <tip.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs" style={{ fontWeight: 600 }}>{tip.title}</p>
              <span className={`text-[9px] rounded-full px-1.5 py-0.5 shrink-0 ${tip.tagColor}`} style={{ fontWeight: 700 }}>
                {tip.tag}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
            <button className="flex items-center gap-1 mt-2.5 text-xs text-primary hover:text-primary/80 transition-colors group" style={{ fontWeight: 600 }}>
              {tip.action}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
