import { useEffect } from 'react';
import { useRecurringService } from '@/hooks/useRecurringService';
import { useStartData } from '@/hooks/use-start-data';
import AppLayout from './app-layout';
import DashboardSkeleton from '@/components/skeletons/dashboard-skeleton';

export default function AuthenticatedApp() {
  const { processRules } = useRecurringService();
  const { isAppLoading } = useStartData();

  useEffect(() => {
    if (!isAppLoading) {
        // Run recurring transaction check only after data is loaded
        processRules();
    }
  }, [isAppLoading, processRules]);

  if (isAppLoading) {
      return <DashboardSkeleton />; 
  }

  return (
      <AppLayout /> 
      // AppLayout contains the Outlet, but wait. 
      // In App.tsx, AppLayout was the Layout Route.
      // If we use AuthenticatedApp as the Layout Route, it should render Outlet too?
      // AppLayout renders Outlet. So yes.
  );
}
