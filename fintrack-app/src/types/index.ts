export interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'ewallet' | 'credit' | 'savings' | 'other';
  balance: number;
  color: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  group?: 'needs' | 'wants' | 'savings';
  subcategories?: Category[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  walletId: string;
  walletName: string;
  toWalletId?: string;
  toWalletName?: string;
  date: string;
  note: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  spent: number;
  month: string;
}

export interface User {
  name: string;
  email: string;
  initials: string;
  currency: string;
  timezone: string;
}

export interface ChartData {
  name: string;
  income: number;
  expense: number;
}
