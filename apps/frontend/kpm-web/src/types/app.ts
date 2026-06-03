export type AnyRecord = Record<string, unknown>;

export type BootstrapData = {
  users: AnyRecord[];
  departments: AnyRecord[];
  roles: AnyRecord[];
  permissions: AnyRecord[];
  enumItems: AnyRecord[];
  taskStatusTransitions: AnyRecord[];
};

export type AppData = {
  bootstrap: BootstrapData;
  projects: AnyRecord[];
  customers: AnyRecord[];
  tasks: AnyRecord[];
  orders: AnyRecord[];
  dashboard: AnyRecord;
  orderStats: AnyRecord[];
  resourceMap: AnyRecord[];
  supportStats: AnyRecord[];
  activity: AnyRecord[];
};
