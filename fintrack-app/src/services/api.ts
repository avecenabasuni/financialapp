const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export const api = {
  get: async <T>(endpoint: string, options?: FetchOptions): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },
  post: async <T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: { ...options?.headers, 'Content-Type': 'application/json' },
    });
  },
  put: async <T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { ...options?.headers, 'Content-Type': 'application/json' },
    });
  },
  delete: async <T>(endpoint: string, options?: FetchOptions): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
  patch: async <T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { ...options?.headers, 'Content-Type': 'application/json' },
    });
  },
};

import { useAuthStore } from '@/store/useAuthStore';

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers: HeadersInit = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  const token = useAuthStore.getState().token;
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.params) {
    const urlObj = new URL(url);
    Object.entries(options.params).forEach(([key, value]) => {
      if (value) urlObj.searchParams.append(key, value);
    });
    // fetch using urlObj.toString()
    const response = await fetch(urlObj.toString(), config);
    return handleResponse(response);
  }

  const response = await fetch(url, config);
  return handleResponse(response);
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    useAuthStore.getState().logout();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = `API Error: ${response.statusText}`;
    
    if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
    } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message;
    } else if (errorData.error && typeof errorData.error === 'object') {
        errorMessage = JSON.stringify(errorData.error);
    } else if (errorData.message && typeof errorData.message === 'object') {
        errorMessage = JSON.stringify(errorData.message);
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
