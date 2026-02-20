import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/theme-context';
import { ToastProvider } from '@/context/toast-context';
import DashboardSkeleton from '@/components/skeletons/dashboard-skeleton';
import ListSkeleton from '@/components/skeletons/list-skeleton';
import StatsSkeleton from '@/components/skeletons/stats-skeleton';
import WalletsSkeleton from '@/components/skeletons/wallets-skeleton';
import BudgetsSkeleton from '@/components/skeletons/budgets-skeleton';

import ProtectedRoute from '@/components/layout/protected-route';
import AuthenticatedApp from '@/components/layout/authenticated-app';
import Login from '@/pages/login';
import Register from '@/pages/register';

const Dashboard = lazy(() => import('@/pages/dashboard'));
const Transactions = lazy(() => import('@/pages/transactions'));
const Statistics = lazy(() => import('@/pages/statistics'));
const Categories = lazy(() => import('@/pages/categories'));
const Wallets = lazy(() => import('@/pages/wallets'));
const Budgets = lazy(() => import('@/pages/budgets'));
const Goals = lazy(() => import('@/pages/goals'));
const Subscriptions = lazy(() => import('@/pages/subscriptions'));
const SettingsPage = lazy(() => import('@/pages/settings'));

export default function App() {
  return (
    <ThemeProvider>
    <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AuthenticatedApp />}>
                <Route path="/" element={<Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense>} />
                <Route path="/transactions" element={<Suspense fallback={<ListSkeleton />}><Transactions /></Suspense>} />
                <Route path="/statistics" element={<Suspense fallback={<StatsSkeleton />}><Statistics /></Suspense>} />
                <Route path="/categories" element={<Suspense fallback={<ListSkeleton rows={8} showHeader={false} />}><Categories /></Suspense>} />
                <Route path="/wallets" element={<Suspense fallback={<WalletsSkeleton />}><Wallets /></Suspense>} />
                <Route path="/budgets" element={<Suspense fallback={<BudgetsSkeleton />}><Budgets /></Suspense>} />
                <Route path="/goals" element={<Suspense fallback={<ListSkeleton />}><Goals /></Suspense>} />
                <Route path="/subscriptions" element={<Suspense fallback={<ListSkeleton />}><Subscriptions /></Suspense>} />
                <Route path="/settings" element={<Suspense fallback={<DashboardSkeleton />}><SettingsPage /></Suspense>} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
    </ToastProvider>
    </ThemeProvider>
  );
}
