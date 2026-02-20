import { useEffect, useState } from 'react';
import AnimatedPage from '@/components/shared/animated-page';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, Edit2, Trash2, Clock, CreditCard, AlertCircle, MoreHorizontal } from 'lucide-react';
import { useSubscriptionStore, type Subscription } from '@/store/useSubscriptionStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CategoryIcon from '@/components/shared/category-icon';
import AddSubscriptionModal from '@/components/modals/add-subscription-modal';

const SummaryCard = ({ icon, title, value, valueClass = "" }: any) => (
  <Card className="rounded-2xl shadow-sm border-border/50">
    <CardContent className="p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
        <p className={`text-xl font-bold ${valueClass}`}>{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default function Subscriptions() {
  const { subscriptions, fetchSubscriptions, isLoading, deleteSubscription } = useSubscriptionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subToEdit, setSubToEdit] = useState<Subscription | null>(null);

  useEffect(() => {
    fetchSubscriptions();
    fetchCategories();
  }, [fetchSubscriptions, fetchCategories]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const today = new Date();
  today.setHours(0,0,0,0);

  const calculateDaysLeft = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(0,0,0,0);
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCategory = (id?: string) => id ? categories.find(c => c.id === id) : undefined;

  const activeSubs = subscriptions.filter(s => s.status === 'active');
  
  const overdueSubs = activeSubs.filter(sub => calculateDaysLeft(sub.nextBillingDate) < 0);

  const upcomingSubs = activeSubs.filter(sub => {
    const days = calculateDaysLeft(sub.nextBillingDate);
    return days >= 0 && days <= 30;
  }).sort((a,b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());

  const upcomingTotal = upcomingSubs.reduce((acc, sub) => acc + sub.amount, 0);
  
  const totalMonthly = activeSubs.reduce((acc, sub) => {
      if (sub.frequency === 'monthly') return acc + sub.amount;
      if (sub.frequency === 'yearly') return acc + (sub.amount / 12);
      return acc;
  }, 0);

  const SubList = ({ subs }: { subs: Subscription[] }) => {
    if (subs.length === 0) return <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-2xl h-32 flex items-center justify-center">No subscriptions found.</div>;
    return (
      <div className="space-y-3">
        {subs.map(sub => {
          const cat = getCategory(sub.categoryId);
          const daysLeft = calculateDaysLeft(sub.nextBillingDate);
          
          let statusText = '';
          let statusColor = '';
          if (sub.status !== 'active') {
             statusText = String(sub.status);
             statusColor = 'text-muted-foreground capitalize';
          } else if (daysLeft < 0) {
             statusText = `${Math.abs(daysLeft)}d overdue`;
             statusColor = 'text-rose-500 font-bold';
          } else if (daysLeft === 0) {
             statusText = 'Due today';
             statusColor = 'text-amber-500 font-bold';
          } else {
             statusText = `${daysLeft}d left`;
             statusColor = 'text-blue-500';
          }

          return (
            <Card key={sub.id} className="rounded-2xl shadow-sm hover:shadow transition-shadow group border-border/50">
               <CardContent className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                            {cat?.icon ? <CategoryIcon icon={cat.icon} size="sm" /> : <div className="font-bold text-lg">{sub.name.charAt(0)}</div>}
                       </div>
                       <div>
                           <div className="flex items-center gap-2">
                             <h4 className="font-semibold">{sub.name}</h4>
                             {sub.status === 'active' && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Auto</Badge>}
                           </div>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 capitalize">
                               <span>{cat?.name || 'Uncategorized'}</span>
                               <span>•</span>
                               <span>{sub.frequency}</span>
                           </div>
                       </div>
                   </div>

                   <div className="flex items-center gap-6">
                       <div className="text-right flex flex-col items-end">
                           <div className="font-bold text-base">{formatCurrency(sub.amount)}</div>
                           <div className={`text-xs flex items-center gap-1 mt-1 ${statusColor}`}>
                               {(daysLeft > 0 && sub.status === 'active') && <Clock className="w-3 h-3" />}
                               {(daysLeft < 0 && sub.status === 'active') && <AlertCircle className="w-3 h-3" />}
                               {statusText}
                           </div>
                       </div>

                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSubToEdit(sub)}>
                              <Edit2 className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteSubscription(sub.id)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                   </div>
               </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  if (isLoading && subscriptions.length === 0) {
      return (
        <AnimatedPage className="space-y-6">
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </AnimatedPage>
      );
  }

  return (
    <AnimatedPage className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills & Subscriptions</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your recurring payments and subscriptions.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white gap-2 font-semibold px-6">
           <Plus className="w-4 h-4" /> Add Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={<Clock className="text-blue-500 w-5 h-5" />} title="Upcoming Total" value={formatCurrency(upcomingTotal)} />
        <SummaryCard icon={<CreditCard className="text-emerald-500 w-5 h-5" />} title="Monthly Cost" value={formatCurrency(totalMonthly)} valueClass="text-emerald-600" />
        <SummaryCard icon={<AlertCircle className="text-rose-500 w-5 h-5" />} title="Overdue" value={`${overdueSubs.length} bill${overdueSubs.length === 1 ? '' : 's'}`} valueClass={overdueSubs.length > 0 ? "text-rose-600" : ""} />
        <SummaryCard icon={<CalendarIcon className="text-indigo-500 w-5 h-5" />} title="Active Subs" value={`${activeSubs.length} bill${activeSubs.length === 1 ? '' : 's'}`} />
      </div>

      {/* Upcoming Schedule */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Upcoming Schedule</h3>
          <p className="text-sm text-muted-foreground mt-1">Next 30 days bill timeline</p>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {upcomingSubs.map(sub => {
            const cat = getCategory(sub.categoryId);
            return (
              <Card key={sub.id} className="min-w-[140px] snap-start rounded-3xl border-border/50 shadow-sm flex-shrink-0">
                <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary mb-2">
                     {cat?.icon ? <CategoryIcon icon={cat.icon} size="sm" /> : <CreditCard className="w-5 h-5" />}
                  </div>
                  <p className="font-semibold text-sm truncate w-full">{sub.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{format(new Date(sub.nextBillingDate), 'MMM d')}</p>
                  <p className="font-bold mt-1 text-sm">{formatCurrency(sub.amount)}</p>
                </CardContent>
              </Card>
            )
          })}
          {upcomingSubs.length === 0 && (
              <div className="text-sm text-muted-foreground italic py-8 border-2 border-dashed rounded-3xl w-full text-center">No upcoming bills in the next 30 days.</div>
          )}
        </div>
      </div>

      {/* Tabs & List */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 space-x-8">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 font-semibold data-[state=inactive]:text-muted-foreground">
             Upcoming ({upcomingSubs.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 font-semibold data-[state=inactive]:text-muted-foreground">
             Overdue ({overdueSubs.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 font-semibold data-[state=inactive]:text-muted-foreground">
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
         onClose={() => { setIsAddModalOpen(false); setSubToEdit(null); }} 
         subscription={subToEdit}
      /> 

    </AnimatedPage>
  );
}
