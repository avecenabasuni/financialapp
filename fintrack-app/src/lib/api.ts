const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Something went wrong');
  }

  return data.data;
}

export const api = {
  wallets: {
    list: () => fetchApi<any[]>('/wallets'),
    create: (data: any) => fetchApi<any>('/wallets', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/wallets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/wallets/${id}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => fetchApi<any[]>('/categories'),
    create: (data: any) => fetchApi<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/categories/${id}`, { method: 'DELETE' }),
  },
  transactions: {
    list: () => fetchApi<any[]>('/transactions'),
    create: (data: any) => fetchApi<any>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/transactions/${id}`, { method: 'DELETE' }),
  },
  budgets: {
    list: (month: string) => fetchApi<any[]>(`/budgets?month=${month}`),
    upsert: (data: any) => fetchApi<any>('/budgets', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/budgets/${id}`, { method: 'DELETE' }),
  },
  dashboard: {
    get: () => fetchApi<any>('/dashboard'),
  },
  stats: {
    get: (period?: string) => fetchApi<any>(`/stats?period=${period || 'Month'}`),
  }
};
