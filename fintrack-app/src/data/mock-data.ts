import type { Wallet, Category, Transaction, Budget, User, ChartData } from '@/types';

export const user: User = {
  name: 'Anggara Nasution',
  email: 'anggara@email.com',
  initials: 'AN',
  currency: 'IDR',
  timezone: 'Asia/Jakarta',
};

export const wallets: Wallet[] = [
  { id: 'w1', name: 'Bank Mandiri', type: 'bank', balance: 7800000, color: '#3b82f6', icon: 'Landmark' },
  { id: 'w2', name: 'Cash', type: 'cash', balance: 2350000, color: '#13ecda', icon: 'Banknote' },
  { id: 'w3', name: 'GoPay', type: 'ewallet', balance: 1500000, color: '#22c55e', icon: 'Smartphone' },
  { id: 'w4', name: 'Credit Card BCA', type: 'credit', balance: -2200000, color: '#a855f7', icon: 'CreditCard' },
];

export const categories: Category[] = [
  {
    id: 'c1', name: 'Food & Drink', icon: 'UtensilsCrossed', color: '#f97316', type: 'expense',
    subcategories: [
      { id: 'c1a', name: 'Groceries', icon: 'ShoppingCart', color: '#f97316', type: 'expense' },
      { id: 'c1b', name: 'Restaurant', icon: 'ChefHat', color: '#f97316', type: 'expense' },
      { id: 'c1c', name: 'Coffee', icon: 'Coffee', color: '#f97316', type: 'expense' },
    ],
  },
  {
    id: 'c2', name: 'Transport', icon: 'Car', color: '#3b82f6', type: 'expense',
    subcategories: [
      { id: 'c2a', name: 'Fuel', icon: 'Fuel', color: '#3b82f6', type: 'expense' },
      { id: 'c2b', name: 'Taxi', icon: 'Car', color: '#3b82f6', type: 'expense' },
    ],
  },
  {
    id: 'c3', name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', type: 'expense',
    subcategories: [
      { id: 'c3a', name: 'Clothing', icon: 'Shirt', color: '#ec4899', type: 'expense' },
      { id: 'c3b', name: 'Electronics', icon: 'Monitor', color: '#ec4899', type: 'expense' },
    ],
  },
  {
    id: 'c4', name: 'Housing', icon: 'Home', color: '#8b5cf6', type: 'expense',
    subcategories: [
      { id: 'c4a', name: 'Rent', icon: 'Key', color: '#8b5cf6', type: 'expense' },
      { id: 'c4b', name: 'Utilities', icon: 'Zap', color: '#8b5cf6', type: 'expense' },
    ],
  },
  { id: 'c5', name: 'Entertainment', icon: 'Gamepad2', color: '#06b6d4', type: 'expense' },
  { id: 'c6', name: 'Health', icon: 'Heart', color: '#ef4444', type: 'expense' },
  { id: 'c7', name: 'Salary', icon: 'Briefcase', color: '#22c55e', type: 'income' },
  { id: 'c8', name: 'Freelance', icon: 'Laptop', color: '#10b981', type: 'income' },
  { id: 'c9', name: 'Investment', icon: 'TrendingUp', color: '#14b8a6', type: 'income' },
];

