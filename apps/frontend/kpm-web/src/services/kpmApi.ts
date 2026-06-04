import { api } from '../api';
import type { AnyRecord, AppData, BootstrapData, Customer, DashboardStats, LoginResponse, Order, Project, Task } from '../types';

export const storageKeys = {
  token: 'kpm.authToken',
  account: 'kpm.currentAccount',
  userName: 'kpm.currentUserName',
  permissions: 'kpm.currentPermissions',
  roles: 'kpm.currentRoles',
} as const;

export const kpmApi = {
  login: (account: string, password: string) => api.post<LoginResponse>('/api/iam/login', { account, password }),
  me: () => api.get<LoginResponse['user']>('/api/iam/me'),
  changePassword: (body: AnyRecord) => api.post<boolean>('/api/iam/change-password', body),

  bootstrap: () => api.get<BootstrapData>('/api/resources/bootstrap'),
  dashboard: () => api.get<DashboardStats>('/api/analytics/dashboard'),
  projects: (params = '') => api.get<Project[]>(`/api/projects${params}`),
  project: (id: string) => api.get<Project>(`/api/projects/${id}`),
  createProject: (body: AnyRecord) => api.post<Project>('/api/projects', body),
  updateProject: (id: string, body: AnyRecord) => api.put<Project>(`/api/projects/${id}`, body),
  deleteProject: (id: string) => api.delete<boolean>(`/api/projects/${id}`),
  archiveProject: (id: string, archived: boolean) => api.post<Project>(`/api/projects/${id}/archive`, { archived }),
  replaceProjectMembers: (id: string, members: AnyRecord[]) => api.put<Project>(`/api/projects/${id}/members`, { members }),
  updateStage: (stageId: string, body: AnyRecord) => api.put<AnyRecord>(`/api/projects/stages/${stageId}`, body),
  replaceStageAssignees: (stageId: string, body: AnyRecord) => api.put<AnyRecord>(`/api/projects/stages/${stageId}/assignees`, body),
  addStageRecord: (stageId: string, body: AnyRecord) => api.post<AnyRecord>(`/api/projects/stages/${stageId}/records`, body),
  addStageMaterial: (stageId: string, body: AnyRecord) => api.post<AnyRecord>(`/api/projects/stages/${stageId}/materials`, body),
  publishStageMaterial: (materialId: string) => api.post<AnyRecord>(`/api/projects/stage-materials/${materialId}/publish`, {}),
  projectSkus: (id: string) => api.get<AnyRecord[]>(`/api/projects/${id}/skus`),
  createProjectSku: (id: string, body: AnyRecord) => api.post<AnyRecord>(`/api/projects/${id}/skus`, body),
  updateProjectSku: (id: string, skuId: string, body: AnyRecord) => api.put<AnyRecord>(`/api/projects/${id}/skus/${skuId}`, body),
  deleteProjectSku: (id: string, skuId: string) => api.delete<boolean>(`/api/projects/${id}/skus/${skuId}`),
  linkProjectCustomer: (projectId: string, body: AnyRecord) => api.post<AnyRecord>(`/api/projects/${projectId}/customers`, body),
  updateProjectCustomerStatus: (projectId: string, customerId: string, body: AnyRecord) => api.put<AnyRecord>(`/api/projects/${projectId}/customers/${customerId}`, body),
  requirementOverview: (id: string) => api.get<AnyRecord[]>(`/api/projects/${id}/requirements-overview`),
  createRequirement: (projectId: string, customerId: string, body: AnyRecord) => api.post<AnyRecord>(`/api/projects/${projectId}/customers/${customerId}/requirements`, body),
  voidRequirement: (id: string) => api.post<AnyRecord>(`/api/projects/requirements/${id}/void`, {}),
  deleteRequirement: (id: string) => api.delete<boolean>(`/api/projects/requirements/${id}`),
  templates: () => api.get<AnyRecord[]>('/api/projects/templates'),
  createTemplate: (body: AnyRecord) => api.post<AnyRecord>('/api/projects/templates', body),
  updateTemplate: (id: string, body: AnyRecord) => api.put<AnyRecord>(`/api/projects/templates/${id}`, body),
  deleteTemplate: (id: string) => api.delete<boolean>(`/api/projects/templates/${id}`),

  customers: () => api.get<Customer[]>('/api/customers'),
  customer: (id: string) => api.get<Customer>(`/api/customers/${id}`),
  createCustomer: (body: AnyRecord) => api.post<Customer>('/api/customers', body),
  updateCustomer: (id: string, body: AnyRecord) => api.put<Customer>(`/api/customers/${id}`, body),
  deleteCustomer: (id: string) => api.delete<boolean>(`/api/customers/${id}`),
  addCustomerContact: (id: string, body: AnyRecord) => api.post<AnyRecord>(`/api/customers/${id}/contacts`, body),
  addCustomerFollowup: (id: string, body: AnyRecord) => api.post<AnyRecord>(`/api/customers/${id}/followups`, body),
  addCustomerMaterial: (id: string, body: AnyRecord) => api.post<AnyRecord>(`/api/customers/${id}/materials`, body),

  tasks: () => api.get<Task[]>('/api/tasks'),
  task: (id: string) => api.get<Task>(`/api/tasks/${id}`),
  createTask: (body: AnyRecord) => api.post<Task>('/api/tasks', body),
  updateTask: (id: string, body: AnyRecord) => api.put<Task>(`/api/tasks/${id}`, body),
  deleteTask: (id: string) => api.delete<boolean>(`/api/tasks/${id}`),
  addTaskComment: (id: string, body: AnyRecord) => api.post<Task>(`/api/tasks/${id}/comments`, body),
  addTaskAttachment: (id: string, body: AnyRecord) => api.post<Task>(`/api/tasks/${id}/attachments`, body),
  deleteTaskAttachment: (id: string, attachmentId: string) => api.delete<Task>(`/api/tasks/${id}/attachments/${attachmentId}`),

  orders: () => api.get<Order[]>('/api/orders'),
  order: (id: string) => api.get<Order>(`/api/orders/${id}`),
  createOrder: (body: AnyRecord) => api.post<Order>('/api/orders', body),
  updateOrder: (id: string, body: AnyRecord) => api.put<Order>(`/api/orders/${id}`, body),
  deleteOrder: (id: string) => api.delete<boolean>(`/api/orders/${id}`),

  orderStats: (targetCurrency = 'USD') => api.get<AnyRecord[]>(`/api/analytics/orders?targetCurrency=${encodeURIComponent(targetCurrency)}`),
  resourceMap: () => api.get<AnyRecord[]>('/api/analytics/resource-map'),
  supportStats: (customerId?: string) => api.get<AnyRecord[]>(`/api/analytics/support${customerId ? `?customerId=${encodeURIComponent(customerId)}` : ''}`),
  activity: () => api.get<AnyRecord[]>('/api/analytics/activity'),

  uploadFile: (file: File, category: string, businessId: string, uploader: string) => {
    const body = new FormData();
    body.append('file', file);
    body.append('category', category);
    body.append('businessId', businessId);
    body.append('uploader', uploader);
    return api.postForm<AnyRecord>('/api/files/upload', body);
  },
  downloadUrl: (objectKey: string, fileName?: string) => api.get<AnyRecord>(`/api/files/download-url?objectKey=${encodeURIComponent(objectKey)}${fileName ? `&fileName=${encodeURIComponent(fileName)}` : ''}`),

  users: () => api.get<AnyRecord[]>('/api/resources/users'),
  createUser: (body: AnyRecord) => api.post<AnyRecord>('/api/resources/users', body),
  updateUser: (id: string, body: AnyRecord) => api.put<AnyRecord>(`/api/resources/users/${id}`, body),
  deleteUser: (id: string) => api.delete<boolean>(`/api/resources/users/${id}`),
  resetUserPassword: (id: string) => api.post<AnyRecord>(`/api/resources/users/${id}/reset-password`, {}),
  createDepartment: (body: AnyRecord) => api.post<AnyRecord>('/api/resources/departments', body),
  updateDepartment: (id: string, body: AnyRecord) => api.put<AnyRecord>(`/api/resources/departments/${id}`, body),
  deleteDepartment: (id: string) => api.delete<boolean>(`/api/resources/departments/${id}`),
  createRole: (body: AnyRecord) => api.post<AnyRecord>('/api/resources/roles', body),
  updateRole: (id: string, body: AnyRecord) => api.put<AnyRecord>(`/api/resources/roles/${id}`, body),
  deleteRole: (id: string) => api.delete<boolean>(`/api/resources/roles/${id}`),
  createEnum: (body: AnyRecord) => api.post<AnyRecord>('/api/resources/enums', body),
  updateEnum: (id: string, body: AnyRecord) => api.put<AnyRecord>(`/api/resources/enums/${id}`, body),
  deleteEnum: (id: string) => api.delete<boolean>(`/api/resources/enums/${id}`),
  createTaskStatusTransition: (body: AnyRecord) => api.post<AnyRecord>('/api/resources/task-status-transitions', body),
  deleteTaskStatusTransition: (id: string) => api.delete<boolean>(`/api/resources/task-status-transitions/${id}`),

  notifications: () => api.get<AnyRecord[]>('/api/notifications/messages'),
  unreadCount: () => api.get<{ count: number }>('/api/notifications/unread-count'),
  markMessageRead: (id: string) => api.post<AnyRecord>(`/api/notifications/messages/${id}/read`, {}),
  markAllRead: () => api.post<AnyRecord>('/api/notifications/messages/read-all', {}),
};

export async function loadAppData(): Promise<AppData> {
  const [bootstrap, dashboard, projects, customers, tasks, orders, templates, orderStats, resourceMap, supportStats, activity] = await Promise.all([
    kpmApi.bootstrap(),
    kpmApi.dashboard(),
    kpmApi.projects(),
    kpmApi.customers(),
    kpmApi.tasks(),
    kpmApi.orders(),
    kpmApi.templates(),
    kpmApi.orderStats(),
    kpmApi.resourceMap(),
    kpmApi.supportStats(),
    kpmApi.activity(),
  ]);
  return { bootstrap, dashboard, projects, customers, tasks, orders, templates, orderStats, resourceMap, supportStats, activity };
}
