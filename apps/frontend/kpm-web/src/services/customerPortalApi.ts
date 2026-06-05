import type { ApiResponse } from "../types/api";
import { resolveApiUrl } from "../api/httpClient";
import type { KnowledgeArticle, PageResult } from "../types";
import type {
  CustomerPortalCodeResponse,
  CustomerPortalContact,
  CustomerPortalData,
  CustomerPortalDownloadResult,
  CustomerPortalLoginResponse,
  CustomerPortalMaterial,
  CustomerPortalMessage,
  CustomerPortalTaskStats,
  CustomerPortalTask,
  CustomerPortalTaskCommentPage,
  CustomerPortalTaskCommentRequest,
  CustomerPortalTaskRequest,
  CustomerPortalUser,
} from "../types/customerPortal";
import type { AnyRecord } from "../types";

const DEFAULT_REQUEST_TIMEOUT_MS = 20_000;
const UPLOAD_REQUEST_TIMEOUT_MS = 10 * 60_000;
const inflightGetRequests = new Map<string, Promise<unknown>>();

type CustomerPortalRequestInit = RequestInit & {
  timeoutMs?: number;
  dedupe?: boolean;
};

export const customerPortalStorageKeys = {
  token: "kpm.customerPortal.token",
  email: "kpm.customerPortal.email",
  contactName: "kpm.customerPortal.contactName",
  customerName: "kpm.customerPortal.customerName",
} as const;

function jsonHeaders(init?: RequestInit): Record<string, string> {
  if (!init?.body || init.body instanceof FormData) return {};
  return { "Content-Type": "application/json" };
}

async function readApiPayload<T>(
  response: Response,
): Promise<ApiResponse<T> | null> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  return (await response.json()) as ApiResponse<T>;
}

function apiErrorMessage(
  response: Response,
  payload: ApiResponse<unknown> | null,
): string {
  if (payload?.message) return payload.message;
  if (payload?.code) return payload.code;
  return `${response.status} ${response.statusText}`;
}

function timeoutMessage(url: string): string {
  return `接口请求超时，请检查后端服务或网络连接：${url}`;
}

async function fetchWithTimeout(
  url: string,
  init: CustomerPortalRequestInit = {},
  token?: string,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutMs =
    init.timeoutMs ??
    (init.body instanceof FormData
      ? UPLOAD_REQUEST_TIMEOUT_MS
      : DEFAULT_REQUEST_TIMEOUT_MS);
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  const abortFromCaller = () => controller.abort();

  if (init.signal) {
    if (init.signal.aborted) controller.abort();
    else init.signal.addEventListener("abort", abortFromCaller, { once: true });
  }

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        ...jsonHeaders(init),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
    });
  } catch (error) {
    if (controller.signal.aborted) throw new Error(timeoutMessage(url));
    throw error;
  } finally {
    window.clearTimeout(timer);
    init.signal?.removeEventListener("abort", abortFromCaller);
  }
}

async function executeRequest<T>(
  url: string,
  init?: CustomerPortalRequestInit,
  token?: string,
): Promise<T> {
  const resolvedUrl = resolveApiUrl(url);
  const response = await fetchWithTimeout(resolvedUrl, init, token);
  const refreshedToken = response.headers.get("X-KPM-Refresh-Token");
  if (refreshedToken) {
    window.localStorage.setItem(
      customerPortalStorageKeys.token,
      refreshedToken,
    );
  }
  const payload = await readApiPayload<T>(response);
  if (!response.ok) throw new Error(apiErrorMessage(response, payload));
  if (!payload) throw new Error("接口未返回标准 JSON 响应");
  if (!payload.success) throw new Error(payload.message || payload.code);
  return payload.data;
}

async function request<T>(
  url: string,
  init?: CustomerPortalRequestInit,
  token?: string,
): Promise<T> {
  const method = (init?.method || "GET").toUpperCase();
  const shouldDedupe = init?.dedupe ?? method === "GET";
  if (!shouldDedupe || method !== "GET")
    return executeRequest<T>(url, init, token);

  const key = `${method}:${resolveApiUrl(url)}:${token || ""}`;
  const existing = inflightGetRequests.get(key);
  if (existing) return existing as Promise<T>;

  const promise = executeRequest<T>(url, init, token).finally(() =>
    inflightGetRequests.delete(key),
  );
  inflightGetRequests.set(key, promise);
  return promise;
}

export function readCustomerPortalToken() {
  return window.localStorage.getItem(customerPortalStorageKeys.token) || "";
}

export function persistCustomerPortalSession(
  result: CustomerPortalLoginResponse,
) {
  window.localStorage.setItem(customerPortalStorageKeys.token, result.token);
  window.localStorage.setItem(
    customerPortalStorageKeys.email,
    result.user.email,
  );
  window.localStorage.setItem(
    customerPortalStorageKeys.contactName,
    result.user.contactName || "",
  );
  window.localStorage.setItem(
    customerPortalStorageKeys.customerName,
    result.user.customerName || "",
  );
}

export function clearCustomerPortalSession() {
  Object.values(customerPortalStorageKeys).forEach((key) =>
    window.localStorage.removeItem(key),
  );
}

