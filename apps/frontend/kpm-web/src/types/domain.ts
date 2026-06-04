export type Id = string;
export type AnyRecord = Record<string, any>;

export type User = {
  id: Id;
  account: string;
  email?: string;
  name: string;
  status?: string;
  departments?: string[];
  globalRoles?: string[];
  directPermissions?: string[];
  permissions?: string[];
  roles?: string[];
};

export type Department = { id: Id; name: string; status?: string; description?: string; active?: boolean; userCount?: number };
export type Role = { id: Id; name: string; roleType?: string; status?: string; description?: string; permissions?: string[]; active?: boolean; userCount?: number };
export type Permission = { id?: string; key?: string; code?: string; name: string; type?: string; permissionType?: string; target?: string; location?: string };
export type EnumItem = { id: Id; enumType: string; name?: string; value: string; semantic?: string; active?: boolean; sortOrder?: number };
export type TaskStatusTransition = { id: Id; fromStatus: string; toStatus: string };

export type BootstrapData = {
  users: User[];
  departments: Department[];
  roles: Role[];
  permissions: Permission[];
  enumItems: EnumItem[];
  taskStatusTransitions: TaskStatusTransition[];
};

export type ProjectMember = { userAccount?: string; account?: string; name?: string; roleName?: string; role?: string; userId?: string };
export type ProjectSku = { id: Id; projectId?: string; wholeMachinePartNumber: string; configurationName: string; memoryType: string; active?: boolean };
export type ProjectStage = {
  id: Id;
  projectId?: string;
  name: string;
  status?: string;
  expectedDays?: number;
  assignees?: AnyRecord[];
  materials?: AnyRecord[];
  records?: AnyRecord[];
};
export type ProjectCustomer = {
  customerId: Id;
  customerName?: string;
  name?: string;
  region?: string;
  projectStatus?: string;
  projectName?: string;
  externalName?: string;
  requirements?: Requirement[];
};
export type Requirement = { id: Id; title: string; status?: string; priority?: string; customerName?: string; userStory?: string; businessValue?: string; acceptance?: string; taskId?: string };
export type Project = {
  id: Id;
  externalName: string;
  internalName?: string;
  modelName?: string;
  managerAccount?: string;
  managerName?: string;
  managerUserId?: string;
  description?: string;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  members?: ProjectMember[];
  stages?: ProjectStage[];
  skus?: ProjectSku[];
  projectCustomers?: ProjectCustomer[];
  requirements?: Requirement[];
  materials?: AnyRecord[];
};

export type Customer = {
  id: Id;
  name: string;
  shortName?: string;
  region?: string;
  address?: string;
  level?: string;
  status?: string;
  salesOwners?: string[];
  supportOwners?: string[];
  contacts?: AnyRecord[];
  followups?: AnyRecord[];
  materials?: AnyRecord[];
  projects?: AnyRecord[];
};

export type Task = {
  id: Id;
  taskNo?: string;
  title: string;
  description?: string;
  projectId?: string;
  stageId?: string;
  customerId?: string;
  projectName?: string;
  stageName?: string;
  customerName?: string;
  category?: string;
  status?: string;
  priority?: string;
  creator?: string;
  createdAt?: string;
  updatedAt?: string;
  expectedCompletionAt?: string;
  dueDate?: string;
  source?: string;
  blocked?: boolean;
  creatorUserId?: string;
  assignees?: string[];
  assigneeIds?: string[];
  participants?: string[];
  participantIds?: string[];
  attachments?: AnyRecord[];
  comments?: AnyRecord[];
};

export type Order = {
  id: Id;
  orderDate?: string;
  customerId?: string;
  customerName?: string;
  projectId?: string;
  projectName?: string;
  skuId?: string;
  skuSnapshot?: any;
  orderType?: string;
  type?: string;
  status?: string;
  quantity?: number;
  specification?: string;
  expectedShipDate?: string;
  plannedShipDate?: string;
  actualShipDate?: string;
  softwareVersion?: string;
  currency?: string;
  unitPrice?: number;
  amount?: number;
  creator?: string;
  wholeMachinePartNumber?: string;
  configurationName?: string;
  memoryType?: string;
  histories?: AnyRecord[];
};

export type DashboardStats = { projectCount?: number; activeProjectCount?: number; customerCount?: number; openTaskCount?: number; [key: string]: any };

export type AppData = {
  bootstrap: BootstrapData;
  projects: Project[];
  customers: Customer[];
  tasks: Task[];
  orders: Order[];
  dashboard: DashboardStats;
  templates: AnyRecord[];
  orderStats: AnyRecord[];
  resourceMap: AnyRecord[];
  supportStats: AnyRecord[];
  activity: AnyRecord[];
};

export type LoginResponse = {
  token: string;
  tokenType?: string;
  expiresIn?: number;
  user: User;
};
