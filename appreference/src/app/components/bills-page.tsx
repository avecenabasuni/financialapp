import { useState } from "react";
import {
  Plus,
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
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical,
  CreditCard,
  ToggleRight,
  RefreshCw,
  DollarSign,
  CalendarDays,
  Zap as ZapIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { bills } from "./mock-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  Home, Tv, Music, Zap, Dumbbell, Wifi, Car, Smartphone, Cloud, Droplets,
};

const statusConfig = {
  upcoming: {
    icon: Clock,
    label: "Upcoming",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/15",
    badge: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  paid: {
    icon: CheckCircle2,
    label: "Paid",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    badge: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  overdue: {
    icon: AlertCircle,
    label: "Overdue",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/15",
    badge: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
};

export function BillsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingBills = bills.filter((b) => b.status === "upcoming");
  const paidBills = bills.filter((b) => b.status === "paid");
  const overdueBills = bills.filter((b) => b.status === "overdue");

  const totalUpcoming = upcomingBills.reduce((s, b) => s + b.amount, 0);
  const totalPaid = paidBills.reduce((s, b) => s + b.amount, 0);
  const autopayCount = bills.filter((b) => b.autopay && b.status === "upcoming").length;

  const getDaysUntil = (dateStr: string) => {
    const due = new Date(dateStr);
    const now = new Date("2026-02-20");
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const renderBillsList = (billsList: typeof bills) => (
    <div className="space-y-2">
      {[...billsList]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .map((bill) => {
          const Icon = iconMap[bill.icon] || CreditCard;
          const config = statusConfig[bill.status];
          const StatusIcon = config.icon;
          const daysUntil = getDaysUntil(bill.dueDate);
          const isUrgent = bill.status === "upcoming" && daysUntil <= 5;

          return (
            <div
              key={bill.id}
              className={`flex items-center gap-4 rounded-xl border p-4 hover:shadow-md hover:shadow-black/5 transition-all duration-200 group cursor-pointer ${
                bill.status === "overdue"
                  ? "border-red-200 bg-red-50/30 dark:border-red-500/20 dark:bg-red-500/5"
                  : isUrgent
                  ? "border-amber-200 bg-amber-50/30 dark:border-amber-500/20 dark:bg-amber-500/5"
                  : "border-border/60 bg-card"
              }`}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${bill.color}15`, color: bill.color }}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm truncate" style={{ fontWeight: 600 }}>{bill.name}</p>
                  {bill.autopay && (
                    <Badge variant="secondary" className="border-0 text-[10px] px-1.5 py-0 bg-primary/10 text-primary shrink-0">
                      Auto
                    </Badge>
                  )}
                  {isUrgent && (
                    <Badge variant="secondary" className="border-0 text-[10px] px-1.5 py-0 bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 shrink-0">
                      Soon
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{bill.category}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground capitalize">{bill.frequency}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm" style={{ fontWeight: 700 }}>${bill.amount.toFixed(2)}</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <StatusIcon className={`h-3 w-3 ${config.color}`} />
                  <span className={`text-xs ${config.color}`} style={{ fontWeight: 500 }}>
                    {bill.status === "upcoming"
                      ? daysUntil <= 0
                        ? "Due today"
                        : `${daysUntil}d left`
                      : bill.status === "overdue"
                      ? `${Math.abs(daysUntil)}d overdue`
                      : "Paid"}
                  </span>
                </div>
              </div>

              {bill.status === "upcoming" && (
                <button
                  className="shrink-0 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => toast.success(`${bill.name} marked as paid!`)}
                  title="Mark as paid"
                >
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </button>
              )}

              <button
                className="shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-muted p-0.5"
                onClick={() => toast.info(`Managing ${bill.name}`)}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          );
        })}

      {billsList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
            <CheckCircle2 className="h-7 w-7 opacity-30" />
          </div>
          <p className="text-sm" style={{ fontWeight: 600 }}>All caught up!</p>
          <p className="text-xs mt-1 opacity-70">No bills in this category</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ fontWeight: 700 }}>Bills & Subscriptions</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Manage your recurring payments and subscriptions.</p>
        </div>
        <button
          onClick={() => toast.info("Bill creation coming soon!")}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 self-start"
          style={{ fontWeight: 600 }}
        >
          <Plus className="h-4 w-4" />
          Add Bill
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 to-transparent" />
          <CardContent className="relative p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Upcoming</p>
              <p className="text-lg" style={{ fontWeight: 700 }}>${totalUpcoming.toFixed(0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-transparent" />
          <CardContent className="relative p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-lg text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 700 }}>${totalPaid.toFixed(0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/8 to-transparent" />
          <CardContent className="relative p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400 shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-lg text-red-600 dark:text-red-400" style={{ fontWeight: 700 }}>
                {overdueBills.length} bill{overdueBills.length !== 1 ? "s" : ""}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent" />
          <CardContent className="relative p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <ToggleRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Auto-Pay</p>
              <p className="text-lg" style={{ fontWeight: 700 }}>{autopayCount} bills</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Schedule timeline */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm" style={{ fontWeight: 600 }}>Upcoming Schedule</CardTitle>
          </div>
          <CardDescription className="text-xs mt-0.5">Next 30 days bill timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scroll-smooth">
            {[...upcomingBills]
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((bill) => {
                const Icon = iconMap[bill.icon] || CreditCard;
                const dueDate = new Date(bill.dueDate);
                const daysUntil = getDaysUntil(bill.dueDate);
                const isUrgent = daysUntil <= 5;
                return (
                  <div
                    key={bill.id}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 min-w-[100px] hover:shadow-md hover:shadow-black/5 transition-all duration-200 cursor-pointer group ${
                      isUrgent
                        ? "border-amber-200 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-500/5"
                        : "border-border/60 hover:border-primary/30 hover:bg-primary/[0.02]"
                    }`}
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${bill.color}15`, color: bill.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-center truncate w-full" style={{ fontWeight: 600 }}>{bill.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <p className="text-xs" style={{ fontWeight: 700 }}>${bill.amount.toFixed(0)}</p>
                    {isUrgent && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400" style={{ fontWeight: 600 }}>
                        {daysUntil}d left
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Tab view */}
      <Tabs defaultValue="upcoming" onValueChange={(v) => setActiveTab(v)}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="bg-muted/60">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBills.length})
            </TabsTrigger>
            <TabsTrigger value="overdue" className={overdueBills.length > 0 ? "text-red-600 dark:text-red-400" : ""}>
              Overdue ({overdueBills.length})
            </TabsTrigger>
            <TabsTrigger value="paid">
              Paid ({paidBills.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({bills.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming" className="mt-4">
          {renderBillsList(upcomingBills)}
        </TabsContent>
        <TabsContent value="overdue" className="mt-4">
          {overdueBills.length > 0 && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 dark:border-red-500/20 dark:bg-red-500/5 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-xs text-red-700 dark:text-red-300">
                You have <span style={{ fontWeight: 700 }}>{overdueBills.length} overdue bill{overdueBills.length > 1 ? "s" : ""}</span> totaling <span style={{ fontWeight: 700 }}>${overdueBills.reduce((s, b) => s + b.amount, 0).toFixed(2)}</span>. Pay now to avoid late fees.
              </p>
            </div>
          )}
          {renderBillsList(overdueBills)}
        </TabsContent>
        <TabsContent value="paid" className="mt-4">
          {renderBillsList(paidBills)}
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          {renderBillsList(bills)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
