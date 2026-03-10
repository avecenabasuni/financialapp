import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
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
import { bills } from "./mock-data";
import { useNavigate } from "react-router";

const iconMap: Record<string, React.ElementType> = {
  Home, Tv, Music, Zap, Dumbbell, Wifi, Car, Smartphone, Cloud, Droplets,
};

export function UpcomingBillsCard() {
  const navigate = useNavigate();
  const upcomingBills = bills
    .filter((b) => b.status === "upcoming" || b.status === "overdue")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getDaysUntil = (dateStr: string) => {
    const due = new Date(dateStr);
    const now = new Date("2026-02-20");
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
            <CardTitle className="text-sm flex items-center gap-1.5" style={{ fontWeight: 600 }}>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              Upcoming Bills
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              ${totalUpcoming.toFixed(0)} due in next 30 days
            </CardDescription>
          </div>
          <button
            onClick={() => navigate("/bills")}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors group"
            style={{ fontWeight: 600 }}
          >
            View all
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
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
                  style={{ backgroundColor: `${bill.color}15`, color: bill.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs truncate" style={{ fontWeight: 600 }}>{bill.name}</p>
                    {bill.autopay && (
                      <span className="text-[9px] bg-primary/10 text-primary rounded-full px-1 py-0 shrink-0" style={{ fontWeight: 700 }}>
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
                    <p className={`text-[10px] ${isOverdue ? "text-red-500 dark:text-red-400" : isUrgent ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`} style={{ fontWeight: isOverdue || isUrgent ? 600 : 400 }}>
                      {isOverdue
                        ? `${Math.abs(daysUntil)}d overdue`
                        : daysUntil === 0
                        ? "Due today!"
                        : `Due in ${daysUntil}d`}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs" style={{ fontWeight: 700 }}>
                    ${bill.amount.toFixed(2)}
                  </p>
                  {(isOverdue || isUrgent) && (
                    <Badge
                      variant="secondary"
                      className={`mt-0.5 border-0 text-[9px] px-1 py-0 ${isOverdue ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400" : "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"}`}
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
