import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { useUserStore } from "@/store/useUserStore";

export function formatCurrency(amount: number): string {
  let currency = 'IDR';
  try {
    currency = useUserStore.getState().user.currency || 'IDR';
  } catch (e) {
    // Fallback
  }

  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: currency, 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

export const getEndOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (day === 0 ? 0 : 7) - day; // adjust when day is sunday
  return new Date(d.setDate(diff));
};

export const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const getAllMonths = () => [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

