import type { ApiResponse } from '../types/api';

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8080';
const DEFAULT_REQUEST_TIMEOUT_MS = 20_000;
const UPLOAD_REQUEST_TIMEOUT_MS = 10 * 60_000;

const inflightGetRequests = new Map<string, Promise<unknown>>();

type KpmRequestInit = RequestInit & {
  timeoutMs?: number;
  dedupe?: boolean;
};

function authHeaders(): Record<string, string> {
  const token = window.localStorage.getItem('kpm.authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonHeaders(init?: RequestInit): Record<string, string> {
  if (!init?.body || init.body instanceof FormData) return {};
  return { 'Content-Type': 'application/json' };
}

function normalizeBaseUrl(value: string | undefined): string {
  return (value || '').trim().replace(/\/+$/, '');
}

export function apiBaseUrl(): string {
  const configured = normalizeBaseUrl(import.meta.env.VITE_KPM_API_BASE);
  if (configured) return configured;
  return DEFAULT_API_BASE_URL;
}

export function resolveApiUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/api')) return `${apiBaseUrl()}${url}`;
  return url;
}

function timeoutMessage(url: string): string {
  return `接口请求超时，请检查后端服务或网络连接：${url}`;
}

async function fetchWithTimeout(url: string, init: KpmRequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? (init.body instanceof FormData ? UPLOAD_REQUEST_TIMEOUT_MS : DEFAULT_REQUEST_TIMEOUT_MS);
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  const abortFromCaller = () => controller.abort();

  if (init.signal) {
    if (init.signal.aborted) controller.abort();
    else init.signal.addEventListener('abort', abortFromCaller, { once: true });
  }

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { ...jsonHeaders(init), ...authHeaders(), ...(init.headers ?? {}) },
    });
  } catch (error) {
    if (controller.signal.aborted) throw new Error(timeoutMessage(url));
    throw error;
  } finally {
    window.clearTimeout(timer);
    init.signal?.removeEventListener('abort', abortFromCaller);
  }
}

async function readApiPayload<T>(response: Response): Promise<ApiResponse<T> | null> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  return (await response.json()) as ApiResponse<T>;
}

function apiErrorMessage(response: Response, payload: ApiResponse<unknown> | null): string {
  if (payload?.message) return payload.message;
  if (payload?.code) return payload.code;
  return `${response.status} ${response.statusText}`;
}

async function executeRequest<T>(url: string, init?: KpmRequestInit): Promise<T> {
  const resolvedUrl = resolveApiUrl(url);
  const response = await fetchWithTimeout(resolvedUrl, init);
  const refreshedToken = response.headers.get('X-KPM-Refresh-Token');
  if (refreshedToken) {
    window.localStorage.setItem('kpm.authToken', refreshedToken);
  }
  const payload = await readApiPayload<T>(response);
  if (!response.ok) {
    throw new Error(apiErrorMessage(response, payload));
  }
  if (!payload) {
    throw new Error('接口未返回标准 JSON 响应');
  }
  if (!payload.success) {
    throw new Error(payload.message || payload.code);
  }
  return payload.data;
}

async function request<T>(url: string, init?: KpmRequestInit): Promise<T> {
  const method = (init?.method || 'GET').toUpperCase();
  const shouldDedupe = init?.dedupe ?? method === 'GET';
  if (!shouldDedupe || method !== 'GET') return executeRequest<T>(url, init);

  const token = window.localStorage.getItem('kpm.authToken') || '';
  const key = `${method}:${resolveApiUrl(url)}:${token}`;
  const existing = inflightGetRequests.get(key);
  if (existing) return existing as Promise<T>;

  const promise = executeRequest<T>(url, init).finally(() => inflightGetRequests.delete(key));
  inflightGetRequests.set(key, promise);
  return promise;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) => request<T>(url, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  postForm: <T>(url: string, body: FormData) => request<T>(url, { method: 'POST', body }),
  put: <T>(url: string, body?: unknown) => request<T>(url, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
