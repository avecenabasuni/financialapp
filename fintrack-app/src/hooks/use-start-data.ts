import { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useRecurringStore } from '@/store/useRecurringStore';
import { useUserStore } from '@/store/useUserStore';

export const useStartData = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useWalletStore((state) => state.fetchWallets);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
  const fetchBudgets = useBudgetStore((state) => state.fetchBudgets);
  const fetchRules = useRecurringStore((state) => state.fetchRules);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    const loadData = async () => {
      setIsAppLoading(true);
      try {
        await Promise.all([
          fetchUser(),
          fetchWallets(),
          fetchCategories(),
          fetchTransactions(),
          fetchBudgets(),
          fetchRules(),
        ]);
      } catch (err: any) {
        console.error("Failed to load initial data", err);
        setError(err.message || "Failed to load data");
      } finally {
        setIsAppLoading(false);
      }
    };

    loadData();
  }, [fetchUser, fetchWallets, fetchCategories, fetchTransactions, fetchBudgets, fetchRules]);

  return { isAppLoading, error };
};