export const transactions: Transaction[] = [
  { id: 't1', amount: 3200000, type: 'income', categoryId: 'c7', categoryName: 'Salary', categoryIcon: 'Briefcase', categoryColor: '#22c55e', walletId: 'w1', walletName: 'Bank Mandiri', date: '2026-02-17', note: 'Monthly salary' },
  { id: 't2', amount: 85000, type: 'expense', categoryId: 'c1', categoryName: 'Food & Drink', categoryIcon: 'UtensilsCrossed', categoryColor: '#f97316', walletId: 'w2', walletName: 'Cash', date: '2026-02-17', note: 'Lunch at warung' },
  { id: 't3', amount: 35000, type: 'expense', categoryId: 'c2', categoryName: 'Transport', categoryIcon: 'Car', categoryColor: '#3b82f6', walletId: 'w3', walletName: 'GoPay', date: '2026-02-17', note: 'Grab to office' },
  { id: 't4', amount: 250000, type: 'expense', categoryId: 'c3', categoryName: 'Shopping', categoryIcon: 'ShoppingBag', categoryColor: '#ec4899', walletId: 'w4', walletName: 'Credit Card BCA', date: '2026-02-16', note: 'New headphones cable' },
  { id: 't5', amount: 150000, type: 'expense', categoryId: 'c1', categoryName: 'Food & Drink', categoryIcon: 'UtensilsCrossed', categoryColor: '#f97316', walletId: 'w2', walletName: 'Cash', date: '2026-02-16', note: 'Dinner with friends' },
  { id: 't6', amount: 500000, type: 'income', categoryId: 'c8', categoryName: 'Freelance', categoryIcon: 'Laptop', categoryColor: '#10b981', walletId: 'w1', walletName: 'Bank Mandiri', date: '2026-02-15', note: 'Logo design project' },
  { id: 't7', amount: 1800000, type: 'expense', categoryId: 'c4', categoryName: 'Housing', categoryIcon: 'Home', categoryColor: '#8b5cf6', walletId: 'w1', walletName: 'Bank Mandiri', date: '2026-02-15', note: 'Monthly rent' },
  { id: 't8', amount: 45000, type: 'expense', categoryId: 'c2', categoryName: 'Transport', categoryIcon: 'Car', categoryColor: '#3b82f6', walletId: 'w3', walletName: 'GoPay', date: '2026-02-14', note: 'Fuel top-up' },
  { id: 't9', amount: 120000, type: 'expense', categoryId: 'c5', categoryName: 'Entertainment', categoryIcon: 'Gamepad2', categoryColor: '#06b6d4', walletId: 'w2', walletName: 'Cash', date: '2026-02-14', note: 'Movie tickets' },
  { id: 't10', amount: 75000, type: 'expense', categoryId: 'c6', categoryName: 'Health', categoryIcon: 'Heart', categoryColor: '#ef4444', walletId: 'w1', walletName: 'Bank Mandiri', date: '2026-02-13', note: 'Vitamins' },
  { id: 't11', amount: 200000, type: 'expense', categoryId: 'c1', categoryName: 'Food & Drink', categoryIcon: 'UtensilsCrossed', categoryColor: '#f97316', walletId: 'w2', walletName: 'Cash', date: '2026-02-13', note: 'Weekly groceries' },
  { id: 't12', amount: 350000, type: 'income', categoryId: 'c9', categoryName: 'Investment', categoryIcon: 'TrendingUp', categoryColor: '#14b8a6', walletId: 'w1', walletName: 'Bank Mandiri', date: '2026-02-12', note: 'Dividend payout' },
];

export const budgets: Budget[] = [
  { id: 'b1', categoryId: 'c1', categoryName: 'Food & Drink', categoryIcon: 'UtensilsCrossed', categoryColor: '#f97316', amount: 2800000, spent: 1750000, month: '2026-02' },
  { id: 'b2', categoryId: 'c2', categoryName: 'Transport', categoryIcon: 'Car', categoryColor: '#3b82f6', amount: 800000, spent: 620000, month: '2026-02' },
  { id: 'b3', categoryId: 'c3', categoryName: 'Shopping', categoryIcon: 'ShoppingBag', categoryColor: '#ec4899', amount: 1500000, spent: 1650000, month: '2026-02' },
  { id: 'b4', categoryId: 'c4', categoryName: 'Housing', categoryIcon: 'Home', categoryColor: '#8b5cf6', amount: 2000000, spent: 1800000, month: '2026-02' },
  { id: 'b5', categoryId: 'c5', categoryName: 'Entertainment', categoryIcon: 'Gamepad2', categoryColor: '#06b6d4', amount: 500000, spent: 120000, month: '2026-02' },
];

export const chartData: ChartData[] = [
  { name: 'Sep', income: 2800000, expense: 2100000 },
  { name: 'Oct', income: 3100000, expense: 2400000 },
  { name: 'Nov', income: 2900000, expense: 2800000 },
  { name: 'Dec', income: 3500000, expense: 3200000 },
  { name: 'Jan', income: 3200000, expense: 2600000 },
  { name: 'Feb', income: 3110563, expense: 2954563 },
];

