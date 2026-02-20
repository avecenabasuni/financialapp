import { useEffect, useState } from 'react';
import AnimatedPage from '@/components/shared/animated-page';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, Edit2, Trash2 } from 'lucide-react';
import { useSubscriptionStore, type Subscription } from '@/store/useSubscriptionStore';
import { format, isThisMonth, isFuture, addMonths } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AddSubscriptionModal from '@/components/modals/add-subscription-modal';

export default function Subscriptions() {
  const { subscriptions, fetchSubscriptions, isLoading, deleteSubscription } = useSubscriptionStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subToEdit, setSubToEdit] = useState<Subscription | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const calculateTotalMonthly = () => {
     let total = 0;
     subscriptions.forEach(sub => {
         if (sub.status !== 'active') return;
         if (sub.frequency === 'monthly') total += sub.amount;
         if (sub.frequency === 'yearly') total += (sub.amount / 12);
     });
     return total;
  };

  const getUpcomingThisMonth = () => {
    const sorted = [...subscriptions].sort((a,b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
    return sorted.filter(sub => sub.status === 'active' && isThisMonth(new Date(sub.nextBillingDate)) || (isFuture(new Date(sub.nextBillingDate)) && new Date(sub.nextBillingDate) < addMonths(new Date(), 1)));
  };

  const totalMonthly = calculateTotalMonthly();
  const upcoming = getUpcomingThisMonth();

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your recurring bills and subscriptions.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-lg gap-2">
           <Plus className="w-4 h-4" /> Add Subscription
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-xl shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-zinc-950 border-none">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                   <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm font-medium text-muted-foreground">Total Monthly Cost</p>
                   <p className="text-3xl font-bold text-indigo-600">{formatCurrency(totalMonthly)}</p>
                </div>
            </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-sm bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-zinc-950 border-none">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                   <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                   <p className="text-3xl font-bold text-amber-600">{subscriptions.filter(s => s.status === 'active').length}</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Your Subscriptions</h3>
            
            {isLoading && subscriptions.length === 0 ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : subscriptions.length === 0 ? (
                 <Card className="rounded-xl border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                        <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p>No active subscriptions found.</p>
                    </CardContent>
                 </Card>
            ) : (
                <div className="space-y-3">
                    {subscriptions.map(sub => (
                        <Card key={sub.id} className="rounded-xl shadow-sm hover:shadow transition-shadow group">
                           <CardContent className="p-4 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                        {sub.name.charAt(0).toUpperCase()}
                                   </div>
                                   <div>
                                       <h4 className="font-semibold">{sub.name}</h4>
                                       <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                           <Badge variant="outline" className="font-normal px-1.5 py-0 capitalize border-border">
                                              {sub.frequency}
                                           </Badge>
                                           <span className="flex items-center gap-1">
                                               <CalendarIcon className="w-3 h-3" />
                                               Next: {format(new Date(sub.nextBillingDate), 'MMM dd, yyyy')}
                                           </span>
                                       </div>
                                   </div>
                               </div>

                               <div className="flex items-center gap-4">
                                   <div className="text-right">
                                       <div className="font-semibold">{formatCurrency(sub.amount)}</div>
                                       {sub.status !== 'active' && <Badge variant="secondary" className="text-[10px] mt-1 h-4">Paused</Badge>}
                                   </div>

                                   <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Edit2 className="w-4 h-4 text-muted-foreground" />
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
                    ))}
                </div>
            )}
        </div>

        {/* Coming Up Sidebar */}
        <div className="space-y-4">
             <h3 className="text-lg font-semibold">Upcoming Bills</h3>
             <Card className="rounded-xl shadow-sm bg-muted/30 border-none">
                 <CardContent className="p-4 space-y-4">
                     {upcoming.length === 0 ? (
                         <div className="text-sm text-center text-muted-foreground py-4">
                             No upcoming bills this month.
                         </div>
                     ) : (
                         upcoming.slice(0, 5).map(sub => (
                             <div key={sub.id} className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="font-medium truncate max-w-[120px]">{sub.name}</span>
                                 </div>
                                 <div className="flex flex-col items-end">
                                    <span className="font-semibold">{formatCurrency(sub.amount)}</span>
                                    <span className="text-xs text-muted-foreground">{format(new Date(sub.nextBillingDate), 'MMM dd')}</span>
                                 </div>
                             </div>
                         ))
                     )}
                 </CardContent>
             </Card>
        </div>

      </div>

      <AddSubscriptionModal 
         open={isAddModalOpen || !!subToEdit} 
         onClose={() => { setIsAddModalOpen(false); setSubToEdit(null); }} 
         subscription={subToEdit}
      /> 

    </AnimatedPage>
  );
}
