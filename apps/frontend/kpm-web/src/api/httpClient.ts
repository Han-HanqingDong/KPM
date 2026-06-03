import type { ApiResponse } from '../types/api';

function authHeaders(): Record<string, string> {
  const token = window.localStorage.getItem('kpm.authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(init?.headers ?? {}) },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) {
    throw new Error(payload.message || payload.code);
  }
  return payload.data;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) => request<T>(url, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: <T>(url: string, body?: unknown) => request<T>(url, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
