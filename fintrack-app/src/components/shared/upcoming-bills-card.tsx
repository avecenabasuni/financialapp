import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Tv,
  Music,
  Zap,
  Dumbbell,
  Wifi,
  Car,
  Smartphone,
  Cloud,
  Droplets,
  CreditCard,
  Clock,
  AlertCircle,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionStore } from "@/store/useSubscriptionStore";

const iconMap: Record<string, React.ElementType> = {
  Home,
  Tv,
  Music,
  Zap,
  Dumbbell,
  Wifi,
  Car,
  Smartphone,
  Cloud,
  Droplets,
};

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: "upcoming" | "paid" | "overdue";
  autopay: boolean;
  color: string;
  icon: string;
  category: string;
}

export function UpcomingBillsCard() {
  const navigate = useNavigate();
  const { subscriptions } = useSubscriptionStore();

  // Transform subscriptions to bills format for display
  const upcomingBills: Bill[] = subscriptions
    .filter((s) => {
      const dueDate = new Date(s.nextBillingDate);
      const now = new Date();
      const daysUntil = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil <= 30 && daysUntil >= -7; // Due within 30 days or up to 7 days overdue
    })
    .sort(
      (a, b) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime()
    )
    .slice(0, 5)
    .map((s) => {
      const dueDate = new Date(s.nextBillingDate);
      const now = new Date();
      const daysUntil = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        id: s.id,
        name: s.name,
        amount: s.amount,
        dueDate: s.nextBillingDate,
        status: daysUntil < 0 ? "overdue" : "upcoming",
        autopay: true, // Assume subscriptions are auto-pay
        color: "#8b5cf6",
        icon: "Tv",
        category: "Subscription",
      };
    });

  const getDaysUntil = (dateStr: string) => {
    const due = new Date(dateStr);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const totalUpcoming = upcomingBills
    .filter((b) => b.status === "upcoming")
    .reduce((s, b) => s + b.amount, 0);

  return (
    <Card className="border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-1.5 font-semibold">
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              Upcoming Bills
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              ${totalUpcoming.toFixed(0)} due in next 30 days
            </CardDescription>
          </div>
          <button
            onClick={() => navigate("/subscriptions")}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors group font-semibold"
          >
            View all
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {upcomingBills.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CalendarCheck className="h-8 w-8 opacity-30 mb-2" />
              <p className="text-xs">No upcoming bills</p>
            </div>
          )}
          {upcomingBills.map((bill) => {
            const Icon = iconMap[bill.icon] || CreditCard;
            const daysUntil = getDaysUntil(bill.dueDate);
            const isOverdue = bill.status === "overdue";
            const isUrgent = daysUntil <= 5 && !isOverdue;

            return (
              <div
                key={bill.id}
                className={`flex items-center gap-3 rounded-xl px-2 py-2.5 transition-all duration-150 group cursor-pointer ${
                  isOverdue
                    ? "bg-red-50/60 dark:bg-red-500/5 hover:bg-red-50 dark:hover:bg-red-500/10"
                    : isUrgent
                    ? "bg-amber-50/60 dark:bg-amber-500/5 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                    : "hover:bg-accent/60"
                }`}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${bill.color}15`,
                    color: bill.color,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs truncate font-semibold">
                      {bill.name}
                    </p>
                    {bill.autopay && (
                      <span className="text-[9px] bg-primary/10 text-primary rounded-full px-1 py-0 shrink-0 font-bold">
                        Auto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {isOverdue ? (
                      <AlertCircle className="h-2.5 w-2.5 text-red-500 dark:text-red-400" />
                    ) : (
                      <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                    )}
                    <p
                      className={`text-[10px] ${
                        isOverdue
                          ? "text-red-500 dark:text-red-400 font-semibold"
                          : isUrgent
                          ? "text-amber-600 dark:text-amber-400 font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isOverdue
                        ? `${Math.abs(daysUntil)}d overdue`
                        : daysUntil === 0
                        ? "Due today!"
                        : `Due in ${daysUntil}d`}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold">${bill.amount.toFixed(2)}</p>
                  {(isOverdue || isUrgent) && (
                    <Badge
                      variant="secondary"
                      className={`mt-0.5 border-0 text-[9px] px-1 py-0 ${
                        isOverdue
                          ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                          : "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                      }`}
                    >
                      {isOverdue ? "Overdue" : "Soon"}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