export const customerPortalApi = {
  requestCode: (email: string) =>
    request<CustomerPortalCodeResponse>("/api/customer-portal/request-code", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  login: (email: string, code: string) =>
    request<CustomerPortalLoginResponse>("/api/customer-portal/login", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    }),
  me: (token = readCustomerPortalToken()) =>
    request<CustomerPortalUser>("/api/customer-portal/me", undefined, token),
  data: (token = readCustomerPortalToken()) =>
    request<CustomerPortalData>("/api/customer-portal/data", undefined, token),
  contacts: (token = readCustomerPortalToken()) =>
    request<CustomerPortalContact[]>("/api/customer-portal/contacts", undefined, token),
  materialsPage: (
    params: {
      projectId?: string;
      keyword?: string;
      page?: number;
      pageSize?: number;
    } = {},
    token = readCustomerPortalToken(),
  ) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      search.set(key, String(value));
    });
    const query = search.toString();
    return request<PageResult<CustomerPortalMaterial>>(
      `/api/customer-portal/materials/page${query ? `?${query}` : ""}`,
      undefined,
      token,
    );
  },
  knowledgePage: (
    keyword = "",
    page = 1,
    pageSize = 10,
    token = readCustomerPortalToken(),
  ) =>
    request<PageResult<KnowledgeArticle>>(
      `/api/customer-portal/knowledge/page?keyword=${encodeURIComponent(keyword)}&page=${page}&pageSize=${pageSize}`,
      undefined,
      token,
    ),
  knowledgeArticle: (id: string, token = readCustomerPortalToken()) =>
    request<KnowledgeArticle>(
      `/api/customer-portal/knowledge/${encodeURIComponent(id)}`,
      undefined,
      token,
    ),
  createTask: (
    body: CustomerPortalTaskRequest,
    token = readCustomerPortalToken(),
  ) =>
    request<CustomerPortalTask>(
      "/api/customer-portal/tasks",
      { method: "POST", body: JSON.stringify(body) },
      token,
    ),
  tasksPage: (
    params: {
      projectId?: string;
      status?: string;
      creatorEmail?: string;
      page?: number;
      pageSize?: number;
    } = {},
    token = readCustomerPortalToken(),
  ) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      search.set(key, String(value));
    });
    const query = search.toString();
    return request<PageResult<CustomerPortalTask>>(
      `/api/customer-portal/tasks/page${query ? `?${query}` : ""}`,
      undefined,
      token,
    );
  },
	  addTaskAttachments: (
    taskId: string,
    attachments: AnyRecord[],
    token = readCustomerPortalToken(),
  ) =>
    request<CustomerPortalTask>(
      `/api/customer-portal/tasks/${taskId}/attachments`,
      { method: "POST", body: JSON.stringify({ attachments }) },
      token,
    ),
  task: (taskId: string, token = readCustomerPortalToken()) =>
    request<CustomerPortalTask>(
      `/api/customer-portal/tasks/${taskId}`,
      undefined,
      token,
    ),
  taskStatuses: (token = readCustomerPortalToken()) =>
    request<string[]>("/api/customer-portal/tasks/statuses", undefined, token),
  taskStats: (projectId?: string, token = readCustomerPortalToken()) =>
    request<CustomerPortalTaskStats>(
      `/api/customer-portal/tasks/stats${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`,
      undefined,
      token,
    ),
  taskComments: (
    taskId: string,
    page = 1,
    pageSize = 10,
    token = readCustomerPortalToken(),
  ) =>
    request<CustomerPortalTaskCommentPage>(
      `/api/customer-portal/tasks/${taskId}/comments?page=${page}&pageSize=${pageSize}`,
      undefined,
      token,
    ),
  addTaskComment: (
    taskId: string,
    body: CustomerPortalTaskCommentRequest,
    token = readCustomerPortalToken(),
  ) =>
    request<CustomerPortalTask>(
      `/api/customer-portal/tasks/${taskId}/comments`,
      { method: "POST", body: JSON.stringify(body) },
      token,
    ),
  messages: (unreadOnly = false, token = readCustomerPortalToken()) =>
    request<CustomerPortalMessage[]>(
      `/api/customer-portal/messages?unreadOnly=${unreadOnly}`,
      undefined,
      token,
    ),
  unreadCount: (token = readCustomerPortalToken()) =>
    request<{ count: number }>(
      "/api/customer-portal/unread-count",
      undefined,
      token,
    ),
  markMessageRead: (id: string, token = readCustomerPortalToken()) =>
    request<boolean>(
      `/api/customer-portal/messages/${id}/read`,
      { method: "POST", body: JSON.stringify({}) },
      token,
    ),
  markAllMessagesRead: (token = readCustomerPortalToken()) =>
    request<{ count: number }>(
      "/api/customer-portal/messages/read-all",
      { method: "POST", body: JSON.stringify({}) },
      token,
    ),
  downloadUrl: (
    objectKey: string,
    fileName?: string,
    token = readCustomerPortalToken(),
  ) =>
    request<CustomerPortalDownloadResult>(
      `/api/files/download-url?objectKey=${encodeURIComponent(objectKey)}${fileName ? `&fileName=${encodeURIComponent(fileName)}` : ""}`,
      undefined,
      token,
    ),
  uploadFile: (
    file: File,
    category: string,
    businessId: string,
    uploader: string,
    token = readCustomerPortalToken(),
  ) => {
    const body = new FormData();
    body.append("file", file);
    body.append("category", category);
    body.append("businessId", businessId);
    body.append("uploader", uploader);
    return request<AnyRecord>(
      "/api/files/upload",
      { method: "POST", body },
      token,
    );
  },
};
