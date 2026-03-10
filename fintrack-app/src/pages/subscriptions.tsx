import { useEffect, useState } from "react";
import AnimatedPage from "@/components/shared/animated-page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  Clock,
  CreditCard,
  AlertCircle,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import {
  useSubscriptionStore,
  type Subscription,
} from "@/store/useSubscriptionStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CategoryIcon from "@/components/shared/category-icon";
import AddSubscriptionModal from "@/components/modals/add-subscription-modal";
import { cn } from "@/lib/utils";

const StatCard = ({
  icon,
  title,
  value,
  trend,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: string;
  color: "emerald" | "blue" | "rose" | "violet";
}) => {
  const colorClasses = {
    emerald:
      "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    blue: "bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20",
    rose: "bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20",
    violet:
      "bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20",
  };

  const iconColorClasses = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    rose: "text-rose-500",
    violet: "text-violet-500",
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
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
            </div>
            {trend && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
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

const SubscriptionCard = ({
  sub,
  cat,
  daysLeft,
  onEdit,
  onDelete,
  formatCurrency,
}: {
  sub: Subscription;
  cat: any;
  daysLeft: number;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
}) => {
  const getStatusConfig = () => {
    if (sub.status !== "active") {
      return {
        text: String(sub.status),
        variant: "secondary" as const,
        icon: null,
      };
    }
    if (daysLeft < 0) {
      return {
        text: `${Math.abs(daysLeft)}d overdue`,
        variant: "destructive" as const,
        icon: <AlertCircle className="w-3.5 h-3.5" />,
      };
    }
    if (daysLeft === 0) {
      return {
        text: "Due today",
        variant: "default" as const,
        icon: <AlertCircle className="w-3.5 h-3.5" />,
      };
    }
    if (daysLeft <= 3) {
      return {
        text: `${daysLeft}d left`,
        variant: "default" as const,
        icon: <Clock className="w-3.5 h-3.5" />,
      };
    }
    return {
      text: `${daysLeft}d left`,
      variant: "secondary" as const,
      icon: <Clock className="w-3.5 h-3.5" />,
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="group relative bg-gradient-to-br from-card to-card/95 border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center text-primary shadow-inner">
                {cat?.icon ? (
                  <CategoryIcon icon={cat.icon} size="md" />
                ) : (
                  <span className="font-bold text-lg">
                    {sub.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {sub.status === "active" && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-base">{sub.name}</h4>
                {sub.status === "active" && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 h-5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-medium"
                  >
                    Auto
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                <span className="capitalize">
                  {cat?.name || "Uncategorized"}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span className="capitalize">{sub.frequency}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-bold text-lg text-foreground">
                {formatCurrency(sub.amount)}
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                {statusConfig.icon}
                <Badge
                  variant={statusConfig.variant}
                  className={cn(
                    "text-[10px] px-2 py-0.5 h-5 font-medium",
                    statusConfig.variant === "destructive" &&
                      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-none",
                    statusConfig.variant === "default" &&
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none",
                    statusConfig.variant === "secondary" &&
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none"
                  )}
                >
                  {statusConfig.text}
                </Badge>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-secondary/50"
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => onEdit(sub)}
                  className="cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => onDelete(sub.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Subscriptions() {
  const { subscriptions, fetchSubscriptions, isLoading, deleteSubscription } =
    useSubscriptionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subToEdit, setSubToEdit] = useState<Subscription | null>(null);

  useEffect(() => {
    fetchSubscriptions();
    fetchCategories();
  }, [fetchSubscriptions, fetchCategories]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calculateDaysLeft = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCategory = (id?: string) =>
    id ? categories.find((c) => c.id === id) : undefined;

  const activeSubs = subscriptions.filter((s) => s.status === "active");

  const overdueSubs = activeSubs.filter(
    (sub) => calculateDaysLeft(sub.nextBillingDate) < 0
  );

  const upcomingSubs = activeSubs
    .filter((sub) => {
      const days = calculateDaysLeft(sub.nextBillingDate);
      return days >= 0 && days <= 30;
    })
    .sort(
      (a, b) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime()
    );

  const upcomingTotal = upcomingSubs.reduce((acc, sub) => acc + sub.amount, 0);

  const totalMonthly = activeSubs.reduce((acc, sub) => {
    if (sub.frequency === "monthly") return acc + sub.amount;
    if (sub.frequency === "yearly") return acc + sub.amount / 12;
    return acc;
  }, 0);

  const SubList = ({ subs }: { subs: Subscription[] }) => {
    if (subs.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl bg-secondary/20">
          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No subscriptions found</p>
          <p className="text-xs mt-1">
            Add your first subscription to get started
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {subs.map((sub) => {
          const cat = getCategory(sub.categoryId);
          const daysLeft = calculateDaysLeft(sub.nextBillingDate);

          return (
            <SubscriptionCard
              key={sub.id}
              sub={sub}
              cat={cat}
              daysLeft={daysLeft}
              onEdit={setSubToEdit}
              onDelete={deleteSubscription}
              formatCurrency={formatCurrency}
            />
          );
        })}
      </div>
    );
  };

  if (isLoading && subscriptions.length === 0) {
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
            Bills & Subscriptions
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your recurring payments and subscriptions
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white gap-2 font-semibold px-6 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add Bill
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Upcoming Total"
          value={formatCurrency(upcomingTotal)}
          trend="Next 30 days"
          color="blue"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Monthly Cost"
          value={formatCurrency(totalMonthly)}
          trend="Recurring"
          color="emerald"
        />
        <StatCard
          icon={<AlertCircle className="w-5 h-5" />}
          title="Overdue"
          value={`${overdueSubs.length} bill${
            overdueSubs.length !== 1 ? "s" : ""
          }`}
          trend={overdueSubs.length > 0 ? "Action needed" : "All good"}
          color="rose"
        />
        <StatCard
          icon={<CalendarIcon className="w-5 h-5" />}
          title="Active Subs"
          value={`${activeSubs.length} bill${
            activeSubs.length !== 1 ? "s" : ""
          }`}
          trend="Subscribed"
          color="violet"
        />
      </div>

      {/* Upcoming Schedule */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Upcoming Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Next 30 days bill timeline
            </p>
          </div>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {upcomingSubs.map((sub) => {
            const cat = getCategory(sub.categoryId);
            const daysLeft = calculateDaysLeft(sub.nextBillingDate);
            return (
              <Card
                key={sub.id}
                className="min-w-[160px] snap-start rounded-3xl border-border/50 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex-shrink-0 bg-gradient-to-br from-card to-card/95"
              >
                <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center text-primary mb-1 shadow-inner">
                    {cat?.icon ? (
                      <CategoryIcon icon={cat.icon} size="sm" />
                    ) : (
                      <CreditCard className="w-5 h-5" />
                    )}
                  </div>
                  <p className="font-semibold text-sm truncate w-full">
                    {sub.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground font-medium">
                      {format(new Date(sub.nextBillingDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <p className="font-bold text-base text-foreground">
                    {formatCurrency(sub.amount)}
                  </p>
                  {daysLeft <= 3 && daysLeft >= 0 && (
                    <Badge
                      variant="default"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none text-[10px] px-2 py-0.5 h-5"
                    >
                      {daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {upcomingSubs.length === 0 && (
            <div className="min-w-[200px] text-sm text-muted-foreground italic py-12 border-2 border-dashed rounded-3xl bg-secondary/20 flex items-center justify-center text-center">
              <div>
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                No upcoming bills in the next 30 days
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs & List */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-secondary/50 border border-border/50 rounded-xl w-full justify-start h-auto p-1 space-x-1">
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 dark:data-[state=active]:bg-card"
          >
            <Clock className="w-4 h-4 mr-2" />
            Upcoming ({upcomingSubs.length})
          </TabsTrigger>
          <TabsTrigger
            value="overdue"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 dark:data-[state=active]:bg-card"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Overdue ({overdueSubs.length})
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 dark:data-[state=active]:bg-card"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            All ({subscriptions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <SubList subs={upcomingSubs} />
        </TabsContent>
        <TabsContent value="overdue" className="mt-4">
          <SubList subs={overdueSubs} />
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <SubList subs={subscriptions} />
        </TabsContent>
      </Tabs>

      <AddSubscriptionModal
        open={isAddModalOpen || !!subToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setSubToEdit(null);
        }}
        subscription={subToEdit}
      />
    </AnimatedPage>
  );
}
