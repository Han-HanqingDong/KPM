import { api } from "../api";
import type {
  AnyRecord,
  AppData,
  BootstrapData,
  Customer,
  DashboardStats,
  KnowledgeArticle,
  LoginResponse,
  Order,
  PageResult,
  Project,
  Task,
} from "../types";

export const storageKeys = {
  token: "kpm.authToken",
  userId: "kpm.currentUserId",
  account: "kpm.currentAccount",
  userName: "kpm.currentUserName",
  permissions: "kpm.currentPermissions",
  roles: "kpm.currentRoles",
} as const;

type QueryValue = string | number | boolean | Array<string | number | boolean> | null | undefined;

function queryString(params: Record<string, QueryValue>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.filter((item) => item !== "").forEach((item) => search.append(key, String(item)));
      return;
    }
    search.set(key, String(value));
  });
  const text = search.toString();
  return text ? `?${text}` : "";
}

export const kpmApi = {
  login: (account: string, password: string) =>
    api.post<LoginResponse>("/api/iam/login", { account, password }),
  me: () => api.get<LoginResponse["user"]>("/api/iam/me"),
  changePassword: (body: AnyRecord) =>
    api.post<boolean>("/api/iam/change-password", body),

  bootstrap: () => api.get<BootstrapData>("/api/resources/bootstrap"),
  dashboard: () => api.get<DashboardStats>("/api/analytics/dashboard"),
  projects: (params = "") => api.get<Project[]>(`/api/projects${params}`),
  projectsPage: (params: Record<string, QueryValue> = {}) =>
    api.get<PageResult<Project>>(`/api/projects/page${queryString(params)}`),
  project: (id: string) => api.get<Project>(`/api/projects/${id}`),
  createProject: (body: AnyRecord) => api.post<Project>("/api/projects", body),
  updateProject: (id: string, body: AnyRecord) =>
    api.put<Project>(`/api/projects/${id}`, body),
  deleteProject: (id: string) => api.delete<boolean>(`/api/projects/${id}`),
  archiveProject: (id: string, archived: boolean) =>
    api.post<Project>(`/api/projects/${id}/archive`, { archived }),
  replaceProjectMembers: (id: string, members: AnyRecord[]) =>
    api.put<Project>(`/api/projects/${id}/members`, { members }),
  updateStage: (stageId: string, body: AnyRecord) =>
    api.put<AnyRecord>(`/api/projects/stages/${stageId}`, body),
  replaceStageAssignees: (stageId: string, body: AnyRecord) =>
    api.put<AnyRecord>(`/api/projects/stages/${stageId}/assignees`, body),
  addStageRecord: (stageId: string, body: AnyRecord) =>
    api.post<AnyRecord>(`/api/projects/stages/${stageId}/records`, body),
  addStageMaterial: (stageId: string, body: AnyRecord) =>
    api.post<AnyRecord>(`/api/projects/stages/${stageId}/materials`, body),
  publishStageMaterial: (materialId: string) =>
    api.post<AnyRecord>(
      `/api/projects/stage-materials/${materialId}/publish`,
      {},
    ),
  addProjectMaterial: (projectId: string, body: AnyRecord) =>
    api.post<Project>(`/api/projects/${projectId}/materials`, body),
  publishProjectMaterialToCustomer: (projectId: string, materialId: string) =>
    api.post<Project>(
      `/api/projects/${projectId}/materials/${materialId}/public`,
      {},
    ),
  retractProjectMaterialFromCustomer: (projectId: string, materialId: string) =>
    api.post<Project>(
      `/api/projects/${projectId}/materials/${materialId}/retract`,
      {},
    ),
  deleteProjectMaterial: (projectId: string, materialId: string) =>
    api.delete<Project>(`/api/projects/${projectId}/materials/${materialId}`),
  publishProjectAnnouncement: (projectId: string, body: AnyRecord) =>
    api.post<Project>(`/api/projects/${projectId}/announcements`, body),
  retractProjectAnnouncement: (projectId: string, announcementId: string) =>
    api.post<Project>(
      `/api/projects/${projectId}/announcements/${announcementId}/retract`,
      {},
    ),
  projectSkus: (id: string) => api.get<AnyRecord[]>(`/api/projects/${id}/skus`),
  createProjectSku: (id: string, body: AnyRecord) =>
    api.post<AnyRecord>(`/api/projects/${id}/skus`, body),
  updateProjectSku: (id: string, skuId: string, body: AnyRecord) =>
    api.put<AnyRecord>(`/api/projects/${id}/skus/${skuId}`, body),
  deleteProjectSku: (id: string, skuId: string) =>
    api.delete<boolean>(`/api/projects/${id}/skus/${skuId}`),
  linkProjectCustomer: (projectId: string, body: AnyRecord) =>
    api.post<AnyRecord>(`/api/projects/${projectId}/customers`, body),
  updateProjectCustomerStatus: (
    projectId: string,
    customerId: string,
    body: AnyRecord,
  ) =>
    api.put<AnyRecord>(
      `/api/projects/${projectId}/customers/${customerId}`,
      body,
    ),
  requirementOverview: (id: string) =>
    api.get<AnyRecord[]>(`/api/projects/${id}/requirements-overview`),
  createRequirement: (projectId: string, customerId: string, body: AnyRecord) =>
    api.post<AnyRecord>(
      `/api/projects/${projectId}/customers/${customerId}/requirements`,
      body,
    ),
  voidRequirement: (id: string) =>
    api.post<AnyRecord>(`/api/projects/requirements/${id}/void`, {}),
  deleteRequirement: (id: string) =>
    api.delete<boolean>(`/api/projects/requirements/${id}`),
  templates: () => api.get<AnyRecord[]>("/api/projects/templates"),
  createTemplate: (body: AnyRecord) =>
    api.post<AnyRecord>("/api/projects/templates", body),
  updateTemplate: (id: string, body: AnyRecord) =>
    api.put<AnyRecord>(`/api/projects/templates/${id}`, body),
  deleteTemplate: (id: string) =>
    api.delete<boolean>(`/api/projects/templates/${id}`),

  customers: () => api.get<Customer[]>("/api/customers"),
  customersPage: (params: Record<string, QueryValue> = {}) =>
    api.get<PageResult<Customer>>(`/api/customers/page${queryString(params)}`),
  customer: (id: string) => api.get<Customer>(`/api/customers/${id}`),
  createCustomer: (body: AnyRecord) =>
    api.post<Customer>("/api/customers", body),
  updateCustomer: (id: string, body: AnyRecord) =>
    api.put<Customer>(`/api/customers/${id}`, body),
  deleteCustomer: (id: string) => api.delete<boolean>(`/api/customers/${id}`),
  addCustomerContact: (id: string, body: AnyRecord) =>
    api.post<AnyRecord>(`/api/customers/${id}/contacts`, body),
  addCustomerFollowup: (id: string, body: AnyRecord) =>
    api.post<AnyRecord>(`/api/customers/${id}/followups`, body),
  addCustomerMaterial: (id: string, body: AnyRecord) =>
    api.post<AnyRecord>(`/api/customers/${id}/materials`, body),
  sendCustomerNotification: (id: string, body: AnyRecord) =>
    api.post<AnyRecord>(`/api/customers/${id}/notifications`, body),

  knowledgePage: (params: Record<string, QueryValue> = {}) =>
    api.get<PageResult<KnowledgeArticle>>(`/api/knowledge/page${queryString(params)}`),
  knowledgeArticle: (id: string) =>
    api.get<KnowledgeArticle>(`/api/knowledge/${id}`),
  createKnowledgeArticle: (body: AnyRecord) =>
    api.post<KnowledgeArticle>("/api/knowledge", body),
  updateKnowledgeArticle: (id: string, body: AnyRecord) =>
    api.put<KnowledgeArticle>(`/api/knowledge/${id}`, body),
  updateKnowledgeArticleStatus: (id: string, status: string) =>
    api.post<KnowledgeArticle>(`/api/knowledge/${id}/status`, { status }),
  deleteKnowledgeArticle: (id: string) =>
    api.delete<boolean>(`/api/knowledge/${id}`),

  tasks: () => api.get<Task[]>("/api/tasks"),
  tasksPage: (params: Record<string, QueryValue> = {}) =>
    api.get<PageResult<Task>>(`/api/tasks/page${queryString(params)}`),
  task: (id: string) => api.get<Task>(`/api/tasks/${id}`),
  createTask: (body: AnyRecord) => api.post<Task>("/api/tasks", body),
  updateTask: (id: string, body: AnyRecord) =>
    api.put<Task>(`/api/tasks/${id}`, body),
  deleteTask: (id: string) => api.delete<boolean>(`/api/tasks/${id}`),
  taskCommentsPage: (id: string, params: Record<string, QueryValue> = {}) =>
    api.get<PageResult<AnyRecord>>(
      `/api/tasks/${id}/comments/page${queryString(params)}`,
    ),
  addTaskComment: (id: string, body: AnyRecord) =>
    api.post<Task>(`/api/tasks/${id}/comments`, body),
  addTaskAttachment: (id: string, body: AnyRecord) =>
    api.post<Task>(`/api/tasks/${id}/attachments`, body),
  deleteTaskAttachment: (id: string, attachmentId: string) =>
    api.delete<Task>(`/api/tasks/${id}/attachments/${attachmentId}`),

  orders: () => api.get<Order[]>("/api/orders"),
  ordersPage: (params: Record<string, QueryValue> = {}) =>
    api.get<PageResult<Order>>(`/api/orders/page${queryString(params)}`),
  order: (id: string) => api.get<Order>(`/api/orders/${id}`),
  createOrder: (body: AnyRecord) => api.post<Order>("/api/orders", body),
  updateOrder: (id: string, body: AnyRecord) =>
    api.put<Order>(`/api/orders/${id}`, body),
  deleteOrder: (id: string) => api.delete<boolean>(`/api/orders/${id}`),

  orderStats: (targetCurrency = "USD") =>
    api.get<AnyRecord[]>(
      `/api/analytics/orders?targetCurrency=${encodeURIComponent(targetCurrency)}`,
    ),
  resourceMap: () => api.get<AnyRecord[]>("/api/analytics/resource-map"),
  supportStats: (customerId?: string) =>
    api.get<AnyRecord[]>(
      `/api/analytics/support${customerId ? `?customerId=${encodeURIComponent(customerId)}` : ""}`,
    ),
  activity: () => api.get<AnyRecord[]>("/api/analytics/activity"),

  uploadFile: (
    file: File,
    category: string,
    businessId: string,
    uploader: string,
  ) => {
    const body = new FormData();
    body.append("file", file);
    body.append("category", category);
    body.append("businessId", businessId);
    body.append("uploader", uploader);
    return api.postForm<AnyRecord>("/api/files/upload", body);
  },
  downloadUrl: (objectKey: string, fileName?: string) =>
    api.get<AnyRecord>(
      `/api/files/download-url?objectKey=${encodeURIComponent(objectKey)}${fileName ? `&fileName=${encodeURIComponent(fileName)}` : ""}`,
    ),

  users: () => api.get<AnyRecord[]>("/api/resources/users"),
  createUser: (body: AnyRecord) =>
    api.post<AnyRecord>("/api/resources/users", body),
  updateUser: (id: string, body: AnyRecord) =>
    api.put<AnyRecord>(`/api/resources/users/${id}`, body),
  deleteUser: (id: string) => api.delete<boolean>(`/api/resources/users/${id}`),
  resetUserPassword: (id: string) =>
    api.post<AnyRecord>(`/api/resources/users/${id}/reset-password`, {}),
  createDepartment: (body: AnyRecord) =>
    api.post<AnyRecord>("/api/resources/departments", body),
  updateDepartment: (id: string, body: AnyRecord) =>
    api.put<AnyRecord>(`/api/resources/departments/${id}`, body),
  deleteDepartment: (id: string) =>
    api.delete<boolean>(`/api/resources/departments/${id}`),
  createRole: (body: AnyRecord) =>
    api.post<AnyRecord>("/api/resources/roles", body),
  updateRole: (id: string, body: AnyRecord) =>
    api.put<AnyRecord>(`/api/resources/roles/${id}`, body),
  deleteRole: (id: string) => api.delete<boolean>(`/api/resources/roles/${id}`),
  createEnum: (body: AnyRecord) =>
    api.post<AnyRecord>("/api/resources/enums", body),
  updateEnum: (id: string, body: AnyRecord) =>
    api.put<AnyRecord>(`/api/resources/enums/${id}`, body),
  deleteEnum: (id: string) => api.delete<boolean>(`/api/resources/enums/${id}`),
  createTaskStatusTransition: (body: AnyRecord) =>
    api.post<AnyRecord>("/api/resources/task-status-transitions", body),
  deleteTaskStatusTransition: (id: string) =>
    api.delete<boolean>(`/api/resources/task-status-transitions/${id}`),

  notifications: () => api.get<AnyRecord[]>("/api/notifications/messages"),
  notificationsPage: (params: Record<string, QueryValue> = {}) =>
    api.get<PageResult<AnyRecord>>(
      `/api/notifications/messages/page${queryString(params)}`,
    ),
  unreadCount: () =>
    api.get<{ count: number }>("/api/notifications/unread-count"),
  markMessageRead: (id: string) =>
    api.post<AnyRecord>(`/api/notifications/messages/${id}/read`, {}),
  markAllRead: () =>
    api.post<AnyRecord>("/api/notifications/messages/read-all", {}),
};

export async function loadAppData(): Promise<AppData> {
  const [
    bootstrap,
    dashboard,
    projects,
    customers,
    tasks,
    orders,
    templates,
    orderStats,
    resourceMap,
    supportStats,
    activity,
  ] = await Promise.all([
    kpmApi.bootstrap(),
    kpmApi.dashboard(),
    kpmApi.projectsPage({ page: 1, pageSize: 50 }),
    kpmApi.customersPage({ page: 1, pageSize: 100 }),
    kpmApi.tasksPage({ page: 1, pageSize: 20 }),
    kpmApi.ordersPage({ page: 1, pageSize: 20 }),
    kpmApi.templates(),
    kpmApi.orderStats(),
    kpmApi.resourceMap(),
    kpmApi.supportStats(),
    kpmApi.activity(),
  ]);
  return {
    bootstrap,
    dashboard,
    projects: projects.items,
    customers: customers.items,
    tasks: tasks.items,
    orders: orders.items,
    templates,
    orderStats,
    resourceMap,
    supportStats,
    activity,
  };
}
