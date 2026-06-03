const projects = [
  {
    id: 'p8-dual',
    externalName: 'P8 dual',
    internalName: 'R2351',
    modelName: 'K1352',
    managerAccount: 'wangwei',
    status: '进行中',
    archived: false,
    salesability: '不可销售',
    unsellableReason: '仍处于设计或测试阶段',
    description: '面向海外市场的双屏 POS 设备。',
    members: [
      { userAccount: 'wangwei', role: '硬件项目经理' },
      { userAccount: 'lina', role: '软件项目经理' },
      { userAccount: 'chenchen', role: '技术支持' },
      { userAccount: 'zhaolei', role: '销售' },
    ],
    stages: [
      { name: '提出想法', assignees: [{ type: 'department', name: '销售部' }, { type: 'department', name: '产品部' }], status: '已完成' },
      { name: '讨论可行性', assignees: [{ type: 'department', name: '产品部' }], status: '已完成' },
      { name: '核算成本', assignees: [{ type: 'department', name: '运营部' }], status: '已完成' },
      { name: '硬件设计', assignees: [{ type: 'user', account: 'wangwei' }, { type: 'department', name: '硬件部' }], status: '已完成' },
      { name: '软件适配', assignees: [{ type: 'user', account: 'lina' }, { type: 'department', name: '软件部' }], status: '进行中' },
      { name: '测试生产', assignees: [{ type: 'department', name: '测试部' }, { type: 'department', name: '车间' }], status: '未开始' },
      { name: '试用', assignees: [{ type: 'department', name: '技术支持部' }], status: '未开始' },
      { name: '客户推广', assignees: [{ type: 'department', name: '销售部' }, { type: 'department', name: '技术支持部' }], status: '未开始' },
    ],
    projectCustomers: [
      { customerName: 'Nova Retail', region: '德国', projectStatus: '商机发掘', requirements: [
        { id: 'REQ-001', title: '支持多语言收据模板', userStory: '作为门店经理，我希望根据国家切换收据语言，以便服务当地客户。', value: '减少前台人工解释成本', acceptance: '可选择至少中英两种语言模板；打印内容正确', priority: '高', status: '待评估', proposer: 'Nova Retail', creator: '赵磊', date: '2026-05-05', taskId: '' },
        { id: 'REQ-002', title: '远程批量升级', userStory: '作为运维人员，我希望批量升级设备，以便降低门店维护成本。', value: '减少现场维护次数', acceptance: '可对指定设备组批量下发升级任务', priority: '高', status: '已采纳', proposer: 'Nova Retail', creator: '赵磊', date: '2026-05-07', taskId: '' },
      ] },
      { customerName: 'Siam Pay', region: '泰国', projectStatus: '样机测试', requirements: [
        { id: 'REQ-003', title: '支持多语言收据模板', userStory: '作为区域运营，我希望为不同国家设置收据语言，以便统一服务体验。', value: '降低培训复杂度', acceptance: '支持按国家配置语言模板', priority: '中', status: '待评估', proposer: 'Siam Pay', creator: '高静', date: '2026-05-08', taskId: '' },
        { id: 'REQ-004', title: '低电量提醒', userStory: '作为店员，我希望设备在低电量时提醒，以避免交易中断。', value: '减少交易失败', acceptance: '低于 20% 电量时提醒', priority: '中', status: '待评估', proposer: 'Siam Pay', creator: '高静', date: '2026-05-09', taskId: '' },
      ] },
      { customerName: 'Pacific Mart', region: '菲律宾', projectStatus: '样机测试', requirements: [] },
    ],
    projectMaterials: [
      { name: '硬件接口说明_v2.pdf', sourceStage: '硬件设计', shareTarget: '项目资料区', publishedAt: '2026-05-10 11:00' },
    ],
  },
  {
    id: 's6-mini',
    externalName: 'S6 mini',
    internalName: 'R2290',
    modelName: 'K1290',
    managerAccount: 'zhouhang',
    status: '进行中',
    archived: false,
    salesability: '不可销售',
    unsellableReason: '仍处于设计或测试阶段',
    description: '轻量级移动收银终端。',
    members: [
      { userAccount: 'zhouhang', role: '硬件项目经理' },
      { userAccount: 'sunqian', role: '软件项目经理' },
    ],
    stages: [
      { name: '提出想法', assignees: [{ type: 'department', name: '销售部' }, { type: 'department', name: '产品部' }], status: '已完成' },
      { name: '讨论可行性', assignees: [{ type: 'department', name: '产品部' }], status: '已完成' },
      { name: '核算成本', assignees: [{ type: 'department', name: '运营部' }], status: '进行中' },
      { name: '硬件设计', assignees: [{ type: 'department', name: '硬件部' }], status: '未开始' },
      { name: '测试生产', assignees: [{ type: 'department', name: '测试部' }, { type: 'department', name: '车间' }], status: '未开始' },
    ],
    projectCustomers: [
      { customerName: 'Nova Retail', region: '德国', projectStatus: '样机测试', requirements: [] },
    ],
    projectMaterials: [],
  },
  {
    id: 'x10-pro',
    externalName: 'X10 Pro',
    internalName: 'R2410',
    modelName: 'K1410',
    managerAccount: 'liuyang',
    status: '已完成',
    archived: true,
    salesability: '不可销售',
    unsellableReason: '产品过老，不再继续推广',
    description: '高端桌面式 POS 设备。',
    members: [
      { userAccount: 'liuyang', role: '硬件项目经理' },
      { userAccount: 'gaojing', role: '销售' },
    ],
    stages: [
      { name: '提出想法', assignees: [{ type: 'department', name: '销售部' }, { type: 'department', name: '产品部' }], status: '已完成' },
      { name: '讨论可行性', assignees: [{ type: 'department', name: '产品部' }], status: '已完成' },
      { name: '核算成本', assignees: [{ type: 'department', name: '运营部' }], status: '已完成' },
      { name: '硬件设计', assignees: [{ type: 'department', name: '硬件部' }], status: '已完成' },
      { name: '软件适配', assignees: [{ type: 'department', name: '软件部' }], status: '已完成' },
      { name: '测试生产', assignees: [{ type: 'department', name: '测试部' }], status: '已完成' },
      { name: '试用', assignees: [{ type: 'department', name: '技术支持部' }], status: '已完成' },
      { name: '客户推广', assignees: [{ type: 'department', name: '销售部' }], status: '已完成' },
    ],
    projectCustomers: [
      { customerName: 'Nova Retail', region: '德国', projectStatus: 'EOL', requirements: [] },
    ],
    projectMaterials: [],
  },
  {
    id: 'm5-plus',
    externalName: 'M5 Plus',
    internalName: 'R2510',
    modelName: 'K1510',
    managerAccount: 'hejing',
    status: '进行中',
    archived: false,
    salesability: '可销售',
    unsellableReason: '',
    description: '已完成设计测试并进入客户推广的移动 POS。',
    members: [
      { userAccount: 'hejing', role: '硬件项目经理' },
      { userAccount: 'wuyue', role: '销售' },
    ],
    stages: [
      { name: '硬件设计', assignees: [{ type: 'department', name: '硬件部' }], status: '已完成' },
      { name: '软件适配', assignees: [{ type: 'department', name: '软件部' }], status: '已完成' },
      { name: '测试生产', assignees: [{ type: 'department', name: '测试部' }], status: '已完成' },
      { name: '客户推广', assignees: [{ type: 'department', name: '销售部' }], status: '进行中' },
    ],
    projectCustomers: [],
    projectMaterials: [],
  },
];

const templates = [
  {
    name: '标准 POS 产品流程',
    scope: '通用',
    status: '启用',
    updatedAt: '2026-05-15',
    stages: ['提出想法', '讨论可行性', '核算成本', '硬件设计', '软件适配', '测试生产', '试用', '客户推广'],
  },
  {
    name: '海外定制产品流程',
    scope: '海外项目',
    status: '草稿',
    updatedAt: '2026-05-15',
    stages: ['提出想法', '讨论可行性', '硬件设计', '软件适配', '客户调试', '客户下单'],
  },
];

const resourceData = {
  users: [
    { name: '张敏', account: 'admin@kozenmobile.com', departments: ['产品部', '运营部'], globalRoles: ['系统管理员'], directPermissions: ['button:customer-statuses:toggle'], status: '启用' },
    { name: '王伟', account: 'wangwei', departments: ['硬件部', '产品部'], globalRoles: ['普通员工'], directPermissions: [], status: '启用' },
    { name: '李娜', account: 'lina', departments: ['软件部'], globalRoles: ['普通员工'], directPermissions: [], status: '启用' },
    { name: '陈晨', account: 'chenchen', departments: ['技术支持部'], globalRoles: ['普通员工'], directPermissions: ['button:customers:create', 'button:customers:edit'], status: '启用' },
    { name: '赵磊', account: 'zhaolei', departments: ['销售部'], globalRoles: ['普通员工'], directPermissions: [], status: '启用' },
    { name: '高静', account: 'gaojing', departments: ['销售部'], globalRoles: ['普通员工'], directPermissions: [], status: '启用' },
    { name: '周航', account: 'zhouhang', departments: ['硬件部'], globalRoles: ['普通员工'], directPermissions: [], status: '启用' },
    { name: '孙倩', account: 'sunqian', departments: ['软件部'], globalRoles: ['普通员工'], directPermissions: [], status: '启用' },
    { name: '刘洋', account: 'liuyang', departments: ['硬件部'], globalRoles: ['普通员工'], directPermissions: [], status: '启用' },
    { name: '何静', account: 'hejing', departments: ['硬件部'], globalRoles: ['普通员工'], directPermissions: [], status: '启用' },
    { name: '吴越', account: 'wuyue', departments: ['销售部'], globalRoles: ['普通员工'], directPermissions: [], status: '启用' },
  ],
  departments: [
    { name: '产品部', parent: '-' },
    { name: '硬件部', parent: '-' },
    { name: '软件部', parent: '-' },
    { name: '技术支持部', parent: '-' },
    { name: '销售部', parent: '-' },
    { name: '运营部', parent: '-' },
    { name: '测试部', parent: '-' },
    { name: '车间', parent: '-' },
  ],
  roles: [
    { name: '系统管理员', type: '全局角色', permissions: ['menu:dashboard', 'menu:templates', 'menu:resources', 'menu:customer-master', 'menu:orders', 'menu:analytics', 'button:templates:create', 'button:templates:edit', 'button:templates:toggle', 'button:projects:delete', 'button:project-detail:delete', 'button:customers:create', 'button:customers:edit', 'button:customers:delete', 'button:customers:view-detail', 'button:customer-detail:add-contact', 'button:customer-detail:upload-material', 'button:customer-detail:add-followup', 'button:customer-detail:create-order', 'button:orders:create', 'button:orders:edit', 'button:orders:delete', 'button:customer-statuses:create', 'button:customer-statuses:edit', 'button:customer-statuses:toggle', 'button:customer-statuses:delete', 'button:customer-levels:create', 'button:customer-levels:edit', 'button:customer-levels:toggle', 'button:customer-levels:delete', 'button:order-types:create', 'button:order-types:edit', 'button:order-types:toggle', 'button:order-types:delete', 'button:task-statuses:create', 'button:task-statuses:edit', 'button:task-statuses:toggle', 'button:task-statuses:delete', 'button:task-statuses:add-transition', 'button:task-statuses:delete-transition'], status: '启用' },
    { name: '普通员工', type: '全局角色', permissions: ['menu:dashboard'], status: '启用' },
    { name: '项目负责人', type: '项目内角色', permissions: ['menu:projects', 'menu:tasks', 'button:projects:create', 'button:projects:edit', 'button:tasks:create'], status: '启用' },
    { name: '硬件项目经理', type: '项目内角色', permissions: ['menu:projects', 'menu:tasks', 'button:projects:create', 'button:projects:edit', 'button:tasks:create'], status: '启用' },
    { name: '软件项目经理', type: '项目内角色', permissions: ['menu:projects', 'menu:tasks', 'button:projects:create', 'button:projects:edit', 'button:tasks:create'], status: '启用' },
    { name: '技术支持', type: '项目内角色', permissions: ['menu:projects', 'menu:tasks', 'button:tasks:create'], status: '启用' },
    { name: '销售', type: '项目内角色', permissions: ['menu:projects', 'menu:tasks', 'button:tasks:create'], status: '启用' },
  ],
};

const buttonPermissionRegistry = [
  { key: 'button:dashboard:view-all', name: '工作台 / 查看全部', target: '查看全部', location: '工作台' },
  { key: 'button:projects:create', name: '项目管理 / 新建项目', target: '新建项目', location: '项目管理' },
  { key: 'button:projects:view-detail', name: '项目管理 / 查看详情', target: '查看详情', location: '项目管理' },
  { key: 'button:projects:edit', name: '项目管理 / 编辑', target: '编辑', location: '项目管理' },
  { key: 'button:projects:archive', name: '项目管理 / 归档或恢复', target: '归档 / 恢复', location: '项目管理' },
  { key: 'button:projects:delete', name: '项目管理 / 删除', target: '删除', location: '项目管理' },
  { key: 'button:project-detail:edit', name: '项目详情 / 编辑项目', target: '编辑项目', location: '项目详情' },
  { key: 'button:project-detail:archive', name: '项目详情 / 归档项目', target: '归档项目', location: '项目详情' },
  { key: 'button:project-detail:delete', name: '项目详情 / 删除项目', target: '删除项目', location: '项目详情' },
  { key: 'button:project-detail:stage-detail', name: '项目详情 / 阶段查看详情', target: '查看详情', location: '项目详情' },
  { key: 'button:project-detail:customers-entry', name: '项目详情 / 客户列表入口', target: '进入', location: '项目详情' },
  { key: 'button:project-detail:materials-entry', name: '项目详情 / 项目资料区入口', target: '进入', location: '项目详情' },
  { key: 'button:project-detail:requirement-overview-entry', name: '项目详情 / 需求纵览入口', target: '进入', location: '项目详情' },
  { key: 'button:project-edit:save', name: '项目编辑 / 保存项目', target: '保存项目', location: '项目编辑' },
  { key: 'button:tasks:create', name: '任务管理 / 新建任务', target: '新建任务', location: '任务管理' },
  { key: 'button:tasks:save', name: '任务管理 / 保存任务', target: '保存任务', location: '任务管理' },
  { key: 'button:task-detail:save', name: '任务详情 / 保存修改', target: '保存修改', location: '任务详情' },
  { key: 'button:task-detail:publish-comment', name: '任务详情 / 发布留言', target: '发布留言', location: '任务详情' },
  { key: 'button:stage-detail:create-task', name: '阶段详情 / 从该阶段新建任务', target: '从该阶段新建任务', location: '阶段详情' },
  { key: 'button:stage-detail:blocker-help', name: '阶段详情 / 卡点求助', target: '卡点求助', location: '阶段详情' },
  { key: 'button:stage-detail:create-blocker-task', name: '阶段详情 / 创建卡点任务', target: '创建卡点任务', location: '阶段详情' },
  { key: 'button:stage-detail:publish-file', name: '阶段详情 / 发布到项目资料区', target: '发布到项目资料区', location: '阶段详情' },
  { key: 'button:stage-detail:publish-record', name: '阶段详情 / 发布记录', target: '发布记录', location: '阶段详情' },
  { key: 'button:project-customers:link', name: '项目客户 / 关联已有客户', target: '关联已有客户', location: '项目客户' },
  { key: 'button:project-customers:save-link', name: '项目客户 / 保存关联', target: '保存关联', location: '项目客户' },
  { key: 'button:project-customers:requirements', name: '项目客户 / 需求列表', target: '需求列表', location: '项目客户' },
  { key: 'button:requirements:create', name: '客户需求 / 新增需求', target: '新增需求', location: '客户需求' },
  { key: 'button:requirements:save', name: '客户需求 / 保存需求', target: '保存需求', location: '客户需求' },
  { key: 'button:requirements:void', name: '客户需求 / 作废需求', target: '作废需求', location: '客户需求' },
  { key: 'button:requirements:delete', name: '客户需求 / 删除需求', target: '删除需求', location: '客户需求' },
  { key: 'button:templates:create', name: '流程模板 / 新建模板', target: '新建模板', location: '流程模板' },
  { key: 'button:templates:edit', name: '流程模板 / 编辑模板', target: '编辑模板', location: '流程模板' },
  { key: 'button:templates:toggle', name: '流程模板 / 启用或停用', target: '启用 / 停用', location: '流程模板' },
  { key: 'button:templates:delete', name: '流程模板 / 删除模板', target: '删除', location: '流程模板' },
  { key: 'button:templates:add-stage', name: '流程模板 / 新增阶段', target: '新增阶段', location: '流程模板' },
  { key: 'button:templates:move-stage-up', name: '流程模板 / 阶段上移', target: '上移', location: '流程模板' },
  { key: 'button:templates:move-stage-down', name: '流程模板 / 阶段下移', target: '下移', location: '流程模板' },
  { key: 'button:templates:save', name: '流程模板 / 保存模板', target: '保存模板', location: '流程模板' },
  { key: 'button:users:create', name: '用户管理 / 新增', target: '新增', location: '用户管理' },
  { key: 'button:users:edit', name: '用户管理 / 编辑', target: '编辑', location: '用户管理' },
  { key: 'button:users:toggle', name: '用户管理 / 启用或停用', target: '启用 / 停用', location: '用户管理' },
  { key: 'button:users:reset-password', name: '用户管理 / 重置密码', target: '重置密码', location: '用户管理' },
  { key: 'button:resources:edit', name: '资源管理 / 维护配置', target: '维护资源', location: '资源管理' },
  { key: 'button:departments:create', name: '部门管理 / 新增', target: '新增', location: '部门管理' },
  { key: 'button:departments:edit', name: '部门管理 / 编辑', target: '编辑', location: '部门管理' },
  { key: 'button:departments:delete', name: '部门管理 / 删除', target: '删除', location: '部门管理' },
  { key: 'button:roles:create', name: '角色管理 / 新增', target: '新增', location: '角色管理' },
  { key: 'button:roles:edit', name: '角色管理 / 编辑', target: '编辑', location: '角色管理' },
  { key: 'button:roles:delete', name: '角色管理 / 删除', target: '删除', location: '角色管理' },
  { key: 'button:customers:create', name: '客户管理 / 新增', target: '新增', location: '客户管理' },
  { key: 'button:customers:edit', name: '客户管理 / 编辑', target: '编辑', location: '客户管理' },
  { key: 'button:customers:delete', name: '客户管理 / 删除', target: '删除', location: '客户管理' },
  { key: 'button:customers:view-detail', name: '客户管理 / 查看详情', target: '查看详情', location: '客户管理' },
  { key: 'button:customer-detail:add-contact', name: '客户详情 / 新增联系人', target: '新增联系人', location: '客户详情' },
  { key: 'button:customer-detail:upload-material', name: '客户详情 / 上传客户资料', target: '上传资料', location: '客户详情' },
  { key: 'button:customer-detail:add-followup', name: '客户详情 / 新增跟进记录', target: '新增跟进记录', location: '客户详情' },
  { key: 'button:customer-detail:create-order', name: '客户详情 / 创建订单', target: '创建订单', location: '客户详情' },
  { key: 'button:customer-statuses:create', name: '客户项目状态配置 / 新增', target: '新增', location: '客户项目状态配置' },
  { key: 'button:customer-statuses:edit', name: '客户项目状态配置 / 编辑', target: '编辑', location: '客户项目状态配置' },
  { key: 'button:customer-statuses:toggle', name: '客户项目状态配置 / 启用或停用', target: '启用 / 停用', location: '客户项目状态配置' },
  { key: 'button:customer-statuses:delete', name: '客户项目状态配置 / 删除', target: '删除', location: '客户项目状态配置' },
  { key: 'button:customer-levels:create', name: '客户等级配置 / 新增', target: '新增', location: '客户等级配置' },
  { key: 'button:customer-levels:edit', name: '客户等级配置 / 编辑', target: '编辑', location: '客户等级配置' },
  { key: 'button:customer-levels:toggle', name: '客户等级配置 / 启用或停用', target: '启用 / 停用', location: '客户等级配置' },
  { key: 'button:customer-levels:delete', name: '客户等级配置 / 删除', target: '删除', location: '客户等级配置' },
  { key: 'button:order-types:create', name: '订单类型配置 / 新增', target: '新增', location: '订单类型配置' },
  { key: 'button:order-types:edit', name: '订单类型配置 / 编辑', target: '编辑', location: '订单类型配置' },
  { key: 'button:order-types:toggle', name: '订单类型配置 / 启用或停用', target: '启用 / 停用', location: '订单类型配置' },
  { key: 'button:order-types:delete', name: '订单类型配置 / 删除', target: '删除', location: '订单类型配置' },
  { key: 'button:task-statuses:create', name: '任务状态配置 / 新增状态', target: '新增状态', location: '任务状态配置' },
  { key: 'button:task-statuses:edit', name: '任务状态配置 / 编辑状态', target: '编辑状态', location: '任务状态配置' },
  { key: 'button:task-statuses:toggle', name: '任务状态配置 / 启用或停用', target: '启用 / 停用', location: '任务状态配置' },
  { key: 'button:task-statuses:delete', name: '任务状态配置 / 删除状态', target: '删除状态', location: '任务状态配置' },
  { key: 'button:task-statuses:add-transition', name: '任务状态配置 / 新增流转', target: '新增流转', location: '任务状态配置' },
  { key: 'button:task-statuses:delete-transition', name: '任务状态配置 / 删除流转', target: '删除流转', location: '任务状态配置' },
  { key: 'button:orders:create', name: '订单管理 / 新增订单', target: '新增订单', location: '订单管理' },
  { key: 'button:orders:edit', name: '订单管理 / 编辑订单', target: '编辑订单', location: '订单管理' },
  { key: 'button:orders:delete', name: '订单管理 / 删除订单', target: '删除订单', location: '订单管理' },
  { key: 'button:orders:view-history', name: '订单管理 / 查看修改记录', target: '查看修改记录', location: '订单管理' },
];

const customers = [
  {
    name: 'Nova Retail',
    shortName: 'Nova',
    region: '德国',
    address: 'Berlin, Germany',
    level: 'A / 战略客户',
    salesOwners: ['赵磊'],
    supportOwners: ['陈晨'],
    status: '合作中',
    contacts: [
      { name: 'Anna Müller', title: '采购经理', phone: '+49 30 1000 2000', email: 'anna.mueller@nova.example', messenger: 'WhatsApp', remark: '负责门店采购与试点反馈' },
      { name: 'Lukas Bauer', title: 'IT 负责人', phone: '+49 30 1000 2001', email: 'lukas.bauer@nova.example', messenger: 'Email', remark: '关注软件版本和设备部署' },
    ],
    materials: [
      { name: 'Nova_年度合作框架.pdf', type: 'PDF', size: '1.8 MB', uploader: '赵磊', time: '2026-05-08 11:20' },
      { name: 'Berlin门店照片.zip', type: '压缩包', size: '24 MB', uploader: '陈晨', time: '2026-05-10 16:45' },
    ],
    followups: [
      { author: '赵磊', time: '2026-05-18 15:30', text: '客户确认 6 月初需要一批正式订单，重点关注欧规充电器和收据模板。', attachments: [{ name: '会议纪要.docx', type: '文档' }] },
      { author: '陈晨', time: '2026-05-16 10:10', text: '远程演示已完成，客户要求补充德语小票字段截图。', attachments: [] },
    ],
  },
  {
    name: 'Siam Pay',
    shortName: 'Siam',
    region: '泰国',
    address: 'Bangkok, Thailand',
    level: 'B / 重点客户',
    salesOwners: ['高静'],
    supportOwners: ['陈晨'],
    status: '潜在客户',
    contacts: [
      { name: 'Niran Chai', title: '产品负责人', phone: '+66 2 000 8899', email: 'niran@siampay.example', messenger: 'LINE', remark: '负责泰国本地化需求确认' },
    ],
    materials: [
      { name: '泰语键盘膜需求.png', type: '图片', size: '920 KB', uploader: '高静', time: '2026-05-12 09:40' },
    ],
    followups: [
      { author: '高静', time: '2026-05-17 13:20', text: '客户希望先走预订单，待泰语键盘膜确认后转正式订单。', attachments: [] },
    ],
  },
  {
    name: 'Andes Market',
    shortName: 'Andes',
    region: '智利',
    address: 'Santiago, Chile',
    level: 'D / 观察客户',
    salesOwners: ['赵磊'],
    supportOwners: ['陈晨'],
    status: '已停用',
    contacts: [],
    materials: [],
    followups: [],
  },
  {
    name: 'Pacific Mart',
    shortName: 'Pacific',
    region: '菲律宾',
    address: 'Manila, Philippines',
    level: 'C / 普通客户',
    salesOwners: [],
    supportOwners: ['陈晨'],
    status: '潜在客户',
    contacts: [],
    materials: [
      { name: 'Pacific_门店网络照片.zip', type: '压缩包', size: '18 MB', uploader: '陈晨', time: '2026-05-15 14:00' },
    ],
    followups: [
      { author: '陈晨', time: '2026-05-15 16:20', text: '销售线下带客户进行现场网络测试，已在 KPM 中记录客户跟进。', attachments: [] },
    ],
  },
  {
    name: 'Metro One',
    shortName: 'Metro',
    region: '阿联酋',
    address: 'Dubai, United Arab Emirates',
    level: 'B / 重点客户',
    salesOwners: ['吴越'],
    supportOwners: [],
    status: '潜在客户',
    contacts: [],
    materials: [],
    followups: [],
  },
];

const customerProjectStatusOptions = [
  { name: '商机发掘', active: true },
  { name: '样机测试', active: true },
  { name: '研发投入', active: true },
  { name: '订单冲刺', active: true },
  { name: '首单护航', active: true },
  { name: '量产维护', active: true },
  { name: 'EOL 声明', active: true },
  { name: 'EOL', active: true },
  { name: 'Support Ended', active: true },
];

const customerLevelOptions = [
  { name: 'A / 战略客户', active: true },
  { name: 'B / 重点客户', active: true },
  { name: 'C / 普通客户', active: true },
  { name: 'D / 观察客户', active: true },
  { name: '黑名单 / 暂停合作', active: true },
];

const orderTypeOptions = [
  { name: '样品订单', active: true },
  { name: '预订单', active: true },
  { name: '正式订单', active: true },
];

const taskStatusOptions = [
  { name: '待处理', active: true, semantic: '普通' },
  { name: '进行中', active: true, semantic: '普通' },
  { name: '已完成', active: true, semantic: '完成' },
  { name: '已拒绝', active: true, semantic: '拒绝' },
];

const taskStatusTransitions = [
  { from: '待处理', to: '进行中' },
  { from: '待处理', to: '已拒绝' },
  { from: '进行中', to: '已完成' },
  { from: '进行中', to: '已拒绝' },
  { from: '已拒绝', to: '进行中' },
];

const orders = [
  {
    id: 'ORD-202601-002',
    orderDate: '2026-01-16',
    customerName: 'Nova Retail',
    projectName: 'M5 Plus',
    quantity: 90,
    specification: '4GB + 64GB / 欧规充电器 / 黑色',
    expectedShipDate: '2026-02-12',
    plannedShipDate: '2026-02-10',
    softwareVersion: 'v3.0.0',
    currency: 'USD',
    unitPrice: 166,
    amount: 14940,
    creator: '赵磊',
    histories: [],
  },
  {
    id: 'ORD-202602-004',
    orderDate: '2026-02-21',
    customerName: 'Siam Pay',
    projectName: 'P8 dual',
    quantity: 80,
    specification: '双屏 / 泰语键盘膜 / 银色',
    expectedShipDate: '2026-03-18',
    plannedShipDate: '2026-03-20',
    softwareVersion: 'v2.6.0',
    currency: 'USD',
    unitPrice: 232,
    amount: 18560,
    creator: '高静',
    histories: [],
  },
  {
    id: 'ORD-202603-006',
    orderDate: '2026-03-10',
    customerName: 'Nova Retail',
    projectName: 'M5 Plus',
    quantity: 120,
    specification: '4GB + 64GB / 欧规充电器 / 黑色',
    expectedShipDate: '2026-04-08',
    plannedShipDate: '2026-04-06',
    softwareVersion: 'v3.1.0',
    currency: 'USD',
    unitPrice: 167,
    amount: 20040,
    creator: '赵磊',
    histories: [],
  },
  {
    id: 'ORD-202605-001',
    orderDate: '2026-05-02',
    customerName: 'Nova Retail',
    projectName: 'M5 Plus',
    quantity: 180,
    specification: '4GB + 64GB / 欧规充电器 / 黑色',
    expectedShipDate: '2026-06-05',
    plannedShipDate: '2026-06-03',
    softwareVersion: 'v3.2.1',
    currency: 'USD',
    unitPrice: 168,
    amount: 30240,
    creator: '赵磊',
    histories: [
      { modifier: '张敏', modifiedAt: '2026-05-06 14:20', changes: '计划发货日期：2026-06-01 → 2026-06-03', reason: '客户要求与门店开业时间对齐' },
    ],
  },
  {
    id: 'ORD-202604-008',
    orderDate: '2026-04-18',
    customerName: 'Siam Pay',
    projectName: 'P8 dual',
    quantity: 120,
    specification: '双屏 / 泰语键盘膜 / 银色',
    expectedShipDate: '2026-05-28',
    plannedShipDate: '2026-05-30',
    softwareVersion: 'v2.8.0-beta',
    currency: 'USD',
    unitPrice: 236,
    amount: 28320,
    creator: '高静',
    histories: [],
  },
  {
    id: 'ORD-202605-011',
    orderDate: '2026-05-11',
    customerName: 'Siam Pay',
    projectName: 'P8 dual',
    quantity: 140,
    specification: '双屏 / 泰语键盘膜 / 银色',
    expectedShipDate: '2026-06-08',
    plannedShipDate: '2026-06-10',
    softwareVersion: 'v2.8.1',
    currency: 'USD',
    unitPrice: 238,
    amount: 33320,
    creator: '高静',
    histories: [],
  },
  {
    id: 'ORD-202503-014',
    orderDate: '2025-03-12',
    customerName: 'Nova Retail',
    projectName: 'X10 Pro',
    quantity: 60,
    specification: '桌面旗舰版 / NFC / 德语包',
    expectedShipDate: '2025-04-10',
    plannedShipDate: '2025-04-08',
    softwareVersion: 'v5.1.4',
    currency: 'EUR',
    unitPrice: 320,
    amount: 19200,
    creator: '赵磊',
    histories: [],
  },
];

const tasks = [
  {
    id: 'KPM-101',
    title: '确认支付模块语言包',
    description: '核对中英文语言包与收据模板，确认海外版本可正常展示。',
    project: 'P8 dual',
    stage: '软件适配',
    category: '需求',
    status: '进行中',
    priority: '高',
    creator: '张敏',
    assignees: ['李娜'],
    participants: ['王伟'],
    expectedCompletionAt: '2026-05-20',
    dueDate: '2026-05-20',
    source: '阶段详情',
    customerName: 'Nova Retail',
    attachments: [
      { name: '支付语言包说明.pdf', type: 'PDF', size: '860 KB', uploader: '李娜', time: '2026-05-16 10:20' },
    ],
    comments: [
      { author: '李娜', time: '2026-05-17 09:10', text: '英语文案已确认，今天补齐德国版特殊字段。', attachments: [] },
    ],
  },
  {
    id: 'KPM-102',
    title: '整理客户推广演示脚本',
    description: '整理销售与技术支持联合演示时使用的讲解脚本。',
    project: 'P8 dual',
    stage: '客户推广',
    category: '技术支持',
    status: '待处理',
    priority: '中',
    creator: '张敏',
    assignees: ['陈晨'],
    participants: ['王伟', '赵磊'],
    expectedCompletionAt: '2026-05-24',
    dueDate: '2026-05-24',
    source: '任务管理',
    customerName: 'Nova Retail',
    attachments: [],
    comments: [],
  },
  {
    id: 'KPM-103',
    title: '确认试产测试清单',
    description: '确认试产前的硬件、软件与车间检查项。',
    project: 'S6 mini',
    stage: '测试生产',
    category: '其他',
    status: '已完成',
    priority: '高',
    creator: '周航',
    assignees: ['周航'],
    participants: [],
    expectedCompletionAt: '2026-05-10',
    dueDate: '2026-05-10',
    source: '任务管理',
    customerName: 'Nova Retail',
    attachments: [],
    comments: [],
  },
  {
    id: 'KPM-104',
    title: '现场网络环境技术支持',
    description: '销售线下带客户试用设备，需要技术支持确认弱网环境下的联网稳定性。',
    project: 'P8 dual',
    stage: '客户推广',
    category: '技术支持',
    status: '进行中',
    priority: '中',
    creator: '陈晨',
    assignees: ['陈晨'],
    participants: [],
    expectedCompletionAt: '2026-05-22',
    dueDate: '2026-05-22',
    source: '线下支持补录',
    customerName: 'Pacific Mart',
    attachments: [],
    comments: [
      { author: '陈晨', time: '2026-05-16 09:30', text: '已完成第一轮现场排查，等待销售确认下一步推进计划。', attachments: [] },
    ],
  },
];

let currentUser = localStorage.getItem('kpm.currentUserName') || '张敏';
let currentAccount = localStorage.getItem('kpm.currentAccount') || 'admin@kozenmobile.com';
let currentSession = { token: localStorage.getItem('kpm.authToken') || '' };
let currentUserPermissions = JSON.parse(localStorage.getItem('kpm.currentPermissions') || '[]');
let currentUserRoles = JSON.parse(localStorage.getItem('kpm.currentRoles') || '[]');
const prototypeToday = '2026-05-22';
const prototypeNow = '2026-05-22 10:30';
const prototypeReviewTime = '2026-05-22 11:20';
const prototypeUploadTime = '2026-05-22 15:30';
const taskCategoryOptions = ['需求', 'Bug', '技术支持', '其他'];
const projectStatusOptions = ['未开始', '进行中', '已完成'];
const stageStatusOptions = ['未开始', '进行中', '已完成'];
const salesabilityOptions = ['可销售', '不可销售'];
const unsellableReasonOptions = ['仍处于设计或测试阶段', '产品过老，不再继续推广', '被遗弃的老项目'];
const priorityOptions = ['高', '中', '低'];
const requirementStatusOptions = ['待评估', '已采纳', '实现中', '已实现', '已拒绝', '已作废'];
const customerMasterStatusOptions = ['潜在客户', '合作中', '已停用'];
const resourceStatusOptions = ['启用', '停用'];
const roleTypeOptions = ['全局角色', '项目内角色'];
const templateStatusOptions = ['启用', '草稿', '停用'];
const taskStatusSemanticOptions = ['普通', '完成', '拒绝'];
const orderCurrencyOptions = ['USD', 'EUR', 'CNY'];
const analyticsTargetCurrencyOptions = ['USD', 'CNY'];
const analyticsPeriodOptions = ['年度', '季度', '月份'];
const activityStatusOptions = ['全部活跃状态', '活跃', '观察', '停滞', '遗弃'];
const quarterOptions = ['Q1', 'Q2', 'Q3', 'Q4'];
const monthOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const permissionTypeOptions = ['全部类型', '菜单权限', '按钮权限'];

const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');
const projectTable = document.getElementById('project-table');
const dashboardSummary = document.getElementById('dashboard-summary');
const myProjects = document.getElementById('my-projects');
const projectDetail = document.getElementById('project-detail');
const projectDetailBack = document.getElementById('project-detail-back');
const projectEdit = document.getElementById('project-edit');
const stageDetail = document.getElementById('stage-detail');
const customerPlaceholder = document.getElementById('customer-placeholder');
const customerManagement = document.getElementById('customer-management');
const customerDetail = document.getElementById('customer-detail');
const projectMaterials = document.getElementById('project-materials');
const languageToggle = document.getElementById('language-toggle');
const loginLanguageToggle = document.getElementById('login-language-toggle');
const templateList = document.getElementById('template-list');
const templateSearch = document.getElementById('template-search');
const templateStatusFilter = document.getElementById('template-status-filter');
const resourceContent = document.getElementById('resource-content');
const projectSearch = document.getElementById('project-search');
const salesabilityFilter = document.getElementById('salesability-filter');
const archiveFilter = document.getElementById('archive-filter');
const customerRequirements = document.getElementById('customer-requirements');
const requirementOverview = document.getElementById('requirement-overview');
const wizardContent = document.getElementById('wizard-content');
const taskManagement = document.getElementById('task-management');
const taskDetail = document.getElementById('task-detail');
const orderManagement = document.getElementById('order-management');
const analyticsContent = document.getElementById('analytics-content');
const loginScreen = document.getElementById('login-screen');
const appShell = document.getElementById('app-shell');
const loginForm = document.getElementById('login-form');
const loginAccount = document.getElementById('login-account');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');
const userMenuTrigger = document.getElementById('user-menu-trigger');
const userDropdown = document.getElementById('user-dropdown');
const notificationTrigger = document.getElementById('notification-trigger');
const notificationDropdown = document.getElementById('notification-dropdown');
const notificationCount = document.getElementById('notification-count');
const notificationList = document.getElementById('notification-list');
const notificationRefreshNote = document.getElementById('notification-refresh-note');
const globalModalRoot = document.getElementById('global-modal-root');

let selectedProjectId = 'p8-dual';
let selectedStageIndex = 4;
let selectedCustomerIndex = 0;
let selectedCustomerName = 'Nova Retail';
let selectedTaskId = 'KPM-101';
let wizardStep = 1;
let selectedResourceTab = 'users';
let projectCustomerFormOpen = false;
let taskFormOpen = false;
let requirementFormOpen = false;
let blockerHelpFormOpen = false;
let stageTaskFormOpen = false;
let memberModalOpen = false;
let taskDetailReturnView = 'tasks';
let resourceFormOpen = false;
let resourceEditIndex = null;
let resourceSearchKeyword = '';
let permissionTypeFilter = '全部类型';
let permissionPickerDrafts = {};
let customerSearchKeyword = '';
let customerFormOpen = false;
let customerEditIndex = null;
let customerContactFormOpen = false;
let customerFollowupFormOpen = false;
let customerOrderFormOpen = false;
let editingProjectId = null;
let projectEditModalOpen = false;
let confirmationDialog = null;
let selectedTemplateIndex = 0;
let projectWizardDraft = null;
let templateFormOpen = false;
let templateEditIndex = null;
let templateDraftStages = [];
let templateDraftMeta = { name: '', scope: '', status: '草稿' };
let templateSearchKeyword = '';
let templateStatusKeyword = '全部状态';
let taskTransitionFormOpen = false;
let orderFormOpen = false;
let orderEditIndex = null;
let orderHistoryModalOpen = false;
let selectedOrderId = null;
let readableContentModal = null;
let changePasswordModalOpen = false;
let analyticsTab = 'orders';
let analyticsOrderPeriod = '年度';
let analyticsYear = '2026';
let analyticsQuarter = 'Q2';
let analyticsMonth = '05';
let analyticsProjectFilter = [];
let analyticsCustomerFilter = [];
let analyticsRegionFilter = [];
let analyticsTargetCurrency = 'USD';
let analyticsDropdownOpen = null;
let analyticsFilterKeywords = {
  project: '',
  customer: '',
  region: '',
};
let activitySearchKeyword = '';
let activityStatusFilter = '全部活跃状态';
let activityLevelFilter = '全部客户等级';
let selectedActivityCell = null;
let selectedSupportCustomer = 'Nova Retail';
let supportCustomerKeyword = 'Nova Retail';
let notificationRefreshTimer = null;
let notificationFilter = 'unread';
let taskListFilters = {
  keyword: '',
  project: '全部项目',
  status: '全部状态',
  priority: '全部优先级',
  assignee: '全部执行者',
  category: '全部分类',
  taskIds: null,
  contextLabel: '',
  contextActive: false,
};
let mapDragState = null;
let mapOffset = { x: 0, y: 0 };
let mapFullscreenOpen = false;
let resourceMapRows = [];
const resourceLeafletMaps = {};
let currentLanguage = 'zh';
localStorage.setItem('kpm.language', 'zh');
let projectDetailReturnView = 'projects';
let taskFormState = {
  project: projects[0].externalName,
  stage: projects[0].stages[0].name,
  category: '其他',
  source: '任务管理',
};
let lastBusinessNavigationRefreshAt = 0;


const kpmApi = window.createKpmApi(() => currentUser);

function replaceArray(target, values = []) {
  target.splice(0, target.length, ...values);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function parseJsonList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && typeof value.value === 'string') {
    try { return JSON.parse(value.value); } catch { return []; }
  }
  if (typeof value === 'object') return [];
  try { return JSON.parse(String(value)); } catch { return []; }
}

function apiDate(value, fallback = '-') {
  if (!value) return fallback;
  return String(value).slice(0, 10);
}

function apiDateTime(value, fallback = '-') {
  if (!value) return fallback;
  return String(value).replace('T', ' ').slice(0, 16);
}

function normalizeBackendFile(file = {}) {
  return {
    id: file.id,
    name: file.name || file.fileName || '-',
    type: file.type || file.fileType || '文件',
    size: file.size || file.fileSize || '-',
    uploader: file.uploader || currentUser,
    time: apiDateTime(file.time || file.uploadedAt || file.createdAt),
    bucket: file.bucket || '',
    objectKey: file.objectKey || '',
    storageUrl: file.storageUrl || file.url || '',
    category: file.storageCategory || file.category || '',
    publishedToProject: Boolean(file.publishedToProject),
  };
}

function normalizeBackendMessage(message = {}) {
  return {
    id: message.id,
    author: message.author || currentUser,
    time: apiDateTime(message.time || message.createdAt),
    text: message.text || message.content || '',
    attachments: parseJsonList(message.attachments),
  };
}

function normalizeBackendRequirement(requirement = {}) {
  return {
    id: requirement.id,
    title: requirement.title || '',
    userStory: requirement.userStory || '',
    value: requirement.value || requirement.businessValue || '',
    acceptance: requirement.acceptance || '',
    priority: requirement.priority || '中',
    status: requirement.status || '待评估',
    proposer: requirement.proposer || '',
    creator: requirement.creator || currentUser,
    date: apiDate(requirement.date || requirement.createdDate, prototypeToday),
    taskId: requirement.taskId || '',
  };
}

function normalizeBackendProject(project = {}) {
  return {
    id: project.id,
    externalName: project.externalName || '-',
    internalName: project.internalName || '-',
    modelName: project.modelName || '-',
    managerAccount: project.managerAccount || '',
    status: project.status || '未开始',
    archived: Boolean(project.archived),
    salesability: project.salesability || '不可销售',
    unsellableReason: project.unsellableReason || '',
    description: project.description || '暂无项目描述。',
    members: asArray(project.members).map((member) => ({
      id: member.id,
      userAccount: member.userAccount || member.account,
      role: member.role || member.roleName || '普通员工',
    })).filter((member) => member.userAccount),
    stages: asArray(project.stages).map((stage) => ({
      id: stage.id,
      name: stage.name || stage.stageName || '未命名阶段',
      assignees: asArray(stage.assignees).map((assignee) => ({
        type: assignee.type || assignee.assigneeType || 'user',
        name: assignee.name || assignee.assigneeName,
        account: assignee.account || '',
      })),
      status: stage.status || '未开始',
      files: asArray(stage.files || stage.materials).map(normalizeBackendFile),
      messages: asArray(stage.messages || stage.records).map(normalizeBackendMessage),
    })),
    projectCustomers: asArray(project.projectCustomers).map((customer) => ({
      id: customer.id,
      customerId: customer.customerId,
      customerName: customer.customerName,
      region: customer.region || '',
      projectStatus: customer.projectStatus || '商机发掘',
      requirements: asArray(customer.requirements).map(normalizeBackendRequirement),
    })),
    projectMaterials: asArray(project.projectMaterials).map((material) => ({
      id: material.id,
      name: material.name || material.fileName || '-',
      type: material.type || material.fileType || '文件',
      size: material.size || material.fileSize || '-',
      uploader: material.uploader || currentUser,
      sourceStage: material.sourceStage || '-',
      shareTarget: material.shareTarget || '项目资料区',
      publishedAt: apiDateTime(material.publishedAt),
      bucket: material.bucket || '',
      objectKey: material.objectKey || '',
      storageUrl: material.storageUrl || '',
      category: material.storageCategory || material.category || 'project-materials',
    })),
  };
}

function normalizeBackendCustomer(customer = {}) {
  return {
    id: customer.id,
    name: customer.name || '-',
    shortName: customer.shortName || '-',
    region: customer.region || '未填写',
    address: customer.address || customer.region || '',
    level: customer.level || 'C / 普通客户',
    salesOwners: asArray(customer.salesOwners),
    supportOwners: asArray(customer.supportOwners),
    status: customer.status || '潜在客户',
    contacts: asArray(customer.contacts),
    materials: asArray(customer.materials).map(normalizeBackendFile),
    followups: asArray(customer.followups).map(normalizeBackendMessage),
    projects: asArray(customer.projects),
  };
}

function normalizeBackendResourceMapRow(row = {}) {
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);
  return {
    customerId: row.customerId || row.customer_id || '',
    customerName: row.customerName || row.customer_name || '-',
    region: row.region || '未填写',
    address: row.address || row.region || '',
    level: row.level || '-',
    status: row.status || '-',
    salesOwners: String(row.salesOwners || row.sales_owners || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    supportOwners: String(row.supportOwners || row.support_owners || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    projects: String(row.projects || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    orderedQuantity: Number(row.orderedQuantity || row.ordered_quantity || 0),
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    geocodedAddress: row.geocodedAddress || row.geocoded_address || '',
    geocodeProvider: row.geocodeProvider || row.geocode_provider || '',
    geoPrecision: row.geoPrecision || row.geo_precision || '',
    geocodeQuery: row.geocodeQuery || row.geocode_query || '',
  };
}

function normalizeBackendTask(task = {}) {
  return {
    id: task.id,
    title: task.title || '-',
    description: task.description || '',
    projectId: task.projectId || '',
    stageId: task.stageId || '',
    customerId: task.customerId || '',
    project: task.project || task.projectName || '-',
    stage: task.stage || task.stageName || '-',
    category: task.category || '其他',
    status: task.status || activeTaskStatusNames()[0] || '待处理',
    priority: task.priority || '中',
    creator: task.creator || currentUser,
    assignees: asArray(task.assignees),
    participants: asArray(task.participants),
    expectedCompletionAt: apiDate(task.expectedCompletionAt || task.dueDate),
    dueDate: apiDate(task.dueDate || task.expectedCompletionAt),
    source: task.source || '任务管理',
    customerName: task.customerName || '',
    blocked: Boolean(task.blocked),
    attachments: asArray(task.attachments).map(normalizeBackendFile),
    comments: asArray(task.comments).map(normalizeBackendMessage),
  };
}

function normalizeBackendOrder(order = {}) {
  return {
    id: order.id,
    type: order.type || order.orderType || '正式订单',
    orderDate: apiDate(order.orderDate, prototypeToday),
    customerId: order.customerId || '',
    customerName: order.customerName || '-',
    projectId: order.projectId || '',
    projectName: order.projectName || '-',
    quantity: Number(order.quantity || 0),
    specification: order.specification || '',
    expectedShipDate: apiDate(order.expectedShipDate, prototypeToday),
    plannedShipDate: apiDate(order.plannedShipDate, prototypeToday),
    softwareVersion: order.softwareVersion || '',
    currency: order.currency || 'USD',
    unitPrice: Number(order.unitPrice || 0),
    amount: Number(order.amount || 0),
    creator: order.creator || currentUser,
    histories: asArray(order.histories).map((history) => ({
      modifier: history.modifier || currentUser,
      modifiedAt: apiDateTime(history.modifiedAt),
      changes: history.changes || '',
      reason: history.reason || '',
    })),
  };
}

function enumNames(enumItems, enumType, fallback) {
  const values = asArray(enumItems)
    .filter((item) => item.enumType === enumType && item.active !== false)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    .map((item) => item.name || item.value)
    .filter(Boolean);
  return values.length ? values : fallback;
}

function enumOptionObjects(enumItems, enumType, fallbackOptions = [], extra = {}) {
  const values = asArray(enumItems)
    .filter((item) => item.enumType === enumType)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    .map((item) => ({
      id: item.id,
      enumType: item.enumType,
      name: item.name || item.value,
      value: item.value || item.name,
      semantic: item.semantic || extra.semantic || '普通',
      active: item.active !== false,
      sortOrder: item.sortOrder || 100,
    }));
  if (values.length) return values;
  return asArray(fallbackOptions).map((item, index) => typeof item === 'string'
    ? { name: item, value: item, enumType, active: true, sortOrder: index + 1, ...extra }
    : { enumType, value: item.name, sortOrder: index + 1, ...extra, ...item });
}

function hydrateOptionsFromBootstrap(bootstrap = {}) {
  const enumItems = asArray(bootstrap.enumItems);
  replaceArray(customerProjectStatusOptions, enumOptionObjects(enumItems, 'customer_project_status', customerProjectStatusOptions));
  replaceArray(customerLevelOptions, enumOptionObjects(enumItems, 'customer_level', customerLevelOptions));
  replaceArray(orderTypeOptions, enumOptionObjects(enumItems, 'order_type', orderTypeOptions));
  replaceArray(taskStatusOptions, enumOptionObjects(enumItems, 'task_status', taskStatusOptions));
  replaceArray(taskStatusTransitions, asArray(bootstrap.taskStatusTransitions).map((item) => ({
    id: item.id,
    from: item.fromStatus,
    to: item.toStatus,
  })));
  replaceArray(taskCategoryOptions, enumNames(enumItems, 'task_category', taskCategoryOptions));
  replaceArray(projectStatusOptions, enumNames(enumItems, 'project_status', projectStatusOptions));
  replaceArray(stageStatusOptions, enumNames(enumItems, 'stage_status', stageStatusOptions));
  replaceArray(salesabilityOptions, enumNames(enumItems, 'salesability', salesabilityOptions));
  replaceArray(unsellableReasonOptions, enumNames(enumItems, 'unsellable_reason', unsellableReasonOptions));
  replaceArray(priorityOptions, enumNames(enumItems, 'priority', priorityOptions));
  replaceArray(requirementStatusOptions, enumNames(enumItems, 'requirement_status', requirementStatusOptions));
  replaceArray(customerMasterStatusOptions, enumNames(enumItems, 'customer_master_status', customerMasterStatusOptions));
  replaceArray(orderCurrencyOptions, enumNames(enumItems, 'currency', orderCurrencyOptions));
}

function hydrateResourceData(bootstrap = {}) {
  resourceData.users = asArray(bootstrap.users).map((user) => ({
    id: user.id,
    name: user.name,
    account: user.account,
    departments: asArray(user.departments),
    globalRoles: asArray(user.globalRoles),
    directPermissions: asArray(user.directPermissions),
    status: user.status || '启用',
  }));
  resourceData.departments = asArray(bootstrap.departments).map((department) => ({
    id: department.id,
    name: department.name,
    parent: '-',
    status: department.status || '启用',
    userCount: department.userCount || 0,
  }));
  resourceData.roles = asArray(bootstrap.roles).map((role) => ({
    id: role.id,
    name: role.name,
    type: role.type || role.roleType,
    permissions: asArray(role.permissions),
    status: role.status || '启用',
  }));
}

function applyPrototypeSnapshot(snapshot = {}) {
  if (!snapshot || !Object.keys(snapshot).length) return false;
  replaceArray(projects, asArray(snapshot.projects));
  replaceArray(templates, asArray(snapshot.templates));
  Object.assign(resourceData, snapshot.resourceData || {});
  replaceArray(customers, asArray(snapshot.customers));
  replaceArray(customerProjectStatusOptions, asArray(snapshot.customerProjectStatusOptions));
  replaceArray(customerLevelOptions, asArray(snapshot.customerLevelOptions));
  replaceArray(orderTypeOptions, asArray(snapshot.orderTypeOptions));
  replaceArray(taskStatusOptions, asArray(snapshot.taskStatusOptions));
  replaceArray(taskStatusTransitions, asArray(snapshot.taskStatusTransitions));
  replaceArray(orders, asArray(snapshot.orders));
  replaceArray(tasks, asArray(snapshot.tasks));
  return true;
}

function capturePrototypeSnapshot() {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    projects,
    templates,
    resourceData,
    customers,
    customerProjectStatusOptions,
    customerLevelOptions,
    orderTypeOptions,
    taskStatusOptions,
    taskStatusTransitions,
    orders,
    tasks,
  };
}

let prototypePersistTimer = null;
let prototypePersistInFlight = false;
let prototypePersistQueued = false;

function schedulePrototypePersist(reason = 'ui-change') {
  if (!window.__kpmAppReady) return;
  window.__kpmLastPersistReason = reason;
  clearTimeout(prototypePersistTimer);
  prototypePersistTimer = setTimeout(() => persistPrototypeSnapshot(reason), 220);
}

async function persistPrototypeSnapshot(reason = 'ui-change') {
  if (!window.__kpmAppReady || !currentSession?.token) return;
  if (prototypePersistInFlight) {
    prototypePersistQueued = true;
    return;
  }
  prototypePersistInFlight = true;
  try {
    await kpmApi.post('/api/resources/prototype-state', {
      updatedBy: currentUser,
      reason,
      state: capturePrototypeSnapshot(),
    });
    window.__kpmLastPersistOk = new Date().toISOString();
  } catch (error) {
    console.error('[KPM] prototype state persist failed', error);
    window.__kpmLastPersistError = String(error.message || error);
  } finally {
    prototypePersistInFlight = false;
    if (prototypePersistQueued) {
      prototypePersistQueued = false;
      schedulePrototypePersist('queued-change');
    }
  }
}

async function loadBusinessDataFromBackend() {
  const [bootstrap, projectRows, customerRows, taskRows, orderRows, templateRows, resourceMapApiRows] = await Promise.all([
    kpmApi.get('/api/resources/bootstrap'),
    kpmApi.get('/api/projects'),
    kpmApi.get('/api/customers'),
    kpmApi.get('/api/tasks'),
    kpmApi.get('/api/orders'),
    kpmApi.get('/api/projects/templates'),
    kpmApi.get('/api/analytics/resource-map').catch(() => []),
  ]);

  hydrateOptionsFromBootstrap(bootstrap);
  hydrateResourceData(bootstrap);
  replaceArray(templates, asArray(templateRows).map((template) => ({
    id: template.id,
    name: template.name,
    scope: template.scope,
    status: template.status,
    updatedAt: apiDate(template.updatedAt, prototypeToday),
    stages: asArray(template.stages),
  })));
  replaceArray(projects, asArray(projectRows).map(normalizeBackendProject));
  replaceArray(customers, asArray(customerRows).map(normalizeBackendCustomer));
  replaceArray(tasks, asArray(taskRows).map(normalizeBackendTask));
  replaceArray(orders, asArray(orderRows).map(normalizeBackendOrder));
  resourceMapRows = asArray(resourceMapApiRows).map(normalizeBackendResourceMapRow);
}

async function hydrateFromBackend() {
  if (!currentSession?.token) {
    window.__kpmHydratedFromApi = false;
    window.__kpmRealApiMode = false;
    return 'embedded-fallback';
  }
  try {
    await loadBusinessDataFromBackend();
    window.__kpmHydratedFromApi = true;
    window.__kpmRealApiMode = true;
    return 'business-api';
  } catch (error) {
    console.error('[KPM] backend hydrate failed, trying prototype snapshot fallback', error);
    window.__kpmHydrateError = String(error.message || error);
    try {
      const snapshot = await kpmApi.get('/api/resources/prototype-state').catch(() => ({}));
      if (applyPrototypeSnapshot(snapshot)) {
        window.__kpmHydratedFromApi = true;
        window.__kpmRealApiMode = false;
        return 'snapshot-fallback';
      }
    } catch (snapshotError) {
      console.error('[KPM] prototype snapshot hydrate failed', snapshotError);
    }
    window.__kpmHydratedFromApi = false;
    window.__kpmRealApiMode = false;
    return 'embedded-fallback';
  }
}

function renderAllPrototypeSurfaces() {
  ensureStageCollaborationData();
  syncAllProjectStatusesFromStages();
  ensureTaskCollaborationData();
  ensureCustomerAndOrderData();
  renderDashboard();
  renderTaskManagement();
  renderCustomerManagement();
  renderOrderManagement();
  renderAnalytics();
  renderProjectTable();
  renderTemplates();
  renderResourceContent();
  renderWizard();
  applyLanguage();
  applyPermissionVisibility();
}

async function initializePrototypeApp() {
  const source = await hydrateFromBackend();
  renderAllPrototypeSurfaces();
  window.__kpmAppReady = true;
  window.__kpmDataSource = source;
  if (currentSession?.token) {
    startNotificationRefresh();
    if (source !== 'snapshot-fallback') schedulePrototypePersist('initial-normalized-hydrate');
  }
}

const persistableActions = new Set([
  'save-order', 'delete-order', 'save-customer-order', 'save-customer-master', 'delete-customer-master',
  'save-customer-contact', 'delete-customer-contact', 'save-customer-followup', 'save-task', 'save-stage-task',
  'save-task-detail', 'publish-task-comment', 'save-blocker-help-task', 'save-project-members-modal',
  'save-template', 'toggle-template-status', 'delete-template', 'save-project-edit',
  'confirm-dialog', 'save-project-customer', 'save-resource', 'delete-resource', 'toggle-user-status',
  'toggle-customer-status-option', 'toggle-customer-level-option', 'toggle-order-type-option', 'toggle-task-status-option',
  'save-task-transition', 'delete-task-transition', 'publish-stage-message', 'save-requirement', 'void-requirement',
  'delete-requirement', 'wizard-next'
]);

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target || !persistableActions.has(target.dataset.action)) return;
  setTimeout(() => schedulePrototypePersist(target.dataset.action), 350);
});

document.addEventListener('change', (event) => {
  if (
    event.target.closest('[data-stage-index]')
    || event.target.closest('[data-project-customer-index]')
    || ['stage-file-input', 'task-file-input', 'customer-material-input', 'task-detail-status'].includes(event.target.id)
  ) {
    setTimeout(() => schedulePrototypePersist(event.target.id || 'change'), 350);
  }
});

const titles = {
  dashboard: ['工作台', '查看你参与的项目和当前进度'],
  projects: ['项目管理', '统一查看产品型号、阶段和负责人'],
  'customer-master': ['客户管理', '维护客户档案、联系人、资料、跟进和下单入口'],
  tasks: ['任务管理', '管理来自任务页或阶段详情的执行任务'],
  orders: ['订单管理', '维护客户订单、交付计划和修改记录'],
  analytics: ['统计看板', '按订单、资源和技术支持维度查看经营情况'],
  'task-detail': ['任务详情', '编辑任务信息、查看关联对象并围绕问题协作'],
  'project-detail': ['项目详情', '查看完整流程、责任人和阶段状态'],
  'project-edit': ['编辑项目', '维护项目基础信息与销售状态'],
  'stage-detail': ['阶段详情', '沉淀阶段资料与按时间排序的协作记录'],
  customers: ['项目客户列表', '维护当前项目下每个客户的独立状态'],
  'customer-detail': ['客户详情', '查看客户档案、资料、跟进与订单入口'],
  materials: ['项目资料区', '查看从各阶段显式共享出来的可信资料'],
  requirements: ['客户需求列表', '维护单个客户在当前项目下的需求记录'],
  'requirement-overview': ['需求纵览', '查看并提炼多个客户的通用需求'],
  'create-project': ['新建项目', '通过四步完成项目初始化'],
  templates: ['流程模板', '维护可复用的产品生命周期流程'],
  resources: ['资源管理', '维护用户、部门、角色、权限和系统枚举'],
};

const i18nMessages = {
  zh: {
    brand: { subtitle: 'Kozen Project Management' },
    menu: {
      dashboard: '工作台',
      projects: '项目管理',
      'customer-master': '客户管理',
      tasks: '任务管理',
      orders: '订单管理',
      analytics: '统计看板',
      templates: '流程模板',
      resources: '资源管理',
    },
    titles,
    login: {
      account: '登录邮箱',
      password: '密码',
      button: '登录',
      hint: '管理员账号：admin@kozenmobile.com / 123456',
      accountPlaceholder: '请输入登录邮箱',
      passwordPlaceholder: '请输入密码',
      success: '登录成功，欢迎 {name}',
      failed: '账号或密码不正确',
    },
    user: {
      logout: '退出登录',
      changePassword: '修改密码',
    },
    button: {
      newProject: '新建项目',
      create: '新增',
      edit: '编辑',
      delete: '删除',
      cancel: '取消',
      save: '保存',
      confirm: '确认',
      detail: '详情',
      back: '返回',
      close: '关闭',
      search: '搜索',
      upload: '上传',
      download: '下载',
    },
    analytics: {
      orders: '订单统计',
      resources: '资源分配情况',
      support: '技术支持情况',
      activity: '客户活跃度',
    },
    dashboard: {
      taskTotal: '任务总数',
      taskTotalHint: '与我相关的任务',
      myOngoing: '我正在执行',
      myOngoingHint: '执行人包含我，且任务未结束',
      waitingOthers: '等待他人',
      waitingOthersHint: '与我相关，但执行人是别人',
      taskTotalFilter: '工作台 / 任务总数',
      myOngoingFilter: '工作台 / 我正在执行',
      waitingOthersFilter: '工作台 / 等待他人',
      myProjects: '我的项目',
      myProjectsHint: '点击项目名称查看详情',
      viewAllProjects: '查看全部',
      emptyProjects: '暂无与你关联的项目',
    },
    notification: {
      title: '消息',
      internal: '内部消息',
      empty: '暂无消息',
      emptyUnread: '暂无未读消息',
      emptyRead: '暂无已读消息',
      all: '全部',
      unread: '未读',
      read: '已读',
      markRead: '标记已读',
      markAllRead: '一键已读',
      unreadStatus: '未读',
      readStatus: '已读',
    },
    taskList: {
      searchPlaceholder: '搜索任务编号 / 标题 / 阶段 / 客户',
      allProject: '全部项目',
      allStatus: '全部状态',
      allPriority: '全部优先级',
      allAssignee: '全部执行者',
      allCategory: '全部分类',
      create: '新建任务',
      context: '当前任务上下文',
      clearContext: '清除任务上下文',
      countSuffix: '个任务',
      form: {
        title: '任务标题',
        titlePlaceholder: '例如 确认海外版本支付语言包',
        description: '任务描述',
        descriptionPlaceholder: '说明任务背景、目标和交付标准',
        project: '所属项目',
        stage: '来源阶段',
        category: '任务分类',
        priority: '优先级',
        assignee: '执行者',
        participant: '参与者',
        peoplePlaceholder: '搜索姓名，支持多人',
        expectedCompletionAt: '预期完成时间',
        creator: '创建者',
        cancel: '取消',
        save: '保存任务',
      },
      panelTitle: '任务列表',
      panelDescription: '产品逻辑参考 Jira，并保留 KPM 的项目 / 阶段上下文',
      headers: { id: '编号', title: '标题', category: '分类', project: '项目', stage: '来源阶段', status: '状态', priority: '优先级', creator: '创建者', assignee: '执行者', participant: '参与者', expectedCompletionAt: '预期完成时间', source: '来源' },
      empty: '暂无匹配任务',
      unassigned: '待分配',
      activityFilterLabel: '客户 {customer} / 项目 {project} 的进行中任务',
      supportFilterLabel: '客户 {customer} / 技术支持 {support} / {category}任务',
      activeTaskCount: '进行中任务',
    },
    language: '中文 / EN',
  },
  en: {
    brand: { subtitle: 'Kozen Project Management' },
    menu: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      'customer-master': 'Customers',
      tasks: 'Tasks',
      orders: 'Orders',
      analytics: 'Analytics',
      templates: 'Workflow Templates',
      resources: 'Resources',
    },
    titles: {
      dashboard: ['Dashboard', 'View your projects and current progress'],
      projects: ['Project Management', 'Manage product models, stages and owners'],
      'customer-master': ['Customer Management', 'Maintain customer profiles, contacts, materials and follow-ups'],
      tasks: ['Task Management', 'Manage daily tasks from task page or stage details'],
      orders: ['Order Management', 'Manage customer orders, delivery plans and change history'],
      analytics: ['Analytics Dashboard', 'View orders, resource allocation and support status'],
      templates: ['Workflow Templates', 'Maintain reusable product lifecycle workflows'],
      resources: ['Resource Management', 'Maintain users, departments, roles, permissions and enums'],
      'project-detail': ['Project Detail', 'View full lifecycle stages and current status'],
      'project-edit': ['Edit Project', 'Maintain basic information and salesability'],
      'stage-detail': ['Stage Detail', 'Collect stage materials and timeline records'],
      'task-detail': ['Task Detail', 'Edit task information and collaborate around the issue'],
      customers: ['Project Customers', 'Maintain customer status under this project'],
      'customer-detail': ['Customer Detail', 'View customer profile, materials, follow-ups and order entry'],
      materials: ['Project Materials', 'View trusted materials explicitly published from stages'],
      requirements: ['Customer Requirements', 'Maintain requirements for one customer in this project'],
      'requirement-overview': ['Requirement Overview', 'Review and abstract common customer needs'],
      'create-project': ['Create Project', 'Initialize a project in four steps'],
    },
    login: {
      account: 'Email',
      password: 'Password',
      button: 'Sign in',
      hint: 'Admin account: admin@kozenmobile.com / 123456',
      accountPlaceholder: 'Enter login email',
      passwordPlaceholder: 'Enter password',
      success: 'Signed in. Welcome {name}',
      failed: 'Invalid account or password',
    },
    user: {
      logout: 'Sign out',
      changePassword: 'Change password',
    },
    button: {
      newProject: 'New Project',
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      save: 'Save',
      confirm: 'Confirm',
      detail: 'Details',
      back: 'Back',
      close: 'Close',
      search: 'Search',
      upload: 'Upload',
      download: 'Download',
    },
    analytics: {
      orders: 'Order Stats',
      resources: 'Resource Map',
      support: 'Support Status',
      activity: 'Customer Activity',
    },
    dashboard: {
      taskTotal: 'Total tasks',
      taskTotalHint: 'Tasks related to me',
      myOngoing: 'My in-progress',
      myOngoingHint: 'Assigned to me and not finished',
      waitingOthers: 'Waiting on others',
      waitingOthersHint: 'Related to me, assigned to someone else',
      taskTotalFilter: 'Dashboard / Total tasks',
      myOngoingFilter: 'Dashboard / My in-progress',
      waitingOthersFilter: 'Dashboard / Waiting on others',
      myProjects: 'My Projects',
      myProjectsHint: 'Click a project name to view details',
      viewAllProjects: 'View all',
      emptyProjects: 'No projects related to you',
    },
    notification: {
      title: 'Messages',
      internal: 'Internal Messages',
      empty: 'No messages',
      emptyUnread: 'No unread messages',
      emptyRead: 'No read messages',
      all: 'All',
      unread: 'Unread',
      read: 'Read',
      markRead: 'Mark read',
      markAllRead: 'Mark all read',
      unreadStatus: 'Unread',
      readStatus: 'Read',
    },
    taskList: {
      searchPlaceholder: 'Search ID / title / stage / customer',
      allProject: 'All projects',
      allStatus: 'All statuses',
      allPriority: 'All priorities',
      allAssignee: 'All assignees',
      allCategory: 'All categories',
      create: 'New task',
      context: 'Current task context',
      clearContext: 'Clear context',
      countSuffix: 'tasks',
      form: {
        title: 'Task title',
        titlePlaceholder: 'e.g. Confirm overseas payment language pack',
        description: 'Task description',
        descriptionPlaceholder: 'Describe background, goal and acceptance criteria',
        project: 'Project',
        stage: 'Source stage',
        category: 'Task category',
        priority: 'Priority',
        assignee: 'Assignees',
        participant: 'Participants',
        peoplePlaceholder: 'Search existing users; multiple supported',
        expectedCompletionAt: 'Expected completion date',
        creator: 'Creator',
        cancel: 'Cancel',
        save: 'Save task',
      },
      panelTitle: 'Task List',
      panelDescription: 'Jira-inspired task management with KPM project / stage context',
      headers: { id: 'ID', title: 'Title', category: 'Category', project: 'Project', stage: 'Source stage', status: 'Status', priority: 'Priority', creator: 'Creator', assignee: 'Assignees', participant: 'Participants', expectedCompletionAt: 'Expected completion', source: 'Source' },
      empty: 'No matching tasks',
      unassigned: 'Unassigned',
      activityFilterLabel: 'Active tasks for customer {customer} / project {project}',
      supportFilterLabel: 'Customer {customer} / support {support} / {category} tasks',
      activeTaskCount: 'Active tasks',
    },
    language: 'EN / 中文',
  },
};

function textFor(path, fallback = '') {
  return path.split('.').reduce((value, key) => value?.[key], i18nMessages[currentLanguage]) || fallback;
}

function formatText(template, values = {}) {
  return String(template || '').replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function escapeAttr(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'zh-CN';
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = textFor(element.dataset.i18n, element.textContent);
    if (value) element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const value = textFor(element.dataset.i18nPlaceholder, element.getAttribute('placeholder') || '');
    if (value) element.setAttribute('placeholder', value);
  });
  navItems.forEach((item) => {
    item.textContent = textFor(`menu.${item.dataset.view}`, item.textContent);
  });
  const activeView = activeViewName();
  const localizedTitle = i18nMessages[currentLanguage].titles[activeView] || titles[activeView];
  if (localizedTitle) {
    pageTitle.textContent = localizedTitle[0];
    pageSubtitle.textContent = localizedTitle[1];
  }
  if (languageToggle) languageToggle.textContent = textFor('language', '中文 / EN');
  if (loginLanguageToggle) loginLanguageToggle.textContent = textFor('language', '中文 / EN');
}


function isNotificationRead(message) {
  return Boolean(message.read || message.readFlag);
}

function notificationEmptyText() {
  if (notificationFilter === 'unread') return textFor('notification.emptyUnread', '暂无未读消息');
  if (notificationFilter === 'read') return textFor('notification.emptyRead', '暂无已读消息');
  return textFor('notification.empty', '暂无消息');
}

function renderNotificationList(messages = []) {
  const filteredMessages = messages.filter((message) => {
    const read = isNotificationRead(message);
    if (notificationFilter === 'unread') return !read;
    if (notificationFilter === 'read') return read;
    return true;
  });
  const filterButtons = `
    <div class="notification-actions">
      <div class="notification-filters">
        ${['all', 'unread', 'read'].map((filter) => `
          <button class="notification-filter-btn ${notificationFilter === filter ? 'active' : ''}" data-action="set-notification-filter" data-notification-filter="${filter}">
            ${textFor(`notification.${filter}`, filter)}
          </button>
        `).join('')}
      </div>
      <button class="muted-btn compact-btn" data-action="mark-all-notifications-read">${textFor('notification.markAllRead', '一键已读')}</button>
    </div>
  `;
  const body = filteredMessages.map((message) => {
    const read = isNotificationRead(message);
    return `
      <article class="notification-item ${read ? 'read' : 'unread'}">
        <div class="notification-item-head">
          <strong>${escapeAttr(message.title)}</strong>
          <span class="notification-status ${read ? 'read' : 'unread'}">${read ? textFor('notification.readStatus', '已读') : textFor('notification.unreadStatus', '未读')}</span>
        </div>
        <small>${escapeAttr(message.createdAt || '')}</small>
        <p>${escapeAttr(message.content)}</p>
        ${read ? '' : `<button class="inline-link notification-item-action" data-action="mark-notification-read" data-message-id="${escapeAttr(message.id)}">${textFor('notification.markRead', '标记已读')}</button>`}
      </article>
    `;
  }).join('') || `<p class="empty-note">${notificationEmptyText()}</p>`;
  return `${filterButtons}<div class="notification-list-scroll">${body}</div>`;
}

async function refreshNotifications({ loadList = false } = {}) {
  if (!currentSession?.token || !notificationCount) return;
  try {
    const unread = await kpmApi.get('/api/notifications/unread-count');
    notificationCount.textContent = String(unread.count || 0);
    if (loadList && notificationList) {
      const messages = await kpmApi.get('/api/notifications/messages?unreadOnly=false');
      notificationList.innerHTML = renderNotificationList(messages || []);
    }
  } catch (error) {
    console.warn('[KPM] notification refresh skipped', error);
  }
}

async function startNotificationRefresh() {
  if (notificationRefreshTimer) clearInterval(notificationRefreshTimer);
  let intervalSeconds = 120;
  try {
    const settings = await kpmApi.get('/api/notifications/settings');
    intervalSeconds = Number(settings.refreshIntervalSeconds || intervalSeconds);
  } catch (error) {
    console.warn('[KPM] notification settings fallback', error);
  }
  if (notificationRefreshNote) notificationRefreshNote.textContent = `${Math.round(intervalSeconds / 60) || 2} min`;
  await refreshNotifications();
  notificationRefreshTimer = setInterval(() => refreshNotifications(), Math.max(30, intervalSeconds) * 1000);
}

function stopNotificationRefresh() {
  if (notificationRefreshTimer) clearInterval(notificationRefreshTimer);
  notificationRefreshTimer = null;
  if (notificationCount) notificationCount.textContent = '0';
  if (notificationList) notificationList.innerHTML = `<p class="empty-note">${textFor('notification.emptyUnread', '暂无未读消息')}</p>`;
}


function showView(viewName) {
  const menuPermission = `menu:${viewName}`;
  if (viewName && [...navItems].some((item) => item.dataset.view === viewName) && !currentUserCan(menuPermission)) {
    showToast('当前账号没有该菜单权限。', 'warning');
    return;
  }
  views.forEach((view) => view.classList.toggle('active', view.id === `${viewName}-view`));
  navItems.forEach((item) => item.classList.toggle('active', item.dataset.view === viewName));
  const [title, subtitle] = i18nMessages[currentLanguage].titles[viewName] || titles[viewName];
  pageTitle.textContent = title;
  pageSubtitle.textContent = subtitle;
  setTimeout(applyPermissionVisibility, 0);
}

function badgeClass(status) {
  if (status === '已完成') return 'done';
  if (status === '进行中') return 'progress';
  return 'pending';
}

function requirementBadgeClass(status) {
  if (status === '已采纳' || status === '已实现') return 'done';
  if (status === '实现中') return 'progress';
  if (status === '已作废' || status === '已拒绝') return 'invalid';
  return 'pending';
}

function taskBadgeClass(status) {
  const semantic = taskStatusSemantic(status);
  if (semantic === '完成') return 'done';
  if (status === '进行中') return 'progress';
  if (semantic === '拒绝') return 'invalid';
  return 'pending';
}

function customerLevelBadgeClass(level = '') {
  if (level.startsWith('A')) return 'invalid';
  if (level.startsWith('B')) return 'progress';
  if (level.startsWith('C')) return 'done';
  return 'pending';
}

function customerProjectStatusBadgeClass(status = '') {
  if (['量产维护'].includes(status)) return 'done';
  if (['商机发掘', '样机测试', '研发投入', '订单冲刺', '首单护航'].includes(status)) return 'progress';
  if (['EOL', 'Support Ended'].includes(status)) return 'invalid';
  return 'pending';
}

function normalizePersonList(values = []) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function taskAssigneeNames(task) {
  return task.assignees?.length ? task.assignees : task.assignee ? [task.assignee] : [];
}

function taskPersonLabel(values, fallback = '-') {
  return values?.length ? values.join('、') : fallback;
}

function uniqueOptionNames(values = []) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

function configuredEnumNames(options = [], currentValue = '', fallback = []) {
  const configuredNames = options
    .filter((option) => option.active !== false)
    .map((option) => option.name || option.value)
    .filter(Boolean);
  return uniqueOptionNames([...configuredNames, currentValue, ...fallback]);
}

function activeTaskStatusNames() {
  return configuredEnumNames(taskStatusOptions);
}

function taskStatusSemantic(statusName) {
  return taskStatusOptions.find((status) => status.name === statusName)?.semantic || '普通';
}

function allowedNextTaskStatuses(statusName) {
  return taskStatusTransitions
    .filter((transition) => transition.from === statusName)
    .map((transition) => transition.to)
    .filter((name) => taskStatusOptions.some((status) => status.name === name && status.active));
}

function availableTaskDetailStatuses(task) {
  return configuredEnumNames(taskStatusOptions, task.status);
}

function taskStatusTransitionHint(task) {
  const nextStatuses = allowedNextTaskStatuses(task.status);
  return nextStatuses.length
    ? `配置流转建议：${task.status} → ${nextStatuses.join('、')}`
    : '当前状态暂无配置流转；仍可选择资源管理中启用的任务状态。';
}

function activeUsers() {
  return resourceData.users.filter((user) => user.status === '启用');
}

function usersForAccountSelection(selectedAccounts = []) {
  const selected = new Set(selectedAccounts.filter(Boolean));
  return resourceData.users.filter((user) => user.status === '启用' || selected.has(user.account));
}

function usersForNameSelection(selectedNames = []) {
  const selected = new Set(selectedNames.filter(Boolean));
  return resourceData.users.filter((user) => user.status === '启用' || selected.has(user.name));
}

function userDisplayNames(selectedPeople = []) {
  return usersForNameSelection(selectedPeople).map((user) => user.name);
}

function personCandidateNames(selectedPeople = [], users = usersForNameSelection(selectedPeople)) {
  return users.map((user) => user.name);
}

function customerByName(name) {
  return customers.find((customer) => customer.name === name);
}

function customerSalesOwners(customerName) {
  return customerByName(customerName)?.salesOwners || [];
}

function customerSupportOwners(customerName) {
  return customerByName(customerName)?.supportOwners || [];
}

function salesUsers(selectedNames = []) {
  const selected = new Set(selectedNames.filter(Boolean));
  return resourceData.users.filter((user) => (user.status === '启用' && user.departments.includes('销售部')) || selected.has(user.name));
}

function supportUsers(selectedNames = []) {
  const selected = new Set(selectedNames.filter(Boolean));
  return resourceData.users.filter((user) => (user.status === '启用' && user.departments.includes('技术支持部')) || selected.has(user.name));
}

function searchablePeopleInput(id, selectedPeople = [], placeholder = '搜索姓名，多个用逗号分隔', candidateNames = personCandidateNames(selectedPeople)) {
  return `
    <input id="${id}" class="text-input" list="${id}-options" value="${selectedPeople.join('、')}" placeholder="${placeholder}" />
    ${renderNameDatalist(`${id}-options`, candidateNames)}
  `;
}

function collectPeopleInputValue(id) {
  const rawNames = normalizePersonList((document.getElementById(id)?.value || '').split(/[、,，]/));
  return rawNames
    .map((value) => userByNameValue(value)?.name || userByAccount(value)?.name || '')
    .filter(Boolean);
}

function invalidPeopleInputNames(id) {
  return normalizePersonList((document.getElementById(id)?.value || '').split(/[、,，]/))
    .filter((value) => !userByNameValue(value) && !userByAccount(value));
}

function validatePeopleSelection(id, label, options = {}) {
  const invalid = invalidPeopleInputNames(id);
  if (invalid.length) {
    return validateRequiredFields([{
      id,
      label,
      value: '',
      valid: () => false,
      message: `${label}必须从已有用户搜索结果中选择：${invalid.join('、')}`,
    }], { title: '请检查人员选择' });
  }
  if (options.required && !collectPeopleInputValue(id).length) {
    return validateRequiredFields([{ id, label, value: [] }], { title: '请检查人员选择' });
  }
  return true;
}

function renderNameDatalist(id, names = []) {
  return `
    <datalist id="${id}">
      ${[...new Set(names)].map((name) => `<option value="${name}"></option>`).join('')}
    </datalist>
  `;
}

function renderFormModal(content, size = 'wide') {
  return `
    <div class="modal-backdrop">
      <section class="modal-card form-modal ${size}">
        ${content}
      </section>
    </div>
  `;
}

const previewLimits = {
  contacts: 3,
  files: 5,
  messages: 5,
};

function latestItems(items = [], limit = 5) {
  return [...items].sort((a, b) => String(b.time || b.createdAt || '').localeCompare(String(a.time || a.createdAt || ''))).slice(0, limit);
}

function previewItems(items = [], limit = 5, options = {}) {
  const list = options.sortByTime ? latestItems(items, items.length || limit) : [...items];
  return list.slice(0, limit);
}

function overflowCount(items = [], limit = 5) {
  return Math.max(items.length - limit, 0);
}

function renderOverflowButton(items = [], limit = 5, action, labelPrefix = '查看全部') {
  if (overflowCount(items, limit) <= 0) return '';
  return `<button class="ghost-btn compact-btn" data-action="${action}">${labelPrefix}（共 ${items.length} 条）</button>`;
}

function fileTitle(file = {}) {
  return file.name || file.fileName || '-';
}

function attrValue(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function renderFileRows(files = [], options = {}) {
  if (!files.length) return `<p class="empty-note">${options.emptyText || '暂无文件'}</p>`;
  return files.map((file) => `
    <article class="file-row">
      <div>
        <strong>${fileTitle(file)}</strong>
        <small>${file.type || '文件'} · ${file.size || '-'} · ${file.uploader || currentUser} · ${file.time || '-'}</small>
      </div>
      <div class="file-actions">
        ${options.actionRenderer ? options.actionRenderer(file) : renderDownloadButton(file)}
      </div>
    </article>
  `).join('');
}

function renderDownloadButton(file = {}) {
  const objectKey = file.objectKey || '';
  const fileName = fileTitle(file);
  return `<button class="ghost-btn" data-action="download-file" data-object-key="${attrValue(objectKey)}" data-file-name="${attrValue(fileName)}">下载</button>`;
}

function renderStageFileActions(file, project) {
  const publishedMaterials = project?.projectMaterials || [];
  return `
    ${renderDownloadButton(file)}
    ${publishedMaterials.some((material) => material.name === fileTitle(file))
      ? '<button class="muted-btn" disabled>已发布</button>'
      : `<button class="ghost-btn" data-action="request-stage-file-publish" data-file-name="${attrValue(fileTitle(file))}">发布到项目资料区</button>`}
  `;
}

function renderAttachmentChips(attachments = []) {
  if (!attachments.length) return '';
  return `
    <div class="attachment-list">
      ${attachments.map((attachment) => `<span>${attachment.type || '文件'} · ${attachment.name || '-'}</span>`).join('')}
    </div>
  `;
}

function renderMessageCards(messages = [], emptyText = '暂无记录') {
  if (!messages.length) return `<p class="empty-note">${emptyText}</p>`;
  return messages.map((message) => `
    <article class="message-card">
      <div class="detail-head">
        <div>
          <h3>${message.author || currentUser}</h3>
          <p>${message.time || '-'}</p>
        </div>
      </div>
      <p>${message.text || '补充附件'}</p>
      ${renderAttachmentChips(message.attachments || [])}
    </article>
  `).join('');
}

function renderSectionFooter(items = [], limit = 5, action, note) {
  const hiddenCount = overflowCount(items, limit);
  if (hiddenCount <= 0) return '';
  return `
    <div class="section-footer">
      <span>${note || `当前仅展示最近 ${limit} 条`}</span>
      <span>还有 ${hiddenCount} 项未展示，可点击上方“查看全部”</span>
    </div>
  `;
}

let validationToastTimer = null;

function validationFieldElement(field) {
  if (field.element) return field.element;
  if (field.id) return document.getElementById(field.id);
  if (field.selector) return document.querySelector(field.selector);
  return null;
}

function validationFieldValue(field) {
  if (Object.prototype.hasOwnProperty.call(field, 'value')) return field.value;
  const element = validationFieldElement(field);
  if (!element) return '';
  if (element.type === 'checkbox') return element.checked;
  return element.value;
}

function isBlankValidationValue(value) {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'boolean') return value === false;
  return String(value ?? '').trim() === '';
}

function clearValidationState(root = document) {
  root.querySelectorAll('.field-invalid').forEach((element) => element.classList.remove('field-invalid'));
  root.querySelectorAll('.form-field.validation-error').forEach((element) => element.classList.remove('validation-error'));
  root.querySelectorAll('.field-error-text').forEach((element) => element.remove());
}

function clearSingleValidationMark(element) {
  if (!element) return;
  element.classList.remove('field-invalid');
  const field = element.closest('.form-field');
  field?.classList.remove('validation-error');
  field?.querySelector('.field-error-text')?.remove();
}

function markValidationField(field) {
  const element = validationFieldElement(field);
  if (!element) return;
  element.classList.add('field-invalid');
  const wrapper = element.closest('.form-field');
  if (wrapper) {
    wrapper.classList.add('validation-error');
    if (!wrapper.querySelector('.field-error-text')) {
      const hint = document.createElement('small');
      hint.className = 'field-error-text';
      hint.textContent = field.message || `请填写${field.label}`;
      wrapper.appendChild(hint);
    }
  }
}

function showToast(message, level = 'error') {
  let toast = document.getElementById('form-validation-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'form-validation-toast';
    document.body.appendChild(toast);
  }
  const normalizedLevel = ['success', 'warning', 'error'].includes(level) ? level : 'error';
  toast.className = `form-validation-toast toast-${normalizedLevel}`;
  toast.textContent = message;
  toast.classList.add('active');
  clearTimeout(validationToastTimer);
  validationToastTimer = setTimeout(() => toast.classList.remove('active'), 4200);
}

function showValidationToast(message) {
  showToast(message, 'error');
}

function validateRequiredFields(fields, options = {}) {
  clearValidationState();
  const missing = fields.filter((field) => {
    if (field.when && !field.when()) return false;
    const value = validationFieldValue(field);
    if (field.valid) return !field.valid(value, validationFieldElement(field));
    return isBlankValidationValue(value);
  });
  if (!missing.length) return true;

  missing.forEach(markValidationField);
  const labels = missing.map((field) => field.label).join('、');
  const message = options.message || `${options.title || '请补充必填信息'}：${labels}`;
  window.__kpmLastValidationError = {
    message,
    fields: missing.map((field) => field.label),
    at: new Date().toISOString(),
  };
  showValidationToast(message);
  const firstElement = validationFieldElement(missing[0]);
  firstElement?.focus?.({ preventScroll: false });
  firstElement?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  return false;
}

const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function textLengthBetween(value, min, max) {
  const length = String(value ?? '').trim().length;
  return length >= min && length <= max;
}

function optionalMaxLength(max) {
  return (value) => String(value ?? '').trim().length <= max;
}

function requiredMaxLength(max) {
  return (value) => {
    const text = String(value ?? '').trim();
    return text.length > 0 && text.length <= max;
  };
}

function optionalEmailValue(value) {
  const text = String(value ?? '').trim();
  return !text || (text.length <= 128 && EMAIL_PATTERN.test(text));
}

function requiredEmailValue(value) {
  const text = String(value ?? '').trim();
  return text.length > 0 && text.length <= 128 && EMAIL_PATTERN.test(text);
}

function optionalPhoneValue(value) {
  const text = String(value ?? '').trim();
  return !text || (text.length >= 4 && text.length <= 32);
}

function optionalIsoDateValue(value) {
  const text = String(value ?? '').trim();
  return !text || /^\d{4}-\d{2}-\d{2}$/.test(text);
}

function requiredIsoDateValue(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? '').trim());
}

function validateCustomerContactForm() {
  return validateRequiredFields([
    { id: 'customer-contact-name', label: '联系人姓名', valid: requiredMaxLength(60), message: '联系人姓名必填，且不能超过 60 个字符' },
    { id: 'customer-contact-title', label: '联系人职位', valid: optionalMaxLength(80), message: '联系人职位不能超过 80 个字符' },
    { id: 'customer-contact-phone', label: '联系人电话', valid: optionalPhoneValue, message: '联系人电话长度需为 4-32 个字符，可包含国家区号' },
    { id: 'customer-contact-email', label: '联系人邮箱', valid: optionalEmailValue, message: '请输入正确的邮箱格式，例如 name@example.com' },
    { id: 'customer-contact-remark', label: '联系人备注', valid: optionalMaxLength(500), message: '联系人备注不能超过 500 个字符' },
  ], { title: '请检查联系人信息' });
}

function validateTextOrFiles(textId, fileInputId, label) {
  const textValue = document.getElementById(textId)?.value.trim() || '';
  const fileCount = document.getElementById(fileInputId)?.files?.length || 0;
  if (textValue.length > 2000) {
    return validateRequiredFields([{ id: textId, label, value: textValue, valid: optionalMaxLength(2000), message: `${label}不能超过 2000 个字符` }]);
  }
  if (textValue || fileCount) return true;
  return validateRequiredFields([{ id: textId, label, value: '' }]);
}

function buttonPermissionCatalog() {
  return buttonPermissionRegistry.map((permission) => ({
    ...permission,
    type: '按钮权限',
  }));
}

function menuPermissionCatalog() {
  return [...navItems].map((item) => ({
    key: `menu:${item.dataset.view}`,
    name: `菜单 / ${item.textContent.trim()}`,
    type: '菜单权限',
    target: item.textContent.trim(),
    location: '左侧主菜单',
  }));
}

function systemPermissionCatalog() {
  return [...menuPermissionCatalog(), ...buttonPermissionCatalog()];
}

function currentUserCan(permissionKey) {
  if (!permissionKey) return true;
  return currentUserPermissions.includes(permissionKey);
}

const actionPermissionMap = {
  'open-create': 'button:projects:create',
  'save-project-edit': 'button:project-edit:save',
  'wizard-next': 'button:projects:create',
  'delete-project': 'button:projects:delete',
  'archive-project': 'button:projects:archive',
  'open-task-form': 'button:tasks:create',
  'save-task': 'button:tasks:save',
  'create-task-from-stage': 'button:stage-detail:create-task',
  'save-stage-task': 'button:stage-detail:create-task',
  'open-blocker-help-modal': 'button:stage-detail:blocker-help',
  'save-blocker-help-task': 'button:stage-detail:create-blocker-task',
  'request-stage-file-publish': 'button:stage-detail:publish-file',
  'publish-stage-message': 'button:stage-detail:publish-record',
  'save-task-detail': 'button:task-detail:save',
  'publish-task-comment': 'button:task-detail:publish-comment',
  'save-project-customer': 'button:project-customers:save-link',
  'toggle-requirement-form': 'button:requirements:create',
  'save-requirement': 'button:requirements:save',
  'void-requirement': 'button:requirements:void',
  'delete-requirement': 'button:requirements:delete',
  'open-template-create': 'button:templates:create',
  'save-template': 'button:templates:save',
  'toggle-template-status': 'button:templates:toggle',
  'delete-template': 'button:templates:delete',
  'open-resource-create': 'button:resources:edit',
  'save-resource': 'button:resources:edit',
  'delete-resource': 'button:resources:edit',
  'toggle-user-status': 'button:resources:edit',
  'reset-user-password': 'button:users:reset-password',
  'open-customer-create': 'button:customers:create',
  'save-customer-master': 'button:customers:create',
  'delete-customer-master': 'button:customers:delete',
  'save-customer-contact': 'button:customer-detail:add-contact',
  'delete-customer-contact': 'button:customer-detail:add-contact',
  'save-customer-followup': 'button:customer-detail:add-followup',
  'save-customer-order': 'button:customer-detail:create-order',
  'save-order': 'button:orders:create',
  'delete-order': 'button:orders:delete',
};

function updateCurrentUserDisplay() {
  const trigger = document.getElementById('user-menu-trigger');
  if (!trigger) return;
  const nameNode = trigger.querySelector('span');
  const roleNode = trigger.querySelector('small');
  if (nameNode) nameNode.textContent = currentUser;
  if (roleNode) roleNode.textContent = currentUserRoles.join('、') || '普通用户';
}

function syncSession(loginResult = {}) {
  const user = loginResult.user || {};
  if (loginResult.token) {
    localStorage.setItem('kpm.authToken', loginResult.token);
    currentSession = { token: loginResult.token };
  }
  currentAccount = user.account || currentAccount;
  currentUser = user.name || currentUser;
  currentUserPermissions = asArray(user.permissions);
  currentUserRoles = asArray(user.roles);
  localStorage.setItem('kpm.currentAccount', currentAccount);
  localStorage.setItem('kpm.currentUserName', currentUser);
  localStorage.setItem('kpm.currentPermissions', JSON.stringify(currentUserPermissions));
  localStorage.setItem('kpm.currentRoles', JSON.stringify(currentUserRoles));
  updateCurrentUserDisplay();
}

function clearSession() {
  localStorage.removeItem('kpm.authToken');
  localStorage.removeItem('kpm.currentAccount');
  localStorage.removeItem('kpm.currentUserName');
  localStorage.removeItem('kpm.currentPermissions');
  localStorage.removeItem('kpm.currentRoles');
  currentSession = { token: '' };
  currentUserPermissions = [];
  currentUserRoles = [];
}

function applyPermissionVisibility() {
  updateCurrentUserDisplay();
  navItems.forEach((item) => {
    const permissionKey = `menu:${item.dataset.view}`;
    const allowed = currentUserCan(permissionKey);
    item.classList.toggle('permission-hidden', !allowed);
    item.disabled = !allowed;
  });
  document.querySelectorAll('[data-action]').forEach((element) => {
    const permissionKey = actionPermissionMap[element.dataset.action];
    if (!permissionKey) return;
    const allowed = currentUserCan(permissionKey);
    element.classList.toggle('permission-hidden', !allowed);
    element.disabled = !allowed;
    if (!allowed) element.title = '当前账号没有该操作权限';
  });
  const activeNav = [...navItems].find((item) => item.classList.contains('active'));
  if (activeNav && activeNav.disabled) {
    const firstAllowed = [...navItems].find((item) => !item.disabled);
    if (firstAllowed) showView(firstAllowed.dataset.view);
  }
}

function permissionByKey(permissionKey) {
  return systemPermissionCatalog().find((permission) => permission.key === permissionKey);
}

function permissionDisplayName(permissionKey) {
  return permissionByKey(permissionKey)?.name || permissionKey;
}

function uniquePermissionKeys(permissionKeys = []) {
  return [...new Set(permissionKeys.filter(Boolean))];
}

function permissionCountLabel(permissionKeys = [], emptyText = '无权限') {
  const count = uniquePermissionKeys(permissionKeys).length;
  return count ? `${count} 项权限` : emptyText;
}

function permissionSearchLabel(permission) {
  return `${permission.name}｜${permission.type}｜${permission.key}`;
}

function permissionFromSearchValue(value) {
  const keyword = value.trim().toLowerCase();
  if (!keyword) return null;
  const catalog = systemPermissionCatalog();
  return catalog.find((permission) => (
    permissionSearchLabel(permission).toLowerCase() === keyword
    || permission.name.toLowerCase() === keyword
    || permission.key.toLowerCase() === keyword
    || permission.target.toLowerCase() === keyword
  )) || catalog.find((permission) => (
    permissionSearchLabel(permission).toLowerCase().includes(keyword)
    || permission.name.toLowerCase().includes(keyword)
    || permission.key.toLowerCase().includes(keyword)
    || permission.target.toLowerCase().includes(keyword)
    || permission.location.toLowerCase().includes(keyword)
  ));
}

function permissionPickerInputId(context) {
  return `${context}-permission-search`;
}

function permissionPickerValues(context, fallbackKeys = []) {
  return Object.prototype.hasOwnProperty.call(permissionPickerDrafts, context)
    ? uniquePermissionKeys(permissionPickerDrafts[context])
    : uniquePermissionKeys(fallbackKeys);
}

function collectPermissionSelections(context) {
  return uniquePermissionKeys([...document.querySelectorAll(`[data-permission-selection="${context}"]`)].map((input) => input.value));
}

function permissionSelectionMeta(permissionKey) {
  return permissionByKey(permissionKey) || {
    key: permissionKey,
    name: permissionKey,
    type: '未知权限',
    target: permissionKey,
    location: '-',
  };
}

function renderPermissionPicker(context, selectedKeys = [], emptyText = '暂无授权权限') {
  const selected = uniquePermissionKeys(selectedKeys);
  const selectedSet = new Set(selected);
  const candidates = systemPermissionCatalog()
    .filter((permission) => !selectedSet.has(permission.key))
    .map(permissionSearchLabel);
  const inputId = permissionPickerInputId(context);

  return `
    <div class="permission-picker">
      <div class="permission-picker-head">
        <span>${permissionCountLabel(selected, '0 项权限')}</span>
        <small class="field-hint">通过搜索添加真实菜单或按钮权限，避免一次性铺开全部权限。</small>
      </div>
      <div class="permission-search-box">
        <input id="${inputId}" class="text-input" list="${inputId}-options" placeholder="输入权限名称 / 菜单 / 按钮后添加" />
        ${renderNameDatalist(`${inputId}-options`, candidates)}
        <button class="ghost-btn" data-action="add-permission-selection" data-permission-context="${context}">添加权限</button>
      </div>
      <div class="permission-selected-list">
        ${selected.map((permissionKey) => {
          const permission = permissionSelectionMeta(permissionKey);
          return `
            <div class="permission-selected-row">
              <input type="hidden" data-permission-selection="${context}" value="${permission.key}" />
              <div>
                <strong>${permission.name}</strong>
                <small>${permission.type} · ${permission.location} · ${permission.target}</small>
              </div>
              <button class="muted-btn" data-action="remove-permission-selection" data-permission-context="${context}" data-permission-key="${permission.key}">移除</button>
            </div>
          `;
        }).join('') || `<p class="empty-note">${emptyText}</p>`}
      </div>
    </div>
  `;
}

function userByAccount(account) {
  return resourceData.users.find((user) => user.account === account);
}

function userByNameValue(name) {
  return resourceData.users.find((user) => user.name === name);
}

function userName(account) {
  return userByAccount(account)?.name || '待分配';
}

function singleUserSearchInput(id, selectedAccount, placeholder = '输入姓名搜索') {
  const selectedName = userName(selectedAccount);
  const candidates = personCandidateNames([selectedName], usersForAccountSelection([selectedAccount]));
  return `
    <input id="${id}" class="text-input" list="${id}-options" value="${selectedName === '待分配' ? '' : selectedName}" placeholder="${placeholder}" />
    ${renderNameDatalist(`${id}-options`, candidates)}
  `;
}

function collectUserAccountInputValue(id, fallbackAccount = '') {
  const value = document.getElementById(id)?.value.trim();
  return userByNameValue(value)?.account || fallbackAccount;
}

function userDepartmentLabel(account) {
  return joinValues(userByAccount(account)?.departments || []);
}

function projectManagerName(project) {
  return userName(project.managerAccount);
}

function projectRoleOptions(selectedRoles = []) {
  const selected = new Set(selectedRoles.filter(Boolean));
  return resourceData.roles.filter((role) => role.type === '项目内角色' && (role.status === '启用' || selected.has(role.name)));
}

function defaultProjectMemberRole() {
  return projectRoleOptions().find((role) => role.name === '项目负责人')?.name || projectRoleOptions()[0]?.name || '待分配';
}

function hasAvailableProjectRoles() {
  return projectRoleOptions().length > 0;
}

function ensureManagerMembership(members, managerAccount) {
  if (!managerAccount || members.some((member) => member.userAccount === managerAccount)) return members;
  return [...members, { userAccount: managerAccount, role: defaultProjectMemberRole() }];
}

function projectMemberUser(member) {
  return userByAccount(member.userAccount);
}

function assigneeLabel(assignee) {
  return assignee.type === 'user' ? userName(assignee.account) : assignee.name;
}

function stageOwnerLabel(stage) {
  return joinValues((stage.assignees || []).map(assigneeLabel), '待配置');
}

function stagePrimaryOwner(stage) {
  const userAssignee = (stage.assignees || []).find((assignee) => assignee.type === 'user');
  return assigneeLabel(userAssignee || stage.assignees?.[0] || { type: 'department', name: '待配置' });
}

function stageResponsibleUserNames(stage) {
  return normalizePersonList(
    (stage.assignees || [])
      .filter((assignee) => assignee.type === 'user')
      .map((assignee) => userName(assignee.account)),
  );
}

function fileTypeLabel(file) {
  if (file.type.startsWith('image/')) return '图片';
  if (file.type.startsWith('video/')) return '视频';
  return '文件';
}

function fileBusinessId(...parts) {
  return parts.filter(Boolean).join('-').replace(/[\\/]/g, '-').replace(/\s+/g, '-');
}

function uploadedFilePayload(uploaded) {
  return {
    name: uploaded.name || uploaded.fileName,
    fileName: uploaded.fileName || uploaded.name,
    type: uploaded.fileType || uploaded.type || '文件',
    fileType: uploaded.fileType || uploaded.type || '文件',
    size: uploaded.size || '-',
    fileSize: uploaded.size || '-',
    uploader: uploaded.uploader || currentUser,
    time: uploaded.uploadedAt || prototypeNow,
    bucket: uploaded.bucket,
    objectKey: uploaded.objectKey,
    storageUrl: uploaded.storageUrl,
    category: uploaded.category,
  };
}

async function uploadFilesToOss(files = [], category, businessId) {
  const uploads = [];
  for (const file of files) {
    const uploaded = await kpmApi.uploadFile(file, category, businessId, currentUser);
    uploads.push(uploadedFilePayload(uploaded));
  }
  return uploads;
}

async function openFileDownload(file) {
  if (!file?.objectKey) {
    showToast('该文件还没有真实 OSS objectKey，可能是历史种子数据或上传未完成。', 'warning');
    return;
  }
  const fileName = file.fileName || file.name || fileTitle(file);
  const result = await kpmApi.downloadUrl(file.objectKey, fileName);
  const anchor = document.createElement('a');
  anchor.href = result.url;
  anchor.download = fileName || '';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function nextTaskId() {
  const maxTaskNumber = tasks.reduce((max, task) => {
    const current = Number(task.id.split('-')[1]);
    return Number.isNaN(current) ? max : Math.max(max, current);
  }, 100);
  return `KPM-${maxTaskNumber + 1}`;
}

function nextOrderId() {
  const currentMonth = prototypeToday.slice(0, 7).replace('-', '');
  const maxOrderNumber = orders
    .filter((order) => order.id.includes(currentMonth))
    .reduce((max, order) => {
      const current = Number(order.id.split('-').at(-1));
      return Number.isNaN(current) ? max : Math.max(max, current);
    }, 0);
  return `ORD-${currentMonth}-${String(maxOrderNumber + 1).padStart(3, '0')}`;
}

function nextRequirementId() {
  const maxRequirementNumber = projects
    .flatMap((project) => project.projectCustomers)
    .flatMap((customer) => customer.requirements)
    .reduce((max, requirement) => {
      const current = Number(requirement.id?.split('-')[1]);
      return Number.isNaN(current) ? max : Math.max(max, current);
    }, 0);
  return `REQ-${String(maxRequirementNumber + 1).padStart(3, '0')}`;
}

function findRequirementById(requirementId) {
  for (const project of projects) {
    for (let customerIndex = 0; customerIndex < project.projectCustomers.length; customerIndex += 1) {
      const customer = project.projectCustomers[customerIndex];
      const requirementIndex = customer.requirements.findIndex((requirement) => requirement.id === requirementId);
      if (requirementIndex >= 0) {
        return {
          project,
          customer,
          customerIndex,
          requirement: customer.requirements[requirementIndex],
          requirementIndex,
        };
      }
    }
  }
  return null;
}

function findRequirementByTaskId(taskId) {
  for (const project of projects) {
    for (let customerIndex = 0; customerIndex < project.projectCustomers.length; customerIndex += 1) {
      const customer = project.projectCustomers[customerIndex];
      const requirementIndex = customer.requirements.findIndex((requirement) => requirement.taskId === taskId);
      if (requirementIndex >= 0) {
        return {
          project,
          customer,
          customerIndex,
          requirement: customer.requirements[requirementIndex],
          requirementIndex,
        };
      }
    }
  }
  return null;
}

function syncRequirementStatusFromTask(task) {
  const linked = findRequirementByTaskId(task.id);
  if (!linked) return;
  if (taskStatusSemantic(task.status) === '完成') linked.requirement.status = '已实现';
  if (taskStatusSemantic(task.status) === '拒绝') linked.requirement.status = '已拒绝';
  if (taskStatusSemantic(task.status) === '普通') linked.requirement.status = '实现中';
}

function resetTaskFormState() {
  taskFormState = {
    project: projects[0].externalName,
    stage: projects[0].stages[0].name,
    category: '其他',
    source: '任务管理',
  };
}

function activeCustomerProjectStatuses() {
  return configuredEnumNames(customerProjectStatusOptions);
}

function customerProjectStatusOptionsForValue(currentValue) {
  return configuredEnumNames(customerProjectStatusOptions, currentValue);
}

function activeCustomerLevels() {
  return configuredEnumNames(customerLevelOptions);
}

function customerLevelOptionsForValue(currentValue) {
  return configuredEnumNames(customerLevelOptions, currentValue, ['C / 普通客户']);
}

function activeOrderTypes() {
  return configuredEnumNames(orderTypeOptions);
}

function orderTypeOptionsForValue(currentValue) {
  return configuredEnumNames(orderTypeOptions, currentValue, ['正式订单']);
}

function projectCustomerStatusForOrderType(orderType) {
  const mapping = {
    样品订单: '样机测试',
    预订单: '商机发掘',
    正式订单: '订单冲刺',
  };
  return mapping[orderType] || '订单冲刺';
}

function normalizeLegacyCustomerProjectStatus(status) {
  const mapping = {
    推广阶段: '商机发掘',
    客户调试阶段: '样机测试',
    试用阶段: '样机测试',
    客户下单阶段: '订单冲刺',
    稳定出货阶段: '量产维护',
  };
  return mapping[status] || status || activeCustomerProjectStatuses()[0] || '商机发掘';
}

function projectByExternalName(projectName) {
  return projects.find((project) => project.externalName === projectName);
}

function projectCustomerLink(projectName, customerName) {
  return projectByExternalName(projectName)?.projectCustomers.find((item) => item.customerName === customerName);
}

function ensureCustomerProjectLinkForOrder(order) {
  const project = projectByExternalName(order.projectName);
  const customer = customerByName(order.customerName);
  if (!project || !customer) return null;
  let link = project.projectCustomers.find((item) => item.customerName === customer.name);
  if (!link) {
    link = {
      customerName: customer.name,
      region: customer.region,
      projectStatus: projectCustomerStatusForOrderType(order.type || '正式订单'),
      requirements: [],
    };
    project.projectCustomers.push(link);
  }
  return link;
}

function analyticsYearOptions() {
  return [...new Set([...orders.map((order) => order.orderDate.slice(0, 4)), prototypeToday.slice(0, 4)])].sort();
}

function assignableCustomers(selectedCustomerName = '') {
  return customers.filter((customer) => customer.status !== '已停用' || customer.name === selectedCustomerName);
}

function ensureStageCollaborationData() {
  projects.forEach((project) => {
    project.stages.forEach((stage) => {
      stage.assignees = normalizeStageAssigneesToUsers(stage.assignees, stage.name);
      if (!stage.files) stage.files = [];
      if (!stage.messages) stage.messages = [];
    });
  });

  if (window.__kpmHydratedFromApi) return;

  const p8 = projects.find((project) => project.id === 'p8-dual');
  if (p8) {
    p8.stages[4].files = [
      { name: '软件适配方案_v3.pdf', type: 'PDF', size: '2.4 MB', uploader: '李娜', time: '2026-05-13 10:20' },
      { name: '固件演示.mp4', type: '视频', size: '38 MB', uploader: '李娜', time: '2026-05-12 16:40' },
      { name: '屏幕布局.png', type: '图片', size: '1.2 MB', uploader: '陈晨', time: '2026-05-11 09:15' },
    ];
    p8.stages[4].messages = [
      {
        author: '李娜',
        time: '2026-05-14 17:30',
        text: '已完成支付模块适配，等待硬件版本 B 的最终确认。',
        attachments: [{ name: 'payment-adapter-log.txt', type: '文件' }],
      },
      {
        author: '陈晨',
        time: '2026-05-13 14:10',
        text: '补充海外客户演示视频，方便后续推广团队复用。',
        attachments: [{ name: 'demo-walkthrough.mp4', type: '视频' }],
      },
      {
        author: '李娜',
        time: '2026-05-12 09:05',
        text: '上传新版 UI 截图，供技术支持提前熟悉界面。',
        attachments: [{ name: 'ui-preview.png', type: '图片' }],
      },
    ];
  }
}

function ensureTaskCollaborationData() {
  tasks.forEach((task) => {
    task.description ||= '';
    task.creator ||= currentUser;
    task.assignees = normalizePersonList(task.assignees || (task.assignee ? [task.assignee] : []));
    task.participants = normalizePersonList(task.participants || []);
    task.expectedCompletionAt ||= task.dueDate || '-';
    task.attachments ||= [];
    task.comments ||= [];
  });
}

function ensureCustomerAndOrderData() {
  customers.forEach((customer) => {
    customer.level ||= 'C / 普通客户';
    customer.contacts ||= [];
    customer.materials ||= [];
    customer.followups ||= [];
  });
  projects.forEach((project) => {
    project.projectCustomers.forEach((projectCustomer) => {
      projectCustomer.projectStatus = normalizeLegacyCustomerProjectStatus(projectCustomer.projectStatus);
      projectCustomer.requirements ||= [];
      syncCustomerSnapshotReferences(projectCustomer.customerName);
    });
  });
  const ordersByNewestFirst = [...orders].sort((a, b) => b.orderDate.localeCompare(a.orderDate));
  ordersByNewestFirst.forEach((order) => {
    order.type ||= order.id.includes('202604') ? '预订单' : order.quantity <= 90 ? '样品订单' : '正式订单';
    ensureCustomerProjectLinkForOrder(order);
  });
}

function ongoingStageNames(project) {
  return project.stages.filter((stage) => stage.status === '进行中').map((stage) => stage.name);
}

function deriveProjectStatusFromStages(project) {
  if (!project?.stages?.length) return '未开始';
  if (project.stages.every((stage) => stage.status === '已完成')) return '已完成';
  if (project.stages.some((stage) => stage.status === '进行中')) return '进行中';
  return '未开始';
}

function syncProjectStatusFromStages(project) {
  if (!project) return;
  project.status = deriveProjectStatusFromStages(project);
}

function syncAllProjectStatusesFromStages() {
  projects.forEach(syncProjectStatusFromStages);
}

function nextProjectId(externalName) {
  const base = externalName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project';
  let candidate = base;
  let suffix = 2;
  while (projects.some((project) => project.id === candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function currentUserIdentityValues() {
  return new Set([currentUser, currentAccount, userName(currentAccount)].map((value) => String(value || '').trim()).filter(Boolean));
}

function personListContainsCurrentUser(values = []) {
  const identities = currentUserIdentityValues();
  return values.some((value) => identities.has(String(value || '').trim()));
}

function isTaskFinished(task) {
  return ['完成', '拒绝'].includes(taskStatusSemantic(task.status));
}

function isTaskRelatedToCurrentUser(task) {
  return personListContainsCurrentUser([
    task.creator,
    ...(task.participants || []),
    ...taskAssigneeNames(task),
  ]);
}

function isTaskAssignedToCurrentUser(task) {
  return personListContainsCurrentUser(taskAssigneeNames(task));
}

function currentUserTaskStats() {
  const relatedTasks = tasks.filter(isTaskRelatedToCurrentUser);
  const activeRelatedTasks = relatedTasks.filter((task) => !isTaskFinished(task));
  const myOngoingTasks = activeRelatedTasks.filter(isTaskAssignedToCurrentUser);
  const waitingOthersTasks = activeRelatedTasks.filter((task) => !isTaskAssignedToCurrentUser(task));
  return {
    total: relatedTasks.length,
    totalTasks: relatedTasks,
    myOngoing: myOngoingTasks.length,
    myOngoingTasks,
    waitingOthers: waitingOthersTasks.length,
    waitingOthersTasks,
  };
}

function isProjectRelatedToCurrentUser(project) {
  if (!project || project.archived) return false;
  if (project.managerAccount === currentAccount) return true;
  return (project.members || []).some((member) => member.userAccount === currentAccount || member.name === currentUser);
}

function projectBubbleClass(index) {
  return `project-bubble-card tone-${(index % 6) + 1}`;
}

function renderDashboardSummary() {
  if (!dashboardSummary) return;
  const stats = currentUserTaskStats();
  const cards = [
    {
      key: 'taskTotal',
      hint: 'taskTotalHint',
      filter: 'taskTotalFilter',
      value: stats.total,
      taskIds: stats.totalTasks.map((task) => task.id),
      className: 'task-total',
    },
    {
      key: 'myOngoing',
      hint: 'myOngoingHint',
      filter: 'myOngoingFilter',
      value: stats.myOngoing,
      taskIds: stats.myOngoingTasks.map((task) => task.id),
      className: 'task-ongoing',
    },
    {
      key: 'waitingOthers',
      hint: 'waitingOthersHint',
      filter: 'waitingOthersFilter',
      value: stats.waitingOthers,
      taskIds: stats.waitingOthersTasks.map((task) => task.id),
      className: 'task-waiting',
    },
  ];
  dashboardSummary.innerHTML = cards.map((card) => `
    <button class="summary-card dashboard-task-card ${card.className}" data-action="open-task-list-filter" data-task-ids="${card.taskIds.join(',')}" data-filter-label="${escapeAttr(textFor(`dashboard.${card.filter}`, '工作台任务'))}">
      <span>${textFor(`dashboard.${card.key}`, card.key)}</span>
      <strong>${card.value}</strong>
      <small>${textFor(`dashboard.${card.hint}`, '')}</small>
    </button>
  `).join('');
}

function renderDashboardProjects() {
  const relatedProjects = projects.filter(isProjectRelatedToCurrentUser);
  myProjects.classList.add('project-bubble-list');
  myProjects.innerHTML = relatedProjects.map((project, index) => `
    <button class="${projectBubbleClass(index)}" data-project-id="${project.id}" title="${escapeAttr(`${project.externalName} / ${project.internalName} / ${project.modelName}`)}">
      <span>${escapeAttr(project.externalName)}</span>
    </button>
  `).join('') || `<p class="empty-note">${textFor('dashboard.emptyProjects', '暂无与你关联的项目')}</p>`;
}

function renderDashboard() {
  renderDashboardSummary();
  renderDashboardProjects();
}
function renderProjectTable(filter = '') {
  const normalized = filter.trim().toLowerCase();
  const salesability = salesabilityFilter?.value || '全部销售状态';
  const archiveState = archiveFilter?.value || '全部归档状态';
  const rows = projects.filter((project) => {
    const matchesKeyword = [project.externalName, project.internalName, project.modelName]
      .some((value) => value.toLowerCase().includes(normalized));
    const matchesSalesability = salesability === '全部销售状态' || project.salesability === salesability;
    const matchesArchive = archiveState === '全部归档状态'
      || (archiveState === '未归档' && !project.archived)
      || (archiveState === '已归档' && project.archived);
    return matchesKeyword && matchesSalesability && matchesArchive;
  });

  projectTable.innerHTML = rows.map((project) => `
    <tr>
      <td>${project.externalName}</td>
      <td>${project.internalName}</td>
      <td>${project.modelName}</td>
      <td>${ongoingStageNames(project).map((name) => `<span class="badge progress">${name}</span>`).join(' ') || '<span class="badge pending">暂无进行中阶段</span>'}</td>
      <td>${projectManagerName(project)}</td>
      <td><span class="badge ${project.salesability === '可销售' ? 'done' : 'pending'}">${project.salesability}</span></td>
      <td>${project.status}</td>
      <td><span class="badge ${project.archived ? 'pending' : 'done'}">${project.archived ? '已归档' : '未归档'}</span></td>
      <td class="row-actions">
        <button class="ghost-btn" data-project-id="${project.id}">查看详情</button>
        <button class="ghost-btn" data-action="open-project-edit" data-project-id="${project.id}">编辑</button>
        <button class="${project.archived ? 'muted-btn' : 'danger-btn'}" data-action="request-project-archive" data-project-id="${project.id}">
          ${project.archived ? '恢复' : '归档'}
        </button>
        <button class="danger-btn" data-action="request-project-delete" data-project-id="${project.id}">删除</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="9">暂无匹配项目</td></tr>';
}

function projectDetailBackLabel() {
  if (projectDetailReturnView === 'dashboard') return '← 返回工作台';
  if (projectDetailReturnView === 'customer-detail') return '← 返回客户详情';
  return '← 返回项目列表';
}

function updateProjectDetailBackButton() {
  if (!projectDetailBack) return;
  projectDetailBack.textContent = projectDetailBackLabel();
}

function backFromProjectDetail() {
  const view = projectDetailReturnView || 'projects';
  if (view === 'dashboard') renderDashboard();
  if (view === 'projects') renderProjectTable(projectSearch?.value || '');
  if (view === 'customer-detail') renderCustomerDetail();
  showView(view);
}

function renderProjectDetail() {
  updateProjectDetailBackButton();
  const project = projects.find((item) => item.id === selectedProjectId);
  if (!project) {
    projectDetail.innerHTML = '<section class="panel"><p class="empty-note">暂无项目数据</p></section>';
    return;
  }
  const inProgress = ongoingStageNames(project);

  projectDetail.innerHTML = `
    <div class="detail-grid">
      <div class="detail-main">
        <section class="panel">
          <div class="detail-head">
            <div>
              <h2>${project.externalName}</h2>
              <p>${project.internalName} / ${project.modelName}</p>
            </div>
            <div class="inline-actions">
              <span class="badge ${badgeClass(project.status)}">${project.status}</span>
              <span class="badge ${project.archived ? 'pending' : 'done'}">${project.archived ? '已归档' : '未归档'}</span>
              <button class="ghost-btn" data-action="open-project-edit" data-project-id="${project.id}">编辑项目</button>
              <button class="${project.archived ? 'muted-btn' : 'danger-btn'}" data-action="request-project-archive" data-project-id="${project.id}">
                ${project.archived ? '恢复项目' : '归档项目'}
              </button>
              <button class="danger-btn" data-action="request-project-delete" data-project-id="${project.id}">删除项目</button>
            </div>
          </div>
          <div class="project-meta">
            <div class="meta-item">
              <span>进行中阶段</span>
              <strong>${inProgress.join('、') || '暂无'}</strong>
            </div>
            <div class="meta-item">
              <span>项目负责人</span>
              <strong>${projectManagerName(project)}</strong>
            </div>
            <div class="meta-item">
              <span>阶段数量</span>
              <strong>${project.stages.length}</strong>
            </div>
            <div class="meta-item">
              <span>销售状态</span>
              <strong>${project.salesability}${project.salesability === '不可销售' ? ` · ${project.unsellableReason}` : ''}</strong>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>阶段状态</h2>
              <p>阶段可并行进行，由对应负责人维护各自状态</p>
            </div>
          </div>
          <div class="timeline">
            ${project.stages.map((stage, index) => `
              <article class="stage-card">
                <div class="detail-head">
                  <div>
                    <h3>${stage.name}</h3>
                    <p>${stageOwnerLabel(stage)}</p>
                  </div>
                  <div class="stage-status-control">
                    <span class="badge ${badgeClass(stage.status)}">${stage.status}</span>
                    <select class="select-input compact" data-stage-index="${index}">
                      ${stageStatusOptions.map((status) => `<option ${stage.status === status ? 'selected' : ''}>${status}</option>`).join('')}
                    </select>
                    <button class="ghost-btn compact-btn" data-action="open-stage-detail" data-stage-detail-index="${index}">查看详情</button>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      </div>

      <div class="detail-side">
        <section class="info-card">
          <div class="panel-head compact-head">
            <div>
              <h3>项目成员</h3>
              <p>${project.members.length} 人</p>
            </div>
            <button class="ghost-btn" data-action="open-member-modal">查看 / 维护</button>
          </div>
          <p>成员较多时不在详情页直接铺开，避免页面失焦；点击人数后统一维护。</p>
        </section>

        <section class="info-card">
          <div class="panel-head compact-head">
            <div>
              <h3>客户列表</h3>
              <p>${project.projectCustomers.length} 个关联客户</p>
            </div>
            <button class="ghost-btn" data-action="open-customers">进入</button>
          </div>
          <p>查看当前项目关联的客户，以及每个客户在当前产品下的独立状态。</p>
        </section>

        <section class="info-card">
          <div class="panel-head compact-head">
            <div>
              <h3>项目资料区</h3>
              <p>${project.projectMaterials.length} 份共享资料</p>
            </div>
            <button class="ghost-btn" data-action="open-materials">进入</button>
          </div>
          <p>查看由阶段负责人显式发布、供后续阶段复用的资料。</p>
        </section>
        <section class="info-card">
          <div class="panel-head compact-head">
            <div>
              <h3>需求纵览</h3>
              <p>提炼客户共性需求</p>
            </div>
            <button class="ghost-btn" data-action="open-requirement-overview">进入</button>
          </div>
          <p>查看多个客户重复出现或可抽象为产品能力的通用需求。</p>
        </section>

        <section class="info-card">
          <h3>说明</h3>
          <p>${project.description}</p>
          <p>阶段资料默认继承阶段详情权限；需要跨阶段复用时，再显式发布到项目资料区。</p>
        </section>
      </div>
    </div>

    ${memberModalOpen ? `
      <div class="modal-backdrop">
        <section class="modal-card member-modal">
          <div class="panel-head">
            <div>
              <h2>${project.externalName} 项目成员</h2>
              <p>可新增、调整角色或移除成员；项目负责人会自动保留在成员中。</p>
            </div>
          </div>
          ${renderProjectMemberRows(project.members, 'data-member-modal-user', 'data-member-modal-role', project.managerAccount)}
          <div class="customer-form-actions">
            <button class="muted-btn" data-action="close-member-modal">取消</button>
            <button class="primary-btn" data-action="save-project-members-modal">保存成员</button>
          </div>
        </section>
      </div>
    ` : ''}
  `;
}

function renderProjectEditContent(project) {
  return `
    <div class="edit-project-stack">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>编辑 ${project.externalName}</h2>
            <p>统一维护基础信息、项目成员和阶段负责人</p>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-field">
            <label>对外名称</label>
            <input id="edit-project-external-name" class="text-input" maxlength="120" value="${project.externalName}" />
          </div>
          <div class="form-field">
            <label>内部名称</label>
            <input id="edit-project-internal-name" class="text-input" maxlength="120" value="${project.internalName}" />
          </div>
          <div class="form-field">
            <label>Model 名称</label>
            <input id="edit-project-model-name" class="text-input" maxlength="120" value="${project.modelName}" />
          </div>
          <div class="form-field">
            <label>项目负责人</label>
            ${singleUserSearchInput('edit-project-manager', project.managerAccount, '输入姓名搜索项目负责人')}
          </div>
          <div class="form-field">
            <label>项目状态</label>
            <div class="derived-status-box">
              <span class="badge ${badgeClass(project.status)}">${project.status}</span>
              <small>由阶段状态自动计算：任一阶段进行中则项目进行中；全部阶段完成则项目已完成。</small>
            </div>
          </div>
          <div class="form-field">
            <label>销售状态</label>
            <select id="edit-project-salesability" class="select-input">
              ${salesabilityOptions.map((status) => `<option ${project.salesability === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
          </div>
          <div id="edit-unsellable-reason-field" class="form-field full ${project.salesability === '可销售' ? 'hidden' : ''}">
            <label>不可销售原因</label>
            <select id="edit-project-unsellable-reason" class="select-input" ${project.salesability === '可销售' ? 'disabled' : ''}>
              ${unsellableReasonOptions.map((reason) => `<option ${project.unsellableReason === reason ? 'selected' : ''}>${reason}</option>`).join('')}
            </select>
          </div>
          <div class="form-field full">
            <label>项目描述</label>
            <textarea id="edit-project-description" rows="4">${project.description}</textarea>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="section-intro">
          <h3>项目成员</h3>
          <p>成员引用真实用户，并在当前项目内分配项目角色；项目负责人会自动进入成员列表。</p>
        </div>
        ${renderProjectMemberRows(project.members, 'data-edit-member-user', 'data-edit-member-role', project.managerAccount)}
      </section>

      <section class="panel">
        <div class="section-intro">
          <h3>阶段负责人</h3>
          <p>阶段可绑定一个或多个具体负责人，作为后续协作、卡点求助和资料权限的依据。</p>
        </div>
        <div class="stage-assignment-list">
          ${project.stages.map((stage, index) => renderStageAssigneeSelector(stage, index, stage.assignees, 'edit')).join('')}
        </div>
      </section>

      <div class="customer-form-actions">
        <button class="muted-btn" data-action="cancel-project-edit">取消</button>
        <button class="primary-btn" data-action="save-project-edit">保存项目</button>
      </div>
    </div>
  `;
}

function renderProjectEdit() {
  const project = projects.find((item) => item.id === editingProjectId);
  projectEdit.innerHTML = project ? renderProjectEditContent(project) : '<section class="panel"><p class="empty-note">暂无可编辑项目</p></section>';
}

function renderConfirmationDialog() {
  if (!confirmationDialog) return '';
  return `
    <div class="confirm-dialog">
      <div class="section-intro">
        <h3>${confirmationDialog.title}</h3>
        <p>${confirmationDialog.message}</p>
      </div>
      <div class="confirm-meta">
        ${confirmationDialog.meta.map((item) => `<span>${item}</span>`).join('')}
      </div>
      <div class="customer-form-actions">
        <button class="muted-btn" data-action="cancel-confirmation">取消</button>
        <button class="${confirmationDialog.confirmClass || 'danger-btn'}" data-action="confirm-dialog">${confirmationDialog.confirmText}</button>
      </div>
    </div>
  `;
}

function toggleUnsellableReasonField(context) {
  const salesability = document.getElementById(`${context}-project-salesability`)?.value;
  const field = document.getElementById(`${context}-unsellable-reason-field`);
  const select = document.getElementById(`${context}-project-unsellable-reason`);
  if (!field || !select) return;
  const shouldHide = salesability === '可销售';
  field.classList.toggle('hidden', shouldHide);
  select.disabled = shouldHide;
}

function renderDetailFactGrid(items = []) {
  return `
    <div class="detail-facts modal-facts">
      ${items.map((item) => `
        <div>
          <span>${item.label}</span>
          <strong>${item.value || '-'}</strong>
        </div>
      `).join('')}
    </div>
  `;
}

function renderCustomerContactCard(contact, index) {
  return `
    <article class="contact-card contact-card-clickable" data-action="open-customer-contact-detail" data-contact-index="${index}" role="button" tabindex="0">
      <div>
        <strong>${contact.name}</strong>
        <p>${contact.title || '-'} · ${contact.phone || '-'} · ${contact.email || '-'}</p>
        <small>${contact.remark || '暂无备注'}</small>
      </div>
      <button class="muted-btn" data-action="delete-customer-contact" data-contact-index="${index}">删除</button>
    </article>
  `;
}

function renderReadableContentModal() {
  if (!readableContentModal) return '';
  const type = readableContentModal.type;
  const customer = selectedCustomer();
  const project = projects.find((item) => item.id === selectedProjectId);
  const stage = project?.stages?.[selectedStageIndex];
  const task = tasks.find((item) => item.id === selectedTaskId);

  let title = '查看全部';
  let description = '完整列表';
  let body = '<p class="empty-note">暂无数据</p>';
  let size = 'wide';

  if (type === 'customer-contact-detail') {
    const index = Number(readableContentModal.index);
    const contact = customer?.contacts?.[index];
    title = contact ? `${contact.name} 的联系人详情` : '联系人详情';
    description = customer ? `客户：${customer.name}` : '客户联系人';
    size = 'narrow';
    body = contact ? `
      ${renderDetailFactGrid([
        { label: '姓名', value: contact.name },
        { label: '职位', value: contact.title },
        { label: '电话', value: contact.phone },
        { label: '邮箱', value: contact.email },
        { label: '备注', value: contact.remark },
      ])}
      <div class="customer-form-actions">
        <button class="muted-btn" data-action="delete-customer-contact" data-contact-index="${index}">删除联系人</button>
      </div>
    ` : '<p class="empty-note">该联系人不存在或已被删除。</p>';
  }

  if (type === 'customer-contacts') {
    const contacts = customer?.contacts || [];
    title = `${customer?.name || '客户'} 联系人`;
    description = `共 ${contacts.length} 位联系人，点击联系人可查看详情。`;
    body = `
      <div class="contact-list modal-list-scroll">
        ${contacts.map(renderCustomerContactCard).join('') || '<p class="empty-note">暂无联系人</p>'}
      </div>
    `;
  }

  if (type === 'customer-materials') {
    const files = latestItems(customer?.materials || [], customer?.materials?.length || 0);
    title = `${customer?.name || '客户'} 资料库`;
    description = `共 ${files.length} 份资料。`;
    body = `<div class="file-list modal-list-scroll">${renderFileRows(files, { emptyText: '暂无客户资料' })}</div>`;
  }

  if (type === 'customer-followups') {
    const records = latestItems(customer?.followups || [], customer?.followups?.length || 0);
    title = `${customer?.name || '客户'} 跟进记录`;
    description = `共 ${records.length} 条跟进记录，按时间倒序展示。`;
    body = `<div class="message-list modal-list-scroll">${renderMessageCards(records, '暂无跟进记录')}</div>`;
  }

  if (type === 'stage-files') {
    const files = latestItems(stage?.files || [], stage?.files?.length || 0);
    title = `${stage?.name || '阶段'} 资料库`;
    description = `项目：${project?.externalName || '-'}，共 ${files.length} 份资料。`;
    body = `
      <div class="file-list modal-list-scroll">
        ${renderFileRows(files, {
          emptyText: '暂无阶段文件',
          actionRenderer: (file) => renderStageFileActions(file, project),
        })}
      </div>
    `;
  }

  if (type === 'stage-messages') {
    const messages = latestItems(stage?.messages || [], stage?.messages?.length || 0);
    title = `${stage?.name || '阶段'} 留言记录`;
    description = `项目：${project?.externalName || '-'}，共 ${messages.length} 条记录。`;
    body = `<div class="message-list modal-list-scroll">${renderMessageCards(messages, '暂无阶段留言')}</div>`;
  }

  if (type === 'task-attachments') {
    const files = latestItems(task?.attachments || [], task?.attachments?.length || 0);
    title = `${task?.id || '任务'} 附件`;
    description = `任务：${task?.title || '-'}，共 ${files.length} 个附件。`;
    body = `<div class="file-list modal-list-scroll">${renderFileRows(files, { emptyText: '暂无任务附件' })}</div>`;
  }

  if (type === 'task-comments') {
    const comments = latestItems(task?.comments || [], task?.comments?.length || 0);
    title = `${task?.id || '任务'} 讨论记录`;
    description = `任务：${task?.title || '-'}，共 ${comments.length} 条讨论。`;
    body = `<div class="message-list modal-list-scroll">${renderMessageCards(comments, '暂无讨论记录')}</div>`;
  }

  return renderFormModal(`
    <div class="collection-modal">
      <div class="panel-head">
        <div>
          <h2>${title}</h2>
          <p>${description}</p>
        </div>
        <button class="muted-btn" data-action="close-readable-modal">关闭</button>
      </div>
      ${body}
    </div>
  `, size);
}

function renderChangePasswordModal() {
  return renderFormModal(`
    <div class="modal-head">
      <div>
        <h2>修改密码</h2>
        <p>当前账号：${currentAccount}。新密码至少 6 位。</p>
      </div>
      <button class="muted-btn" data-action="close-change-password">关闭</button>
    </div>
    <div class="form-grid">
      <div class="form-field full">
        <label>原密码</label>
        <input id="change-old-password" class="text-input" type="password" maxlength="128" autocomplete="current-password" />
      </div>
      <div class="form-field full">
        <label>新密码</label>
        <input id="change-new-password" class="text-input" type="password" maxlength="128" autocomplete="new-password" />
      </div>
      <div class="form-field full">
        <label>确认新密码</label>
        <input id="change-confirm-password" class="text-input" type="password" maxlength="128" autocomplete="new-password" />
      </div>
    </div>
    <div class="customer-form-actions">
      <button class="muted-btn" data-action="close-change-password">取消</button>
      <button class="primary-btn" data-action="save-change-password">保存新密码</button>
    </div>
  `, 'narrow');
}

function renderGlobalModals() {
  if (!globalModalRoot) return;
  const project = projects.find((item) => item.id === editingProjectId);
  if (projectEditModalOpen && project) {
    globalModalRoot.innerHTML = renderFormModal(renderProjectEditContent(project), 'wide');
    return;
  }
  if (confirmationDialog) {
    globalModalRoot.innerHTML = renderFormModal(renderConfirmationDialog(), 'narrow');
    return;
  }
  if (readableContentModal) {
    globalModalRoot.innerHTML = renderReadableContentModal();
    return;
  }
  if (changePasswordModalOpen) {
    globalModalRoot.innerHTML = renderChangePasswordModal();
    applyPermissionVisibility();
    return;
  }
  globalModalRoot.innerHTML = '';
}

function activeViewName() {
  const activeView = document.querySelector('.view.active');
  return activeView?.id.replace(/-view$/, '') || 'dashboard';
}

function projectReferenceSummary(project) {
  return {
    customers: project.projectCustomers.length,
    tasks: tasks.filter((task) => task.project === project.externalName).length,
    orders: orders.filter((order) => order.projectName === project.externalName).length,
  };
}

function refreshProjectRelatedSurfaces() {
  renderDashboard();
  renderProjectTable(projectSearch.value);
  renderTaskManagement();
  renderOrderManagement();
  renderAnalytics();
  if (selectedProjectId && projects.some((project) => project.id === selectedProjectId)) {
    renderProjectDetail();
    renderProjectCustomers();
    renderProjectMaterials();
    renderRequirementOverview();
  }
  if (selectedCustomerName) renderCustomerDetail();
  renderGlobalModals();
}

function openProjectArchiveConfirmation(project) {
  const summary = projectReferenceSummary(project);
  confirmationDialog = {
    type: 'project-archive',
    projectId: project.id,
    title: project.archived ? `确认恢复 ${project.externalName}？` : `确认归档 ${project.externalName}？`,
    message: project.archived
      ? '恢复后，该项目会重新出现在默认项目列表和工作台中。'
      : '归档后，项目不会从系统删除，但默认视图会弱化展示；适合不再日常推进但需要保留历史信息的项目。',
    meta: [
      `关联客户 ${summary.customers} 个`,
      `关联任务 ${summary.tasks} 个`,
      `关联订单 ${summary.orders} 个`,
    ],
    confirmText: project.archived ? '确认恢复' : '确认归档',
    confirmClass: project.archived ? 'primary-btn' : 'danger-btn',
  };
  renderGlobalModals();
}

function openProjectDeleteConfirmation(project) {
  const summary = projectReferenceSummary(project);
  confirmationDialog = {
    type: 'project-delete',
    projectId: project.id,
    title: `确认删除 ${project.externalName}？`,
    message: '删除是高风险操作。原型中会移除项目、阶段和客户关联；订单与任务历史仍会保留为历史记录，正式系统建议对已有订单或任务的项目限制删除、优先归档。',
    meta: [
      `关联客户 ${summary.customers} 个`,
      `关联任务 ${summary.tasks} 个`,
      `关联订单 ${summary.orders} 个`,
    ],
    confirmText: '确认删除',
    confirmClass: 'danger-btn',
  };
  renderGlobalModals();
}

function openStageFilePublishConfirmation(project, stage, fileName) {
  confirmationDialog = {
    type: 'stage-file-publish',
    projectId: project.id,
    stageIndex: project.stages.indexOf(stage),
    fileName,
    title: `确认发布 ${fileName}？`,
    message: '发布后，该资料会进入项目资料区，项目成员可在项目资料区复用。请确认该文件已经适合跨阶段共享。',
    meta: [
      `项目：${project.externalName}`,
      `来源阶段：${stage.name}`,
      '目标：项目资料区',
    ],
    confirmText: '确认发布',
    confirmClass: 'primary-btn',
  };
  renderGlobalModals();
}

async function applyConfirmationDialog() {
  if (!confirmationDialog) return;
  const dialog = confirmationDialog;
  const project = projects.find((item) => item.id === dialog.projectId);
  const currentView = activeViewName();
  if (!project) {
    confirmationDialog = null;
    renderGlobalModals();
    return;
  }

  try {
    if (dialog.type === 'project-archive') {
      await kpmApi.post(`/api/projects/${project.id}/archive`, { archived: !project.archived });
    }

    if (dialog.type === 'project-delete') {
      await kpmApi.delete(`/api/projects/${project.id}`);
      if (editingProjectId === project.id) {
        editingProjectId = null;
        projectEditModalOpen = false;
      }
    }

    if (dialog.type === 'stage-file-publish') {
      const stage = project.stages[dialog.stageIndex];
      const alreadyPublished = project.projectMaterials.some((material) => material.name === dialog.fileName);
      if (stage && !alreadyPublished) {
        const file = stage.files.find((item) => item.name === dialog.fileName);
        if (!file?.id) throw new Error('该阶段资料缺少后端文件ID，暂不能发布到项目资料区');
        await kpmApi.post(`/api/projects/stage-materials/${file.id}/publish`);
      }
    }

    confirmationDialog = null;
    await refreshBusinessDataAfterWrite(`confirm-${dialog.type}`);
    if (currentView === 'stage-detail') renderStageDetail();
    if (dialog.type === 'project-delete' && currentView === 'project-detail') backFromProjectDetail();
  } catch (error) {
    reportBackendWriteError(dialog.type, error);
  }
}

function renderStageDetail() {
  const project = projects.find((item) => item.id === selectedProjectId);
  const stage = project.stages[selectedStageIndex];
  const sortedMessages = [...stage.messages].sort((a, b) => b.time.localeCompare(a.time));
  const visibleStageMessages = previewItems(sortedMessages, previewLimits.messages);
  const visibleStageFiles = previewItems(stage.files || [], previewLimits.files, { sortByTime: true });

  stageDetail.innerHTML = `
    <div class="stage-detail-grid">
      <div class="detail-main">
        <section class="panel">
          <div class="detail-head">
            <div>
              <h2>${stage.name}</h2>
              <p>${project.externalName} / ${stageOwnerLabel(stage)}</p>
            </div>
            <span class="badge ${badgeClass(stage.status)}">${stage.status}</span>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>阶段留言</h2>
              <p>阶段负责成员可记录文字、照片、视频或其他附件；当前展示最近 ${previewLimits.messages} 条</p>
            </div>
            <div class="inline-actions">
              ${renderOverflowButton(sortedMessages, previewLimits.messages, 'open-stage-messages-modal')}
              <button class="ghost-btn" data-action="create-task-from-stage">从该阶段新建任务</button>
              <button class="primary-btn" data-action="open-blocker-help-modal">卡点求助</button>
            </div>
          </div>

          <div class="message-composer">
            <textarea id="stage-message-text" rows="4" placeholder="记录阶段进展、问题或补充说明"></textarea>
            <div class="message-actions">
              <label class="muted-btn file-label">
                选择附件
                <input id="stage-message-files" type="file" multiple />
              </label>
              <button class="primary-btn" data-action="publish-stage-message">发布记录</button>
            </div>
          </div>

          <div class="message-list">
            ${renderMessageCards(visibleStageMessages, '暂无阶段留言')}
          </div>
          ${renderSectionFooter(sortedMessages, previewLimits.messages, 'open-stage-messages-modal', `仅展示最近 ${previewLimits.messages} 条阶段留言`)}
        </section>
      </div>

      <div class="detail-side">
        <section class="info-card">
          <div class="panel-head compact-head">
            <div>
              <h3>阶段资料库</h3>
              <p>支持任意格式文件；当前展示最近 ${previewLimits.files} 个</p>
            </div>
            ${renderOverflowButton(stage.files || [], previewLimits.files, 'open-stage-files-modal', '查看全部资料')}
          </div>

          <label class="primary-btn upload-label">
            上传文件
            <input id="stage-file-input" type="file" multiple />
          </label>

          <div class="file-list">
            ${renderFileRows(visibleStageFiles, {
              emptyText: '暂无阶段文件',
              actionRenderer: (file) => renderStageFileActions(file, project),
            })}
          </div>
          ${renderSectionFooter(stage.files || [], previewLimits.files, 'open-stage-files-modal', `仅展示最近 ${previewLimits.files} 个阶段资料`)}
        </section>
      </div>
    </div>

    ${stageTaskFormOpen ? `
      <div class="modal-backdrop">
        <section class="modal-card">
          <div class="panel-head">
            <div>
              <h2>从 ${stage.name} 新建任务</h2>
              <p>保留当前项目和阶段上下文，不跳出阶段详情。</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-field full">
              <label>任务标题</label>
              <input id="stage-task-title" class="text-input" maxlength="120" placeholder="例如 补充客户推广演示素材" />
            </div>
            <div class="form-field full">
              <label>任务描述</label>
              <textarea id="stage-task-description" rows="4" maxlength="3000" placeholder="说明任务背景、目标和交付标准"></textarea>
            </div>
            <div class="form-field">
              <label>任务分类</label>
              <select id="stage-task-category" class="select-input">
                ${taskCategoryOptions.map((category) => `<option ${category === '其他' ? 'selected' : ''}>${category}</option>`).join('')}
              </select>
            </div>
            <div class="form-field">
            <label>优先级</label>
            <select id="stage-task-priority" class="select-input">
                ${priorityOptions.map((priority) => `<option ${priority === '中' ? 'selected' : ''}>${priority}</option>`).join('')}
            </select>
            </div>
            <div class="form-field">
              <label>执行者</label>
              ${searchablePeopleInput('stage-task-assignees', stageResponsibleUserNames(stage), '搜索姓名，支持多人')}
            </div>
            <div class="form-field">
              <label>参与者</label>
              ${searchablePeopleInput('stage-task-participants', [], '搜索姓名，支持多人')}
            </div>
            <div class="form-field">
              <label>预期完成时间</label>
              <input id="stage-task-expected-completion-at" class="text-input" type="date" value="2026-05-30" />
            </div>
          </div>
          <div class="customer-form-actions">
            <button class="muted-btn" data-action="close-stage-task-modal">取消</button>
            <button class="primary-btn" data-action="save-stage-task">创建任务</button>
          </div>
        </section>
      </div>
    ` : ''}

    ${blockerHelpFormOpen ? `
      <div class="modal-backdrop">
        <section class="modal-card">
          <div class="panel-head">
            <div>
              <h2>新增卡点求助任务</h2>
              <p>任务将自动流转给阶段负责人，并把项目负责人加入参与者</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-field full">
              <label>卡点标题</label>
              <input id="blocker-task-title" class="text-input" maxlength="120" placeholder="例如 等待硬件版本 B 最终确认" />
            </div>
            <div class="form-field full">
              <label>问题描述</label>
              <textarea id="blocker-task-description" rows="4" maxlength="3000" placeholder="说明卡住的原因、需要谁协助、希望何时解决"></textarea>
            </div>
            <div class="form-field">
            <label>优先级</label>
            <select id="blocker-task-priority" class="select-input">
                ${priorityOptions.map((priority) => `<option ${priority === '高' ? 'selected' : ''}>${priority}</option>`).join('')}
            </select>
            </div>
            <div class="form-field">
              <label>任务分类</label>
              <select id="blocker-task-category" class="select-input">
                ${taskCategoryOptions.map((category) => `<option ${category === '其他' ? 'selected' : ''}>${category}</option>`).join('')}
              </select>
            </div>
            <div class="form-field">
              <label>预期完成时间</label>
              <input id="blocker-task-due-date" class="text-input" type="date" value="2026-05-22" />
            </div>
          </div>
          <div class="helper-strip">
            <span>负责人：${stagePrimaryOwner(stage)}</span>
            <span>参与者：${projectManagerName(project)}</span>
          </div>
          <div class="customer-form-actions">
            <button class="muted-btn" data-action="close-blocker-help-modal">取消</button>
            <button class="primary-btn" data-action="save-blocker-help-task">创建卡点任务</button>
          </div>
        </section>
      </div>
    ` : ''}
  `;
}

function renderProjectCustomers() {
  const project = projects.find((item) => item.id === selectedProjectId);
  if (!project) {
    customerPlaceholder.innerHTML = '<section class="panel"><p class="empty-note">暂无项目客户数据</p></section>';
    return;
  }
  const availableCustomers = assignableCustomers().filter(
    (customer) => !project.projectCustomers.some((item) => item.customerName === customer.name),
  );

  customerPlaceholder.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${project.externalName} 的客户列表</h2>
          <p>维护客户与当前项目的关联关系，以及客户在当前产品下的状态</p>
        </div>
        <button class="primary-btn" data-action="toggle-project-customer-form">关联已有客户</button>
      </div>

      ${projectCustomerFormOpen ? renderFormModal(`
        <div class="customer-form">
          <div class="form-grid">
            <div class="form-field">
              <label>选择客户</label>
              <input id="project-customer-name" class="text-input" list="project-customer-name-options" value="${availableCustomers[0]?.name || ''}" placeholder="输入客户名称搜索" ${availableCustomers.length ? '' : 'disabled'} />
              ${renderNameDatalist('project-customer-name-options', availableCustomers.map((customer) => customer.name))}
            </div>
            <div class="form-field">
              <label>项目内状态</label>
              <select id="project-customer-status" class="select-input">
                ${activeCustomerProjectStatuses().map((status) => `<option>${status}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="customer-form-actions">
            <button class="muted-btn" data-action="toggle-project-customer-form">取消</button>
            <button class="primary-btn" data-action="save-project-customer" ${availableCustomers.length ? '' : 'disabled'}>保存关联</button>
          </div>
        </div>
      `, 'narrow') : ''}

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>客户名称</th>
              <th>国家 / 区域</th>
              <th>当前状态</th>
              <th>客户等级</th>
              <th>负责销售</th>
              <th>负责技术支持</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${project.projectCustomers.map((customer, index) => `
              <tr>
                <td>${customer.customerName}</td>
                <td>${customer.region}</td>
                <td>
                  <select class="select-input compact customer-status-select" data-project-customer-index="${index}">
                    ${customerProjectStatusOptionsForValue(customer.projectStatus).map((status) => `<option ${customer.projectStatus === status ? 'selected' : ''}>${status}</option>`).join('')}
                  </select>
                </td>
                <td><span class="badge ${customerLevelBadgeClass(customerByName(customer.customerName)?.level)}">${customerByName(customer.customerName)?.level || '-'}</span></td>
                <td>${taskPersonLabel(customerSalesOwners(customer.customerName))}</td>
                <td>${taskPersonLabel(customerSupportOwners(customer.customerName))}</td>
                <td class="row-actions">
                  <button class="ghost-btn" data-action="open-customer-detail" data-customer-name="${customer.customerName}">客户详情</button>
                  <button class="ghost-btn" data-action="open-customer-requirements" data-customer-index="${index}">需求列表</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="7">暂无关联客户</td></tr>'}
          </tbody>
        </table>
      </div>
      <p class="empty-note">客户基础资料来自资源管理；客户在当前项目下的状态单独维护。</p>
    </section>
  `;
}

function customerMasterSearchText(customer) {
  return [
    customer.name,
    customer.shortName,
    customer.region,
    ...(customer.salesOwners || []),
    ...(customer.supportOwners || []),
    customer.level,
    customer.status,
  ].join(' ').toLowerCase();
}

function filteredCustomerRows() {
  const keyword = customerSearchKeyword.trim().toLowerCase();
  return customers
    .map((customer, index) => ({ customer, index }))
    .filter(({ customer }) => !keyword || customerMasterSearchText(customer).includes(keyword));
}

function customerOrderCount(customerName) {
  return orders.filter((order) => order.customerName === customerName).length;
}

function customerOrderAmount(customerName) {
  return orders
    .filter((order) => order.customerName === customerName)
    .reduce((sum, order) => sum + convertMoney(order.amount, order.currency, 'USD'), 0);
}

function renderCustomerMasterForm() {
  const editingCustomer = customerEditIndex === null ? null : customers[customerEditIndex];
  const formTitle = editingCustomer ? '编辑客户' : '新增客户';
  const selectedLevel = editingCustomer?.level || 'C / 普通客户';

  return `
    <div class="panel task-form-panel">
      <div class="section-intro">
        <h3>${formTitle}</h3>
        <p>客户基础资料从资源管理中独立出来，作为后续联系人、资料、跟进和订单的入口。</p>
      </div>
      <div class="form-grid">
        <div class="form-field">
          <label>客户名称</label>
          <input id="customer-master-name" class="text-input" maxlength="120" value="${editingCustomer?.name || ''}" placeholder="例如 Nova Retail" />
        </div>
        <div class="form-field">
          <label>客户简称</label>
          <input id="customer-master-short-name" class="text-input" maxlength="60" value="${editingCustomer?.shortName || ''}" placeholder="例如 Nova" />
        </div>
        <div class="form-field">
          <label>国家 / 区域</label>
          <input id="customer-master-region" class="text-input" maxlength="80" value="${editingCustomer?.region || ''}" placeholder="例如 德国" />
        </div>
        <div class="form-field full">
          <label>详细地址</label>
          <input id="customer-master-address" class="text-input" maxlength="255" value="${editingCustomer?.address || ''}" placeholder="例如 Berlin, Germany；地图会优先用地址定位，解析不到时使用国家 / 区域" />
        </div>
        <div class="form-field">
          <label>客户状态</label>
          <select id="customer-master-status" class="select-input">
            ${customerMasterStatusOptions.map((status) => `<option ${editingCustomer?.status === status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </div>
        <div class="form-field">
          <label>客户等级</label>
          <select id="customer-master-level" class="select-input">
            ${customerLevelOptionsForValue(selectedLevel).map((level) => `<option ${selectedLevel === level ? 'selected' : ''}>${level}</option>`).join('')}
          </select>
        </div>
        <div class="form-field full">
          <label>负责销售</label>
          ${searchablePeopleInput(
            'customer-master-sales-owners',
            editingCustomer?.salesOwners || [],
            '输入销售姓名，多个用顿号或逗号分隔',
            personCandidateNames(editingCustomer?.salesOwners || [], salesUsers(editingCustomer?.salesOwners || [])),
          )}
        </div>
        <div class="form-field full">
          <label>负责技术支持</label>
          ${searchablePeopleInput(
            'customer-master-support-owners',
            editingCustomer?.supportOwners || [],
            '输入技术支持姓名，多个用顿号或逗号分隔',
            personCandidateNames(editingCustomer?.supportOwners || [], supportUsers(editingCustomer?.supportOwners || [])),
          )}
        </div>
      </div>
      <div class="customer-form-actions">
        <button class="muted-btn" data-action="cancel-customer-master-form">取消</button>
        <button class="primary-btn" data-action="save-customer-master">${formTitle}</button>
      </div>
    </div>
  `;
}

function renderCustomerManagement() {
  const rows = filteredCustomerRows();

  customerManagement.innerHTML = `
    <div class="toolbar">
      <input id="customer-master-keyword" type="search" value="${customerSearchKeyword}" placeholder="搜索客户名称 / 区域 / 负责人" />
      <button class="primary-btn" data-action="toggle-customer-master-form">新增客户</button>
    </div>
    ${customerFormOpen ? renderFormModal(renderCustomerMasterForm(), 'wide') : ''}
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>客户列表</h2>
          <p>客户已经从资源管理独立为主菜单；客户状态枚举仍在资源管理中配置。</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>客户名称</th>
              <th>客户简称</th>
              <th>国家 / 区域</th>
              <th>详细地址</th>
              <th>负责销售</th>
              <th>负责技术支持</th>
              <th>客户等级</th>
              <th>客户状态</th>
              <th>联系人</th>
              <th>资料</th>
              <th>订单</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(({ customer, index }) => `
              <tr>
                <td>${customer.name}</td>
                <td>${customer.shortName}</td>
                <td>${customer.region}</td>
                <td>${customer.address || '-'}</td>
                <td>${taskPersonLabel(customer.salesOwners)}</td>
                <td>${taskPersonLabel(customer.supportOwners)}</td>
                <td><span class="badge ${customerLevelBadgeClass(customer.level)}">${customer.level}</span></td>
                <td><span class="badge ${customer.status === '合作中' ? 'done' : customer.status === '潜在客户' ? 'progress' : 'pending'}">${customer.status}</span></td>
                <td>${(customer.contacts || []).length} 人</td>
                <td>${(customer.materials || []).length} 份</td>
                <td>${customerOrderCount(customer.name)} 单</td>
                <td class="row-actions">
                  <button class="ghost-btn" data-action="open-customer-detail" data-customer-name="${customer.name}">详情</button>
                  <button class="ghost-btn" data-action="edit-customer-master" data-customer-index="${index}">编辑</button>
                  <button class="danger-btn" data-action="delete-customer-master" data-customer-index="${index}" ${canDeleteCustomer(customer) ? '' : 'disabled'}>${canDeleteCustomer(customer) ? '删除' : '使用中'}</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="12">暂无匹配客户</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function selectedCustomer() {
  return customerByName(selectedCustomerName) || customers[0];
}

function renderCustomerDetail() {
  const customer = selectedCustomer();
  if (!customer) {
    customerDetail.innerHTML = '<section class="panel"><p class="empty-note">暂无客户数据</p></section>';
    return;
  }
  selectedCustomerName = customer.name;
  const linkedProjects = projects.filter((project) => project.projectCustomers.some((item) => item.customerName === customer.name));
  const linkedProjectRows = linkedProjects.map((project) => {
    const link = project.projectCustomers.find((item) => item.customerName === customer.name);
    const projectOrders = orders.filter((order) => order.customerName === customer.name && order.projectName === project.externalName);
    const latestOrder = [...projectOrders].sort((a, b) => b.orderDate.localeCompare(a.orderDate))[0];
    return { project, link, projectOrders, latestOrder };
  });
  const customerOrders = orders.filter((order) => order.customerName === customer.name);
  const customerContacts = customer.contacts || [];
  const visibleCustomerContacts = previewItems(customerContacts, previewLimits.contacts);
  const sortedCustomerMaterials = latestItems(customer.materials || [], (customer.materials || []).length);
  const visibleCustomerMaterials = previewItems(sortedCustomerMaterials, previewLimits.files);
  const sortedCustomerFollowups = latestItems(customer.followups || [], (customer.followups || []).length);
  const visibleCustomerFollowups = previewItems(sortedCustomerFollowups, previewLimits.messages);

  customerDetail.innerHTML = `
    <section class="panel customer-profile-panel">
      <div class="panel-head">
        <div>
          <h2>${customer.name}</h2>
          <p>${customer.shortName} · ${customer.region} · ${customer.status}</p>
          <small>${customer.address ? `地址：${customer.address}` : '地址暂未维护，地图将尝试使用国家 / 区域定位'}</small>
        </div>
        <button class="primary-btn" data-action="toggle-customer-order-form">为该客户下单</button>
      </div>
      <div class="summary-grid">
        <article class="summary-card"><span>合作项目</span><strong>${linkedProjects.length}</strong></article>
        <article class="summary-card"><span>订单数量</span><strong>${customerOrders.length}</strong></article>
        <article class="summary-card"><span>订单金额 USD</span><strong>${formatMoney(customerOrderAmount(customer.name), 'USD')}</strong></article>
      </div>
      <div class="helper-strip">
        <span>客户等级：${customer.level}</span>
        <span>地址：${customer.address || customer.region || '-'}</span>
        <span>负责销售：${taskPersonLabel(customer.salesOwners)}</span>
        <span>负责技术支持：${taskPersonLabel(customer.supportOwners)}</span>
      </div>
    </section>

    ${customerOrderFormOpen ? renderFormModal(renderOrderForm(null, {
      fixedCustomerName: customer.name,
      submitAction: 'save-customer-order',
      cancelAction: 'toggle-customer-order-form',
      title: `为 ${customer.name} 新建订单`,
      description: '从客户详情进入时，系统会自动带入当前客户。',
    }), 'wide') : ''}

    <section class="panel customer-linked-projects-panel">
      <div class="panel-head">
        <div>
          <h2>关联项目</h2>
          <p>查看该客户活跃在哪些产品项目上；项目内客户状态在项目详情的“客户列表”中维护。</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>项目名称</th>
              <th>内部 / Model</th>
              <th>客户项目状态</th>
              <th>项目销售状态</th>
              <th>订单数量</th>
              <th>最近订单</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${linkedProjectRows.map(({ project, link, projectOrders, latestOrder }) => `
              <tr>
                <td>${project.externalName}</td>
                <td>${project.internalName} / ${project.modelName}</td>
                <td><span class="badge ${customerProjectStatusBadgeClass(link.projectStatus)}">${link.projectStatus}</span></td>
                <td><span class="badge ${project.salesability === '可销售' ? 'done' : 'pending'}">${project.salesability}</span></td>
                <td>${projectOrders.length}</td>
                <td>${latestOrder ? `${latestOrder.id} · ${latestOrder.orderDate}` : '-'}</td>
                <td><button class="ghost-btn" data-action="open-linked-project" data-project-id="${project.id}">查看项目</button></td>
              </tr>
            `).join('') || '<tr><td colspan="7">暂无关联项目；从项目详情关联客户，或创建该客户订单时会自动建立关联。</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>

    <div class="customer-detail-grid">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>联系人</h2>
            <p>共 ${customerContacts.length} 位；当前展示最多 ${previewLimits.contacts} 位联系人</p>
          </div>
          <div class="inline-actions">
            ${renderOverflowButton(customerContacts, previewLimits.contacts, 'open-customer-contacts-modal', '查看全部联系人')}
            <button class="ghost-btn" data-action="toggle-customer-contact-form">新增联系人</button>
          </div>
        </div>
        ${customerContactFormOpen ? renderFormModal(`
          <div class="customer-form compact-head">
            <div class="form-grid">
              <div class="form-field"><label>姓名</label><input id="customer-contact-name" class="text-input" maxlength="60" placeholder="例如 Anna Müller" /></div>
              <div class="form-field"><label>职位</label><input id="customer-contact-title" class="text-input" maxlength="80" placeholder="例如 采购经理" /></div>
              <div class="form-field"><label>电话</label><input id="customer-contact-phone" class="text-input" maxlength="32" placeholder="+49 ..." /></div>
              <div class="form-field"><label>邮箱</label><input id="customer-contact-email" class="text-input" type="email" maxlength="128" placeholder="name@example.com" /></div>
              <div class="form-field"><label>备注</label><input id="customer-contact-remark" class="text-input" maxlength="500" placeholder="负责事项或注意点" /></div>
            </div>
            <div class="customer-form-actions">
              <button class="muted-btn" data-action="toggle-customer-contact-form">取消</button>
              <button class="primary-btn" data-action="save-customer-contact">保存联系人</button>
            </div>
          </div>
        `, 'wide') : ''}
        <div class="contact-list">
          ${visibleCustomerContacts.map(renderCustomerContactCard).join('') || '<p class="empty-note">暂无联系人</p>'}
        </div>
        ${renderSectionFooter(customerContacts, previewLimits.contacts, 'open-customer-contacts-modal', `仅展示前 ${previewLimits.contacts} 位联系人，点击联系人可查看详情`)}
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>客户资料</h2>
            <p>共 ${sortedCustomerMaterials.length} 份；当前展示最近 ${previewLimits.files} 个资料</p>
          </div>
          <div class="inline-actions">
            ${renderOverflowButton(sortedCustomerMaterials, previewLimits.files, 'open-customer-materials-modal', '查看全部资料')}
            <label class="upload-btn">
              上传资料
              <input id="customer-material-input" type="file" multiple />
            </label>
          </div>
        </div>
        <div class="file-list">
          ${renderFileRows(visibleCustomerMaterials, { emptyText: '暂无客户资料' })}
        </div>
        ${renderSectionFooter(sortedCustomerMaterials, previewLimits.files, 'open-customer-materials-modal', `仅展示最近 ${previewLimits.files} 个客户资料`)}
      </section>
    </div>

    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>客户跟进记录</h2>
          <p>共 ${sortedCustomerFollowups.length} 条；当前展示最近 ${previewLimits.messages} 条。</p>
        </div>
        <div class="inline-actions">
          ${renderOverflowButton(sortedCustomerFollowups, previewLimits.messages, 'open-customer-followups-modal', '查看全部跟进')}
          <button class="ghost-btn" data-action="toggle-customer-followup-form">新增跟进</button>
        </div>
      </div>
      ${customerFollowupFormOpen ? renderFormModal(`
        <div class="customer-form">
          <div class="form-field">
            <label>跟进内容</label>
            <textarea id="customer-followup-text" rows="4" placeholder="记录客户反馈、风险、下一步动作"></textarea>
          </div>
          <div class="form-field">
            <label>附件</label>
            <input id="customer-followup-files" class="text-input" type="file" multiple />
          </div>
          <div class="customer-form-actions">
            <button class="muted-btn" data-action="toggle-customer-followup-form">取消</button>
            <button class="primary-btn" data-action="save-customer-followup">发布跟进</button>
          </div>
        </div>
      `, 'narrow') : ''}
      <div class="message-stream">
        ${renderMessageCards(visibleCustomerFollowups, '暂无跟进记录')}
      </div>
      ${renderSectionFooter(sortedCustomerFollowups, previewLimits.messages, 'open-customer-followups-modal', `仅展示最近 ${previewLimits.messages} 条跟进记录`)}
    </section>
  `;
}

function renderCustomerRequirements() {
  const project = projects.find((item) => item.id === selectedProjectId);
  const customer = project.projectCustomers[selectedCustomerIndex];

  customerRequirements.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${customer.customerName} 的需求列表</h2>
          <p>需求记录参考敏捷开发格式</p>
        </div>
        <button class="primary-btn" data-action="toggle-requirement-form">新增需求</button>
      </div>
      ${requirementFormOpen ? renderFormModal(`
        <div class="customer-form">
          <div class="form-grid">
            <div class="form-field full">
              <label>需求标题</label>
              <input id="requirement-title" class="text-input" maxlength="120" placeholder="例如 支持离线支付重试" />
            </div>
            <div class="form-field full">
              <label>用户故事</label>
              <textarea id="requirement-user-story" rows="3" maxlength="1500" placeholder="作为……，我希望……，以便……"></textarea>
            </div>
            <div class="form-field">
              <label>业务价值</label>
              <input id="requirement-value" class="text-input" maxlength="1000" placeholder="例如 减少支付失败率" />
            </div>
            <div class="form-field">
              <label>优先级</label>
              <select id="requirement-priority" class="select-input">
                ${priorityOptions.map((priority) => `<option ${priority === '中' ? 'selected' : ''}>${priority}</option>`).join('')}
              </select>
            </div>
            <div class="form-field full">
              <label>验收标准</label>
              <textarea id="requirement-acceptance" rows="3" maxlength="1500" placeholder="写清楚如何判断该需求已满足"></textarea>
            </div>
            <div class="form-field full checkbox-field">
              <label>
                <input id="requirement-create-task" type="checkbox" checked />
                同时创建关联任务，并默认流转给需求创建者（${currentUser}）
              </label>
            </div>
          </div>
          <div class="customer-form-actions">
            <button class="muted-btn" data-action="toggle-requirement-form">取消</button>
            <button class="primary-btn" data-action="save-requirement">保存需求</button>
          </div>
        </div>
      `, 'wide') : ''}
      <div class="requirement-list">
        ${customer.requirements.map((item, index) => `
          <article class="requirement-card">
            <div class="detail-head">
              <div>
                <h3>${item.title}</h3>
                <p>${item.proposer} · 创建者 ${item.creator || '-'} · ${item.date}</p>
              </div>
              <span class="badge ${requirementBadgeClass(item.status)}">${item.status}</span>
            </div>
            <p><strong>用户故事：</strong>${item.userStory}</p>
            <p><strong>业务价值：</strong>${item.value}</p>
            <p><strong>验收标准：</strong>${item.acceptance}</p>
            <div class="attachment-list">
              <span>需求编号 · ${item.id}</span>
              <span>优先级 · ${item.priority}</span>
              ${item.taskId
                ? `<button class="inline-link" data-action="open-task-detail" data-task-id="${item.taskId}" data-return-view="requirements">关联任务 · ${item.taskId}</button>`
                : '<span>未关联任务</span>'}
            </div>
            <div class="requirement-card-actions">
              ${item.status !== '已作废'
                ? `<button class="ghost-btn" data-action="void-requirement" data-requirement-index="${index}">作废需求</button>`
                : ''}
              <button class="danger-btn" data-action="delete-requirement" data-requirement-index="${index}">删除</button>
            </div>
          </article>
        `).join('') || '<p class="empty-note">暂无需求记录</p>'}
      </div>
    </section>
  `;
}

function renderRequirementOverview() {
  const project = projects.find((item) => item.id === selectedProjectId);
  const grouped = new Map();

  project.projectCustomers
    .flatMap((customer) => customer.requirements.map((requirement) => ({ customer, requirement })))
    .filter(({ requirement }) => requirement.status !== '已作废')
    .forEach(({ customer, requirement }) => {
    if (!grouped.has(requirement.title)) grouped.set(requirement.title, []);
    grouped.get(requirement.title).push(customer.customerName);
  });

  requirementOverview.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${project.externalName} 的需求纵览</h2>
          <p>汇总客户共性需求，方便产品提取和抽象</p>
        </div>
      </div>
      <div class="requirement-list">
        ${[...grouped.entries()].map(([title, customers]) => `
          <article class="requirement-card">
            <div class="detail-head">
              <div>
                <h3>${title}</h3>
                <p>涉及客户：${customers.join('、')}</p>
              </div>
              <span class="badge ${customers.length > 1 ? 'progress' : 'pending'}">${customers.length > 1 ? '共性需求' : '单客户需求'}</span>
            </div>
          </article>
        `).join('') || '<p class="empty-note">暂无需求数据</p>'}
      </div>
    </section>
  `;
}

function renderProjectMaterials() {
  const project = projects.find((item) => item.id === selectedProjectId);

  projectMaterials.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${project.externalName} 的项目资料区</h2>
          <p>承接由阶段显式发布出来、供项目内成员复用的可信资料</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>资料名称</th>
              <th>来源阶段</th>
              <th>发布目标</th>
              <th>发布时间</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${project.projectMaterials.map((material) => `
              <tr>
                <td>${material.name}</td>
                <td>${material.sourceStage}</td>
                <td>${material.shareTarget}</td>
                <td>${material.publishedAt}</td>
                <td>${renderDownloadButton(material)}</td>
              </tr>
            `).join('') || '<tr><td colspan="5">暂无共享资料</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function taskFilterOption(value, selectedValue, label = value) {
  return `<option value="${escapeAttr(value)}" ${value === selectedValue ? 'selected' : ''}>${escapeAttr(label)}</option>`;
}

function resetTaskListFiltersForContext(taskIds = [], contextLabel = '', contextActive = Boolean(contextLabel)) {
  taskListFilters = {
    keyword: '',
    project: '全部项目',
    status: '全部状态',
    priority: '全部优先级',
    assignee: '全部执行者',
    category: '全部分类',
    taskIds: [...taskIds],
    contextLabel,
    contextActive,
  };
}

function renderTaskManagement() {
  const keywordRaw = taskListFilters.keyword || '';
  const keyword = keywordRaw.trim().toLowerCase();
  const projectFilter = taskListFilters.project || '全部项目';
  const statusFilter = taskListFilters.status || '全部状态';
  const priorityFilter = taskListFilters.priority || '全部优先级';
  const assigneeFilter = taskListFilters.assignee || '全部执行者';
  const categoryFilter = taskListFilters.category || '全部分类';
  const contextActive = taskListFilters.contextActive === true;
  const contextTaskIds = taskListFilters.taskIds || [];
  const contextTaskIdSet = contextActive ? new Set(contextTaskIds) : null;

  const filteredTasks = tasks.filter((task) => {
    const matchesContext = !contextTaskIdSet || contextTaskIdSet.has(task.id);
    const matchesKeyword = !keyword || [
      task.id,
      task.title,
      task.stage,
      task.category,
      task.description,
      task.customerName,
      ...taskAssigneeNames(task),
      ...(task.participants || []),
    ].some((value) => String(value || '').toLowerCase().includes(keyword));
    const matchesProject = projectFilter === '全部项目' || task.project === projectFilter;
    const matchesStatus = statusFilter === '全部状态' || task.status === statusFilter;
    const matchesPriority = priorityFilter === '全部优先级' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === '全部执行者' || taskAssigneeNames(task).includes(assigneeFilter);
    const matchesCategory = categoryFilter === '全部分类' || task.category === categoryFilter;
    return matchesContext && matchesKeyword && matchesProject && matchesStatus && matchesPriority && matchesAssignee && matchesCategory;
  });

  taskManagement.innerHTML = `
    <div class="toolbar task-toolbar">
      <input id="task-keyword" type="search" value="${escapeAttr(keywordRaw)}" placeholder="${textFor('taskList.searchPlaceholder', '搜索任务编号 / 标题 / 阶段 / 客户')}" />
      <select id="task-project-filter" class="select-input compact-filter">
        ${taskFilterOption('全部项目', projectFilter, textFor('taskList.allProject', '全部项目'))}
        ${[...new Set(tasks.map((task) => task.project))].map((item) => taskFilterOption(item, projectFilter)).join('')}
      </select>
      <select id="task-status-filter" class="select-input compact-filter">
        ${taskFilterOption('全部状态', statusFilter, textFor('taskList.allStatus', '全部状态'))}
        ${activeTaskStatusNames().map((item) => taskFilterOption(item, statusFilter)).join('')}
      </select>
      <select id="task-priority-filter" class="select-input compact-filter">
        ${taskFilterOption('全部优先级', priorityFilter, textFor('taskList.allPriority', '全部优先级'))}
        ${priorityOptions.map((item) => taskFilterOption(item, priorityFilter)).join('')}
      </select>
      <select id="task-assignee-filter" class="select-input compact-filter">
        ${taskFilterOption('全部执行者', assigneeFilter, textFor('taskList.allAssignee', '全部执行者'))}
        ${[...new Set(tasks.flatMap((task) => taskAssigneeNames(task)))].map((item) => taskFilterOption(item, assigneeFilter)).join('')}
      </select>
      <select id="task-category-filter" class="select-input compact-filter">
        ${taskFilterOption('全部分类', categoryFilter, textFor('taskList.allCategory', '全部分类'))}
        ${taskCategoryOptions.map((item) => taskFilterOption(item, categoryFilter)).join('')}
      </select>
      <button class="primary-btn" data-action="toggle-task-form">${textFor('taskList.create', '新建任务')}</button>
    </div>

    ${contextActive ? `
      <div class="context-filter-banner">
        <span><strong>${textFor('taskList.context', '当前任务上下文')}</strong> · ${escapeAttr(taskListFilters.contextLabel || '')} · ${filteredTasks.length}/${contextTaskIds.length} ${textFor('taskList.countSuffix', '个任务')}</span>
        <button class="muted-btn compact-btn" data-action="clear-task-context-filter">${textFor('taskList.clearContext', '清除任务上下文')}</button>
      </div>
    ` : ''}

    ${taskFormOpen ? renderFormModal(`
      <div class="panel task-form-panel">
        <div class="form-grid">
          <div class="form-field full">
            <label>${textFor('taskList.form.title', '任务标题')}</label>
            <input id="task-title" class="text-input" maxlength="120" placeholder="${textFor('taskList.form.titlePlaceholder', '例如 确认海外版本支付语言包')}" />
          </div>
          <div class="form-field full">
            <label>${textFor('taskList.form.description', '任务描述')}</label>
            <textarea id="task-description" rows="3" maxlength="3000" placeholder="${textFor('taskList.form.descriptionPlaceholder', '说明任务背景、目标和交付标准')}"></textarea>
          </div>
          <div class="form-field">
            <label>${textFor('taskList.form.project', '所属项目')}</label>
            <select id="task-project" class="select-input">
              ${projects.map((project) => taskFilterOption(project.externalName, taskFormState.project)).join('')}
            </select>
          </div>
          <div class="form-field">
            <label>${textFor('taskList.form.stage', '来源阶段')}</label>
            <select id="task-stage" class="select-input">
              ${projects.find((project) => project.externalName === taskFormState.project)?.stages.map((stage) => taskFilterOption(stage.name, taskFormState.stage)).join('') || ''}
            </select>
          </div>
          <div class="form-field">
            <label>${textFor('taskList.form.category', '任务分类')}</label>
            <select id="task-category" class="select-input">
              ${taskCategoryOptions.map((category) => taskFilterOption(category, taskFormState.category)).join('')}
            </select>
          </div>
          <div class="form-field">
            <label>${textFor('taskList.form.priority', '优先级')}</label>
            <select id="task-priority" class="select-input">
              ${priorityOptions.map((priority) => taskFilterOption(priority, '中')).join('')}
            </select>
          </div>
          <div class="form-field">
            <label>${textFor('taskList.form.assignee', '执行者')}</label>
            ${searchablePeopleInput('task-assignees', [], textFor('taskList.form.peoplePlaceholder', '搜索姓名，支持多人'))}
          </div>
          <div class="form-field">
            <label>${textFor('taskList.form.participant', '参与者')}</label>
            ${searchablePeopleInput('task-participants', [], textFor('taskList.form.peoplePlaceholder', '搜索姓名，支持多人'))}
          </div>
          <div class="form-field">
            <label>${textFor('taskList.form.expectedCompletionAt', '预期完成时间')}</label>
            <input id="task-expected-completion-at" class="text-input" type="date" value="2026-05-30" />
          </div>
          <div class="form-field">
            <label>${textFor('taskList.form.creator', '创建者')}</label>
            <input class="text-input" value="${currentUser}" disabled />
          </div>
        </div>
        <div class="customer-form-actions">
          <button class="muted-btn" data-action="toggle-task-form">${textFor('taskList.form.cancel', '取消')}</button>
          <button class="primary-btn" data-action="save-task">${textFor('taskList.form.save', '保存任务')}</button>
        </div>
      </div>
    `, 'wide') : ''}

    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>${textFor('taskList.panelTitle', '任务列表')}</h2>
          <p>${textFor('taskList.panelDescription', '产品逻辑参考 Jira，并保留 KPM 的项目 / 阶段上下文')}</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${textFor('taskList.headers.id', '编号')}</th>
              <th>${textFor('taskList.headers.title', '标题')}</th>
              <th>${textFor('taskList.headers.category', '分类')}</th>
              <th>${textFor('taskList.headers.project', '项目')}</th>
              <th>${textFor('taskList.headers.stage', '来源阶段')}</th>
              <th>${textFor('taskList.headers.status', '状态')}</th>
              <th>${textFor('taskList.headers.priority', '优先级')}</th>
              <th>${textFor('taskList.headers.creator', '创建者')}</th>
              <th>${textFor('taskList.headers.assignee', '执行者')}</th>
              <th>${textFor('taskList.headers.participant', '参与者')}</th>
              <th>${textFor('taskList.headers.expectedCompletionAt', '预期完成时间')}</th>
              <th>${textFor('taskList.headers.source', '来源')}</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTasks.map((task) => `
              <tr>
                <td><button class="inline-link" data-action="open-task-detail" data-task-id="${task.id}" data-return-view="tasks">${task.id}</button></td>
                <td>${task.title}</td>
                <td>${task.category}</td>
                <td>${task.project}</td>
                <td>${task.stage}</td>
                <td><span class="badge ${taskBadgeClass(task.status)}">${task.status}</span></td>
                <td>${task.priority}</td>
                <td>${task.creator}</td>
                <td>${taskPersonLabel(taskAssigneeNames(task), textFor('taskList.unassigned', '待分配'))}</td>
                <td>${taskPersonLabel(task.participants)}</td>
                <td>${task.expectedCompletionAt || '-'}</td>
                <td>${task.source}</td>
              </tr>
            `).join('') || `<tr><td colspan="12">${textFor('taskList.empty', '暂无匹配任务')}</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
function renderTaskDetail() {
  const task = tasks.find((item) => item.id === selectedTaskId);
  const linked = findRequirementByTaskId(task.id);
  const expectedCompletionValue = task.expectedCompletionAt && task.expectedCompletionAt !== '-' ? task.expectedCompletionAt : '';
  const sortedTaskAttachments = latestItems(task.attachments || [], (task.attachments || []).length);
  const visibleTaskAttachments = previewItems(sortedTaskAttachments, previewLimits.files);
  const sortedTaskComments = latestItems(task.comments || [], (task.comments || []).length);
  const visibleTaskComments = previewItems(sortedTaskComments, previewLimits.messages);

  taskDetail.innerHTML = `
    <div class="task-detail-grid">
      <div class="detail-main">
        <section class="panel">
          <div class="detail-head">
            <div>
              <p>${task.id}</p>
              <h2>${task.title}</h2>
            </div>
            <span class="badge ${taskBadgeClass(task.status)}">${task.status}</span>
          </div>
          <div class="project-meta task-meta-grid">
            <div class="meta-item">
              <span>所属项目</span>
              <strong>${task.project}</strong>
            </div>
            <div class="meta-item">
              <span>来源阶段</span>
              <strong>${task.stage}</strong>
            </div>
            <div class="meta-item">
              <span>任务分类</span>
              <strong>${task.category}</strong>
            </div>
            <div class="meta-item">
              <span>来源</span>
              <strong>${task.source}</strong>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>任务信息</h2>
              <p>可在这里维护任务描述、优先级、执行者、参与者和预期完成时间</p>
            </div>
          </div>
          <div class="form-grid task-edit-form">
            <div class="form-field full">
              <label>任务描述</label>
              <textarea id="task-detail-description" rows="4" placeholder="说明任务背景、目标和交付标准">${task.description || ''}</textarea>
            </div>
            <div class="form-field">
              <label>优先级</label>
              <select id="task-detail-priority" class="select-input">
                ${priorityOptions.map((priority) => `<option ${task.priority === priority ? 'selected' : ''}>${priority}</option>`).join('')}
              </select>
            </div>
            <div class="form-field">
              <label>预期完成时间</label>
              <input id="task-detail-expected-completion-at" class="text-input" type="date" value="${expectedCompletionValue}" />
            </div>
            <div class="form-field">
              <label>执行者</label>
              ${searchablePeopleInput('task-detail-assignees', taskAssigneeNames(task), '搜索姓名，支持多人')}
            </div>
            <div class="form-field">
              <label>参与者</label>
              ${searchablePeopleInput('task-detail-participants', task.participants || [], '搜索姓名，支持多人')}
            </div>
          </div>
          <div class="customer-form-actions">
            <button class="primary-btn" data-action="save-task-detail">保存修改</button>
          </div>
        </section>

        ${linked ? `
          <section class="panel">
            <div class="panel-head">
              <div>
                <h2>关联需求</h2>
                <p>${linked.customer.customerName} · ${linked.requirement.id}</p>
              </div>
              <button class="ghost-btn" data-action="open-linked-requirement" data-requirement-id="${linked.requirement.id}">查看需求</button>
            </div>
            <article class="requirement-card linked-requirement-card">
              <div class="detail-head">
                <div>
                  <h3>${linked.requirement.title}</h3>
                  <p>${linked.requirement.proposer} · 创建者 ${linked.requirement.creator || '-'} · ${linked.requirement.date}</p>
                </div>
                <span class="badge ${requirementBadgeClass(linked.requirement.status)}">${linked.requirement.status}</span>
              </div>
              <p><strong>用户故事：</strong>${linked.requirement.userStory}</p>
            </article>
          </section>
        ` : ''}

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>任务附件</h2>
              <p>共 ${sortedTaskAttachments.length} 个；当前展示最近 ${previewLimits.files} 个附件</p>
            </div>
            <div class="inline-actions">
              ${renderOverflowButton(sortedTaskAttachments, previewLimits.files, 'open-task-attachments-modal', '查看全部附件')}
              <label class="ghost-btn upload-label">
                上传文件
                <input id="task-file-input" type="file" multiple />
              </label>
            </div>
          </div>
          <div class="file-list">
            ${renderFileRows(visibleTaskAttachments, { emptyText: '暂无任务附件' })}
          </div>
          ${renderSectionFooter(sortedTaskAttachments, previewLimits.files, 'open-task-attachments-modal', `仅展示最近 ${previewLimits.files} 个任务附件`)}
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>任务讨论</h2>
              <p>共 ${sortedTaskComments.length} 条；当前展示最近 ${previewLimits.messages} 条讨论</p>
            </div>
            ${renderOverflowButton(sortedTaskComments, previewLimits.messages, 'open-task-comments-modal', '查看全部讨论')}
          </div>
          <div class="message-composer">
            <textarea id="task-comment-text" rows="3" placeholder="补充进展、问题或需要其他成员协助的内容"></textarea>
            <div class="message-actions">
              <label class="ghost-btn file-label">
                添加附件
                <input id="task-comment-files" type="file" multiple />
              </label>
              <button class="primary-btn" data-action="publish-task-comment">发布留言</button>
            </div>
          </div>
          <div class="message-list">
            ${renderMessageCards(visibleTaskComments, '暂无讨论记录')}
          </div>
          ${renderSectionFooter(sortedTaskComments, previewLimits.messages, 'open-task-comments-modal', `仅展示最近 ${previewLimits.messages} 条任务讨论`)}
        </section>
      </div>

      <div class="detail-side">
        <section class="info-card">
          <h3>任务状态</h3>
          <select id="task-detail-status" class="select-input">
            ${availableTaskDetailStatuses(task).map((status) => `<option ${task.status === status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
          <p>${taskStatusTransitionHint(task)}</p>
          <p>状态选项来自资源管理 / 任务状态配置，所有启用状态都可以在这里使用。</p>
          ${linked ? '<p>状态为“已完成”时，关联需求自动标记为“已实现”；状态为“已拒绝”时，关联需求自动标记为“已拒绝”。</p>' : ''}
        </section>

        <section class="info-card">
          <h3>执行信息</h3>
          <div class="detail-facts">
            <div>
              <span>创建者</span>
              <strong>${task.creator}</strong>
            </div>
            <div>
              <span>执行者</span>
              <strong>${taskPersonLabel(taskAssigneeNames(task), '待分配')}</strong>
            </div>
            <div>
              <span>参与者</span>
              <strong>${taskPersonLabel(task.participants)}</strong>
            </div>
            <div>
              <span>优先级</span>
              <strong>${task.priority}</strong>
            </div>
            <div>
              <span>预期完成时间</span>
              <strong>${task.expectedCompletionAt || '-'}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function formatMoney(amount, currency) {
  return `${currency} ${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const prototypeRatesToUSD = {
  USD: 1,
  EUR: 1.09,
  CNY: 1 / 7.18,
};

function convertMoney(amount, sourceCurrency, targetCurrency) {
  const amountInUSD = Number(amount || 0) * prototypeRatesToUSD[sourceCurrency];
  return amountInUSD / prototypeRatesToUSD[targetCurrency];
}

function orderProjectNames() {
  return [...new Set(orders.map((order) => order.projectName))];
}

function orderCustomerNames() {
  return [...new Set(orders.map((order) => order.customerName))];
}

function orderRegionNames() {
  return [...new Set(customers.map((customer) => customer.region))];
}

function orderRegion(order) {
  return customerByName(order.customerName)?.region || '未配置';
}

function orderFieldLabel(field) {
  return {
    type: '订单类型',
    orderDate: '下单日期',
    customerName: '下单客户',
    projectName: '项目信息',
    quantity: '数量',
    specification: '具体规格',
    expectedShipDate: '期望发货日期',
    plannedShipDate: '计划发货日期',
    softwareVersion: '软件版本号',
    currency: '币种',
    unitPrice: '单价',
    amount: '金额',
  }[field] || field;
}

function collectOrderFormValue() {
  const quantity = Number(document.getElementById('order-quantity').value);
  const unitPrice = Number(document.getElementById('order-unit-price').value);
  return {
    type: document.getElementById('order-type').value,
    orderDate: document.getElementById('order-date').value,
    customerName: document.getElementById('order-customer').value,
    projectName: document.getElementById('order-project').value,
    quantity,
    specification: document.getElementById('order-specification').value.trim(),
    expectedShipDate: document.getElementById('order-expected-ship-date').value,
    plannedShipDate: document.getElementById('order-planned-ship-date').value,
    softwareVersion: document.getElementById('order-software-version').value.trim(),
    currency: document.getElementById('order-currency').value,
    unitPrice,
    amount: quantity * unitPrice,
  };
}

function renderOrderForm(editingOrder = null, options = {}) {
  const fixedCustomerName = options.fixedCustomerName || '';
  const order = editingOrder || {
    type: activeOrderTypes()[0] || '正式订单',
    customerName: fixedCustomerName || assignableCustomers()[0]?.name || customers[0]?.name || '',
    projectName: projects[0]?.externalName || '',
    currency: 'USD',
    quantity: 1,
    unitPrice: 0,
    orderDate: prototypeToday,
    expectedShipDate: prototypeToday,
    plannedShipDate: prototypeToday,
    softwareVersion: '',
    specification: '',
  };

  return `
    <div class="panel task-form-panel">
        <div class="section-intro">
        <h3>${options.title || (editingOrder ? `编辑 ${editingOrder.id}` : '新增订单')}</h3>
        <p>${options.description || (editingOrder ? '修改订单时必须填写原因，系统会自动保留修改记录。' : '新增订单后，销售额会直接进入统计看板。')}</p>
      </div>
      <div class="form-grid">
        <div class="form-field">
          <label>订单类型</label>
          <select id="order-type" class="select-input">
            ${orderTypeOptionsForValue(order.type).map((type) => `<option ${order.type === type ? 'selected' : ''}>${type}</option>`).join('')}
          </select>
        </div>
        <div class="form-field">
          <label>下单日期</label>
          <input id="order-date" class="text-input" type="date" value="${order.orderDate}" />
        </div>
        <div class="form-field">
          <label>下单客户</label>
          ${fixedCustomerName ? `
            <input id="order-customer" class="text-input" value="${fixedCustomerName}" readonly />
          ` : `
            <input id="order-customer" class="text-input" list="order-customer-options" value="${order.customerName}" placeholder="输入客户名称搜索" />
            ${renderNameDatalist('order-customer-options', assignableCustomers(order.customerName).map((customer) => customer.name))}
          `}
        </div>
        <div class="form-field">
          <label>项目信息</label>
          <input id="order-project" class="text-input" list="order-project-options" value="${order.projectName}" placeholder="输入项目名称搜索" />
          ${renderNameDatalist('order-project-options', projects.map((project) => project.externalName))}
        </div>
        <div class="form-field">
          <label>数量</label>
          <input id="order-quantity" class="text-input" type="number" min="1" value="${order.quantity}" />
        </div>
        <div class="form-field full">
          <label>具体规格</label>
          <input id="order-specification" class="text-input" maxlength="1000" value="${order.specification}" placeholder="例如 4GB + 64GB / 黑色 / 欧规充电器" />
        </div>
        <div class="form-field">
          <label>期望发货日期</label>
          <input id="order-expected-ship-date" class="text-input" type="date" value="${order.expectedShipDate}" />
        </div>
        <div class="form-field">
          <label>计划发货日期</label>
          <input id="order-planned-ship-date" class="text-input" type="date" value="${order.plannedShipDate}" />
        </div>
        <div class="form-field">
          <label>软件版本号</label>
          <input id="order-software-version" class="text-input" maxlength="80" value="${order.softwareVersion}" placeholder="例如 v3.2.1" />
        </div>
        <div class="form-field">
          <label>币种</label>
          <select id="order-currency" class="select-input">
            ${orderCurrencyOptions.map((currency) => `<option ${order.currency === currency ? 'selected' : ''}>${currency}</option>`).join('')}
          </select>
        </div>
        <div class="form-field">
          <label>单价</label>
          <input id="order-unit-price" class="text-input" type="number" min="0" step="0.01" value="${order.unitPrice}" />
        </div>
        <div class="form-field">
          <label>创建人</label>
          <input class="text-input" value="${editingOrder?.creator || currentUser}" disabled />
        </div>
        ${editingOrder ? `
          <div class="form-field full">
            <label>修改原因</label>
            <textarea id="order-change-reason" rows="3" placeholder="请说明为什么修改该订单"></textarea>
          </div>
        ` : ''}
      </div>
      <div class="customer-form-actions">
        <button class="muted-btn" data-action="${options.cancelAction || 'cancel-order-form'}">取消</button>
        <button class="primary-btn" data-action="${options.submitAction || 'save-order'}">${editingOrder ? '保存修改' : '保存订单'}</button>
      </div>
    </div>
  `;
}

function renderOrderManagement() {
  const keyword = document.getElementById('order-keyword')?.value.trim().toLowerCase() || '';
  const filteredOrders = orders.filter((order) => !keyword || [
    order.id,
    order.type,
    order.customerName,
    order.projectName,
    order.specification,
    order.softwareVersion,
  ].some((value) => value.toLowerCase().includes(keyword)));
  const editingOrder = orderEditIndex === null ? null : orders[orderEditIndex];
  const selectedHistoryOrder = orders.find((order) => order.id === selectedOrderId);

  orderManagement.innerHTML = `
    <div class="toolbar">
      <input id="order-keyword" type="search" value="${keyword}" placeholder="搜索订单号 / 客户 / 项目 / 规格" />
      <button class="primary-btn" data-action="toggle-order-form">新增订单</button>
    </div>
    ${orderFormOpen ? renderFormModal(renderOrderForm(editingOrder), 'wide') : ''}
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>订单列表</h2>
          <p>新增、修改、删除均可受权限控制；修改订单时自动沉淀审计记录。</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>订单号</th>
              <th>类型</th>
              <th>下单日期</th>
              <th>客户</th>
              <th>项目</th>
              <th>数量</th>
              <th>规格</th>
              <th>期望发货</th>
              <th>计划发货</th>
              <th>软件版本</th>
              <th>金额</th>
              <th>创建人</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${filteredOrders.map((order) => {
              const index = orders.indexOf(order);
              return `
              <tr>
                <td>${order.id}</td>
                <td><span class="badge progress">${order.type || '正式订单'}</span></td>
                <td>${order.orderDate}</td>
                <td>${order.customerName}</td>
                <td>${order.projectName}</td>
                <td>${order.quantity}</td>
                <td>${order.specification}</td>
                <td>${order.expectedShipDate}</td>
                <td>${order.plannedShipDate}</td>
                <td>${order.softwareVersion}</td>
                <td>${formatMoney(order.amount, order.currency)}</td>
                <td>${order.creator}</td>
                <td class="row-actions">
                  <button class="ghost-btn" data-action="edit-order" data-order-index="${index}">编辑</button>
                  <button class="ghost-btn" data-action="open-order-history" data-order-id="${order.id}">修改记录</button>
                  <button class="danger-btn" data-action="delete-order" data-order-index="${index}">删除</button>
                </td>
              </tr>
            `;
            }).join('') || '<tr><td colspan="13">暂无匹配订单</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
    ${orderHistoryModalOpen && selectedHistoryOrder ? `
      <div class="modal-backdrop">
        <section class="modal-card">
          <div class="panel-head">
            <div>
              <h2>${selectedHistoryOrder.id} 修改记录</h2>
              <p>保留修改人、时间、内容和原因</p>
            </div>
          </div>
          <div class="audit-list">
            ${selectedHistoryOrder.histories.map((history) => `
              <article class="audit-card">
                <strong>${history.modifier}</strong>
                <span>${history.modifiedAt}</span>
                <p>${history.changes}</p>
                <small>原因：${history.reason}</small>
              </article>
            `).join('') || '<p class="empty-note">暂无修改记录</p>'}
          </div>
          <div class="customer-form-actions">
            <button class="primary-btn" data-action="close-order-history">关闭</button>
          </div>
        </section>
      </div>
    ` : ''}
  `;
}

function filteredOrdersForAnalytics() {
  return orders.filter((order) => {
    const [year, month] = order.orderDate.split('-');
    const quarter = `Q${Math.ceil(Number(month) / 3)}`;
    const matchesProject = !analyticsProjectFilter.length || analyticsProjectFilter.includes(order.projectName);
    const matchesCustomer = !analyticsCustomerFilter.length || analyticsCustomerFilter.includes(order.customerName);
    const matchesRegion = !analyticsRegionFilter.length || analyticsRegionFilter.includes(orderRegion(order));
    const matchesPeriod = analyticsOrderPeriod === '年度'
      ? year === analyticsYear
      : analyticsOrderPeriod === '季度'
        ? year === analyticsYear && quarter === analyticsQuarter
        : year === analyticsYear && month === analyticsMonth;
    return matchesProject && matchesCustomer && matchesRegion && matchesPeriod;
  });
}

function analyticsSelectedProjects() {
  return analyticsProjectFilter.length
    ? analyticsProjectFilter
    : [...new Set(filteredOrdersForAnalytics().map((order) => order.projectName))];
}

function convertedOrderAmount(order) {
  return convertMoney(order.amount, order.currency, analyticsTargetCurrency);
}

function analyticsFilterOptions(type) {
  if (type === 'project') return orderProjectNames();
  if (type === 'customer') return orderCustomerNames();
  return orderRegionNames();
}

function analyticsSelectedFilterValues(type) {
  if (type === 'project') return analyticsProjectFilter;
  if (type === 'customer') return analyticsCustomerFilter;
  return analyticsRegionFilter;
}

function analyticsFilterSummary(type) {
  const selected = analyticsSelectedFilterValues(type);
  if (!selected.length) {
    return {
      project: '全部项目',
      customer: '全部客户',
      region: '全部地区',
    }[type];
  }
  if (selected.length === 1) return selected[0];
  return `${selected.length} 项已选`;
}

function filteredAnalyticsFilterOptions(type) {
  const keyword = analyticsFilterKeywords[type].trim().toLowerCase();
  return analyticsFilterOptions(type)
    .filter((option) => !keyword || option.toLowerCase().includes(keyword));
}

function renderAnalyticsFilterOptionList(type) {
  const selected = analyticsSelectedFilterValues(type);
  return filteredAnalyticsFilterOptions(type).map((option) => `
    <label class="multi-select-option">
      <input type="checkbox" data-analytics-filter="${type}" value="${option}" ${selected.includes(option) ? 'checked' : ''} />
      <span>${option}</span>
    </label>
  `).join('') || '<p class="empty-note">没有匹配项</p>';
}

function renderAnalyticsMultiSelect(type, label) {
  const isOpen = analyticsDropdownOpen === type;
  return `
    <div class="form-field analytics-multi-select-field">
      <label>${label}</label>
      <div class="analytics-multi-select">
        <button class="multi-select-trigger" data-action="toggle-analytics-multiselect" data-filter-type="${type}">
          <span>${analyticsFilterSummary(type)}</span>
          <em>${isOpen ? '收起' : '展开'}</em>
        </button>
        ${isOpen ? `
          <div class="multi-select-panel">
            <input
              class="text-input"
              data-analytics-search="${type}"
              value="${analyticsFilterKeywords[type]}"
              placeholder="搜索${label}"
            />
            <div id="analytics-${type}-options" class="multi-select-options">
              ${renderAnalyticsFilterOptionList(type)}
            </div>
            <button class="ghost-btn compact-btn" data-action="clear-analytics-filter" data-filter-type="${type}">清空选择</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function analyticsTrendBuckets() {
  if (analyticsOrderPeriod === '季度') {
    const quarterStartMonth = (Number(analyticsQuarter.slice(1)) - 1) * 3 + 1;
    return Array.from({ length: 3 }, (_, index) => {
      const month = String(quarterStartMonth + index).padStart(2, '0');
      return { key: `${analyticsYear}-${month}`, label: `${Number(month)}月` };
    });
  }

  if (analyticsOrderPeriod === '月份') {
    return [
      { key: 'W1', label: '第1周' },
      { key: 'W2', label: '第2周' },
      { key: 'W3', label: '第3周' },
      { key: 'W4', label: '第4周' },
      { key: 'W5', label: '第5周' },
    ];
  }

  return Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, '0');
    return { key: `${analyticsYear}-${month}`, label: `${index + 1}月` };
  });
}

function orderTrendBucketKey(order) {
  const [year, month, day] = order.orderDate.split('-');
  if (analyticsOrderPeriod === '月份') {
    return `W${Math.ceil(Number(day) / 7)}`;
  }
  return `${year}-${month}`;
}

function analyticsTrendSeries() {
  const buckets = analyticsTrendBuckets();
  const selectedProjects = analyticsSelectedProjects();
  return selectedProjects.map((projectName, index) => ({
    projectName,
    color: ['#2457f5', '#12b76a', '#f79009', '#9e77ed', '#f04438'][index % 5],
    values: buckets.map((bucket) => filteredOrdersForAnalytics()
      .filter((order) => order.projectName === projectName && orderTrendBucketKey(order) === bucket.key)
      .reduce((sum, order) => sum + convertedOrderAmount(order), 0)),
  }));
}

function renderOrderTrendChart() {
  const buckets = analyticsTrendBuckets();
  const series = analyticsTrendSeries();
  const width = 960;
  const height = 360;
  const padding = { top: 28, right: 24, bottom: 54, left: 68 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...series.flatMap((item) => item.values), 1);
  const roundedMax = Math.ceil(maxValue / 10000) * 10000 || maxValue;
  const bucketWidth = chartWidth / buckets.length;
  const barGroupWidth = Math.min(bucketWidth * 0.68, 56);
  const barWidth = barGroupWidth / Math.max(series.length, 1);
  const yForValue = (value) => padding.top + chartHeight - (value / roundedMax) * chartHeight;
  const linePoints = (values) => values.map((value, bucketIndex) => {
    const x = padding.left + bucketWidth * bucketIndex + bucketWidth / 2;
    return `${x},${yForValue(value)}`;
  }).join(' ');

  return `
    <section class="sub-panel chart-panel">
      <div class="panel-head compact-head">
        <div>
          <h3>项目销售趋势</h3>
          <p>柱状图比较各项目销售额，折线连接同一项目在不同周期内的变化趋势</p>
        </div>
      </div>
      <div class="chart-legend">
        ${series.map((item) => `<span><i style="background:${item.color}"></i>${item.projectName}</span>`).join('')}
      </div>
      <svg class="combo-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="订单销售额组合图">
        ${Array.from({ length: 5 }, (_, index) => {
          const value = roundedMax - (roundedMax / 4) * index;
          const y = yForValue(value);
          return `
            <g>
              <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" />
              <text x="${padding.left - 12}" y="${y + 4}">${Math.round(value / 1000)}k</text>
            </g>
          `;
        }).join('')}
        ${buckets.map((bucket, bucketIndex) => {
          const centerX = padding.left + bucketWidth * bucketIndex + bucketWidth / 2;
          return `<text class="axis-label" x="${centerX}" y="${height - 18}">${bucket.label}</text>`;
        }).join('')}
        ${series.map((item, seriesIndex) => item.values.map((value, bucketIndex) => {
          const x = padding.left + bucketWidth * bucketIndex + bucketWidth / 2 - barGroupWidth / 2 + seriesIndex * barWidth;
          const y = yForValue(value);
          const barHeight = padding.top + chartHeight - y;
          return `<rect x="${x}" y="${y}" width="${Math.max(barWidth - 4, 6)}" height="${barHeight}" rx="7" fill="${item.color}" opacity="0.84"><title>${item.projectName} · ${buckets[bucketIndex].label} · ${formatMoney(value, analyticsTargetCurrency)}</title></rect>`;
        }).join('')).join('')}
        ${series.map((item) => `
          <polyline points="${linePoints(item.values)}" stroke="${item.color}" />
          ${item.values.map((value, bucketIndex) => {
            const x = padding.left + bucketWidth * bucketIndex + bucketWidth / 2;
            const y = yForValue(value);
            return `<circle cx="${x}" cy="${y}" r="5" fill="${item.color}"><title>${item.projectName} · ${buckets[bucketIndex].label} · ${formatMoney(value, analyticsTargetCurrency)}</title></circle>`;
          }).join('')}
        `).join('')}
      </svg>
    </section>
  `;
}

function regionSummary(region) {
  const regionCustomers = customers.filter((customer) => customer.region === region);
  const sales = new Set(regionCustomers.flatMap((customer) => customer.salesOwners || []));
  const support = new Set(regionCustomers.flatMap((customer) => customer.supportOwners || []));
  const soldProjects = new Set(orders.filter((order) => regionCustomers.some((customer) => customer.name === order.customerName)).map((order) => order.projectName));
  return {
    salesCount: sales.size,
    supportCount: support.size,
    soldProjects: [...soldProjects],
  };
}

function fallbackResourceMapRows() {
  const fallbackCoordinates = {
    'Nova Retail': { latitude: 52.52, longitude: 13.405, geocodedAddress: 'Berlin', geoPrecision: 'city-center' },
    'Siam Pay': { latitude: 13.7563, longitude: 100.5018, geocodedAddress: 'Bangkok', geoPrecision: 'city-center' },
    'Andes Market': { latitude: -33.4489, longitude: -70.6693, geocodedAddress: 'Santiago', geoPrecision: 'city-center' },
    'Pacific Mart': { latitude: 14.5995, longitude: 120.9842, geocodedAddress: 'Manila', geoPrecision: 'city-center' },
    'Metro One': { latitude: 25.2048, longitude: 55.2708, geocodedAddress: 'Dubai', geoPrecision: 'city-center' },
  };
  return customers.map((customer) => ({
    customerId: customer.id || customer.name,
    customerName: customer.name,
    region: customer.region,
    address: customer.address || customer.region,
    level: customer.level,
    status: customer.status,
    salesOwners: customer.salesOwners || [],
    supportOwners: customer.supportOwners || [],
    projects: projects
      .filter((project) => project.projectCustomers.some((projectCustomer) => projectCustomer.customerName === customer.name))
      .map((project) => project.externalName),
    orderedQuantity: orders
      .filter((order) => order.customerName === customer.name)
      .reduce((sum, order) => sum + Number(order.quantity || 0), 0),
    ...(fallbackCoordinates[customer.name] || {}),
    geocodeProvider: fallbackCoordinates[customer.name] ? 'prototype-fallback' : 'unresolved',
  }));
}

function resourceMapData() {
  return resourceMapRows.length ? resourceMapRows : fallbackResourceMapRows();
}

function locatedResourceRows() {
  return resourceMapData().filter((row) => Number.isFinite(Number(row.latitude)) && Number.isFinite(Number(row.longitude)));
}

function unlocatedResourceRows() {
  return resourceMapData().filter((row) => !Number.isFinite(Number(row.latitude)) || !Number.isFinite(Number(row.longitude)));
}

function renderRegionCards() {
  const rows = resourceMapData();
  const regions = [...new Set(rows.map((row) => row.region))];
  return `
    <div class="region-grid">
      ${regions.map((region) => {
        const regionRows = rows.filter((row) => row.region === region);
        const summary = {
          salesCount: new Set(regionRows.flatMap((row) => row.salesOwners || [])).size,
          supportCount: new Set(regionRows.flatMap((row) => row.supportOwners || [])).size,
          soldProjects: [...new Set(regionRows.flatMap((row) => row.projects || []))],
          unlocatedCount: regionRows.filter((row) => !Number.isFinite(Number(row.latitude)) || !Number.isFinite(Number(row.longitude))).length,
        };
        return `
          <article class="region-card">
            <h3>${region}</h3>
            <p>销售 ${summary.salesCount} 人 · 技术支持 ${summary.supportCount} 人</p>
            <span>已售项目：${summary.soldProjects.join('、') || '-'}</span>
            ${summary.unlocatedCount ? `<small>未定位客户：${summary.unlocatedCount} 个</small>` : ''}
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function renderResourceMap(viewportId, canvasId, fullscreen = false) {
  return `
    <div id="${viewportId}" class="resource-map-viewport real-resource-map-viewport ${fullscreen ? 'fullscreen-map' : ''}" data-leaflet-viewport>
      <div id="${canvasId}" class="resource-real-map" data-leaflet-map="${canvasId}"></div>
      <div class="map-loading-hint">正在加载真实地图；若长时间未显示，请检查网络或地图瓦片服务访问。</div>
      ${fullscreen ? '' : '<button class="map-fullscreen-btn" data-action="open-resource-map-fullscreen">全屏</button>'}
    </div>
  `;
}

function resourceMarkerTone(row) {
  if (row.status === '合作中') return '#12b76a';
  if (row.level?.startsWith('A')) return '#2457f5';
  if (row.status === '已停用') return '#98a2b3';
  return '#f79009';
}

function resourceMarkerIcon(row) {
  const color = resourceMarkerTone(row);
  return window.L.divIcon({
    className: 'resource-leaflet-marker',
    html: `<span style="--marker-color:${color}">${String(row.customerName || '?').slice(0, 1)}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function resourceMapPopup(row) {
  return `
    <div class="resource-map-popup">
      <strong>${row.customerName}</strong>
      <p>${row.address || row.region || '-'}</p>
      <p>客户等级：${row.level || '-'}</p>
      <p>客户状态：${row.status || '-'}</p>
      <p>销售：${taskPersonLabel(row.salesOwners, '未配置')}</p>
      <p>技术支持：${taskPersonLabel(row.supportOwners, '未配置')}</p>
      <p>已售项目：${(row.projects || []).join('、') || '-'}</p>
      <p>产品数量：${row.orderedQuantity || 0}</p>
      <small>定位：${row.geocodedAddress || row.geocodeQuery || '-'} · ${row.geoPrecision || '-'}</small>
      <button class="ghost-btn compact-btn" data-action="open-customer-detail" data-customer-name="${attrValue(row.customerName)}">查看客户详情</button>
    </div>
  `;
}

function initResourceLeafletMap(canvasId) {
  const container = document.getElementById(canvasId);
  if (!container) return;
  if (!window.L) {
    container.closest('.resource-map-viewport')?.classList.add('map-provider-missing');
    return;
  }
  if (resourceLeafletMaps[canvasId]) {
    resourceLeafletMaps[canvasId].remove();
    delete resourceLeafletMaps[canvasId];
  }

  const map = window.L.map(container, {
    worldCopyJump: true,
    zoomControl: true,
    attributionControl: true,
  }).setView([20, 0], 2);
  resourceLeafletMaps[canvasId] = map;

  window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  const bounds = [];
  locatedResourceRows().forEach((row) => {
    const latLng = [Number(row.latitude), Number(row.longitude)];
    bounds.push(latLng);
    window.L.marker(latLng, { icon: resourceMarkerIcon(row) })
      .addTo(map)
      .bindTooltip(`${row.customerName}｜${row.region}`, { direction: 'top' })
      .bindPopup(resourceMapPopup(row), { maxWidth: 320 });
  });

  if (bounds.length) {
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 5 });
  }
  setTimeout(() => map.invalidateSize(), 120);
}

function initRenderedResourceMaps() {
  ['resource-map-canvas', 'resource-map-canvas-fullscreen'].forEach(initResourceLeafletMap);
}

function renderUnlocatedCustomers() {
  const rows = unlocatedResourceRows();
  if (!rows.length) return '';
  return `
    <section class="sub-panel unlocated-customers-panel">
      <div class="panel-head compact-head">
        <div>
          <h3>未定位客户</h3>
          <p>这些客户缺少可解析地址，地图暂不显示点位。请在客户资料中补充城市或更完整地址。</p>
        </div>
      </div>
      <div class="unlocated-customer-list">
        ${rows.map((row) => `
          <article>
            <strong>${row.customerName}</strong>
            <span>${row.region || '-'} · 地址：${row.address || '未填写'}</span>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function normalizeDateValue(value) {
  if (!value || value === '-') return '';
  return value.slice(0, 10);
}

function daysSince(dateValue) {
  const normalized = normalizeDateValue(dateValue);
  if (!normalized) return 9999;
  const [todayYear, todayMonth, todayDay] = prototypeToday.split('-').map(Number);
  const [year, month, day] = normalized.split('-').map(Number);
  const todayDate = Date.UTC(todayYear, todayMonth - 1, todayDay);
  const targetDate = Date.UTC(year, month - 1, day);
  return Math.max(0, Math.round((todayDate - targetDate) / 86400000));
}

function latestDate(values = []) {
  return values.map(normalizeDateValue).filter(Boolean).sort().at(-1) || '';
}

function customerKpmActivityDates(customerName) {
  const customer = customerByName(customerName);
  const dates = [
    ...(customer?.followups || []).map((record) => record.time),
    ...(customer?.materials || []).map((file) => file.time),
    ...orders.filter((order) => order.customerName === customerName).map((order) => order.orderDate),
    ...tasks.filter((task) => task.customerName === customerName).flatMap((task) => [
      task.createdAt,
      ...(task.comments || []).map((comment) => comment.time),
      ...(task.attachments || []).map((file) => file.time),
    ]),
    ...projects.flatMap((project) => project.projectCustomers
      .filter((projectCustomer) => projectCustomer.customerName === customerName)
      .flatMap((projectCustomer) => projectCustomer.requirements.map((requirement) => requirement.date))),
  ];
  return dates.map(normalizeDateValue).filter(Boolean);
}

function projectCustomerActivityDates(projectName, customerName) {
  const link = projectCustomerLink(projectName, customerName);
  const dates = [
    ...orders.filter((order) => order.customerName === customerName && order.projectName === projectName).map((order) => order.orderDate),
    ...tasks.filter((task) => task.customerName === customerName && task.project === projectName).flatMap((task) => [
      task.createdAt,
      ...(task.comments || []).map((comment) => comment.time),
      ...(task.attachments || []).map((file) => file.time),
    ]),
    ...(link?.requirements || []).map((requirement) => requirement.date),
  ];
  return dates.map(normalizeDateValue).filter(Boolean);
}

function activeCustomerProjectNames() {
  return [...new Set([
    ...projects.flatMap((project) => project.projectCustomers.map(() => project.externalName)),
    ...orders.map((order) => order.projectName),
    ...tasks.map((task) => task.project),
  ])];
}

function activityStatusFromSignals({ lastDate, hasActiveTask = false, customer, project }) {
  if (customer?.status === '已停用' || project?.archived || project?.unsellableReason === '被遗弃的老项目') return '遗弃';
  if (hasActiveTask) return '活跃';
  const age = daysSince(lastDate);
  if (age <= 30) return '活跃';
  if (age <= 60) return '观察';
  if (age <= 90) return '停滞';
  return '遗弃';
}

function activityBadgeClass(status) {
  if (status === '活跃') return 'done';
  if (status === '观察') return 'progress';
  if (status === '停滞') return 'pending';
  return 'invalid';
}

function activitySuggestion(status) {
  if (status === '停滞') return '由销售负责人确认是否继续推进，必要时项目负责人介入';
  if (status === '遗弃') return '建议复核后标记暂停投入或归档关系';
  if (status === '观察') return '保持低频跟进，等待客户明确反馈';
  return '继续按当前节奏推进';
}

function projectCustomerActivityCell(projectName, customerName) {
  const customer = customerByName(customerName);
  const project = projectByExternalName(projectName);
  const link = projectCustomerLink(projectName, customerName);
  const projectOrders = orders.filter((order) => order.customerName === customerName && order.projectName === projectName);
  const projectTasks = tasks.filter((task) => task.customerName === customerName && task.project === projectName);
  const hasRelation = Boolean(link) || projectOrders.length > 0 || projectTasks.length > 0;
  if (!hasRelation || !customer || !project) {
    return { projectName, customerName, status: '-', tone: 'empty', lastDate: '', activeTasks: [], orders: [], requirements: [], suggestion: '-' };
  }
  const activeTasks = projectTasks.filter((task) => taskStatusSemantic(task.status) === '普通');
  const lastDate = latestDate(projectCustomerActivityDates(projectName, customerName));
  const status = activityStatusFromSignals({
    lastDate,
    hasActiveTask: activeTasks.length > 0,
    customer,
    project,
  });
  return {
    projectName,
    customerName,
    status,
    tone: activityBadgeClass(status),
    lastDate,
    activeTasks,
    orders: projectOrders,
    requirements: link?.requirements || [],
    projectStatus: link?.projectStatus || '-',
    suggestion: activitySuggestion(status),
  };
}

function customerActivityRow(customer) {
  const kpmDates = customerKpmActivityDates(customer.name);
  const lastKpmDate = latestDate(kpmDates);
  const linkedProjects = activeCustomerProjectNames()
    .map((projectName) => projectCustomerActivityCell(projectName, customer.name))
    .filter((cell) => cell.status !== '-');
  const hasActiveTask = tasks.some((task) => task.customerName === customer.name && taskStatusSemantic(task.status) === '普通');
  const status = activityStatusFromSignals({ lastDate: lastKpmDate, hasActiveTask, customer });
  return {
    customer,
    status,
    lastDate: lastKpmDate,
    lastKpmDate,
    linkedProjects,
    hasKpmActivity: kpmDates.length > 0 || linkedProjects.length > 0,
    hasActiveTask,
    suggestion: activitySuggestion(status),
  };
}

function filteredCustomerActivityRows() {
  const keyword = activitySearchKeyword.trim().toLowerCase();
  return customers
    .map(customerActivityRow)
    .filter(({ customer, status }) => {
      const matchesKeyword = !keyword || [
        customer.name,
        customer.shortName,
        customer.region,
        customer.level,
        customer.status,
        ...(customer.salesOwners || []),
        ...(customer.supportOwners || []),
      ].join(' ').toLowerCase().includes(keyword);
      const matchesStatus = activityStatusFilter === '全部活跃状态' || status === activityStatusFilter;
      const matchesLevel = activityLevelFilter === '全部客户等级' || customer.level === activityLevelFilter;
      return matchesKeyword && matchesStatus && matchesLevel;
    });
}

function renderActivityMatrix(projectNames, rows) {
  return `
    <div class="table-wrap activity-matrix-wrap">
      <table class="activity-matrix">
        <thead>
          <tr>
            <th>客户 / 项目</th>
            ${projectNames.map((projectName) => `<th>${projectName}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(({ customer }) => `
            <tr>
              <td>
                <strong>${customer.name}</strong>
                <small>${customer.level} · ${customer.region}</small>
              </td>
              ${projectNames.map((projectName) => {
                const cell = projectCustomerActivityCell(projectName, customer.name);
                if (cell.status === '-') return '<td><span class="empty-cell">-</span></td>';
                return `
                  <td>
                    <button
                      class="activity-cell ${cell.tone}"
                      data-action="open-activity-cell"
                      data-activity-customer="${customer.name}"
                      data-activity-project="${projectName}"
                      title="${customer.name} / ${projectName}｜最近活动：${cell.lastDate || '-'}｜建议：${cell.suggestion}"
                    >
                      <strong>${cell.status}</strong>
                      <span>${cell.projectStatus}</span>
                    </button>
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('') || `<tr><td colspan="${projectNames.length + 1}">当前筛选下暂无客户</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderActivityRiskList(rows) {
  const risks = rows.filter((row) => row.status === '停滞' || row.status === '遗弃');
  return `
    <div class="activity-risk-list">
      ${risks.map((row) => `
        <article class="activity-risk-card">
          <div>
            <strong>${row.customer.name}</strong>
            <p>${row.customer.level} · ${row.customer.region} · 最近活动 ${row.lastDate || '-'}</p>
          </div>
          <span class="badge ${activityBadgeClass(row.status)}">${row.status}</span>
          <p>销售：${taskPersonLabel(row.customer.salesOwners)} ｜ 技术支持：${taskPersonLabel(row.customer.supportOwners)}</p>
          <small>建议：${row.suggestion}</small>
        </article>
      `).join('') || '<p class="empty-note">当前没有需要重点处理的客户</p>'}
    </div>
  `;
}

function renderActivityDetailModal() {
  if (!selectedActivityCell) return '';
  const cell = projectCustomerActivityCell(selectedActivityCell.projectName, selectedActivityCell.customerName);
  const customer = customerByName(selectedActivityCell.customerName);
  if (!customer || cell.status === '-') return '';
  const activeTaskIds = cell.activeTasks.map((task) => task.id);
  const activeTaskFilterLabel = formatText(textFor('taskList.activityFilterLabel', '客户 {customer} / 项目 {project} 的进行中任务'), {
    customer: customer.name,
    project: cell.projectName,
  });
  const activeTaskCountControl = activeTaskIds.length
    ? `<button class="inline-link metric-link" data-action="open-task-list-filter" data-task-ids="${activeTaskIds.join(',')}" data-filter-label="${escapeAttr(activeTaskFilterLabel)}">${activeTaskIds.length}</button>`
    : '<strong>0</strong>';
  return `
    <div class="modal-backdrop">
      <section class="modal-card form-modal wide">
        <div class="panel-head">
          <div>
            <h2>${customer.name} / ${cell.projectName}</h2>
            <p>客户项目活跃度详情与建议动作</p>
          </div>
          <span class="badge ${cell.tone}">${cell.status}</span>
        </div>
        <div class="detail-facts activity-detail-facts">
          <div><span>客户等级</span><strong>${customer.level}</strong></div>
          <div><span>项目内状态</span><strong>${cell.projectStatus}</strong></div>
          <div><span>最近有效活动</span><strong>${cell.lastDate || '-'}</strong></div>
          <div><span>负责销售</span><strong>${taskPersonLabel(customer.salesOwners)}</strong></div>
          <div><span>负责技术支持</span><strong>${taskPersonLabel(customer.supportOwners)}</strong></div>
          <div><span>${textFor('taskList.activeTaskCount', '进行中任务')}</span>${activeTaskCountControl}</div>
          <div><span>订单数量</span><strong>${cell.orders.length}</strong></div>
        </div>
        <section class="sub-panel activity-modal-section">
          <h3>建议动作</h3>
          <p>${cell.suggestion}</p>
        </section>
        <div class="customer-form-actions">
          <button class="primary-btn" data-action="close-activity-cell">关闭</button>
        </div>
      </section>
    </div>
  `;
}

function renderCustomerActivityAnalytics() {
  const rows = filteredCustomerActivityRows();
  const allRows = customers.map(customerActivityRow);
  const projectNames = activeCustomerProjectNames();
  analyticsContent.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>客户活跃度</h2>
          <p>识别客户活跃在哪个项目、哪些客户停滞，以及资源投入是否需要调整</p>
        </div>
      </div>
      <div class="analytics-filter-grid activity-filter-grid">
        <div class="form-field">
          <label>客户搜索</label>
          <input id="activity-search" class="text-input" type="search" value="${activitySearchKeyword}" placeholder="客户 / 区域 / 负责人" />
        </div>
        <div class="form-field">
          <label>活跃状态</label>
          <select id="activity-status-filter" class="select-input">
            ${activityStatusOptions.map((status) => `<option ${activityStatusFilter === status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </div>
        <div class="form-field">
          <label>客户等级</label>
          <select id="activity-level-filter" class="select-input">
            ${['全部客户等级', ...customerLevelOptions.map((level) => level.name)].map((level) => `<option ${activityLevelFilter === level ? 'selected' : ''}>${level}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="summary-grid analytics-summary activity-summary">
        <article class="summary-card"><span>活跃客户</span><strong>${allRows.filter((row) => row.status === '活跃').length}</strong></article>
        <article class="summary-card"><span>停滞客户</span><strong>${allRows.filter((row) => row.status === '停滞').length}</strong></article>
        <article class="summary-card"><span>遗弃客户</span><strong>${allRows.filter((row) => row.status === '遗弃').length}</strong></article>
      </div>
      <section class="sub-panel activity-rule-panel">
        <h3>活跃度规则</h3>
        <p>默认按 30 / 60 / 90 天判断：30 天内有有效活动为活跃，31–60 天为观察，61–90 天为停滞，超过 90 天或已停用 / 已归档关系为遗弃。</p>
      </section>
      <section class="sub-panel">
        <div class="panel-head compact-head">
          <div>
            <h3>客户 × 项目活跃矩阵</h3>
            <p>点击格子查看客户在该项目上的任务、订单和建议动作</p>
          </div>
        </div>
        ${renderActivityMatrix(projectNames, rows)}
      </section>
      <section class="sub-panel">
        <div class="panel-head compact-head">
          <div>
            <h3>风险客户列表</h3>
            <p>优先处理近期无活动、停滞或遗弃的客户关系</p>
          </div>
        </div>
        ${renderActivityRiskList(rows)}
      </section>
    </section>
    ${renderActivityDetailModal()}
  `;
}

function renderOrderAnalytics() {
  const filteredOrders = filteredOrdersForAnalytics();
  const convertedSalesAmount = filteredOrders.reduce((sum, order) => sum + convertedOrderAmount(order), 0);
  const totalQuantity = filteredOrders.reduce((sum, order) => sum + Number(order.quantity), 0);
  const grouped = orderProjectNames().map((projectName) => {
    const projectOrders = filteredOrders.filter((order) => order.projectName === projectName);
    return {
      projectName,
      count: projectOrders.length,
      quantity: projectOrders.reduce((sum, order) => sum + Number(order.quantity), 0),
      amountText: projectOrders.length
        ? formatMoney(projectOrders.reduce((sum, order) => sum + convertedOrderAmount(order), 0), analyticsTargetCurrency)
        : '-',
    };
  }).filter((item) => item.count);

  analyticsContent.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>订单统计</h2>
          <p>按年、季度、月份查看指定项目的销售额、订单数和产品数量</p>
        </div>
      </div>
      <div class="analytics-filter-grid">
        <div class="form-field">
          <label>统计周期</label>
          <select id="analytics-period" class="select-input">
            ${analyticsPeriodOptions.map((period) => `<option ${analyticsOrderPeriod === period ? 'selected' : ''}>${period}</option>`).join('')}
          </select>
        </div>
        <div class="form-field">
          <label>年份</label>
          <select id="analytics-year" class="select-input">
            ${analyticsYearOptions().map((year) => `<option ${analyticsYear === year ? 'selected' : ''}>${year}</option>`).join('')}
          </select>
        </div>
        <div class="form-field">
          <label>统计币种</label>
          <select id="analytics-target-currency" class="select-input">
            ${analyticsTargetCurrencyOptions.map((currency) => `<option ${analyticsTargetCurrency === currency ? 'selected' : ''}>${currency}</option>`).join('')}
          </select>
        </div>
        ${analyticsOrderPeriod === '季度' ? `
          <div class="form-field">
            <label>季度</label>
            <select id="analytics-quarter" class="select-input">
              ${quarterOptions.map((quarter) => `<option ${analyticsQuarter === quarter ? 'selected' : ''}>${quarter}</option>`).join('')}
            </select>
          </div>
        ` : ''}
        ${analyticsOrderPeriod === '月份' ? `
          <div class="form-field">
            <label>月份</label>
            <select id="analytics-month" class="select-input">
              ${monthOptions.map((month) => `<option ${analyticsMonth === month ? 'selected' : ''}>${month}</option>`).join('')}
            </select>
          </div>
        ` : ''}
        ${renderAnalyticsMultiSelect('project', '项目')}
        ${renderAnalyticsMultiSelect('customer', '客户')}
        ${renderAnalyticsMultiSelect('region', '地区')}
      </div>
      <p class="field-hint analytics-rate-hint">原型当前使用固定演示汇率：1 EUR = 1.09 USD，1 USD = 7.18 CNY；正式汇率规则待产品确认。</p>
      <div class="summary-grid analytics-summary">
        <article class="summary-card">
          <span>统一折算销售额</span>
          <strong>${filteredOrders.length ? formatMoney(convertedSalesAmount, analyticsTargetCurrency) : '-'}</strong>
        </article>
        <article class="summary-card">
          <span>订单数量</span>
          <strong>${filteredOrders.length}</strong>
        </article>
        <article class="summary-card">
          <span>产品数量</span>
          <strong>${totalQuantity}</strong>
        </article>
      </div>
      ${renderOrderTrendChart()}
      <div class="table-wrap">
        <table>
          <thead><tr><th>项目</th><th>订单数</th><th>产品数量</th><th>销售额</th></tr></thead>
          <tbody>
            ${grouped.map((item) => `
              <tr>
                <td>${item.projectName}</td>
                <td>${item.count}</td>
                <td>${item.quantity}</td>
                <td>${item.amountText}</td>
              </tr>
            `).join('') || '<tr><td colspan="4">当前筛选下暂无订单</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderResourceAnalytics() {
  analyticsContent.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>资源分配情况</h2>
          <p>基于客户地址自动定位到真实地图，悬浮或点击客户点查看销售与技术支持信息</p>
        </div>
      </div>
      ${renderResourceMap('resource-map-viewport', 'resource-map-canvas')}
      ${renderRegionCards()}
      ${renderUnlocatedCustomers()}
    </section>
    ${mapFullscreenOpen ? `
      <div class="modal-backdrop">
        <section class="modal-card fullscreen-map-modal">
          <div class="panel-head">
            <div>
              <h2>全球资源分布图</h2>
              <p>拖拽和缩放真实地图，查看客户、销售、技术支持和各区域已售项目</p>
            </div>
            <button class="primary-btn" data-action="close-resource-map-fullscreen">关闭全屏</button>
          </div>
          ${renderResourceMap('resource-map-viewport-fullscreen', 'resource-map-canvas-fullscreen', true)}
          ${renderRegionCards()}
          ${renderUnlocatedCustomers()}
        </section>
      </div>
    ` : ''}
  `;
  requestAnimationFrame(initRenderedResourceMaps);
}

function activeTasksForCustomerAndSupport(customerName, supportName) {
  return tasks.filter((task) => task.customerName === customerName
    && taskAssigneeNames(task).includes(supportName)
    && taskStatusSemantic(task.status) === '普通');
}

function filteredSupportCustomers() {
  const keyword = supportCustomerKeyword.trim().toLowerCase();
  return customers
    .filter((customer) => !keyword || `${customer.name} ${customer.shortName} ${customer.region}`.toLowerCase().includes(keyword))
    .slice(0, 8);
}

function renderSupportCustomerResults(selectedCustomerName) {
  const matchedCustomers = filteredSupportCustomers();
  return matchedCustomers.map((customer) => `
    <button
      class="support-customer-option ${customer.name === selectedCustomerName ? 'active' : ''}"
      data-action="select-support-customer"
      data-customer-name="${customer.name}"
    >
      <strong>${customer.name}</strong>
      <span>${customer.region}</span>
    </button>
  `).join('') || '<p class="empty-note">没有找到匹配客户</p>';
}

function renderSupportAnalytics() {
  const customer = customerByName(selectedSupportCustomer) || customers[0];
  const projectLinks = projects
    .flatMap((project) => project.projectCustomers
      .filter((projectCustomer) => projectCustomer.customerName === customer.name)
      .map((projectCustomer) => ({
        projectName: project.externalName,
        status: projectCustomer.projectStatus,
        orderedQuantity: orders
          .filter((order) => order.customerName === customer.name && order.projectName === project.externalName)
          .reduce((sum, order) => sum + Number(order.quantity), 0),
      })));
  const customerOrders = orders.filter((order) => order.customerName === customer.name);

  analyticsContent.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>技术支持情况</h2>
          <p>查看某客户当前由谁负责、有哪些进行中任务和卡点任务</p>
        </div>
      </div>
      <div class="analytics-filter-grid support-filter-grid">
        <div class="form-field">
          <label>客户</label>
          <div class="support-customer-search">
            <input
              id="support-customer-search"
              class="text-input"
              placeholder="输入客户名称、简称或地区搜索"
              value="${supportCustomerKeyword}"
            />
            <div id="support-customer-results" class="support-customer-results">
              ${renderSupportCustomerResults(customer.name)}
            </div>
          </div>
        </div>
      </div>
      <div class="support-tree">
        <article class="support-root" title="地区：${customer.region}｜订单数量：${customerOrders.length}｜合作项目：${projectLinks.map((item) => item.projectName).join('、') || '-'}｜项目下单数量：${projectLinks.map((item) => `${item.projectName} ${item.orderedQuantity}`).join('、') || '-'}｜客户状态：${customer.status}">
          <strong>${customer.name}</strong>
          <span>${customer.region} · ${customerOrders.length} 个订单 · ${projectLinks.length} 个合作项目</span>
        </article>
        <div class="support-branches">
          ${customer.supportOwners.map((supportName) => {
            const supportTasks = activeTasksForCustomerAndSupport(customer.name, supportName);
            const categoryGroups = [
              { label: '需求', tasks: supportTasks.filter((task) => task.category === '需求'), tone: 'progress' },
              { label: 'Bug', tasks: supportTasks.filter((task) => task.category === 'Bug'), tone: 'invalid' },
              { label: '其他', tasks: supportTasks.filter((task) => task.category === '其他' || task.category === '技术支持'), tone: 'pending' },
              { label: '卡点', tasks: supportTasks.filter((task) => task.source === '卡点求助'), tone: 'done' },
            ];
            return `
              <article class="support-branch">
                <h3>${supportName}</h3>
                <div class="support-task-stats">
                  ${categoryGroups.map((group) => {
                    const taskIds = group.tasks.map((task) => task.id);
                    const filterLabel = formatText(textFor('taskList.supportFilterLabel', '客户 {customer} / 技术支持 {support} / {category}任务'), {
                      customer: customer.name,
                      support: supportName,
                      category: group.label,
                    });
                    return `
                      <button
                        class="support-stat ${group.tone}"
                        title="${group.tasks.length ? `${group.tasks.length} ${textFor('taskList.countSuffix', '个任务')}` : '暂无任务'}"
                        data-action="${taskIds.length ? 'open-task-list-filter' : ''}"
                        data-task-ids="${taskIds.join(',')}"
                        data-filter-label="${escapeAttr(filterLabel)}"
                      >
                        ${group.label} ${group.tasks.length}
                      </button>
                    `;
                  }).join('')}
                </div>
              </article>
            `;
          }).join('') || '<p class="empty-note">该客户暂未配置技术支持负责人</p>'}
        </div>
      </div>
    </section>
  `;
}

function renderAnalytics() {
  document.querySelectorAll('[data-analytics-tab]').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.analyticsTab === analyticsTab);
  });
  if (analyticsTab === 'orders') renderOrderAnalytics();
  if (analyticsTab === 'resources') renderResourceAnalytics();
  if (analyticsTab === 'support') renderSupportAnalytics();
  if (analyticsTab === 'activity') renderCustomerActivityAnalytics();
}

function templateBadgeClass(status) {
  if (status === '启用') return 'done';
  if (status === '草稿') return 'progress';
  return 'pending';
}

function enabledTemplateEntries() {
  return templates
    .map((template, index) => ({ template, index }))
    .filter(({ template }) => template.status === '启用');
}

function firstEnabledTemplateIndex() {
  return enabledTemplateEntries()[0]?.index ?? 0;
}

function normalizeSelectedTemplateIndex() {
  if (templates[selectedTemplateIndex]?.status === '启用') return;
  selectedTemplateIndex = firstEnabledTemplateIndex();
}

function filteredTemplateEntries() {
  const keyword = templateSearchKeyword.trim().toLowerCase();
  return templates
    .map((template, index) => ({ template, index }))
    .filter(({ template }) => {
      const matchesKeyword = !keyword || `${template.name} ${template.scope}`.toLowerCase().includes(keyword);
      const matchesStatus = templateStatusKeyword === '全部状态' || template.status === templateStatusKeyword;
      return matchesKeyword && matchesStatus;
    });
}

function captureTemplateDraftStages() {
  templateDraftStages = [...document.querySelectorAll('[data-template-stage-name]')].map((input) => input.value);
}

function captureTemplateFormDraft() {
  captureTemplateDraftStages();
  const nameInput = document.getElementById('template-name');
  const scopeInput = document.getElementById('template-scope');
  const statusInput = document.getElementById('template-status');
  if (nameInput && scopeInput && statusInput) {
    templateDraftMeta = {
      name: nameInput.value,
      scope: scopeInput.value,
      status: statusInput.value,
    };
  }
}

function renderTemplateStageRows() {
  return `
    <div class="template-stage-editor">
      ${templateDraftStages.map((stage, index) => `
        <div class="template-stage-row">
          <input class="text-input" data-template-stage-name="${index}" value="${stage}" placeholder="例如 硬件设计" />
          <div class="row-actions">
            <button class="ghost-btn" data-action="move-template-stage" data-template-stage-index="${index}" data-direction="up" ${index === 0 ? 'disabled' : ''}>上移</button>
            <button class="ghost-btn" data-action="move-template-stage" data-template-stage-index="${index}" data-direction="down" ${index === templateDraftStages.length - 1 ? 'disabled' : ''}>下移</button>
            <button class="muted-btn" data-action="delete-template-stage" data-template-stage-index="${index}" ${templateDraftStages.length === 1 ? 'disabled' : ''}>删除</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTemplateForm() {
  if (!templateFormOpen) return '';
  const editingTemplate = templateEditIndex === null ? null : templates[templateEditIndex];
  const formTitle = editingTemplate ? '编辑模板' : '新建模板';
  const cannotDisableLastEnabledTemplate = editingTemplate?.status === '启用' && enabledTemplateEntries().length <= 1;

  return `
    <div class="customer-form template-form">
      <div class="section-intro">
        <h3>${formTitle}</h3>
        <p>项目创建时只可选择“启用”模板；已生成项目不会随着模板修改而被回写。</p>
      </div>
      <div class="form-grid">
        <div class="form-field">
          <label>模板名称</label>
          <input id="template-name" class="text-input" maxlength="80" value="${templateDraftMeta.name}" placeholder="例如 标准 POS 产品流程" />
        </div>
        <div class="form-field">
          <label>适用范围</label>
          <input id="template-scope" class="text-input" value="${templateDraftMeta.scope}" placeholder="例如 通用 / 海外项目" />
        </div>
        <div class="form-field">
          <label>模板状态</label>
          <select id="template-status" class="select-input">
            ${templateStatusOptions.map((status) => `<option ${templateDraftMeta.status === status ? 'selected' : ''} ${cannotDisableLastEnabledTemplate && status !== '启用' ? 'disabled' : ''}>${status}</option>`).join('')}
          </select>
        </div>
      </div>
      ${cannotDisableLastEnabledTemplate ? '<p class="field-hint">系统至少需要保留 1 个启用模板，当前模板暂不能改成草稿或停用。</p>' : ''}
      <div class="template-stage-head">
        <div>
          <h4>阶段配置</h4>
          <p>可新增、改名、排序或删除阶段。</p>
        </div>
        <button class="ghost-btn" data-action="add-template-stage">新增阶段</button>
      </div>
      ${renderTemplateStageRows()}
      <div class="customer-form-actions">
        <button class="muted-btn" data-action="cancel-template-form">取消</button>
        <button class="primary-btn" data-action="save-template">保存模板</button>
      </div>
    </div>
  `;
}

function renderTemplates() {
  normalizeSelectedTemplateIndex();
  const rows = filteredTemplateEntries();
  templateList.innerHTML = `
    ${templateFormOpen ? renderFormModal(renderTemplateForm(), 'wide') : ''}
    ${rows.map(({ template, index }) => `
      <article class="template-card">
        <div class="detail-head">
          <div>
            <h3>${template.name}</h3>
            <p>${template.scope} · ${template.stages.length} 个阶段 · 最近更新 ${template.updatedAt}</p>
          </div>
          <span class="badge ${templateBadgeClass(template.status)}">${template.status}</span>
        </div>
        <div class="template-flow">
          ${template.stages.map((stage) => `<span>${stage}</span>`).join('')}
        </div>
        <div class="row-actions">
          <button class="ghost-btn" data-action="edit-template" data-template-index="${index}">编辑模板</button>
          <button class="muted-btn" data-action="toggle-template-status" data-template-index="${index}" ${template.status === '启用' && enabledTemplateEntries().length <= 1 ? 'disabled' : ''}>${template.status === '启用' ? '停用' : '启用'}</button>
          <button class="muted-btn" data-action="delete-template" data-template-index="${index}" ${template.status === '启用' ? 'disabled' : ''}>删除</button>
        </div>
      </article>
    `).join('') || '<p class="empty-note">暂无匹配流程模板</p>'}
  `;
}

function resourceRowsForTab(tab) {
  if (tab === 'customer-statuses') return customerProjectStatusOptions;
  if (tab === 'customer-levels') return customerLevelOptions;
  if (tab === 'order-types') return orderTypeOptions;
  if (tab === 'task-statuses') return taskStatusOptions;
  if (tab === 'permissions') return systemPermissionCatalog();
  return resourceData[tab];
}

function joinValues(values, fallback = '-') {
  return values.length ? values.join(' / ') : fallback;
}

function departmentMemberCount(departmentName) {
  return resourceData.users.filter((user) => user.departments.includes(departmentName)).length;
}

function projectDepartmentUsageCount(departmentName) {
  return projects.reduce((count, project) => {
    const memberUsage = project.members.filter((member) => userByAccount(member.userAccount)?.departments.includes(departmentName)).length;
    const stageUsage = project.stages.filter((stage) => stage.assignees.some((assignee) => assignee.type === 'department' && assignee.name === departmentName)).length;
    return count + memberUsage + stageUsage;
  }, 0);
}

function canDeleteDepartment(department) {
  const hasMembers = departmentMemberCount(department.name) > 0;
  const usedByProjects = projectDepartmentUsageCount(department.name) > 0;
  return !hasMembers && !usedByProjects;
}

function roleAssignedUserCount(roleName) {
  return resourceData.users.filter((user) => user.globalRoles.includes(roleName)).length;
}

function projectRoleUsageCount(roleName) {
  return projects.reduce((count, project) => count + project.members.filter((member) => member.role === roleName).length, 0);
}

function canDeleteRole(role) {
  return roleAssignedUserCount(role.name) === 0 && projectRoleUsageCount(role.name) === 0;
}

function permissionRoleNames(permissionKey) {
  return resourceData.roles
    .filter((role) => role.permissions.includes(permissionKey))
    .map((role) => role.name);
}

function permissionDirectUserNames(permissionKey) {
  return resourceData.users
    .filter((user) => user.directPermissions.includes(permissionKey))
    .map((user) => user.name);
}

function customerProjectUsageCount(customerName) {
  return projects.reduce((count, project) => count + project.projectCustomers.filter((customer) => customer.customerName === customerName).length, 0);
}

function canDeleteCustomer(customer) {
  return customerProjectUsageCount(customer.name) === 0
    && !orders.some((order) => order.customerName === customer.name)
    && !tasks.some((task) => task.customerName === customer.name);
}

function customerStatusUsageCount(statusName) {
  return projects.reduce((count, project) => count + project.projectCustomers.filter((customer) => customer.projectStatus === statusName).length, 0);
}

function canDeleteCustomerStatus(option) {
  return customerStatusUsageCount(option.name) === 0;
}

function canToggleCustomerStatusOption(option) {
  return !option.active || customerStatusUsageCount(option.name) === 0;
}

function customerLevelUsageCount(levelName) {
  return customers.filter((customer) => customer.level === levelName).length;
}

function canDeleteCustomerLevel(option) {
  return customerLevelUsageCount(option.name) === 0;
}

function canToggleCustomerLevelOption(option) {
  return !option.active || customerLevelUsageCount(option.name) === 0;
}

function orderTypeUsageCount(typeName) {
  return orders.filter((order) => (order.type || '正式订单') === typeName).length;
}

function canDeleteOrderType(option) {
  return orderTypeUsageCount(option.name) === 0;
}

function canToggleOrderTypeOption(option) {
  return !option.active || orderTypeUsageCount(option.name) === 0;
}

function taskStatusUsageCount(statusName) {
  return tasks.filter((task) => task.status === statusName).length;
}

function canDeleteTaskStatus(status) {
  return taskStatusUsageCount(status.name) === 0
    && !taskStatusTransitions.some((transition) => transition.from === status.name || transition.to === status.name);
}

function canToggleTaskStatusOption(status) {
  return !status.active || taskStatusUsageCount(status.name) === 0;
}

function globalRoleOptions(selectedRoles = []) {
  const selected = new Set(selectedRoles.filter(Boolean));
  return resourceData.roles.filter((role) => role.type === '全局角色' && (role.status === '启用' || selected.has(role.name)));
}

function renderCheckboxOptions(items, selectedItems, dataAttribute) {
  return `
    <div class="checkbox-grid">
      ${items.map((item) => `
        <label class="checkbox-option">
          <input type="checkbox" ${dataAttribute} value="${item.key || item.name}" ${selectedItems.includes(item.key || item.name) ? 'checked' : ''} />
          <span>${item.name}</span>
        </label>
      `).join('')}
    </div>
  `;
}

function selectedCheckboxValues(selector) {
  return [...document.querySelectorAll(selector)]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function renameUserReferences(previousName, nextName) {
  if (previousName === nextName) return;
  customers.forEach((customer) => {
    customer.salesOwners = (customer.salesOwners || []).map((owner) => owner === previousName ? nextName : owner);
    customer.supportOwners = (customer.supportOwners || []).map((owner) => owner === previousName ? nextName : owner);
  });
  projects.forEach((project) => {
    project.projectCustomers.forEach((customer) => {
      customer.requirements.filter((requirement) => requirement.creator === previousName).forEach((requirement) => {
        requirement.creator = nextName;
      });
    });
    project.stages.forEach((stage) => {
      stage.messages?.filter((message) => message.author === previousName).forEach((message) => {
        message.author = nextName;
      });
    });
  });
  tasks.forEach((task) => {
    if (task.assignee === previousName) task.assignee = nextName;
    if (task.creator === previousName) task.creator = nextName;
    task.assignees = taskAssigneeNames(task).map((assignee) => assignee === previousName ? nextName : assignee);
    task.participants = (task.participants || []).map((participant) => participant === previousName ? nextName : participant);
    task.attachments?.filter((file) => file.uploader === previousName).forEach((file) => {
      file.uploader = nextName;
    });
    task.comments?.filter((comment) => comment.author === previousName).forEach((comment) => {
      comment.author = nextName;
    });
  });
}

function renameUserAccountReferences(previousAccount, nextAccount) {
  if (previousAccount === nextAccount) return;
  projects.forEach((project) => {
    if (project.managerAccount === previousAccount) project.managerAccount = nextAccount;
    project.members
      .filter((member) => member.userAccount === previousAccount)
      .forEach((member) => {
        member.userAccount = nextAccount;
      });
    project.stages.forEach((stage) => {
      stage.assignees
        .filter((assignee) => assignee.type === 'user' && assignee.account === previousAccount)
        .forEach((assignee) => {
          assignee.account = nextAccount;
        });
    });
  });
}

function renameDepartmentReferences(previousName, nextName) {
  if (previousName === nextName) return;
  resourceData.users.forEach((user) => {
    user.departments = user.departments.map((department) => department === previousName ? nextName : department);
  });
  resourceData.departments.filter((department) => department.parent === previousName).forEach((department) => {
    department.parent = nextName;
  });
  projects.forEach((project) => {
    project.stages.forEach((stage) => {
      stage.assignees
        .filter((assignee) => assignee.type === 'department' && assignee.name === previousName)
        .forEach((assignee) => {
          assignee.name = nextName;
        });
    });
  });
}

function renameRoleReferences(previousName, nextName) {
  if (previousName === nextName) return;
  resourceData.users.forEach((user) => {
    user.globalRoles = user.globalRoles.map((role) => role === previousName ? nextName : role);
  });
  projects.forEach((project) => {
    project.members.filter((member) => member.role === previousName).forEach((member) => {
      member.role = nextName;
    });
  });
}

function renameCustomerReferences(previousName, nextName) {
  if (previousName === nextName) return;
  projects.forEach((project) => {
    project.projectCustomers.filter((customer) => customer.customerName === previousName).forEach((customer) => {
      customer.customerName = nextName;
    });
  });
  orders.filter((order) => order.customerName === previousName).forEach((order) => {
    order.customerName = nextName;
  });
  tasks.filter((task) => task.customerName === previousName).forEach((task) => {
    task.customerName = nextName;
  });
}

function syncCustomerSnapshotReferences(customerName) {
  const customer = customerByName(customerName);
  if (!customer) return;
  projects.forEach((project) => {
    project.projectCustomers
      .filter((projectCustomer) => projectCustomer.customerName === customerName)
      .forEach((projectCustomer) => {
        projectCustomer.region = customer.region;
      });
  });
}

function renameCustomerProjectStatusReferences(previousName, nextName) {
  if (previousName === nextName) return;
  projects.forEach((project) => {
    project.projectCustomers
      .filter((projectCustomer) => projectCustomer.projectStatus === previousName)
      .forEach((projectCustomer) => {
        projectCustomer.projectStatus = nextName;
      });
  });
}

function renameCustomerLevelReferences(previousName, nextName) {
  if (previousName === nextName) return;
  customers.filter((customer) => customer.level === previousName).forEach((customer) => {
    customer.level = nextName;
  });
}

function renameOrderTypeReferences(previousName, nextName) {
  if (previousName === nextName) return;
  orders.filter((order) => (order.type || '正式订单') === previousName).forEach((order) => {
    order.type = nextName;
  });
}

function resourceSearchText(item, tab) {
  if (tab === 'users') {
    return [
      item.name,
      item.account,
      ...item.departments,
      ...item.globalRoles,
      ...item.directPermissions.map(permissionDisplayName),
      item.status,
    ].join(' ').toLowerCase();
  }
  if (tab === 'departments') {
    return [item.name, `${departmentMemberCount(item.name)} 人`].join(' ').toLowerCase();
  }
  if (tab === 'roles') {
    return [item.name, item.type, ...item.permissions.map(permissionDisplayName), item.status].join(' ').toLowerCase();
  }
  if (tab === 'permissions') {
    return [
      item.name,
      item.type,
      item.target,
      item.location,
      ...permissionRoleNames(item.key),
      ...permissionDirectUserNames(item.key),
    ].join(' ').toLowerCase();
  }
  if (tab === 'customers') {
    return [
      item.name,
      item.shortName,
      item.region,
      ...(item.salesOwners || []),
      ...(item.supportOwners || []),
      item.status,
    ].join(' ').toLowerCase();
  }
  if (tab === 'task-statuses') {
    return [item.name, item.semantic, item.active ? '启用' : '停用'].join(' ').toLowerCase();
  }
  if (tab === 'order-types') {
    return [item.name, item.active ? '启用' : '停用'].join(' ').toLowerCase();
  }
  if (tab === 'customer-levels') {
    return [item.name, item.active ? '启用' : '停用'].join(' ').toLowerCase();
  }
  return Object.values(item).join(' ').toLowerCase();
}

function filteredResourceRows(tab) {
  const keyword = resourceSearchKeyword.trim().toLowerCase();
  return resourceRowsForTab(tab)
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const matchesKeyword = !keyword || resourceSearchText(item, tab).includes(keyword);
      const matchesPermissionType = tab !== 'permissions' || permissionTypeFilter === '全部类型' || item.type === permissionTypeFilter;
      return matchesKeyword && matchesPermissionType;
    });
}

function resourceTitleMeta(tab) {
  const titleMap = {
    users: ['用户管理', '维护用户、所属部门、全局角色和用户直授权限'],
    departments: ['部门管理', '平铺维护部门；成员数由用户列表自动统计'],
    roles: ['角色管理', '在角色中统一配置权限，再由角色赋予用户或项目成员'],
    permissions: ['权限管理', '系统根据真实菜单和按钮自动生成，只读展示并按类型筛选'],
    'customer-statuses': ['客户项目状态配置', '维护客户与具体项目之间的状态枚举，例如样机测试、订单冲刺、EOL'],
    'customer-levels': ['客户等级配置', '维护客户等级枚举，例如战略客户、重点客户、普通客户'],
    'order-types': ['订单类型配置', '维护订单类型枚举，例如样品订单、预订单、正式订单'],
    'task-statuses': ['任务状态配置', '维护全局任务状态及允许流转关系；任务详情会展示所有启用状态，并提示推荐流转'],
  };
  return titleMap[tab];
}

function resourceTabTitle(tab) {
  return resourceTitleMeta(tab)?.[0] || tab || '-';
}

function renderResourceForm() {
  const editingItem = resourceEditIndex === null ? null : resourceRowsForTab(selectedResourceTab)[resourceEditIndex];
  const formTitle = editingItem ? '编辑' : '新增';
  const selectedCustomerLevel = editingItem?.level || 'C / 普通客户';

  if (selectedResourceTab === 'users') {
    return `
      <div class="customer-form">
        <div class="form-grid">
          <div class="form-field">
            <label>姓名</label>
            <input id="resource-user-name" class="text-input" maxlength="40" value="${editingItem?.name || ''}" placeholder="例如 张敏" />
          </div>
          <input id="resource-user-account" type="hidden" value="${editingItem?.account || editingItem?.email || ''}" />
          <div class="form-field">
            <label>邮箱 / 登录账号</label>
            <input id="resource-user-email" class="text-input" type="email" maxlength="128" value="${editingItem?.email || editingItem?.account || ''}" placeholder="例如 user@kozenmobile.com" />
            <small class="field-hint">新增用户时邮箱必填，登录账号默认等于邮箱。</small>
          </div>
          <div class="form-field full">
            <label>所属部门</label>
            ${renderCheckboxOptions(resourceData.departments, editingItem?.departments || [], 'data-user-department')}
          </div>
          <div class="form-field full">
            <label>全局角色</label>
            ${renderCheckboxOptions(globalRoleOptions(editingItem?.globalRoles || []), editingItem?.globalRoles || [], 'data-user-global-role')}
            <small class="field-hint">项目内角色仍在具体项目成员中配置，不在这里做全局绑定。</small>
          </div>
          <div class="form-field full">
            <label>用户直授权限</label>
            ${renderPermissionPicker('user-direct', permissionPickerValues('user-direct', editingItem?.directPermissions || []), '暂无用户直授权限')}
            <small class="field-hint">用于少量例外场景；通用权限优先通过角色统一授权。</small>
          </div>
          <div class="form-field">
            <label>状态</label>
            <select id="resource-user-status" class="select-input">
              ${resourceStatusOptions.map((status) => `<option ${editingItem?.status === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="customer-form-actions">
          <button class="muted-btn" data-action="cancel-resource-form">取消</button>
          <button class="primary-btn" data-action="save-resource">${formTitle}用户</button>
        </div>
      </div>
    `;
  }

  if (selectedResourceTab === 'departments') {
    return `
      <div class="customer-form">
        <div class="form-grid">
          <div class="form-field">
            <label>部门名称</label>
            <input id="resource-department-name" class="text-input" maxlength="40" value="${editingItem?.name || ''}" placeholder="例如 产品部" />
          </div>
          <div class="form-field">
            <label>结构说明</label>
            <div class="field-readonly">平铺部门，不维护上下级关系</div>
          </div>
        </div>
        <div class="customer-form-actions">
          <button class="muted-btn" data-action="cancel-resource-form">取消</button>
          <button class="primary-btn" data-action="save-resource">${formTitle}部门</button>
        </div>
      </div>
    `;
  }

  if (selectedResourceTab === 'roles') {
    return `
      <div class="customer-form">
        <div class="form-grid">
          <div class="form-field">
            <label>角色名称</label>
            <input id="resource-role-name" class="text-input" maxlength="40" value="${editingItem?.name || ''}" placeholder="例如 软件项目经理" />
          </div>
          <div class="form-field">
            <label>角色类型</label>
            <select id="resource-role-type" class="select-input">
              ${roleTypeOptions.map((type) => `<option ${editingItem?.type === type ? 'selected' : ''}>${type}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label>状态</label>
            <select id="resource-role-status" class="select-input">
              ${resourceStatusOptions.map((status) => `<option ${editingItem?.status === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
          </div>
          <div class="form-field full">
            <label>角色权限</label>
            ${renderPermissionPicker('role-permissions', permissionPickerValues('role-permissions', editingItem?.permissions || []), '暂无角色权限')}
          </div>
        </div>
        <div class="customer-form-actions">
          <button class="muted-btn" data-action="cancel-resource-form">取消</button>
          <button class="primary-btn" data-action="save-resource">${formTitle}角色</button>
        </div>
      </div>
    `;
  }

  if (selectedResourceTab === 'customers') {
    return `
      <div class="customer-form">
        <div class="form-grid">
          <div class="form-field">
            <label>客户名称</label>
            <input id="customer-name" class="text-input" maxlength="120" value="${editingItem?.name || ''}" placeholder="例如 Nova Retail" />
          </div>
          <div class="form-field">
            <label>客户简称</label>
            <input id="customer-short-name" class="text-input" maxlength="60" value="${editingItem?.shortName || ''}" placeholder="例如 Nova" />
          </div>
          <div class="form-field">
            <label>国家 / 区域</label>
            <input id="customer-region" class="text-input" maxlength="80" value="${editingItem?.region || ''}" placeholder="例如 德国" />
          </div>
          <div class="form-field full">
            <label>详细地址</label>
            <input id="customer-address" class="text-input" maxlength="255" value="${editingItem?.address || ''}" placeholder="例如 Berlin, Germany；用于资源分布地图自动定位" />
          </div>
          <div class="form-field full">
            <label>负责销售</label>
            ${searchablePeopleInput(
              'customer-sales-owners',
              editingItem?.salesOwners || [],
              '输入销售姓名，多个用顿号或逗号分隔',
              personCandidateNames(editingItem?.salesOwners || [], salesUsers(editingItem?.salesOwners || [])),
            )}
          </div>
          <div class="form-field full">
            <label>负责技术支持</label>
            ${searchablePeopleInput(
              'customer-support-owners',
              editingItem?.supportOwners || [],
              '输入技术支持姓名，多个用顿号或逗号分隔',
              personCandidateNames(editingItem?.supportOwners || [], supportUsers(editingItem?.supportOwners || [])),
            )}
          </div>
          <div class="form-field">
            <label>客户状态</label>
            <select id="customer-status" class="select-input">
              ${customerMasterStatusOptions.map((status) => `<option ${editingItem?.status === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label>客户等级</label>
            <select id="customer-level" class="select-input">
              ${customerLevelOptionsForValue(selectedCustomerLevel).map((level) => `<option ${selectedCustomerLevel === level ? 'selected' : ''}>${level}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="customer-form-actions">
          <button class="muted-btn" data-action="cancel-resource-form">取消</button>
          <button class="primary-btn" data-action="save-resource">${formTitle}客户</button>
        </div>
      </div>
    `;
  }

  if (selectedResourceTab === 'customer-levels') {
    return `
      <div class="customer-form">
        <div class="form-grid">
          <div class="form-field">
            <label>客户等级名称</label>
            <input id="customer-level-name" class="text-input" maxlength="80" value="${editingItem?.name || ''}" placeholder="例如 A / 战略客户" />
          </div>
          <div class="form-field">
            <label>是否启用</label>
            <select id="customer-level-active" class="select-input">
              <option ${editingItem?.active !== false ? 'selected' : ''}>启用</option>
              <option ${editingItem?.active === false ? 'selected' : ''}>停用</option>
            </select>
          </div>
        </div>
        <p class="field-hint">客户等级用于客户活跃度看板中的资源投入优先级判断。</p>
        <div class="customer-form-actions">
          <button class="muted-btn" data-action="cancel-resource-form">取消</button>
          <button class="primary-btn" data-action="save-resource">${formTitle}等级</button>
        </div>
      </div>
    `;
  }

  if (selectedResourceTab === 'order-types') {
    return `
      <div class="customer-form">
        <div class="form-grid">
          <div class="form-field">
            <label>订单类型名称</label>
            <input id="order-type-name" class="text-input" maxlength="80" value="${editingItem?.name || ''}" placeholder="例如 小批量试单" />
          </div>
          <div class="form-field">
            <label>是否启用</label>
            <select id="order-type-active" class="select-input">
              <option ${editingItem?.active !== false ? 'selected' : ''}>启用</option>
              <option ${editingItem?.active === false ? 'selected' : ''}>停用</option>
            </select>
          </div>
        </div>
        <p class="field-hint">订单类型用于订单录入、筛选和后续统计，例如样品订单、预订单、正式订单。</p>
        <div class="customer-form-actions">
          <button class="muted-btn" data-action="cancel-resource-form">取消</button>
          <button class="primary-btn" data-action="save-resource">${formTitle}类型</button>
        </div>
      </div>
    `;
  }

  if (selectedResourceTab === 'task-statuses') {
    return `
      <div class="customer-form">
        <div class="form-grid">
          <div class="form-field">
            <label>状态名称</label>
            <input id="task-status-name" class="text-input" maxlength="80" value="${editingItem?.name || ''}" placeholder="例如 待复核" />
          </div>
          <div class="form-field">
            <label>状态语义</label>
            <select id="task-status-semantic" class="select-input">
              ${taskStatusSemanticOptions.map((semantic) => `<option ${editingItem?.semantic === semantic ? 'selected' : ''}>${semantic}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label>是否启用</label>
            <select id="task-status-active" class="select-input">
              <option ${editingItem?.active !== false ? 'selected' : ''}>启用</option>
              <option ${editingItem?.active === false ? 'selected' : ''}>停用</option>
            </select>
          </div>
        </div>
        <p class="field-hint">“完成 / 拒绝”语义用于关联需求自动回写，避免只依赖固定中文状态名。</p>
        <div class="customer-form-actions">
          <button class="muted-btn" data-action="cancel-resource-form">取消</button>
          <button class="primary-btn" data-action="save-resource">${formTitle}状态</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="customer-form">
      <div class="form-grid">
        <div class="form-field">
          <label>客户项目状态名称</label>
          <input id="customer-status-option-name" class="text-input" maxlength="80" value="${editingItem?.name || ''}" placeholder="例如 首单护航" />
        </div>
        <div class="form-field">
          <label>是否启用</label>
          <select id="customer-status-option-active" class="select-input">
            <option ${editingItem?.active !== false ? 'selected' : ''}>启用</option>
            <option ${editingItem?.active === false ? 'selected' : ''}>停用</option>
          </select>
        </div>
      </div>
      <p class="field-hint">用于描述某个客户在某个产品项目上的推进状态，可在项目详情的客户列表中维护。</p>
      <div class="customer-form-actions">
        <button class="muted-btn" data-action="cancel-resource-form">取消</button>
        <button class="primary-btn" data-action="save-resource">${formTitle}状态</button>
      </div>
    </div>
  `;
}

function renderResourceTable() {
  const rows = filteredResourceRows(selectedResourceTab);

  if (selectedResourceTab === 'users') {
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>姓名</th><th>账号</th><th>所属部门</th><th>全局角色</th><th>直授权限</th><th>状态</th><th></th></tr></thead>
          <tbody>
            ${rows.map(({ item, index }) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.account}</td>
                <td>${joinValues(item.departments)}</td>
                <td>${joinValues(item.globalRoles)}</td>
                <td><span class="count-pill">${permissionCountLabel(item.directPermissions, '无直授权限')}</span></td>
                <td><span class="badge ${item.status === '启用' ? 'done' : 'pending'}">${item.status}</span></td>
                <td class="row-actions">
                  <button class="ghost-btn" data-action="edit-resource" data-resource-index="${index}">编辑</button>
                  <button class="muted-btn" data-action="toggle-user-status" data-resource-index="${index}">${item.status === '启用' ? '停用' : '启用'}</button>
                  <button class="muted-btn" data-action="reset-user-password" data-resource-index="${index}">重置密码</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="7">暂无匹配用户</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  if (selectedResourceTab === 'departments') {
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>部门名称</th><th>成员数</th><th></th></tr></thead>
          <tbody>
            ${rows.map(({ item, index }) => `
              <tr>
                <td>${item.name}</td>
                <td>${departmentMemberCount(item.name)} 人</td>
                <td class="row-actions">
                  <button class="ghost-btn" data-action="edit-resource" data-resource-index="${index}">编辑</button>
                  <button class="danger-btn" data-action="delete-resource" data-resource-index="${index}" ${canDeleteDepartment(item) ? '' : 'disabled'}>${canDeleteDepartment(item) ? '删除' : '使用中'}</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="3">暂无匹配部门</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  if (selectedResourceTab === 'roles') {
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>角色名称</th><th>角色类型</th><th>权限数量</th><th>引用人数</th><th>状态</th><th></th></tr></thead>
          <tbody>
            ${rows.map(({ item, index }) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td><span class="count-pill">${permissionCountLabel(item.permissions, '无权限')}</span></td>
                <td>${roleAssignedUserCount(item.name) + projectRoleUsageCount(item.name)} 人</td>
                <td><span class="badge ${item.status === '启用' ? 'done' : 'pending'}">${item.status}</span></td>
                <td class="row-actions">
                  <button class="ghost-btn" data-action="edit-resource" data-resource-index="${index}">编辑</button>
                  <button class="danger-btn" data-action="delete-resource" data-resource-index="${index}" ${canDeleteRole(item) ? '' : 'disabled'}>${canDeleteRole(item) ? '删除' : '使用中'}</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="6">暂无匹配角色</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  if (selectedResourceTab === 'permissions') {
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>权限名称</th><th>权限类型</th><th>对应菜单 / 按钮</th><th>所在位置</th><th>角色授权</th><th>直接授权用户</th></tr></thead>
          <tbody>
            ${rows.map(({ item }) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.target}</td>
                <td>${item.location}</td>
                <td>${joinValues(permissionRoleNames(item.key))}</td>
                <td>${joinValues(permissionDirectUserNames(item.key))}</td>
              </tr>
            `).join('') || '<tr><td colspan="6">暂无匹配权限</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  if (selectedResourceTab === 'customers') {
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>客户名称</th><th>客户简称</th><th>国家 / 区域</th><th>负责销售</th><th>负责技术支持</th><th>客户等级</th><th>客户状态</th><th></th></tr>
          </thead>
          <tbody>
            ${rows.map(({ item, index }) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.shortName}</td>
                <td>${item.region}</td>
                <td>${taskPersonLabel(item.salesOwners)}</td>
                <td>${taskPersonLabel(item.supportOwners)}</td>
                <td><span class="badge ${customerLevelBadgeClass(item.level)}">${item.level || '-'}</span></td>
                <td><span class="badge ${item.status === '合作中' ? 'done' : item.status === '潜在客户' ? 'progress' : 'pending'}">${item.status}</span></td>
                <td class="row-actions">
                  <button class="ghost-btn" data-action="edit-resource" data-resource-index="${index}">编辑</button>
                  <button class="danger-btn" data-action="delete-resource" data-resource-index="${index}" ${canDeleteCustomer(item) ? '' : 'disabled'}>${canDeleteCustomer(item) ? '删除' : '使用中'}</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="8">暂无匹配客户</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }



  if (selectedResourceTab === 'customer-levels') {
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>客户等级</th><th>状态</th><th>客户引用数</th><th></th></tr></thead>
          <tbody>
            ${rows.map(({ item, index }) => `
              <tr>
                <td>${item.name}</td>
                <td><span class="badge ${item.active ? 'done' : 'pending'}">${item.active ? '启用中' : '已停用'}</span></td>
                <td>${customerLevelUsageCount(item.name)}</td>
                <td class="row-actions">
                  <button class="ghost-btn" data-action="edit-resource" data-resource-index="${index}">编辑</button>
                  <button class="muted-btn" data-action="toggle-customer-level-option" data-level-option-index="${index}" ${canToggleCustomerLevelOption(item) ? '' : 'disabled'}>${canToggleCustomerLevelOption(item) ? (item.active ? '停用' : '启用') : '使用中'}</button>
                  <button class="danger-btn" data-action="delete-resource" data-resource-index="${index}" ${canDeleteCustomerLevel(item) ? '' : 'disabled'}>${canDeleteCustomerLevel(item) ? '删除' : '使用中'}</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="4">暂无客户等级</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  if (selectedResourceTab === 'order-types') {
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>订单类型</th><th>状态</th><th>订单引用数</th><th></th></tr></thead>
          <tbody>
            ${rows.map(({ item, index }) => `
              <tr>
                <td>${item.name}</td>
                <td><span class="badge ${item.active ? 'done' : 'pending'}">${item.active ? '启用中' : '已停用'}</span></td>
                <td>${orderTypeUsageCount(item.name)}</td>
                <td class="row-actions">
                  <button class="ghost-btn" data-action="edit-resource" data-resource-index="${index}">编辑</button>
                  <button class="muted-btn" data-action="toggle-order-type-option" data-order-type-index="${index}" ${canToggleOrderTypeOption(item) ? '' : 'disabled'}>${canToggleOrderTypeOption(item) ? (item.active ? '停用' : '启用') : '使用中'}</button>
                  <button class="danger-btn" data-action="delete-resource" data-resource-index="${index}" ${canDeleteOrderType(item) ? '' : 'disabled'}>${canDeleteOrderType(item) ? '删除' : '使用中'}</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="4">暂无订单类型</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  if (selectedResourceTab === 'task-statuses') {
    return `
      <div class="task-status-layout">
        <div class="table-wrap">
          <table>
            <thead><tr><th>状态名称</th><th>状态语义</th><th>启用状态</th><th>任务引用数</th><th></th></tr></thead>
            <tbody>
              ${rows.map(({ item, index }) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.semantic}</td>
                  <td><span class="badge ${item.active ? 'done' : 'pending'}">${item.active ? '启用中' : '已停用'}</span></td>
                  <td>${taskStatusUsageCount(item.name)}</td>
                  <td class="row-actions">
                    <button class="ghost-btn" data-action="edit-resource" data-resource-index="${index}">编辑</button>
                    <button class="muted-btn" data-action="toggle-task-status-option" data-status-option-index="${index}" ${canToggleTaskStatusOption(item) ? '' : 'disabled'}>${canToggleTaskStatusOption(item) ? (item.active ? '停用' : '启用') : '使用中'}</button>
                    <button class="danger-btn" data-action="delete-resource" data-resource-index="${index}" ${canDeleteTaskStatus(item) ? '' : 'disabled'}>${canDeleteTaskStatus(item) ? '删除' : '使用中'}</button>
                  </td>
                </tr>
              `).join('') || '<tr><td colspan="5">暂无任务状态</td></tr>'}
            </tbody>
          </table>
        </div>
        <section class="sub-panel">
          <div class="panel-head compact-head">
            <div>
              <h3>允许流转关系</h3>
              <p>任务详情会展示所有启用状态；这里的流转关系用于提示推荐下一状态，后续可升级为强约束审批。</p>
            </div>
            <button class="ghost-btn" data-action="toggle-task-transition-form">新增流转</button>
          </div>
          ${taskTransitionFormOpen ? renderFormModal(`
            <div class="inline-form transition-form-modal">
              <select id="task-transition-from" class="select-input">
                ${activeTaskStatusNames().map((status) => `<option>${status}</option>`).join('')}
              </select>
              <select id="task-transition-to" class="select-input">
                ${activeTaskStatusNames().map((status) => `<option>${status}</option>`).join('')}
              </select>
              <button class="primary-btn" data-action="save-task-transition">保存流转</button>
            </div>
          `, 'narrow') : ''}
          <div class="transition-list">
            ${taskStatusTransitions.map((transition, index) => `
              <div class="transition-row">
                <span>${transition.from}</span>
                <strong>→</strong>
                <span>${transition.to}</span>
                <button class="muted-btn" data-action="delete-task-transition" data-transition-index="${index}">删除</button>
              </div>
            `).join('') || '<p class="empty-note">暂无流转关系</p>'}
          </div>
        </section>
      </div>
    `;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>客户项目状态</th><th>启用状态</th><th></th></tr></thead>
        <tbody>
          ${rows.map(({ item, index }) => `
            <tr>
              <td>${item.name}</td>
              <td><span class="badge ${item.active ? 'done' : 'pending'}">${item.active ? '启用中' : '已停用'}</span></td>
              <td class="row-actions">
                <button class="ghost-btn" data-action="edit-resource" data-resource-index="${index}">编辑</button>
                <button class="muted-btn" data-action="toggle-customer-status-option" data-status-option-index="${index}" ${canToggleCustomerStatusOption(item) ? '' : 'disabled'}>${canToggleCustomerStatusOption(item) ? (item.active ? '停用' : '启用') : '使用中'}</button>
                <button class="danger-btn" data-action="delete-resource" data-resource-index="${index}" ${canDeleteCustomerStatus(item) ? '' : 'disabled'}>${canDeleteCustomerStatus(item) ? '删除' : '使用中'}</button>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="3">暂无匹配状态</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function renderResourceContent() {
  const [title, subtitle] = resourceTitleMeta(selectedResourceTab);
  const isPermissionView = selectedResourceTab === 'permissions';

  resourceContent.innerHTML = `
    <div class="panel-head">
      <div>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
      ${isPermissionView ? '' : '<button class="primary-btn" data-action="open-resource-create">新增</button>'}
    </div>
    <div class="resource-toolbar">
      <input id="resource-search" type="search" value="${resourceSearchKeyword}" placeholder="${isPermissionView ? '搜索权限名称 / 菜单 / 按钮 / 页面' : '搜索当前资源'}" />
      ${isPermissionView ? `
          <select id="permission-type-filter" class="select-input compact-filter">
          ${permissionTypeOptions.map((type) => `<option ${permissionTypeFilter === type ? 'selected' : ''}>${type}</option>`).join('')}
        </select>
      ` : ''}
    </div>
    ${resourceFormOpen && !isPermissionView ? renderFormModal(renderResourceForm(), 'wide') : ''}
    <div id="resource-table-area">
      ${renderResourceTable()}
    </div>
  `;
}

function createProjectWizardDraft() {
  return {
    externalName: '',
    internalName: '',
    modelName: '',
    managerAccount: 'wangwei',
    status: '未开始',
    salesability: salesabilityOptions[1],
    unsellableReason: unsellableReasonOptions[0],
    description: '',
    members: [
      { userAccount: 'wangwei', role: '硬件项目经理' },
      { userAccount: 'lina', role: '软件项目经理' },
      { userAccount: 'zhaolei', role: '销售' },
    ],
    stageAssignments: {},
  };
}

function cloneAssignees(assignees) {
  return assignees.map((assignee) => ({ ...assignee }));
}

const departmentDefaultOwnerAccounts = {
  销售部: ['zhaolei'],
  产品部: ['admin@kozenmobile.com'],
  运营部: ['admin@kozenmobile.com'],
  硬件部: ['wangwei'],
  软件部: ['lina'],
  测试部: ['zhouhang'],
  车间: ['zhouhang'],
  技术支持部: ['chenchen'],
};

const stageDefaultOwnerAccounts = {
  提出想法: ['zhaolei', 'admin@kozenmobile.com'],
  讨论可行性: ['admin@kozenmobile.com'],
  核算成本: ['admin@kozenmobile.com'],
  硬件设计: ['wangwei'],
  软件适配: ['lina'],
  测试生产: ['zhouhang'],
  试用: ['chenchen'],
  客户推广: ['zhaolei', 'chenchen'],
  客户调试: ['chenchen'],
  客户下单: ['zhaolei'],
};

function uniqueExistingAccounts(accounts = []) {
  return [...new Set(accounts)].filter((account) => userByAccount(account));
}

function normalizeStageAssigneesToUsers(assignees = [], stageName = '') {
  const accounts = assignees.flatMap((assignee) => {
    if (assignee.type === 'user') return [assignee.account];
    return departmentDefaultOwnerAccounts[assignee.name] || [];
  });
  const normalizedAccounts = uniqueExistingAccounts(accounts.length ? accounts : stageDefaultOwnerAccounts[stageName] || []);
  return normalizedAccounts.map((account) => ({ type: 'user', account }));
}

function defaultAssigneesForStage(stageName) {
  return normalizeStageAssigneesToUsers([], stageName);
}

function stageAssigneesFromDraft(stageName) {
  return cloneAssignees(projectWizardDraft.stageAssignments[stageName] || defaultAssigneesForStage(stageName));
}

function safeDomToken(value) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function memberSearchInputId(memberDataAttr) {
  return `${safeDomToken(memberDataAttr)}-search`;
}

function renderProjectMemberRows(selectedMembers, memberDataAttr, roleDataAttr, managerAccount) {
  const normalizedMembers = ensureManagerMembership(selectedMembers, managerAccount);
  const selectedAccounts = normalizedMembers.map((member) => member.userAccount);
  const candidateNames = usersForAccountSelection(selectedAccounts)
    .filter((user) => !selectedAccounts.includes(user.account))
    .map((user) => user.name);

  return `
    <div class="member-search-box">
      <input
        id="${memberSearchInputId(memberDataAttr)}"
        class="text-input"
        list="${memberSearchInputId(memberDataAttr)}-options"
        placeholder="输入姓名搜索后添加项目成员"
      />
      ${renderNameDatalist(`${memberSearchInputId(memberDataAttr)}-options`, candidateNames)}
      <button
        class="ghost-btn"
        data-action="add-project-member"
        data-member-context="${memberDataAttr}"
        data-role-attribute="${roleDataAttr}"
        ${hasAvailableProjectRoles() ? '' : 'disabled title="请先在角色管理中配置项目内角色"'}
      >添加成员</button>
    </div>
    <div class="selection-list">
      ${normalizedMembers.map((member) => {
        const user = userByAccount(member.userAccount);
        if (!user) return '';
        const selectedMember = normalizedMembers.find((item) => item.userAccount === user.account);
        const isManager = user.account === managerAccount;
        const visibleMember = selectedMember || (isManager ? { userAccount: user.account, role: defaultProjectMemberRole() } : null);
        return `
          <div class="selection-row project-member-row">
            <div>
              <input type="hidden" ${memberDataAttr} value="${user.account}" />
              <strong>${user.name}</strong>
              ${isManager ? '<span class="inline-note">项目负责人自动入组</span>' : ''}
              <p>${joinValues(user.departments)}</p>
            </div>
            <select class="select-input" ${roleDataAttr}="${user.account}">
              ${projectRoleOptions([visibleMember?.role].filter(Boolean)).map((role) => `<option ${visibleMember?.role === role.name ? 'selected' : ''}>${role.name}</option>`).join('')}
            </select>
            <button class="muted-btn" data-action="remove-project-member" data-member-context="${memberDataAttr}" data-role-attribute="${roleDataAttr}" data-member-account="${user.account}" ${isManager ? 'disabled' : ''}>移除</button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderStageAssigneeSelector(stage, stageIndex, assignees, context) {
  const selectedUsers = assignees.filter((assignee) => assignee.type === 'user').map((assignee) => assignee.account);
  const selectedNames = selectedUsers.map(userName).filter((name) => name !== '待分配');

  return `
    <article class="stage-assignment-card">
      <div>
        <h3>${stage.name}</h3>
        <p>已选择：${stageOwnerLabel({ assignees: normalizeStageAssigneesToUsers(assignees, stage.name) })}</p>
      </div>
      <div class="assignment-group">
        <strong>负责人</strong>
        ${searchablePeopleInput(`${context}-stage-users-${stageIndex}`, selectedNames, '输入姓名搜索，多个负责人用顿号或逗号分隔')}
      </div>
    </article>
  `;
}

function collectProjectMembers(memberSelector, roleAttribute) {
  return [...document.querySelectorAll(memberSelector)]
    .map((input) => ({
      userAccount: input.value,
      role: document.querySelector(`[${roleAttribute}="${input.value}"]`)?.value || defaultProjectMemberRole(),
    }));
}

function collectStageAssignees(context, stageIndex) {
  return collectPeopleInputValue(`${context}-stage-users-${stageIndex}`)
    .map((name) => userByNameValue(name)?.account)
    .filter(Boolean)
    .map((account) => ({ type: 'user', account }));
}

function validateProjectRoleConfiguration() {
  if (hasAvailableProjectRoles()) return true;
  showToast('请先在角色管理中配置至少一个启用的项目内角色，再添加项目成员。', 'warning');
  return false;
}

function validateStageOwnerSelections(context, stageCount) {
  for (let index = 0; index < stageCount; index += 1) {
    if (!validatePeopleSelection(`${context}-stage-users-${index}`, '阶段负责人')) return false;
  }
  return true;
}

function saveMembersForContext(memberContext, members) {
  if (memberContext === 'data-project-member-user') {
    projectWizardDraft.members = ensureManagerMembership(members, projectWizardDraft.managerAccount);
    renderWizard();
    return;
  }

  if (memberContext === 'data-edit-member-user') {
    const project = projects.find((item) => item.id === editingProjectId);
    project.members = ensureManagerMembership(members, project.managerAccount);
    if (projectEditModalOpen) renderGlobalModals();
    else renderProjectEdit();
    return;
  }

  if (memberContext === 'data-member-modal-user') {
    const project = projects.find((item) => item.id === selectedProjectId);
    project.members = ensureManagerMembership(members, project.managerAccount);
    renderProjectDetail();
  }
}

function currentMembersFromContext(memberContext, roleAttribute) {
  return collectProjectMembers(`[${memberContext}]`, roleAttribute);
}

function captureWizardStepOne() {
  if (wizardStep !== 1) return;
  projectWizardDraft.externalName = document.getElementById('wizard-project-external-name').value.trim();
  projectWizardDraft.internalName = document.getElementById('wizard-project-internal-name').value.trim();
  projectWizardDraft.modelName = document.getElementById('wizard-project-model-name').value.trim();
  projectWizardDraft.managerAccount = collectUserAccountInputValue('wizard-project-manager', projectWizardDraft.managerAccount);
  projectWizardDraft.status = '未开始';
  projectWizardDraft.salesability = document.getElementById('wizard-project-salesability').value;
  projectWizardDraft.unsellableReason = projectWizardDraft.salesability === '可销售'
    ? ''
    : document.getElementById('wizard-project-unsellable-reason')?.value || unsellableReasonOptions[0];
  projectWizardDraft.description = document.getElementById('wizard-project-description').value.trim();
  projectWizardDraft.members = ensureManagerMembership(projectWizardDraft.members, projectWizardDraft.managerAccount);
}

function captureWizardStepThree() {
  if (wizardStep !== 3) return;
  projectWizardDraft.members = ensureManagerMembership(
    collectProjectMembers('[data-project-member-user]', 'data-project-member-role'),
    projectWizardDraft.managerAccount,
  );
}

function captureWizardStepFour() {
  if (wizardStep !== 4) return;
  templates[selectedTemplateIndex].stages.forEach((stageName, index) => {
    projectWizardDraft.stageAssignments[stageName] = collectStageAssignees('wizard', index);
  });
}

function createProjectFromWizard() {
  const template = templates[selectedTemplateIndex];
  const externalName = projectWizardDraft.externalName || '未命名项目';

  const project = {
    id: nextProjectId(externalName),
    externalName,
    internalName: projectWizardDraft.internalName || '-',
    modelName: projectWizardDraft.modelName || '-',
    managerAccount: projectWizardDraft.managerAccount,
    status: '未开始',
    archived: false,
    salesability: projectWizardDraft.salesability,
    unsellableReason: projectWizardDraft.salesability === '可销售' ? '' : projectWizardDraft.unsellableReason,
    description: projectWizardDraft.description || '暂无项目描述。',
    members: ensureManagerMembership(projectWizardDraft.members, projectWizardDraft.managerAccount),
    stages: template.stages.map((name) => ({
      name,
      assignees: cloneAssignees(projectWizardDraft.stageAssignments[name] || defaultAssigneesForStage(name)),
      status: '未开始',
    })),
    projectCustomers: [],
    projectMaterials: [],
  };
  syncProjectStatusFromStages(project);

  projects.unshift(project);
  selectedProjectId = project.id;
  renderDashboard();
  renderProjectTable(projectSearch.value);
  renderTaskManagement();
  return project;
}

function renderWizard() {
  if (!projectWizardDraft) projectWizardDraft = createProjectWizardDraft();
  normalizeSelectedTemplateIndex();
  document.querySelectorAll('.wizard-step').forEach((step) => {
    step.classList.toggle('active', Number(step.dataset.step) === wizardStep);
  });

  if (wizardStep === 1) {
    wizardContent.innerHTML = `
      <div class="form-grid">
        <div class="form-field">
          <label>对外名称</label>
          <input id="wizard-project-external-name" class="text-input" maxlength="120" value="${projectWizardDraft.externalName}" placeholder="例如 P8 dual" />
        </div>
        <div class="form-field">
          <label>内部名称</label>
          <input id="wizard-project-internal-name" class="text-input" maxlength="120" value="${projectWizardDraft.internalName}" placeholder="例如 R2351" />
        </div>
        <div class="form-field">
          <label>Model 名称</label>
          <input id="wizard-project-model-name" class="text-input" maxlength="120" value="${projectWizardDraft.modelName}" placeholder="例如 K1352" />
        </div>
        <div class="form-field">
          <label>项目负责人</label>
          ${singleUserSearchInput('wizard-project-manager', projectWizardDraft.managerAccount, '输入姓名搜索项目负责人')}
        </div>
        <div class="form-field">
          <label>项目状态</label>
          <div class="derived-status-box">
            <span class="badge pending">未开始</span>
            <small>新建项目默认为未开始；后续由阶段状态自动推导项目状态。</small>
          </div>
        </div>
        <div class="form-field">
          <label>销售状态</label>
          <select id="wizard-project-salesability" class="select-input">
            ${salesabilityOptions.map((status) => `<option ${projectWizardDraft.salesability === status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </div>
        <div id="wizard-unsellable-reason-field" class="form-field full ${projectWizardDraft.salesability === '可销售' ? 'hidden' : ''}">
          <label>不可销售原因</label>
          <select id="wizard-project-unsellable-reason" class="select-input" ${projectWizardDraft.salesability === '可销售' ? 'disabled' : ''}>
            ${unsellableReasonOptions.map((reason) => `<option ${projectWizardDraft.unsellableReason === reason ? 'selected' : ''}>${reason}</option>`).join('')}
          </select>
        </div>
        <div class="form-field full">
          <label>项目描述</label>
          <textarea id="wizard-project-description" rows="4" placeholder="补充项目说明">${projectWizardDraft.description}</textarea>
        </div>
      </div>
    `;
  }

  if (wizardStep === 2) {
    const enabledTemplates = enabledTemplateEntries();
    wizardContent.innerHTML = `
      <div class="selection-list">
        ${enabledTemplates.map(({ template, index }) => `
          <div class="selection-row">
            <div>
              <strong>${template.name}</strong>
              <p>${template.stages.join(' → ')}</p>
            </div>
            <button class="${index === selectedTemplateIndex ? 'primary-btn' : 'ghost-btn'}" data-action="select-template" data-template-index="${index}">
              ${index === selectedTemplateIndex ? '已选择' : '选择模板'}
            </button>
          </div>
        `).join('') || '<p class="empty-note">当前暂无可用于建项目的启用模板。</p>'}
      </div>
    `;
  }

  if (wizardStep === 3) {
    wizardContent.innerHTML = `
      <div class="section-intro">
        <h3>选择项目成员</h3>
        <p>项目成员引用真实用户，并在当前项目内分配项目角色；项目负责人会自动进入成员列表。</p>
      </div>
      ${renderProjectMemberRows(projectWizardDraft.members, 'data-project-member-user', 'data-project-member-role', projectWizardDraft.managerAccount)}
    `;
  }

  if (wizardStep === 4) {
    wizardContent.innerHTML = `
      <div class="section-intro">
        <h3>配置阶段负责人</h3>
        <p>每个阶段可输入搜索一个或多个具体负责人，支持并行协作。</p>
      </div>
      <div class="stage-assignment-list">
        ${templates[selectedTemplateIndex].stages.map((stageName, index) => renderStageAssigneeSelector(
          { name: stageName },
          index,
          stageAssigneesFromDraft(stageName),
          'wizard',
        )).join('')}
      </div>
    `;
  }

  wizardContent.insertAdjacentHTML('beforeend', `
    <div class="wizard-actions">
      <button class="muted-btn" data-action="wizard-prev" ${wizardStep === 1 ? 'disabled' : ''}>上一步</button>
      <button class="primary-btn" data-action="wizard-next">${wizardStep === 4 ? '创建项目' : '下一步'}</button>
    </div>
  `);
}


function backendProjectByName(name) {
  return projects.find((project) => project.externalName === name || project.id === name || project.projectName === name);
}

function backendCustomerByName(name) {
  return customers.find((customer) => customer.name === name || customer.id === name || customer.customerName === name);
}

function backendStageByName(project, stageName) {
  return asArray(project?.stages).find((stage) => stage.name === stageName || stage.id === stageName || stage.stageName === stageName);
}

function backendTaskPayload(task, overrides = {}) {
  const project = backendProjectByName(overrides.project || task.project || task.projectName) || projects.find((item) => item.id === task.projectId);
  const stage = backendStageByName(project, overrides.stage || task.stage || task.stageName) || asArray(project?.stages).find((item) => item.id === task.stageId);
  const customer = backendCustomerByName(overrides.customerName || task.customerName) || customers.find((item) => item.id === task.customerId);
  return {
    title: overrides.title ?? task.title,
    description: overrides.description ?? task.description ?? '',
    projectId: overrides.projectId ?? project?.id ?? task.projectId ?? null,
    stageId: overrides.stageId ?? stage?.id ?? task.stageId ?? null,
    category: overrides.category ?? task.category ?? '其他',
    status: overrides.status ?? task.status ?? activeTaskStatusNames()[0] ?? '待处理',
    priority: overrides.priority ?? task.priority ?? '中',
    creator: overrides.creator ?? task.creator ?? currentUser,
    expectedCompletionAt: overrides.expectedCompletionAt ?? task.expectedCompletionAt ?? task.dueDate ?? null,
    dueDate: overrides.dueDate ?? overrides.expectedCompletionAt ?? task.dueDate ?? task.expectedCompletionAt ?? null,
    source: overrides.source ?? task.source ?? '任务管理',
    customerId: overrides.customerId ?? customer?.id ?? task.customerId ?? null,
    blocked: overrides.blocked ?? task.blocked ?? false,
    assignees: overrides.assignees ?? taskAssigneeNames(task),
    participants: overrides.participants ?? task.participants ?? [],
  };
}

function backendOrderPayload(order, overrides = {}) {
  const customer = backendCustomerByName(order.customerName) || customers.find((item) => item.id === order.customerId);
  const project = backendProjectByName(order.projectName) || projects.find((item) => item.id === order.projectId);
  if (!customer || !project) throw new Error('订单客户或项目未匹配，请先选择有效客户和项目');
  return {
    orderDate: order.orderDate,
    customerId: customer.id,
    projectId: project.id,
    orderType: order.type || order.orderType || '正式订单',
    quantity: Number(order.quantity || 0),
    specification: order.specification || '',
    expectedShipDate: order.expectedShipDate,
    plannedShipDate: order.plannedShipDate,
    softwareVersion: order.softwareVersion || '',
    currency: order.currency || 'USD',
    unitPrice: Number(order.unitPrice || 0),
    creator: currentUser,
    ...overrides,
  };
}

function backendProjectPayloadFromProject(project) {
  return {
    externalName: project.externalName,
    internalName: project.internalName,
    modelName: project.modelName,
    managerAccount: project.managerAccount,
    salesability: project.salesability,
    unsellableReason: project.salesability === '可销售' ? null : project.unsellableReason,
    description: project.description || '',
    members: asArray(project.members).map((member) => ({
      userAccount: member.userAccount || member.account,
      role: member.role || member.roleName || '普通员工',
    })),
    stages: asArray(project.stages).map((stage) => ({
      id: stage.id,
      name: stage.name,
      status: stage.status || '未开始',
      assignees: asArray(stage.assignees).map((assignee) => ({
        type: assignee.type || assignee.assigneeType || 'user',
        name: assignee.name || assignee.assigneeName,
        account: assignee.account || '',
      })),
    })),
  };
}

function backendProjectPayloadFromWizard() {
  const template = templates[selectedTemplateIndex];
  const externalName = projectWizardDraft.externalName || '未命名项目';
  const members = ensureManagerMembership(projectWizardDraft.members, projectWizardDraft.managerAccount);
  return {
    externalName,
    internalName: projectWizardDraft.internalName || '-',
    modelName: projectWizardDraft.modelName || '-',
    managerAccount: projectWizardDraft.managerAccount,
    salesability: projectWizardDraft.salesability,
    unsellableReason: projectWizardDraft.salesability === '可销售' ? null : projectWizardDraft.unsellableReason,
    description: projectWizardDraft.description || '暂无项目描述。',
    members: members.map((member) => ({ userAccount: member.userAccount, role: member.role })),
    stages: template.stages.map((name) => ({
      name,
      status: '未开始',
      assignees: cloneAssignees(projectWizardDraft.stageAssignments[name] || defaultAssigneesForStage(name)),
    })),
  };
}

function collectCustomerMasterPayload(previousCustomer = {}) {
  return {
    name: document.getElementById('customer-master-name').value.trim(),
    shortName: document.getElementById('customer-master-short-name').value.trim() || '-',
    region: document.getElementById('customer-master-region').value.trim(),
    address: document.getElementById('customer-master-address').value.trim(),
    level: document.getElementById('customer-master-level').value,
    salesOwners: collectPeopleInputValue('customer-master-sales-owners'),
    supportOwners: collectPeopleInputValue('customer-master-support-owners'),
    status: document.getElementById('customer-master-status').value,
  };
}

function enumTypeForResourceTab(tab) {
  return {
    'customer-statuses': 'customer_project_status',
    'customer-levels': 'customer_level',
    'order-types': 'order_type',
    'task-statuses': 'task_status',
  }[tab];
}

function resourceEndpointForTab(tab) {
  return {
    users: '/api/resources/users',
    departments: '/api/resources/departments',
    roles: '/api/resources/roles',
    customers: '/api/customers',
  }[tab];
}

function collectResourcePayload(tab, previousItem = {}) {
  if (tab === 'users') {
    return {
      name: document.getElementById('resource-user-name').value.trim(),
      account: document.getElementById('resource-user-email').value.trim(),
      email: document.getElementById('resource-user-email').value.trim(),
      departments: selectedCheckboxValues('[data-user-department]'),
      globalRoles: selectedCheckboxValues('[data-user-global-role]'),
      directPermissions: collectPermissionSelections('user-direct'),
      status: document.getElementById('resource-user-status').value,
    };
  }
  if (tab === 'departments') {
    return {
      name: document.getElementById('resource-department-name').value.trim(),
      status: previousItem.status || '启用',
    };
  }
  if (tab === 'roles') {
    return {
      name: document.getElementById('resource-role-name').value.trim(),
      roleType: document.getElementById('resource-role-type').value,
      permissions: collectPermissionSelections('role-permissions'),
      status: document.getElementById('resource-role-status').value,
    };
  }
  if (tab === 'customers') {
    return {
      name: document.getElementById('customer-name').value.trim(),
      shortName: document.getElementById('customer-short-name').value.trim() || '-',
      region: document.getElementById('customer-region').value.trim(),
      address: document.getElementById('customer-address').value.trim(),
      salesOwners: collectPeopleInputValue('customer-sales-owners'),
      supportOwners: collectPeopleInputValue('customer-support-owners'),
      status: document.getElementById('customer-status').value,
      level: document.getElementById('customer-level').value,
    };
  }
  const enumType = enumTypeForResourceTab(tab);
  if (!enumType) return null;
  const idPrefix = {
    'customer-levels': 'customer-level',
    'customer-statuses': 'customer-status-option',
    'order-types': 'order-type',
    'task-statuses': 'task-status',
  }[tab];
  const name = document.getElementById(`${idPrefix}-name`).value.trim();
  const active = document.getElementById(`${idPrefix}-active`).value === '启用';
  return {
    enumType,
    name,
    value: name,
    semantic: tab === 'task-statuses' ? document.getElementById('task-status-semantic').value : previousItem.semantic,
    active,
    sortOrder: previousItem.sortOrder || 100,
  };
}

function renderAfterBackendRefresh() {
  const view = activeViewName();
  if (selectedProjectId && !projects.some((project) => project.id === selectedProjectId)) selectedProjectId = projects[0]?.id || '';
  if (selectedCustomerName && !customers.some((customer) => customer.name === selectedCustomerName)) selectedCustomerName = customers[0]?.name || '';
  renderAllPrototypeSurfaces();
  if (view === 'project-detail') renderProjectDetail();
  if (view === 'customers') renderProjectCustomers();
  if (view === 'materials') renderProjectMaterials();
  if (view === 'requirements') renderCustomerRequirements();
  if (view === 'requirement-overview') renderRequirementOverview();
  if (view === 'stage-detail') renderStageDetail();
  if (view === 'customer-detail') renderCustomerDetail();
  if (view === 'task-detail') renderTaskDetail();
  if (view === 'orders') renderOrderManagement();
  if (view === 'templates') renderTemplates();
  if (view === 'resources') renderResourceContent();
  if (view === 'analytics') renderAnalytics();
  renderGlobalModals();
}

async function refreshBusinessDataAfterWrite(reason = 'api-write') {
  window.__kpmLastApiWrite = { reason, at: new Date().toISOString() };
  await loadBusinessDataFromBackend();
  window.__kpmHydratedFromApi = true;
  window.__kpmRealApiMode = true;
  renderAfterBackendRefresh();
  showToast('操作成功，页面数据已刷新。', 'success');
}

async function refreshBusinessDataForNavigation() {
  if (!localStorage.getItem('kpm.authToken')) return;
  const now = Date.now();
  if (now - lastBusinessNavigationRefreshAt < 1200) return;
  lastBusinessNavigationRefreshAt = now;
  try {
    await loadBusinessDataFromBackend();
    renderAllPrototypeSurfaces();
  } catch (error) {
    console.warn('[KPM] navigation data refresh skipped', error);
  }
}

function reportBackendWriteError(action, error) {
  console.error(`[KPM] ${action} failed`, error);
  window.__kpmLastApiWriteError = { action, message: String(error.message || error), at: new Date().toISOString() };
  showToast(`操作没有保存到后端：${error.message || error}`, 'error');
}

function validateOrderForm() {
  return validateRequiredFields([
    { id: 'order-date', label: '下单日期', valid: requiredIsoDateValue, message: '下单日期必须是 YYYY-MM-DD 格式' },
    { id: 'order-customer', label: '下单客户（需选择已有客户）', valid: (value) => Boolean(backendCustomerByName(String(value).trim())) },
    { id: 'order-project', label: '项目信息（需选择已有项目）', valid: (value) => Boolean(backendProjectByName(String(value).trim())) },
    { id: 'order-quantity', label: '数量（需大于 0）', valid: (value) => Number(value) > 0 },
    { id: 'order-specification', label: '具体规格', valid: requiredMaxLength(1000), message: '具体规格必填，且不能超过 1000 个字符' },
    { id: 'order-expected-ship-date', label: '期望发货日期', valid: optionalIsoDateValue, message: '期望发货日期必须是 YYYY-MM-DD 格式' },
    { id: 'order-planned-ship-date', label: '计划发货日期', valid: optionalIsoDateValue, message: '计划发货日期必须是 YYYY-MM-DD 格式' },
    { id: 'order-software-version', label: '软件版本号', valid: optionalMaxLength(80), message: '软件版本号不能超过 80 个字符' },
    { id: 'order-unit-price', label: '单价', valid: (value) => String(value).trim() !== '' && Number(value) >= 0 },
  ]);
}

function validateTaskCreateForm(mode) {
  if (mode === 'task') {
    return validatePeopleSelection('task-assignees', '执行者', { required: true })
      && validatePeopleSelection('task-participants', '参与者')
      && validateRequiredFields([
      { id: 'task-title', label: '任务标题', valid: requiredMaxLength(120), message: '任务标题必填，且不能超过 120 个字符' },
      { id: 'task-description', label: '任务描述', valid: optionalMaxLength(3000), message: '任务描述不能超过 3000 个字符' },
      { id: 'task-project', label: '所属项目' },
      { id: 'task-stage', label: '来源阶段' },
      { id: 'task-assignees', label: '执行者', value: collectPeopleInputValue('task-assignees') },
      { id: 'task-expected-completion-at', label: '预期完成时间', valid: requiredIsoDateValue, message: '预期完成时间必须是 YYYY-MM-DD 格式' },
    ]);
  }
  if (mode === 'stage') {
    return validatePeopleSelection('stage-task-assignees', '执行者', { required: true })
      && validatePeopleSelection('stage-task-participants', '参与者')
      && validateRequiredFields([
      { id: 'stage-task-title', label: '任务标题', valid: requiredMaxLength(120), message: '任务标题必填，且不能超过 120 个字符' },
      { id: 'stage-task-description', label: '任务描述', valid: optionalMaxLength(3000), message: '任务描述不能超过 3000 个字符' },
      { id: 'stage-task-assignees', label: '执行者', value: collectPeopleInputValue('stage-task-assignees') },
      { id: 'stage-task-expected-completion-at', label: '预期完成时间', valid: requiredIsoDateValue, message: '预期完成时间必须是 YYYY-MM-DD 格式' },
    ]);
  }
  if (mode === 'blocker') {
    return validateRequiredFields([
      { id: 'blocker-task-title', label: '卡点标题', valid: requiredMaxLength(120), message: '卡点标题必填，且不能超过 120 个字符' },
      { id: 'blocker-task-description', label: '问题描述', valid: requiredMaxLength(3000), message: '问题描述必填，且不能超过 3000 个字符' },
      { id: 'blocker-task-due-date', label: '预期完成时间', valid: requiredIsoDateValue, message: '预期完成时间必须是 YYYY-MM-DD 格式' },
    ]);
  }
  return true;
}

function validateCustomerMasterForm() {
  return validatePeopleSelection('customer-master-sales-owners', '负责销售')
    && validatePeopleSelection('customer-master-support-owners', '负责技术支持')
    && validateRequiredFields([
    { id: 'customer-master-name', label: '客户名称', valid: requiredMaxLength(120), message: '客户名称必填，且不能超过 120 个字符' },
    { id: 'customer-master-short-name', label: '客户简称', valid: optionalMaxLength(60), message: '客户简称不能超过 60 个字符' },
    { id: 'customer-master-region', label: '国家 / 区域', valid: requiredMaxLength(80), message: '国家 / 区域必填，且不能超过 80 个字符' },
    { id: 'customer-master-address', label: '详细地址', valid: optionalMaxLength(255), message: '详细地址不能超过 255 个字符' },
  ]);
}

function validateProjectEditForm() {
  const project = projects.find((item) => item.id === editingProjectId);
  return validateProjectRoleConfiguration()
    && validateStageOwnerSelections('edit', project?.stages?.length || 0)
    && validateRequiredFields([
    { id: 'edit-project-external-name', label: '对外名称', valid: requiredMaxLength(120), message: '对外名称必填，且不能超过 120 个字符' },
    { id: 'edit-project-internal-name', label: '内部名称', valid: requiredMaxLength(120), message: '内部名称必填，且不能超过 120 个字符' },
    { id: 'edit-project-model-name', label: 'Model 名称', valid: requiredMaxLength(120), message: 'Model 名称必填，且不能超过 120 个字符' },
    { id: 'edit-project-manager', label: '项目负责人（需选择已有用户）', valid: (value) => Boolean(userByNameValue(String(value).trim())) },
  ]);
}

function validateWizardStepOne() {
  return validateRequiredFields([
    { id: 'wizard-project-external-name', label: '对外名称', valid: requiredMaxLength(120), message: '对外名称必填，且不能超过 120 个字符' },
    { id: 'wizard-project-internal-name', label: '内部名称', valid: requiredMaxLength(120), message: '内部名称必填，且不能超过 120 个字符' },
    { id: 'wizard-project-model-name', label: 'Model 名称', valid: requiredMaxLength(120), message: 'Model 名称必填，且不能超过 120 个字符' },
    { id: 'wizard-project-manager', label: '项目负责人（需选择已有用户）', valid: (value) => Boolean(userByNameValue(String(value).trim())) },
  ]);
}

function validateWizardStepThree() {
  return validateProjectRoleConfiguration();
}

function validateWizardStepFour() {
  const template = templates[selectedTemplateIndex];
  return validateStageOwnerSelections('wizard', template?.stages?.length || 0);
}

function validateResourceForm(tab, payload) {
  if (tab === 'users') {
    return validateRequiredFields([
      { id: 'resource-user-name', label: '姓名', valid: requiredMaxLength(40), message: '姓名必填，且不能超过 40 个字符' },
      { id: 'resource-user-email', label: '邮箱 / 登录账号', valid: requiredEmailValue, message: '请输入正确的邮箱格式，例如 user@kozenmobile.com' },
    ]);
  }
  if (tab === 'departments') {
    return validateRequiredFields([{ id: 'resource-department-name', label: '部门名称', valid: requiredMaxLength(40), message: '部门名称必填，且不能超过 40 个字符' }]);
  }
  if (tab === 'roles') {
    return validateRequiredFields([{ id: 'resource-role-name', label: '角色名称', valid: requiredMaxLength(40), message: '角色名称必填，且不能超过 40 个字符' }]);
  }
  if (tab === 'customers') {
    return validatePeopleSelection('customer-sales-owners', '负责销售')
      && validatePeopleSelection('customer-support-owners', '负责技术支持')
      && validateRequiredFields([
      { id: 'customer-name', label: '客户名称', valid: requiredMaxLength(120), message: '客户名称必填，且不能超过 120 个字符' },
      { id: 'customer-short-name', label: '客户简称', valid: optionalMaxLength(60), message: '客户简称不能超过 60 个字符' },
      { id: 'customer-region', label: '国家 / 区域', valid: requiredMaxLength(80), message: '国家 / 区域必填，且不能超过 80 个字符' },
      { id: 'customer-address', label: '详细地址', valid: optionalMaxLength(255), message: '详细地址不能超过 255 个字符' },
    ]);
  }
  if (enumTypeForResourceTab(tab)) {
    return validateRequiredFields([{ id: `${{
      'customer-levels': 'customer-level',
      'customer-statuses': 'customer-status-option',
      'order-types': 'order-type',
      'task-statuses': 'task-status',
    }[tab]}-name`, label: '枚举名称', value: payload?.name, valid: requiredMaxLength(80), message: '枚举名称必填，且不能超过 80 个字符' }]);
  }
  return true;
}

let pendingWriteConfirmation = null;

function writeActionKind(action) {
  if (action.includes('delete') || action.includes('void')) return 'delete';
  if (action.includes('toggle')) return 'modify';
  if (action.includes('publish') || action.includes('save') || action.includes('copy') || action === 'wizard-next') return 'submit';
  return 'modify';
}

function writeConfirmClass(kind) {
  return kind === 'delete' ? 'danger-btn' : 'primary-btn';
}

function writeConfirmText(kind) {
  if (kind === 'delete') return '确认删除';
  if (kind === 'modify') return '确认修改';
  return '确认提交';
}

function writeConfirmationConfig(action, actionTarget, overrides = {}) {
  const kind = overrides.kind || writeActionKind(action);
  const defaults = {
    delete: {
      title: '确认删除？',
      message: '该操作会删除后端数据，请确认已经核对无误。',
    },
    modify: {
      title: '确认修改？',
      message: '该操作会修改系统数据，并同步影响相关页面展示。',
    },
    submit: {
      title: '确认提交？',
      message: '该操作会写入系统数据，请确认内容无误后继续。',
    },
  }[kind];

  const config = {
    kind,
    title: defaults.title,
    message: defaults.message,
    confirmText: writeConfirmText(kind),
    confirmClass: writeConfirmClass(kind),
    meta: [],
    ...overrides,
  };

  if (action === 'delete-order') {
    const order = orders[Number(actionTarget.dataset.orderIndex)];
    return { ...config, title: '确认删除订单？', meta: [`订单：${order?.id || '-'}`, `客户：${order?.customerName || '-'}`] };
  }
  if (action === 'save-order') {
    const editing = orderEditIndex !== null ? orders[orderEditIndex] : null;
    return {
      ...config,
      kind: editing ? 'modify' : 'submit',
      title: editing ? '确认保存订单修改？' : '确认提交新订单？',
      confirmText: editing ? '确认修改' : '确认提交',
      meta: editing ? [`订单：${editing.id}`, `客户：${editing.customerName}`] : ['订单：新增'],
    };
  }
  if (action === 'save-customer-order') return { ...config, title: '确认为该客户下单？', meta: ['来源：客户详情'] };
  if (action === 'delete-customer-master') {
    const customer = customers[Number(actionTarget.dataset.customerIndex)];
    return { ...config, title: '确认删除客户？', meta: [`客户：${customer?.name || '-'}`] };
  }
  if (action === 'delete-customer-contact') {
    const customer = selectedCustomer();
    const contact = customer?.contacts?.[Number(actionTarget.dataset.contactIndex)];
    return { ...config, title: '确认删除联系人？', meta: [`客户：${customer?.name || '-'}`, `联系人：${contact?.name || '-'}`] };
  }
  if (action === 'delete-resource') {
    const rows = resourceRowsForTab(selectedResourceTab);
    const resource = rows[Number(actionTarget.dataset.resourceIndex)];
    return { ...config, title: '确认删除资源？', meta: [`类型：${resourceTabTitle(selectedResourceTab)}`, `名称：${resource?.name || resource?.code || '-'}`] };
  }
  if (action === 'delete-template') {
    const template = templates[Number(actionTarget.dataset.templateIndex)];
    return { ...config, title: '确认删除流程模板？', meta: [`模板：${template?.name || '-'}`] };
  }
  if (action === 'delete-task-transition') {
    const transition = taskStatusTransitions[Number(actionTarget.dataset.transitionIndex)];
    return { ...config, title: '确认删除任务状态流转？', meta: [`${transition?.from || '-'} → ${transition?.to || '-'}`] };
  }
  if (action === 'delete-requirement') return { ...config, title: '确认删除需求？', meta: [`需求ID：${actionTarget.dataset.requirementId || '-'}`] };
  if (action === 'void-requirement') return { ...config, title: '确认作废需求？', message: '作废后该需求将不再进入后续实现跟踪。', meta: [`需求ID：${actionTarget.dataset.requirementId || '-'}`] };
  if (action === 'save-task-detail') return { ...config, kind: 'modify', title: '确认保存任务修改？', confirmText: '确认修改', meta: [`任务：${selectedTaskId || '-'}`] };
  if (action === 'save-project-edit') return { ...config, kind: 'modify', title: '确认保存项目修改？', confirmText: '确认修改', meta: [`项目：${projects.find((item) => item.id === editingProjectId)?.externalName || '-'}`] };
  if (action === 'save-project-members-modal') return { ...config, kind: 'modify', title: '确认修改项目成员？', confirmText: '确认修改' };
  if (action === 'save-resource') return {
    ...config,
    kind: resourceEditIndex === null ? 'submit' : 'modify',
    title: resourceEditIndex === null ? '确认新增资源？' : '确认保存资源修改？',
    confirmText: resourceEditIndex === null ? '确认提交' : '确认修改',
    meta: [`类型：${resourceTabTitle(selectedResourceTab)}`],
  };
  if (action === 'wizard-next') return { ...config, title: '确认创建项目？', meta: [`项目：${projectWizardDraft?.externalName || '新项目'}`] };
  if (action === 'toggle-user-status') return { ...config, kind: 'modify', title: '确认修改用户状态？', confirmText: '确认修改' };
  if (action === 'reset-user-password') return { ...config, kind: 'modify', title: '确认重置用户密码？', message: '该用户密码会被重置为系统默认密码，请确认后继续。', confirmText: '确认重置' };
  if (action.includes('toggle-') && action.includes('option')) return { ...config, kind: 'modify', title: '确认修改枚举状态？', confirmText: '确认修改' };
  if (action === 'save-task' || action === 'save-stage-task' || action === 'save-blocker-help-task') return { ...config, title: '确认提交任务？' };
  if (action === 'publish-task-comment') return { ...config, title: '确认提交任务评论？' };
  if (action === 'publish-stage-message') return { ...config, title: '确认提交阶段留言？' };
  if (action === 'save-customer-followup') return { ...config, title: '确认提交客户跟进记录？' };
  if (action === 'save-requirement') return { ...config, title: '确认提交客户需求？' };
  if (action === 'save-template') return { ...config, title: templateEditIndex === null ? '确认提交流程模板？' : '确认保存流程模板修改？' };
  if (action === 'toggle-template-status') return { ...config, kind: 'modify', title: '确认修改模板状态？', confirmText: '确认修改' };
  if (action === 'save-task-transition') return { ...config, title: '确认提交任务状态流转？' };
  return config;
}

function renderWriteConfirmation(config) {
  return `
    <div id="write-confirmation-backdrop" class="modal-backdrop write-confirmation-backdrop">
      <section class="modal-card form-modal narrow">
        <div class="confirm-dialog">
          <div class="section-intro">
            <h3>${config.title}</h3>
            <p>${config.message}</p>
          </div>
          ${config.meta?.length ? `<div class="confirm-meta">${config.meta.map((item) => `<span>${item}</span>`).join('')}</div>` : ''}
          <div class="customer-form-actions">
            <button class="muted-btn" data-write-confirm="cancel">取消</button>
            <button class="${config.confirmClass || writeConfirmClass(config.kind)}" data-write-confirm="confirm">${config.confirmText || writeConfirmText(config.kind)}</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function closeWriteConfirmation(confirmed) {
  const pending = pendingWriteConfirmation;
  pendingWriteConfirmation = null;
  document.getElementById('write-confirmation-backdrop')?.remove();
  if (!confirmed && pending?.onCancel) pending.onCancel();
  pending?.resolve(Boolean(confirmed));
}

function confirmWriteOperation(config) {
  if (pendingWriteConfirmation) closeWriteConfirmation(false);
  return new Promise((resolve) => {
    pendingWriteConfirmation = { resolve, onCancel: config.onCancel };
    document.getElementById('write-confirmation-backdrop')?.remove();
    document.body.insertAdjacentHTML('beforeend', renderWriteConfirmation(config));
  });
}

function preflightWriteAction(action, actionTarget) {
  if (action === 'save-order' || action === 'save-customer-order') {
    if (!validateOrderForm()) return false;
    if (action === 'save-order' && orderEditIndex !== null) {
      const nextOrder = collectOrderFormValue();
      const currentOrder = orders[orderEditIndex];
      const changedFields = Object.entries(nextOrder).filter(([field, value]) => currentOrder[field] !== value);
      if (!changedFields.length) {
        showToast('没有检测到订单内容变化，请修改后再保存。', 'warning');
        return false;
      }
      return validateRequiredFields([{ id: 'order-change-reason', label: '修改原因', value: document.getElementById('order-change-reason').value.trim() }]);
    }
    return true;
  }
  if (action === 'save-task') return validateTaskCreateForm('task');
  if (action === 'save-stage-task') return validateTaskCreateForm('stage');
  if (action === 'save-blocker-help-task') return validateTaskCreateForm('blocker');
  if (action === 'save-customer-master') return validateCustomerMasterForm();
  if (action === 'save-project-edit') return validateProjectEditForm();
  if (action === 'save-resource') {
    const rows = resourceRowsForTab(selectedResourceTab);
    const previousItem = resourceEditIndex === null ? null : rows[resourceEditIndex];
    return validateResourceForm(selectedResourceTab, collectResourcePayload(selectedResourceTab, previousItem || {}));
  }
  if (action === 'save-customer-contact') return validateCustomerContactForm();
  if (action === 'save-customer-followup') return validateTextOrFiles('customer-followup-text', 'customer-followup-files', '跟进记录内容或附件');
  if (action === 'publish-task-comment') return validateTextOrFiles('task-comment-text', 'task-comment-files', '评论内容或附件');
  if (action === 'save-project-customer') return validateRequiredFields([
    { id: 'project-customer-name', label: '客户（需选择已有客户）', valid: (value) => Boolean(backendCustomerByName(String(value).trim())) },
  ]);
  if (action === 'publish-stage-message') return validateTextOrFiles('stage-message-text', 'stage-message-files', '阶段留言内容或附件');
  if (action === 'save-requirement') return validateRequiredFields([
    { id: 'requirement-title', label: '需求标题', valid: requiredMaxLength(120), message: '需求标题必填，且不能超过 120 个字符' },
    { id: 'requirement-user-story', label: '用户故事', valid: requiredMaxLength(1500), message: '用户故事必填，且不能超过 1500 个字符' },
    { id: 'requirement-value', label: '业务价值', valid: requiredMaxLength(1000), message: '业务价值必填，且不能超过 1000 个字符' },
    { id: 'requirement-acceptance', label: '验收标准', valid: requiredMaxLength(1500), message: '验收标准必填，且不能超过 1500 个字符' },
  ]);
  if (action === 'save-template') {
    captureTemplateFormDraft();
    const stages = templateDraftStages.map((stage) => stage.trim()).filter(Boolean);
    return validateRequiredFields([
      { id: 'template-name', label: '模板名称', value: templateDraftMeta.name.trim() },
      { id: 'template-scope', label: '适用范围', value: templateDraftMeta.scope.trim() },
      { selector: '[data-template-stage-name]', label: '至少一个阶段名称', value: stages },
    ]);
  }
  if (action === 'save-task-transition') {
    const from = document.getElementById('task-transition-from').value;
    const to = document.getElementById('task-transition-to').value;
    if (!validateRequiredFields([
      { id: 'task-transition-from', label: '起始状态', value: from },
      { id: 'task-transition-to', label: '目标状态', value: to },
    ])) return false;
    if (from === to) {
      showToast('任务状态流转的起始状态和目标状态不能相同。', 'warning');
      return false;
    }
  }
  return true;
}

async function runConfirmedWriteAction(action, actionTarget) {
  if (!preflightWriteAction(action, actionTarget)) return;
  const confirmed = await confirmWriteOperation(writeConfirmationConfig(action, actionTarget));
  if (!confirmed) return;
  await handleRealApiClick(action, actionTarget);
}

async function saveOrderViaApi() {
  if (!validateOrderForm()) return;
  const nextOrder = collectOrderFormValue();
  if (orderEditIndex === null) {
    const created = await kpmApi.post('/api/orders', backendOrderPayload(nextOrder));
    selectedOrderId = created.id;
  } else {
    const currentOrder = orders[orderEditIndex];
    const reason = document.getElementById('order-change-reason').value.trim();
    const changedFields = Object.entries(nextOrder)
      .filter(([field, value]) => currentOrder[field] !== value)
      .map(([field, value]) => `${orderFieldLabel(field)}：${currentOrder[field]} → ${value}`);
    if (!changedFields.length) {
      showToast('没有检测到订单内容变化，请修改后再保存。', 'warning');
      return;
    }
    if (!validateRequiredFields([{ id: 'order-change-reason', label: '修改原因', value: reason }])) return;
    await kpmApi.put(`/api/orders/${currentOrder.id}`, backendOrderPayload(nextOrder, {
      modifier: currentUser,
      changeReason: reason,
      changeSummary: changedFields.join('；'),
    }));
  }
  orderFormOpen = false;
  orderEditIndex = null;
  await refreshBusinessDataAfterWrite('order-save');
}

async function saveCustomerMasterViaApi() {
  const previousCustomer = customerEditIndex === null ? null : customers[customerEditIndex];
  const payload = collectCustomerMasterPayload(previousCustomer || {});
  if (!validateCustomerMasterForm()) return;
  const saved = customerEditIndex === null
    ? await kpmApi.post('/api/customers', payload)
    : await kpmApi.put(`/api/customers/${previousCustomer.id}`, payload);
  selectedCustomerName = saved.name || payload.name;
  customerFormOpen = false;
  customerEditIndex = null;
  await refreshBusinessDataAfterWrite('customer-save');
}

async function saveTaskViaApi(mode) {
  if (!validateTaskCreateForm(mode)) return;
  let payload;
  if (mode === 'task') {
    const title = document.getElementById('task-title').value.trim();
    const expectedCompletionAt = document.getElementById('task-expected-completion-at').value.trim() || null;
    payload = backendTaskPayload({}, {
      title,
      description: document.getElementById('task-description').value.trim(),
      project: document.getElementById('task-project').value,
      stage: document.getElementById('task-stage').value,
      category: document.getElementById('task-category').value,
      status: activeTaskStatusNames()[0],
      priority: document.getElementById('task-priority').value,
      creator: currentUser,
      assignees: collectPeopleInputValue('task-assignees'),
      participants: collectPeopleInputValue('task-participants'),
      expectedCompletionAt,
      dueDate: expectedCompletionAt,
      source: taskFormState.source,
    });
  }
  if (mode === 'stage') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const stage = project.stages[selectedStageIndex];
    const title = document.getElementById('stage-task-title').value.trim();
    const expectedCompletionAt = document.getElementById('stage-task-expected-completion-at').value.trim() || null;
    payload = backendTaskPayload({}, {
      title,
      description: document.getElementById('stage-task-description').value.trim(),
      projectId: project.id,
      stageId: stage.id,
      project: project.externalName,
      stage: stage.name,
      category: document.getElementById('stage-task-category').value,
      status: activeTaskStatusNames()[0],
      priority: document.getElementById('stage-task-priority').value,
      creator: currentUser,
      assignees: collectPeopleInputValue('stage-task-assignees'),
      participants: collectPeopleInputValue('stage-task-participants'),
      expectedCompletionAt,
      dueDate: expectedCompletionAt,
      source: '阶段详情',
    });
  }
  if (mode === 'blocker') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const stage = project.stages[selectedStageIndex];
    const title = document.getElementById('blocker-task-title').value.trim();
    const description = document.getElementById('blocker-task-description').value.trim();
    const expectedCompletionAt = document.getElementById('blocker-task-due-date').value.trim() || null;
    payload = backendTaskPayload({}, {
      title,
      description,
      projectId: project.id,
      stageId: stage.id,
      project: project.externalName,
      stage: stage.name,
      category: document.getElementById('blocker-task-category').value,
      status: activeTaskStatusNames()[0],
      priority: document.getElementById('blocker-task-priority').value,
      creator: currentUser,
      assignees: stageResponsibleUserNames(stage).length ? stageResponsibleUserNames(stage) : [stagePrimaryOwner(stage)],
      participants: [projectManagerName(project)],
      expectedCompletionAt,
      dueDate: expectedCompletionAt,
      source: '卡点求助',
      blocked: true,
    });
  }
  const created = await kpmApi.post('/api/tasks', payload);
  selectedTaskId = created.id;
  taskFormOpen = false;
  stageTaskFormOpen = false;
  blockerHelpFormOpen = false;
  resetTaskFormState();
  await refreshBusinessDataAfterWrite(`task-${mode}-save`);
}

async function saveTaskDetailViaApi() {
  const task = tasks.find((item) => item.id === selectedTaskId);
  if (!task) return;
  if (!validatePeopleSelection('task-detail-assignees', '执行者', { required: true })
    || !validatePeopleSelection('task-detail-participants', '参与者')) return;
  const expectedCompletionAt = document.getElementById('task-detail-expected-completion-at').value.trim() || null;
  await kpmApi.put(`/api/tasks/${task.id}`, backendTaskPayload(task, {
    description: document.getElementById('task-detail-description').value.trim(),
    priority: document.getElementById('task-detail-priority').value,
    assignees: collectPeopleInputValue('task-detail-assignees'),
    participants: collectPeopleInputValue('task-detail-participants'),
    expectedCompletionAt,
    dueDate: expectedCompletionAt,
  }));
  await refreshBusinessDataAfterWrite('task-detail-save');
}

async function saveProjectEditViaApi() {
  const project = projects.find((item) => item.id === editingProjectId);
  if (!project) return;
  if (!validateProjectEditForm()) return;
  const managerAccount = collectUserAccountInputValue('edit-project-manager', project.managerAccount);
  const draft = {
    ...project,
    externalName: document.getElementById('edit-project-external-name').value.trim() || project.externalName,
    internalName: document.getElementById('edit-project-internal-name').value.trim() || project.internalName,
    modelName: document.getElementById('edit-project-model-name').value.trim() || project.modelName,
    managerAccount,
    salesability: document.getElementById('edit-project-salesability').value,
    description: document.getElementById('edit-project-description').value.trim() || project.description,
    members: ensureManagerMembership(collectProjectMembers('[data-edit-member-user]', 'data-edit-member-role'), managerAccount),
    stages: project.stages.map((stage, index) => ({ ...stage, assignees: collectStageAssignees('edit', index) })),
  };
  draft.unsellableReason = draft.salesability === '可销售' ? '' : document.getElementById('edit-project-unsellable-reason')?.value || unsellableReasonOptions[0];
  await kpmApi.put(`/api/projects/${project.id}`, backendProjectPayloadFromProject(draft));
  selectedProjectId = project.id;
  projectEditModalOpen = false;
  editingProjectId = null;
  await refreshBusinessDataAfterWrite('project-save');
}

async function saveResourceViaApi() {
  const rows = resourceRowsForTab(selectedResourceTab);
  const previousItem = resourceEditIndex === null ? null : rows[resourceEditIndex];
  const payload = collectResourcePayload(selectedResourceTab, previousItem || {});
  if (!payload || !validateResourceForm(selectedResourceTab, payload)) return;
  const enumType = enumTypeForResourceTab(selectedResourceTab);
  if (enumType) {
    if (resourceEditIndex === null) await kpmApi.post('/api/resources/enums', payload);
    else await kpmApi.put(`/api/resources/enums/${previousItem.id}`, payload);
  } else {
    const endpoint = resourceEndpointForTab(selectedResourceTab);
    if (!endpoint) return;
    if (resourceEditIndex === null) await kpmApi.post(endpoint, payload);
    else await kpmApi.put(`${endpoint}/${previousItem.id}`, payload);
  }
  resourceFormOpen = false;
  resourceEditIndex = null;
  permissionPickerDrafts = {};
  await refreshBusinessDataAfterWrite(`resource-${selectedResourceTab}-save`);
}

async function deleteResourceViaApi(actionTarget) {
  const rows = resourceRowsForTab(selectedResourceTab);
  const resource = rows[Number(actionTarget.dataset.resourceIndex)];
  if (!resource) return;
  const enumType = enumTypeForResourceTab(selectedResourceTab);
  if (enumType) {
    if (!resource.id) throw new Error('该枚举来自本地兜底数据，暂时不能删除');
    await kpmApi.delete(`/api/resources/enums/${resource.id}`);
  } else {
    const endpoint = resourceEndpointForTab(selectedResourceTab);
    if (!endpoint || !resource.id) return;
    await kpmApi.delete(`${endpoint}/${resource.id}`);
  }
  resourceFormOpen = false;
  resourceEditIndex = null;
  await refreshBusinessDataAfterWrite(`resource-${selectedResourceTab}-delete`);
}

async function toggleEnumViaApi(resource, active) {
  if (!resource?.id) throw new Error('该枚举来自本地兜底数据，暂时不能修改');
  await kpmApi.put(`/api/resources/enums/${resource.id}`, {
    name: resource.name,
    value: resource.value || resource.name,
    semantic: resource.semantic,
    active,
    sortOrder: resource.sortOrder || 100,
  });
  await refreshBusinessDataAfterWrite('enum-toggle');
}

async function handleRealApiClick(action, actionTarget) {
  if (action === 'save-order') return saveOrderViaApi();
  if (action === 'delete-order') {
    const order = orders[Number(actionTarget.dataset.orderIndex)];
    if (order?.id) await kpmApi.delete(`/api/orders/${order.id}`);
    orderFormOpen = false; orderEditIndex = null;
    return refreshBusinessDataAfterWrite('order-delete');
  }
  if (action === 'save-customer-order') {
    if (!validateOrderForm()) return;
    const created = await kpmApi.post('/api/orders', backendOrderPayload(collectOrderFormValue()));
    selectedOrderId = created.id;
    customerOrderFormOpen = false;
    return refreshBusinessDataAfterWrite('customer-order-save');
  }
  if (action === 'save-customer-master') return saveCustomerMasterViaApi();
  if (action === 'delete-customer-master') {
    const customer = customers[Number(actionTarget.dataset.customerIndex)];
    if (!customer || !canDeleteCustomer(customer)) return;
    await kpmApi.delete(`/api/customers/${customer.id}`);
    customerFormOpen = false; customerEditIndex = null;
    selectedCustomerName = customers.find((item) => item.id !== customer.id)?.name || '';
    return refreshBusinessDataAfterWrite('customer-delete');
  }
  if (action === 'save-customer-contact') {
    const customer = selectedCustomer();
    const name = document.getElementById('customer-contact-name').value.trim();
    if (!customer) return;
    if (!validateCustomerContactForm()) return;
    await kpmApi.post(`/api/customers/${customer.id}/contacts`, {
      name,
      title: document.getElementById('customer-contact-title').value.trim(),
      phone: document.getElementById('customer-contact-phone').value.trim(),
      email: document.getElementById('customer-contact-email').value.trim(),
      remark: document.getElementById('customer-contact-remark').value.trim(),
    });
    customerContactFormOpen = false;
    return refreshBusinessDataAfterWrite('customer-contact-save');
  }
  if (action === 'delete-customer-contact') {
    const customer = selectedCustomer();
    const contact = customer?.contacts?.[Number(actionTarget.dataset.contactIndex)];
    if (!customer || !contact?.id) return;
    await kpmApi.delete(`/api/customers/${customer.id}/contacts/${contact.id}`);
    if (readableContentModal?.type === 'customer-contact-detail') readableContentModal = null;
    return refreshBusinessDataAfterWrite('customer-contact-delete');
  }
  if (action === 'save-customer-followup') {
    const customer = selectedCustomer();
    const text = document.getElementById('customer-followup-text').value.trim();
    const files = [...document.getElementById('customer-followup-files').files];
    if (!customer) return;
    if (!validateTextOrFiles('customer-followup-text', 'customer-followup-files', '跟进记录内容或附件')) return;
    const attachments = await uploadFilesToOss(files, 'customer-followup-attachments', customer.id);
    await kpmApi.post(`/api/customers/${customer.id}/followups`, {
      author: currentUser,
      content: text || '补充客户跟进附件',
      attachments,
    });
    customerFollowupFormOpen = false;
    return refreshBusinessDataAfterWrite('customer-followup-save');
  }
  if (action === 'save-task') return saveTaskViaApi('task');
  if (action === 'save-stage-task') return saveTaskViaApi('stage');
  if (action === 'save-blocker-help-task') return saveTaskViaApi('blocker');
  if (action === 'save-task-detail') return saveTaskDetailViaApi();
  if (action === 'publish-task-comment') {
    const task = tasks.find((item) => item.id === selectedTaskId);
    const text = document.getElementById('task-comment-text').value.trim();
    const files = [...document.getElementById('task-comment-files').files];
    if (!task) return;
    if (!validateTextOrFiles('task-comment-text', 'task-comment-files', '评论内容或附件')) return;
    const attachments = await uploadFilesToOss(files, 'task-comment-attachments', task.id);
    await kpmApi.post(`/api/tasks/${task.id}/comments`, {
      author: currentUser,
      content: text || '补充任务附件',
      attachments,
    });
    return refreshBusinessDataAfterWrite('task-comment-save');
  }
  if (action === 'save-project-members-modal') {
    const project = projects.find((item) => item.id === selectedProjectId);
    if (!project) return;
    if (!validateProjectRoleConfiguration()) return;
    const members = ensureManagerMembership(collectProjectMembers('[data-member-modal-user]', 'data-member-modal-role'), project.managerAccount);
    await kpmApi.put(`/api/projects/${project.id}/members`, { managerAccount: project.managerAccount, members });
    memberModalOpen = false;
    return refreshBusinessDataAfterWrite('project-members-save');
  }
  if (action === 'save-project-edit') return saveProjectEditViaApi();
  if (action === 'wizard-next' && wizardStep === 4) {
    if (!validateWizardStepFour()) return;
    captureWizardStepFour();
    const created = await kpmApi.post('/api/projects', backendProjectPayloadFromWizard());
    selectedProjectId = created.id;
    projectWizardDraft = null;
    wizardStep = 1;
    await refreshBusinessDataAfterWrite('project-create');
    projectDetailReturnView = 'projects';
    showView('project-detail');
    return;
  }
  if (action === 'save-project-customer') {
    const customerNameValue = document.getElementById('project-customer-name').value;
    if (!validateRequiredFields([
      { id: 'project-customer-name', label: '客户（需选择已有客户）', valid: (value) => Boolean(backendCustomerByName(String(value).trim())) },
    ])) return;
    const customer = backendCustomerByName(customerNameValue);
    const project = projects.find((item) => item.id === selectedProjectId);
    if (!customer || !project) return;
    await kpmApi.post(`/api/projects/${project.id}/customers`, {
      customerId: customer.id,
      projectStatus: document.getElementById('project-customer-status').value,
    });
    projectCustomerFormOpen = false;
    return refreshBusinessDataAfterWrite('project-customer-save');
  }
  if (action === 'publish-stage-message') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const stage = project?.stages[selectedStageIndex];
    const textValue = document.getElementById('stage-message-text').value.trim();
    const files = [...document.getElementById('stage-message-files').files];
    if (!stage) return;
    if (!validateTextOrFiles('stage-message-text', 'stage-message-files', '阶段留言内容或附件')) return;
    const attachments = await uploadFilesToOss(files, 'stage-record-attachments', fileBusinessId(project?.id, stage?.id));
    await kpmApi.post(`/api/projects/stages/${stage.id}/records`, {
      author: currentUser,
      content: textValue || '补充阶段附件',
      attachments,
    });
    return refreshBusinessDataAfterWrite('stage-record-save');
  }
  if (action === 'save-requirement') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const customer = project?.projectCustomers[selectedCustomerIndex];
    const title = document.getElementById('requirement-title').value.trim();
    const userStory = document.getElementById('requirement-user-story').value.trim();
    const value = document.getElementById('requirement-value').value.trim();
    const acceptance = document.getElementById('requirement-acceptance').value.trim();
    if (!project || !customer) return;
    if (!validateRequiredFields([
      { id: 'requirement-title', label: '需求标题', value: title, valid: requiredMaxLength(120), message: '需求标题必填，且不能超过 120 个字符' },
      { id: 'requirement-user-story', label: '用户故事', value: userStory, valid: requiredMaxLength(1500), message: '用户故事必填，且不能超过 1500 个字符' },
      { id: 'requirement-value', label: '业务价值', value, valid: requiredMaxLength(1000), message: '业务价值必填，且不能超过 1000 个字符' },
      { id: 'requirement-acceptance', label: '验收标准', value: acceptance, valid: requiredMaxLength(1500), message: '验收标准必填，且不能超过 1500 个字符' },
    ])) return;
    await kpmApi.post(`/api/projects/${project.id}/customers/${customer.customerId}/requirements`, {
      title,
      userStory,
      businessValue: value,
      acceptance,
      priority: document.getElementById('requirement-priority').value,
      status: document.getElementById('requirement-create-task').checked ? '实现中' : '待评估',
      proposer: customer.customerName,
      creator: currentUser,
      createTask: document.getElementById('requirement-create-task').checked,
      expectedCompletionAt: '2026-05-30',
    });
    requirementFormOpen = false;
    return refreshBusinessDataAfterWrite('requirement-save');
  }
  if (action === 'void-requirement') {
    await kpmApi.post(`/api/projects/requirements/${actionTarget.dataset.requirementId}/void`);
    return refreshBusinessDataAfterWrite('requirement-void');
  }
  if (action === 'delete-requirement') {
    await kpmApi.delete(`/api/projects/requirements/${actionTarget.dataset.requirementId}`);
    return refreshBusinessDataAfterWrite('requirement-delete');
  }
  if (action === 'save-template') {
    captureTemplateFormDraft();
    const payload = {
      name: templateDraftMeta.name.trim(),
      scope: templateDraftMeta.scope.trim(),
      status: templateDraftMeta.status,
      stages: templateDraftStages.map((stage) => stage.trim()).filter(Boolean),
    };
    if (!validateRequiredFields([
      { id: 'template-name', label: '模板名称', value: payload.name },
      { id: 'template-scope', label: '适用范围', value: payload.scope },
      { selector: '[data-template-stage-name]', label: '至少一个阶段名称', value: payload.stages },
    ])) return;
    if (templateEditIndex === null) await kpmApi.post('/api/projects/templates', payload);
    else await kpmApi.put(`/api/projects/templates/${templates[templateEditIndex].id}`, payload);
    templateFormOpen = false; templateEditIndex = null; templateDraftStages = [];
    return refreshBusinessDataAfterWrite('template-save');
  }
  if (action === 'delete-template') {
    const template = templates[Number(actionTarget.dataset.templateIndex)];
    if (!template || template.status === '启用') return;
    await kpmApi.delete(`/api/projects/templates/${template.id}`);
    return refreshBusinessDataAfterWrite('template-delete');
  }
  if (action === 'toggle-template-status') {
    const template = templates[Number(actionTarget.dataset.templateIndex)];
    if (!template || (template.status === '启用' && enabledTemplateEntries().length <= 1)) return;
    await kpmApi.put(`/api/projects/templates/${template.id}`, {
      name: template.name,
      scope: template.scope,
      status: template.status === '启用' ? '停用' : '启用',
      stages: [...template.stages],
    });
    return refreshBusinessDataAfterWrite('template-toggle');
  }
  if (action === 'save-task-transition') {
    const from = document.getElementById('task-transition-from').value;
    const to = document.getElementById('task-transition-to').value;
    if (!validateRequiredFields([
      { id: 'task-transition-from', label: '起始状态', value: from },
      { id: 'task-transition-to', label: '目标状态', value: to },
    ])) return;
    if (from === to) {
      showToast('任务状态流转的起始状态和目标状态不能相同。', 'warning');
      return;
    }
    await kpmApi.post('/api/resources/task-status-transitions', { fromStatus: from, toStatus: to });
    taskTransitionFormOpen = false;
    return refreshBusinessDataAfterWrite('task-transition-save');
  }
  if (action === 'delete-task-transition') {
    const transition = taskStatusTransitions[Number(actionTarget.dataset.transitionIndex)];
    if (!transition?.id) return;
    await kpmApi.delete(`/api/resources/task-status-transitions/${transition.id}`);
    return refreshBusinessDataAfterWrite('task-transition-delete');
  }
  if (action === 'save-resource') return saveResourceViaApi();
  if (action === 'delete-resource') return deleteResourceViaApi(actionTarget);
  if (action === 'toggle-user-status') {
    const user = resourceData.users[Number(actionTarget.dataset.resourceIndex)];
    if (!user) return;
    await kpmApi.put(`/api/resources/users/${user.id}`, { ...user, status: user.status === '启用' ? '停用' : '启用' });
    return refreshBusinessDataAfterWrite('user-toggle');
  }
  if (action === 'reset-user-password') {
    const user = resourceData.users[Number(actionTarget.dataset.resourceIndex)];
    if (!user) return;
    const result = await kpmApi.post(`/api/resources/users/${user.id}/reset-password`, {});
    showToast(`${user.name} 的密码已重置为默认密码：${result.defaultPassword || '123456'}`, 'success');
    return refreshBusinessDataAfterWrite('user-password-reset');
  }
  if (action === 'toggle-customer-status-option') return toggleEnumViaApi(customerProjectStatusOptions[Number(actionTarget.dataset.statusOptionIndex)], !customerProjectStatusOptions[Number(actionTarget.dataset.statusOptionIndex)]?.active);
  if (action === 'toggle-customer-level-option') return toggleEnumViaApi(customerLevelOptions[Number(actionTarget.dataset.levelOptionIndex)], !customerLevelOptions[Number(actionTarget.dataset.levelOptionIndex)]?.active);
  if (action === 'toggle-order-type-option') return toggleEnumViaApi(orderTypeOptions[Number(actionTarget.dataset.orderTypeIndex)], !orderTypeOptions[Number(actionTarget.dataset.orderTypeIndex)]?.active);
  if (action === 'toggle-task-status-option') return toggleEnumViaApi(taskStatusOptions[Number(actionTarget.dataset.statusOptionIndex)], !taskStatusOptions[Number(actionTarget.dataset.statusOptionIndex)]?.active);
}

const realApiClickActions = new Set([
  'save-order', 'delete-order', 'save-customer-order', 'save-customer-master', 'delete-customer-master',
  'save-customer-contact', 'delete-customer-contact', 'save-customer-followup', 'save-task', 'save-stage-task', 'save-blocker-help-task',
  'save-task-detail', 'publish-task-comment', 'save-project-members-modal', 'save-project-edit', 'save-project-customer',
  'publish-stage-message', 'save-requirement', 'void-requirement', 'delete-requirement', 'save-template', 'delete-template',
  'toggle-template-status', 'save-task-transition', 'delete-task-transition',
  'save-resource', 'delete-resource', 'toggle-user-status', 'reset-user-password',
  'toggle-customer-status-option', 'toggle-customer-level-option', 'toggle-order-type-option', 'toggle-task-status-option'
]);

document.addEventListener('input', (event) => {
  if (event.target.matches?.('input, textarea')) clearSingleValidationMark(event.target);
});

document.addEventListener('change', (event) => {
  if (event.target.matches?.('input, select, textarea')) clearSingleValidationMark(event.target);
});

document.addEventListener('click', async (event) => {
  const writeConfirmTarget = event.target.closest('[data-write-confirm]');
  if (writeConfirmTarget) {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeWriteConfirmation(writeConfirmTarget.dataset.writeConfirm === 'confirm');
    return;
  }

  const actionTarget = event.target.closest('[data-action]');
  const action = actionTarget?.dataset.action;
  if (!(realApiClickActions.has(action) || (action === 'wizard-next' && wizardStep === 4))) return;
  const permissionKey = actionPermissionMap[action];
  if (permissionKey && !currentUserCan(permissionKey)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    showToast('当前账号没有该操作权限。', 'warning');
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  try {
    await runConfirmedWriteAction(action, actionTarget);
  } catch (error) {
    reportBackendWriteError(action, error);
  }
}, true);

document.addEventListener('change', async (event) => {
  const stageSelect = event.target.closest('[data-stage-index]');
  const projectCustomerSelect = event.target.closest('[data-project-customer-index]');
  const handled = stageSelect || projectCustomerSelect || ['stage-file-input', 'task-file-input', 'customer-material-input', 'task-detail-status'].includes(event.target.id);
  if (!handled) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  try {
    if (stageSelect) {
      const project = projects.find((item) => item.id === selectedProjectId);
      const stage = project?.stages[Number(stageSelect.dataset.stageIndex)];
      const previousStatus = stage?.status || '';
      const nextStatus = stageSelect.value;
      const confirmed = await confirmWriteOperation(writeConfirmationConfig('stage-status-change', stageSelect, {
        kind: 'modify',
        title: '确认修改阶段状态？',
        message: '阶段状态会影响项目整体状态和协作视图，请确认后继续。',
        meta: [`阶段：${stage?.name || '-'}`, `状态：${previousStatus || '-'} → ${nextStatus || '-'}`],
        onCancel: () => { stageSelect.value = previousStatus; },
      }));
      if (!confirmed) return;
      if (stage?.id) await kpmApi.put(`/api/projects/stages/${stage.id}`, { status: stageSelect.value });
      await refreshBusinessDataAfterWrite('stage-status-change');
      return;
    }
    if (projectCustomerSelect) {
      const project = projects.find((item) => item.id === selectedProjectId);
      const relation = project?.projectCustomers[Number(projectCustomerSelect.dataset.projectCustomerIndex)];
      const previousStatus = relation?.projectStatus || '';
      const nextStatus = projectCustomerSelect.value;
      const confirmed = await confirmWriteOperation(writeConfirmationConfig('project-customer-status-change', projectCustomerSelect, {
        kind: 'modify',
        title: '确认修改客户项目状态？',
        message: '该状态用于判断客户活跃在哪个项目阶段，请确认后继续。',
        meta: [`客户：${relation?.customerName || '-'}`, `状态：${previousStatus || '-'} → ${nextStatus || '-'}`],
        onCancel: () => { projectCustomerSelect.value = previousStatus; },
      }));
      if (!confirmed) return;
      if (project?.id && relation?.customerId) {
        await kpmApi.put(`/api/projects/${project.id}/customers/${relation.customerId}`, { projectStatus: projectCustomerSelect.value });
      }
      await refreshBusinessDataAfterWrite('project-customer-status-change');
      return;
    }
    if (event.target.id === 'stage-file-input') {
      const project = projects.find((item) => item.id === selectedProjectId);
      const stage = project?.stages[selectedStageIndex];
      const files = [...event.target.files];
      if (!files.length) return;
      const confirmed = await confirmWriteOperation(writeConfirmationConfig('stage-file-upload', event.target, {
        kind: 'submit',
        title: '确认上传阶段资料？',
        message: '上传后，能查看该阶段详情的人都可以查看或下载这些资料。',
        meta: [`阶段：${stage?.name || '-'}`, `文件数：${files.length}`],
        onCancel: () => { event.target.value = ''; },
      }));
      if (!confirmed) return;
      for (const file of files) {
        const [uploaded] = await uploadFilesToOss([file], 'project-stage-materials', fileBusinessId(project?.id, stage?.id));
        await kpmApi.post(`/api/projects/stages/${stage.id}/materials`, {
          ...uploaded,
          fileName: uploaded.fileName,
          fileType: uploaded.fileType,
          fileSize: uploaded.fileSize,
        });
      }
      await refreshBusinessDataAfterWrite('stage-file-upload');
      return;
    }
    if (event.target.id === 'task-file-input') {
      const task = tasks.find((item) => item.id === selectedTaskId);
      const files = [...event.target.files];
      if (!files.length) return;
      const confirmed = await confirmWriteOperation(writeConfirmationConfig('task-file-upload', event.target, {
        kind: 'submit',
        title: '确认上传任务附件？',
        message: '附件会被保存到当前任务详情中，供任务参与者查看。',
        meta: [`任务：${task?.id || '-'}`, `文件数：${files.length}`],
        onCancel: () => { event.target.value = ''; },
      }));
      if (!confirmed) return;
      for (const file of files) {
        const [uploaded] = await uploadFilesToOss([file], 'task-attachments', task?.id);
        await kpmApi.post(`/api/tasks/${task.id}/attachments`, {
          ...uploaded,
          fileName: uploaded.fileName,
          fileType: uploaded.fileType,
          fileSize: uploaded.fileSize,
        });
      }
      await refreshBusinessDataAfterWrite('task-file-upload');
      return;
    }
    if (event.target.id === 'customer-material-input') {
      const customer = selectedCustomer();
      const files = [...event.target.files];
      if (!files.length) return;
      const confirmed = await confirmWriteOperation(writeConfirmationConfig('customer-file-upload', event.target, {
        kind: 'submit',
        title: '确认上传客户资料？',
        message: '资料会进入客户详情资料库，请确认文件选择无误。',
        meta: [`客户：${customer?.name || '-'}`, `文件数：${files.length}`],
        onCancel: () => { event.target.value = ''; },
      }));
      if (!confirmed) return;
      for (const file of files) {
        const [uploaded] = await uploadFilesToOss([file], 'customer-materials', customer?.id);
        await kpmApi.post(`/api/customers/${customer.id}/materials`, {
          ...uploaded,
          fileName: uploaded.fileName,
          fileType: uploaded.fileType,
          fileSize: uploaded.fileSize,
        });
      }
      await refreshBusinessDataAfterWrite('customer-file-upload');
      return;
    }
    if (event.target.id === 'task-detail-status') {
      const task = tasks.find((item) => item.id === selectedTaskId);
      const previousStatus = task?.status || '';
      const nextStatus = event.target.value;
      const confirmed = await confirmWriteOperation(writeConfirmationConfig('task-status-change', event.target, {
        kind: 'modify',
        title: '确认修改任务状态？',
        message: '任务状态可能会联动关联需求的实现或拒绝状态，请确认后继续。',
        meta: [`任务：${task?.id || '-'}`, `状态：${previousStatus || '-'} → ${nextStatus || '-'}`],
        onCancel: () => { event.target.value = previousStatus; },
      }));
      if (!confirmed) return;
      if (task) await kpmApi.put(`/api/tasks/${task.id}`, backendTaskPayload(task, { status: event.target.value }));
      await refreshBusinessDataAfterWrite('task-status-change');
    }
  } catch (error) {
    reportBackendWriteError(event.target.id || 'change', error);
  }
}, true);


document.addEventListener('click', async (event) => {
  const navTarget = event.target.closest('[data-view]');
  if (navTarget) {
    projectEditModalOpen = false;
    confirmationDialog = null;
    readableContentModal = null;
    renderGlobalModals();
    const view = navTarget.dataset.view;
    if ([...navItems].some((item) => item.dataset.view === view)) {
      await refreshBusinessDataForNavigation();
    }
    if (view === 'project-detail') {
      renderProjectDetail();
      showView('project-detail');
      return;
    }
    if (view === 'customer-master') renderCustomerManagement();
    if (view === 'orders') renderOrderManagement();
    if (view === 'analytics') renderAnalytics();
    showView(view);
  }

  const projectButton = event.target.closest('[data-project-id]:not([data-action])');
  if (projectButton) {
    const sourceView = activeViewName();
    projectDetailReturnView = sourceView === 'dashboard' ? 'dashboard' : 'projects';
    selectedProjectId = projectButton.dataset.projectId;
    renderProjectDetail();
    showView('project-detail');
  }

  const actionTarget = event.target.closest('[data-action]');
  const action = actionTarget?.dataset.action;
  const actionPermission = actionPermissionMap[action];
  if (actionPermission && !currentUserCan(actionPermission)) {
    showToast('当前账号没有该操作权限。', 'warning');
    return;
  }
  if (action === 'set-notification-filter') {
    notificationFilter = actionTarget.dataset.notificationFilter || 'unread';
    await refreshNotifications({ loadList: true });
    return;
  }
  if (action === 'mark-notification-read') {
    try {
      await kpmApi.post(`/api/notifications/messages/${actionTarget.dataset.messageId}/read`, {});
      await refreshNotifications({ loadList: true });
      showToast('消息已标记为已读。', 'success');
    } catch (error) {
      reportBackendWriteError('mark-notification-read', error);
    }
    return;
  }
  if (action === 'mark-all-notifications-read') {
    try {
      const result = await kpmApi.post('/api/notifications/messages/read-all', {});
      await refreshNotifications({ loadList: true });
      showToast(`已标记 ${result?.updated || 0} 条消息为已读。`, 'success');
    } catch (error) {
      reportBackendWriteError('mark-all-notifications-read', error);
    }
    return;
  }
  if (action === 'open-task-list-filter') {
    const taskIds = String(actionTarget.dataset.taskIds || '').split(',').map((id) => id.trim()).filter(Boolean);
    resetTaskListFiltersForContext(taskIds, actionTarget.dataset.filterLabel || '', true);
    selectedActivityCell = null;
    renderTaskManagement();
    showView('tasks');
    return;
  }
  if (action === 'clear-task-context-filter') {
    resetTaskListFiltersForContext([], '', false);
    renderTaskManagement();
    return;
  }
  if (action === 'back-from-project-detail') {
    backFromProjectDetail();
    return;
  }
  if (action === 'close-readable-modal') {
    readableContentModal = null;
    renderGlobalModals();
  }
  if (action === 'open-customer-contact-detail') {
    readableContentModal = { type: 'customer-contact-detail', index: Number(actionTarget.dataset.contactIndex) };
    renderGlobalModals();
  }
  if (action === 'open-customer-contacts-modal') {
    readableContentModal = { type: 'customer-contacts' };
    renderGlobalModals();
  }
  if (action === 'open-customer-materials-modal') {
    readableContentModal = { type: 'customer-materials' };
    renderGlobalModals();
  }
  if (action === 'open-customer-followups-modal') {
    readableContentModal = { type: 'customer-followups' };
    renderGlobalModals();
  }
  if (action === 'open-stage-files-modal') {
    readableContentModal = { type: 'stage-files' };
    renderGlobalModals();
  }
  if (action === 'open-stage-messages-modal') {
    readableContentModal = { type: 'stage-messages' };
    renderGlobalModals();
  }
  if (action === 'open-task-attachments-modal') {
    readableContentModal = { type: 'task-attachments' };
    renderGlobalModals();
  }
  if (action === 'open-task-comments-modal') {
    readableContentModal = { type: 'task-comments' };
    renderGlobalModals();
  }
  if (action === 'download-file') {
    try {
      await openFileDownload({ objectKey: actionTarget.dataset.objectKey, fileName: actionTarget.dataset.fileName });
    } catch (error) {
      reportBackendWriteError('download-file', error);
    }
  }
  if (action === 'logout') {
    clearSession();
    appShell.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    userDropdown.classList.remove('open');
    loginPassword.value = '';
    loginError.textContent = '';
    showToast('已退出登录', 'success');
    stopNotificationRefresh();
  }
  if (action === 'open-change-password') {
    changePasswordModalOpen = true;
    userDropdown.classList.remove('open');
    renderGlobalModals();
  }
  if (action === 'close-change-password') {
    changePasswordModalOpen = false;
    renderGlobalModals();
  }
  if (action === 'save-change-password') {
    const oldPassword = document.getElementById('change-old-password')?.value || '';
    const newPassword = document.getElementById('change-new-password')?.value || '';
    const confirmPassword = document.getElementById('change-confirm-password')?.value || '';
    if (!validateRequiredFields([
      { id: 'change-old-password', label: '原密码', valid: (value) => textLengthBetween(value, 1, 128), message: '请输入原密码' },
      { id: 'change-new-password', label: '新密码', valid: (value) => textLengthBetween(value, 6, 128), message: '新密码至少 6 位，且不能超过 128 位' },
      { id: 'change-confirm-password', label: '确认新密码', valid: (value) => value === newPassword, message: '两次输入的新密码不一致' },
    ], { title: '请检查密码信息' })) return;
    try {
      await kpmApi.post('/api/iam/change-password', { account: currentAccount, oldPassword, newPassword });
      changePasswordModalOpen = false;
      renderGlobalModals();
      showToast('密码修改成功，请妥善保管新密码。', 'success');
    } catch (error) {
      reportBackendWriteError('change-password', error);
    }
  }
  if (action === 'add-project-member') {
    if (!hasAvailableProjectRoles()) {
      showToast('请先在角色管理中配置至少一个启用的项目内角色。', 'warning');
      return;
    }
    const memberContext = actionTarget.dataset.memberContext;
    const roleAttribute = actionTarget.dataset.roleAttribute;
    const input = document.getElementById(memberSearchInputId(memberContext));
    const searchValue = input?.value.trim();
    const user = userByNameValue(searchValue) || userByAccount(searchValue);
    const members = currentMembersFromContext(memberContext, roleAttribute);
    if (user && !members.some((member) => member.userAccount === user.account)) {
      members.push({ userAccount: user.account, role: defaultProjectMemberRole() });
      saveMembersForContext(memberContext, members);
    } else if (!user) {
      showToast('项目成员必须从已有用户搜索结果中选择。', 'warning');
    } else {
      showToast('该用户已经在项目成员列表中。', 'warning');
    }
  }
  if (action === 'remove-project-member') {
    const memberContext = actionTarget.dataset.memberContext;
    const roleAttribute = actionTarget.dataset.roleAttribute;
    const memberAccount = actionTarget.dataset.memberAccount;
    const members = currentMembersFromContext(memberContext, roleAttribute)
      .filter((member) => member.userAccount !== memberAccount);
    saveMembersForContext(memberContext, members);
  }
  if (action === 'toggle-task-form') {
    if (!taskFormOpen) resetTaskFormState();
    taskFormOpen = !taskFormOpen;
    renderTaskManagement();
  }
  if (action === 'toggle-order-form') {
    orderFormOpen = !(orderFormOpen && orderEditIndex === null);
    orderEditIndex = null;
    renderOrderManagement();
  }
  if (action === 'cancel-order-form') {
    orderFormOpen = false;
    orderEditIndex = null;
    renderOrderManagement();
  }
  if (action === 'edit-order') {
    orderFormOpen = true;
    orderEditIndex = Number(event.target.dataset.orderIndex);
    renderOrderManagement();
  }
  if (action === 'delete-order') {
    orders.splice(Number(event.target.dataset.orderIndex), 1);
    orderFormOpen = false;
    orderEditIndex = null;
    renderOrderManagement();
    renderAnalytics();
  }
  if (action === 'save-order') {
    const nextOrder = collectOrderFormValue();
    if (orderEditIndex === null) {
      ensureCustomerProjectLinkForOrder(nextOrder);
      orders.unshift({
        id: nextOrderId(),
        ...nextOrder,
        creator: currentUser,
        histories: [],
      });
      orderFormOpen = false;
      renderOrderManagement();
      renderProjectDetail();
      renderProjectCustomers();
      renderCustomerDetail();
      renderAnalytics();
    } else {
      const currentOrder = orders[orderEditIndex];
      const reason = document.getElementById('order-change-reason').value.trim();
      const changedFields = Object.entries(nextOrder)
        .filter(([field, value]) => currentOrder[field] !== value)
        .map(([field, value]) => `${orderFieldLabel(field)}：${currentOrder[field]} → ${value}`);
      if (reason && changedFields.length) {
        ensureCustomerProjectLinkForOrder(nextOrder);
        orders[orderEditIndex] = {
          ...currentOrder,
          ...nextOrder,
          histories: [
            {
              modifier: currentUser,
              modifiedAt: prototypeReviewTime,
              changes: changedFields.join('；'),
              reason,
            },
            ...currentOrder.histories,
          ],
        };
        orderFormOpen = false;
        orderEditIndex = null;
        renderOrderManagement();
        renderProjectDetail();
        renderProjectCustomers();
        renderCustomerDetail();
        renderAnalytics();
      }
    }
  }
  if (action === 'open-order-history') {
    selectedOrderId = event.target.dataset.orderId;
    orderHistoryModalOpen = true;
    renderOrderManagement();
  }
  if (action === 'close-order-history') {
    orderHistoryModalOpen = false;
    selectedOrderId = null;
    renderOrderManagement();
  }
  if (action === 'toggle-customer-master-form') {
    customerFormOpen = !(customerFormOpen && customerEditIndex === null);
    customerEditIndex = null;
    renderCustomerManagement();
  }
  if (action === 'cancel-customer-master-form') {
    customerFormOpen = false;
    customerEditIndex = null;
    renderCustomerManagement();
  }
  if (action === 'edit-customer-master') {
    customerFormOpen = true;
    customerEditIndex = Number(actionTarget.dataset.customerIndex);
    renderCustomerManagement();
  }
  if (action === 'save-customer-master') {
    const name = document.getElementById('customer-master-name').value.trim();
    const region = document.getElementById('customer-master-region').value.trim();
    if (name && region) {
      const previousCustomer = customerEditIndex === null ? null : customers[customerEditIndex];
      const nextCustomer = {
        name,
        shortName: document.getElementById('customer-master-short-name').value.trim() || '-',
        region,
        address: document.getElementById('customer-master-address').value.trim(),
        level: document.getElementById('customer-master-level').value,
        salesOwners: collectPeopleInputValue('customer-master-sales-owners'),
        supportOwners: collectPeopleInputValue('customer-master-support-owners'),
        status: document.getElementById('customer-master-status').value,
        contacts: previousCustomer?.contacts || [],
        materials: previousCustomer?.materials || [],
        followups: previousCustomer?.followups || [],
      };
      if (customerEditIndex === null) {
        customers.unshift(nextCustomer);
      } else {
        customers[customerEditIndex] = nextCustomer;
        renameCustomerReferences(previousCustomer.name, nextCustomer.name);
        syncCustomerSnapshotReferences(nextCustomer.name);
        if (selectedCustomerName === previousCustomer.name) selectedCustomerName = nextCustomer.name;
      }
      customerFormOpen = false;
      customerEditIndex = null;
      renderCustomerManagement();
      renderAnalytics();
    }
  }
  if (action === 'delete-customer-master') {
    const customerIndex = Number(actionTarget.dataset.customerIndex);
    if (!canDeleteCustomer(customers[customerIndex])) return;
    customers.splice(customerIndex, 1);
    customerFormOpen = false;
    customerEditIndex = null;
    selectedCustomerName = customers[0]?.name || '';
    renderCustomerManagement();
    renderAnalytics();
  }
  if (action === 'open-customer-detail') {
    selectedCustomerName = actionTarget.dataset.customerName;
    customerContactFormOpen = false;
    customerFollowupFormOpen = false;
    customerOrderFormOpen = false;
    readableContentModal = null;
    renderGlobalModals();
    renderCustomerDetail();
    showView('customer-detail');
  }
  if (action === 'open-linked-project') {
    projectDetailReturnView = activeViewName();
    selectedProjectId = actionTarget.dataset.projectId;
    memberModalOpen = false;
    readableContentModal = null;
    renderGlobalModals();
    renderProjectDetail();
    showView('project-detail');
  }
  if (action === 'toggle-customer-contact-form') {
    customerContactFormOpen = !customerContactFormOpen;
    renderCustomerDetail();
  }
  if (action === 'save-customer-contact') {
    const customer = selectedCustomer();
    const name = document.getElementById('customer-contact-name').value.trim();
    if (customer && name && validateCustomerContactForm()) {
      customer.contacts.unshift({
        name,
        title: document.getElementById('customer-contact-title').value.trim(),
        phone: document.getElementById('customer-contact-phone').value.trim(),
        email: document.getElementById('customer-contact-email').value.trim(),
        remark: document.getElementById('customer-contact-remark').value.trim(),
      });
      customerContactFormOpen = false;
      renderCustomerDetail();
      renderCustomerManagement();
    }
  }
  if (action === 'delete-customer-contact') {
    const customer = selectedCustomer();
    customer.contacts.splice(Number(actionTarget.dataset.contactIndex), 1);
    if (readableContentModal?.type === 'customer-contact-detail') readableContentModal = null;
    renderCustomerDetail();
    renderCustomerManagement();
    renderGlobalModals();
  }
  if (action === 'toggle-customer-followup-form') {
    customerFollowupFormOpen = !customerFollowupFormOpen;
    renderCustomerDetail();
  }
  if (action === 'save-customer-followup') {
    const customer = selectedCustomer();
    const text = document.getElementById('customer-followup-text').value.trim();
    const attachments = [...document.getElementById('customer-followup-files').files].map((file) => ({
      name: file.name,
      type: fileTypeLabel(file),
    }));
    if (customer && (text || attachments.length)) {
      customer.followups.unshift({
        author: currentUser,
        time: prototypeUploadTime,
        text: text || '补充客户跟进附件',
        attachments,
      });
      customerFollowupFormOpen = false;
      renderCustomerDetail();
    }
  }
  if (action === 'toggle-customer-order-form') {
    customerOrderFormOpen = !customerOrderFormOpen;
    renderCustomerDetail();
  }
  if (action === 'save-customer-order') {
    const nextOrder = collectOrderFormValue();
    ensureCustomerProjectLinkForOrder(nextOrder);
    orders.unshift({
      id: nextOrderId(),
      ...nextOrder,
      creator: currentUser,
      histories: [],
    });
    customerOrderFormOpen = false;
    renderCustomerDetail();
    renderProjectDetail();
    renderProjectCustomers();
    renderOrderManagement();
    renderAnalytics();
  }
  if (action === 'save-task') {
    const title = document.getElementById('task-title').value.trim();
    if (title) {
      const expectedCompletionAt = document.getElementById('task-expected-completion-at').value.trim() || '-';
      tasks.unshift({
        id: nextTaskId(),
        title,
        description: document.getElementById('task-description').value.trim(),
        project: document.getElementById('task-project').value,
        stage: document.getElementById('task-stage').value,
        category: document.getElementById('task-category').value,
        status: activeTaskStatusNames()[0],
        priority: document.getElementById('task-priority').value,
        creator: currentUser,
        assignees: collectPeopleInputValue('task-assignees'),
        participants: collectPeopleInputValue('task-participants'),
        expectedCompletionAt,
        dueDate: expectedCompletionAt,
        source: taskFormState.source,
        customerName: '',
        attachments: [],
        comments: [],
      });
      taskFormOpen = false;
      resetTaskFormState();
      renderTaskManagement();
    }
  }
  if (action === 'create-task-from-stage') {
    stageTaskFormOpen = true;
    renderStageDetail();
  }
  if (action === 'close-stage-task-modal') {
    stageTaskFormOpen = false;
    renderStageDetail();
  }
  if (action === 'save-stage-task') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const stage = project.stages[selectedStageIndex];
    const title = document.getElementById('stage-task-title').value.trim();
    if (title) {
      const expectedCompletionAt = document.getElementById('stage-task-expected-completion-at').value.trim() || '-';
      tasks.unshift({
        id: nextTaskId(),
        title,
        description: document.getElementById('stage-task-description').value.trim(),
        project: project.externalName,
        stage: stage.name,
        category: document.getElementById('stage-task-category').value,
        status: activeTaskStatusNames()[0],
        priority: document.getElementById('stage-task-priority').value,
        creator: currentUser,
        assignees: collectPeopleInputValue('stage-task-assignees'),
        participants: collectPeopleInputValue('stage-task-participants'),
        expectedCompletionAt,
        dueDate: expectedCompletionAt,
        source: '阶段详情',
        customerName: '',
        attachments: [],
        comments: [],
      });
      stageTaskFormOpen = false;
      renderTaskManagement();
      renderStageDetail();
    }
  }
  if (action === 'open-task-detail') {
    selectedTaskId = event.target.dataset.taskId;
    taskDetailReturnView = event.target.dataset.returnView || 'tasks';
    readableContentModal = null;
    renderGlobalModals();
    renderTaskDetail();
    showView('task-detail');
  }
  if (action === 'back-from-task-detail') {
    if (taskDetailReturnView === 'requirements') renderCustomerRequirements();
    if (taskDetailReturnView === 'tasks') renderTaskManagement();
    if (taskDetailReturnView === 'analytics') renderAnalytics();
    showView(taskDetailReturnView);
  }
  if (action === 'open-linked-requirement') {
    const linked = findRequirementById(event.target.dataset.requirementId);
    if (linked) {
      selectedProjectId = linked.project.id;
      selectedCustomerIndex = linked.customerIndex;
      requirementFormOpen = false;
      renderCustomerRequirements();
      showView('requirements');
    }
  }
  if (action === 'save-task-detail') {
    const task = tasks.find((item) => item.id === selectedTaskId);
    const expectedCompletionAt = document.getElementById('task-detail-expected-completion-at').value.trim() || '-';
    task.description = document.getElementById('task-detail-description').value.trim();
    task.priority = document.getElementById('task-detail-priority').value;
    task.assignees = collectPeopleInputValue('task-detail-assignees');
    task.participants = collectPeopleInputValue('task-detail-participants');
    task.expectedCompletionAt = expectedCompletionAt;
    task.dueDate = expectedCompletionAt;
    renderTaskDetail();
    renderTaskManagement();
  }
  if (action === 'publish-task-comment') {
    const task = tasks.find((item) => item.id === selectedTaskId);
    const text = document.getElementById('task-comment-text').value.trim();
    const attachments = [...document.getElementById('task-comment-files').files].map((file) => ({
      name: file.name,
      type: fileTypeLabel(file),
    }));

    if (text || attachments.length) {
      task.comments.unshift({
        author: currentUser,
        time: prototypeNow,
        text,
        attachments,
      });
      renderTaskDetail();
    }
  }
  if (action === 'open-blocker-help-modal') {
    blockerHelpFormOpen = true;
    renderStageDetail();
  }
  if (action === 'open-member-modal') {
    memberModalOpen = true;
    renderProjectDetail();
  }
  if (action === 'close-member-modal') {
    memberModalOpen = false;
    renderProjectDetail();
  }
  if (action === 'save-project-members-modal') {
    const project = projects.find((item) => item.id === selectedProjectId);
    project.members = ensureManagerMembership(
      collectProjectMembers('[data-member-modal-user]', 'data-member-modal-role'),
      project.managerAccount,
    );
    memberModalOpen = false;
    renderProjectDetail();
  }
  if (action === 'close-blocker-help-modal') {
    blockerHelpFormOpen = false;
    renderStageDetail();
  }
  if (action === 'save-blocker-help-task') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const stage = project.stages[selectedStageIndex];
    const title = document.getElementById('blocker-task-title').value.trim();
    const description = document.getElementById('blocker-task-description').value.trim();

    if (title && description) {
      const expectedCompletionAt = document.getElementById('blocker-task-due-date').value.trim() || '-';
      tasks.unshift({
        id: nextTaskId(),
        title,
        description,
        project: project.externalName,
        stage: stage.name,
        category: document.getElementById('blocker-task-category').value,
        status: activeTaskStatusNames()[0],
        priority: document.getElementById('blocker-task-priority').value,
        creator: currentUser,
        assignees: stageResponsibleUserNames(stage).length ? stageResponsibleUserNames(stage) : [stagePrimaryOwner(stage)],
        participants: [projectManagerName(project)],
        expectedCompletionAt,
        dueDate: expectedCompletionAt,
        source: '卡点求助',
        customerName: '',
        attachments: [],
        comments: [],
      });
      blockerHelpFormOpen = false;
      renderTaskManagement();
      showView('tasks');
    }
  }
  if (action === 'open-create') {
    wizardStep = 1;
    selectedTemplateIndex = firstEnabledTemplateIndex();
    projectWizardDraft = createProjectWizardDraft();
    renderWizard();
    showView('create-project');
  }
  if (action === 'select-template') {
    selectedTemplateIndex = Number(event.target.dataset.templateIndex);
    renderWizard();
  }
  if (action === 'open-template-create') {
    templateFormOpen = true;
    templateEditIndex = null;
    templateDraftStages = [''];
    templateDraftMeta = { name: '', scope: '', status: '草稿' };
    renderTemplates();
  }
  if (action === 'cancel-template-form') {
    templateFormOpen = false;
    templateEditIndex = null;
    templateDraftStages = [];
    templateDraftMeta = { name: '', scope: '', status: '草稿' };
    renderTemplates();
  }
  if (action === 'edit-template') {
    templateFormOpen = true;
    templateEditIndex = Number(event.target.dataset.templateIndex);
    templateDraftStages = [...templates[templateEditIndex].stages];
    templateDraftMeta = {
      name: templates[templateEditIndex].name,
      scope: templates[templateEditIndex].scope,
      status: templates[templateEditIndex].status,
    };
    renderTemplates();
  }
  if (action === 'toggle-template-status') {
    const templateIndex = Number(event.target.dataset.templateIndex);
    const template = templates[templateIndex];
    if (template.status === '启用' && enabledTemplateEntries().length <= 1) return;
    template.status = template.status === '启用' ? '停用' : '启用';
    template.updatedAt = prototypeToday;
    renderTemplates();
  }
  if (action === 'delete-template') {
    const templateIndex = Number(event.target.dataset.templateIndex);
    if (templates[templateIndex].status === '启用') return;
    templates.splice(templateIndex, 1);
    if (templateEditIndex === templateIndex) {
      templateFormOpen = false;
      templateEditIndex = null;
      templateDraftStages = [];
      templateDraftMeta = { name: '', scope: '', status: '草稿' };
    } else if (templateEditIndex !== null && templateEditIndex > templateIndex) {
      templateEditIndex -= 1;
    }
    renderTemplates();
  }
  if (action === 'add-template-stage') {
    captureTemplateFormDraft();
    templateDraftStages.push('');
    renderTemplates();
  }
  if (action === 'delete-template-stage') {
    captureTemplateFormDraft();
    templateDraftStages.splice(Number(event.target.dataset.templateStageIndex), 1);
    if (!templateDraftStages.length) templateDraftStages = [''];
    renderTemplates();
  }
  if (action === 'move-template-stage') {
    captureTemplateFormDraft();
    const index = Number(event.target.dataset.templateStageIndex);
    const nextIndex = event.target.dataset.direction === 'up' ? index - 1 : index + 1;
    if (nextIndex >= 0 && nextIndex < templateDraftStages.length) {
      [templateDraftStages[index], templateDraftStages[nextIndex]] = [templateDraftStages[nextIndex], templateDraftStages[index]];
    }
    renderTemplates();
  }
  if (action === 'save-template') {
    captureTemplateFormDraft();
    const name = templateDraftMeta.name.trim();
    const scope = templateDraftMeta.scope.trim();
    const status = templateDraftMeta.status;
    const stages = templateDraftStages.map((stage) => stage.trim()).filter(Boolean);
    const previousTemplate = templateEditIndex === null ? null : templates[templateEditIndex];
    const wouldDisableLastEnabledTemplate = previousTemplate?.status === '启用' && status !== '启用' && enabledTemplateEntries().length <= 1;

    if (name && scope && stages.length && !wouldDisableLastEnabledTemplate) {
      const nextTemplate = {
        name,
        scope,
        status,
        updatedAt: prototypeToday,
        stages,
      };
      if (templateEditIndex === null) {
        templates.unshift(nextTemplate);
      } else {
        templates[templateEditIndex] = nextTemplate;
      }
      templateFormOpen = false;
      templateEditIndex = null;
      templateDraftStages = [];
      templateDraftMeta = { name: '', scope: '', status: '草稿' };
      renderTemplates();
    }
  }
  if (action === 'open-project-edit') {
    editingProjectId = event.target.dataset.projectId;
    projectEditModalOpen = true;
    confirmationDialog = null;
    renderGlobalModals();
  }
  if (action === 'cancel-project-edit') {
    projectEditModalOpen = false;
    editingProjectId = null;
    renderGlobalModals();
  }
  if (action === 'save-project-edit') {
    const project = projects.find((item) => item.id === editingProjectId);
    const previousExternalName = project.externalName;
    project.externalName = document.getElementById('edit-project-external-name').value.trim() || project.externalName;
    project.internalName = document.getElementById('edit-project-internal-name').value.trim() || project.internalName;
    project.modelName = document.getElementById('edit-project-model-name').value.trim() || project.modelName;
    project.managerAccount = collectUserAccountInputValue('edit-project-manager', project.managerAccount);
    project.salesability = document.getElementById('edit-project-salesability').value;
    project.unsellableReason = project.salesability === '可销售' ? '' : document.getElementById('edit-project-unsellable-reason')?.value || unsellableReasonOptions[0];
    project.description = document.getElementById('edit-project-description').value.trim() || project.description;
    project.members = ensureManagerMembership(
      collectProjectMembers('[data-edit-member-user]', 'data-edit-member-role'),
      project.managerAccount,
    );
    project.stages.forEach((stage, index) => {
      stage.assignees = collectStageAssignees('edit', index);
    });
    syncProjectStatusFromStages(project);
    if (previousExternalName !== project.externalName) {
      tasks.filter((task) => task.project === previousExternalName).forEach((task) => {
        task.project = project.externalName;
      });
      orders.filter((order) => order.projectName === previousExternalName).forEach((order) => {
        order.projectName = project.externalName;
      });
    }
    selectedProjectId = project.id;
    projectEditModalOpen = false;
    editingProjectId = null;
    refreshProjectRelatedSurfaces();
  }
  if (action === 'request-project-archive') {
    const project = projects.find((item) => item.id === event.target.dataset.projectId);
    if (project) openProjectArchiveConfirmation(project);
  }
  if (action === 'request-project-delete') {
    const project = projects.find((item) => item.id === event.target.dataset.projectId);
    if (project) openProjectDeleteConfirmation(project);
  }
  if (action === 'cancel-confirmation') {
    confirmationDialog = null;
    renderGlobalModals();
  }
  if (action === 'confirm-dialog') {
    await applyConfirmationDialog();
  }
  if (action === 'wizard-prev' && wizardStep > 1) {
    if (wizardStep === 3) captureWizardStepThree();
    if (wizardStep === 4) captureWizardStepFour();
    wizardStep -= 1;
    renderWizard();
  }
  if (action === 'wizard-next') {
    if (wizardStep === 1 && !validateWizardStepOne()) return;
    if (wizardStep === 1) captureWizardStepOne();
    if (wizardStep === 3 && !validateWizardStepThree()) return;
    if (wizardStep === 3) captureWizardStepThree();
    if (wizardStep === 4 && !validateWizardStepFour()) return;
    if (wizardStep === 4) captureWizardStepFour();
    if (wizardStep < 4) {
      wizardStep += 1;
      renderWizard();
    } else {
      createProjectFromWizard();
      projectDetailReturnView = 'projects';
      renderProjectDetail();
      showView('project-detail');
    }
  }
  if (action === 'open-customers') {
    projectCustomerFormOpen = false;
    renderProjectCustomers();
    showView('customers');
  }
  if (action === 'open-materials') {
    renderProjectMaterials();
    showView('materials');
  }
  if (action === 'open-customer-requirements') {
    selectedCustomerIndex = Number(event.target.dataset.customerIndex);
    requirementFormOpen = false;
    renderCustomerRequirements();
    showView('requirements');
  }
  if (action === 'open-requirement-overview') {
    renderRequirementOverview();
    showView('requirement-overview');
  }
  if (action === 'open-stage-detail') {
    selectedStageIndex = Number(event.target.dataset.stageDetailIndex);
    renderStageDetail();
    showView('stage-detail');
  }
  if (action === 'toggle-project-customer-form') {
    projectCustomerFormOpen = !projectCustomerFormOpen;
    renderProjectCustomers();
  }
  if (action === 'save-project-customer') {
    const customerName = document.getElementById('project-customer-name').value;
    const projectStatus = document.getElementById('project-customer-status').value;
    const customer = customers.find((item) => item.name === customerName);
    const project = projects.find((item) => item.id === selectedProjectId);

    if (customer) {
      project.projectCustomers.push({
        customerName: customer.name,
        region: customer.region,
        projectStatus,
        requirements: [],
      });
      projectCustomerFormOpen = false;
      renderProjectCustomers();
      renderProjectDetail();
      renderCustomerDetail();
      renderAnalytics();
    }
  }
  if (action === 'open-resource-create') {
    if (selectedResourceTab === 'permissions') return;
    permissionPickerDrafts = {};
    resourceFormOpen = !(resourceFormOpen && resourceEditIndex === null);
    resourceEditIndex = null;
    renderResourceContent();
  }
  if (action === 'cancel-resource-form') {
    permissionPickerDrafts = {};
    resourceFormOpen = false;
    resourceEditIndex = null;
    renderResourceContent();
  }
  if (action === 'edit-resource') {
    permissionPickerDrafts = {};
    resourceFormOpen = true;
    resourceEditIndex = Number(event.target.dataset.resourceIndex);
    renderResourceContent();
  }
  if (action === 'add-permission-selection') {
    const context = actionTarget.dataset.permissionContext;
    const input = document.getElementById(permissionPickerInputId(context));
    const permission = permissionFromSearchValue(input?.value || '');
    const selected = collectPermissionSelections(context);
    if (permission && !selected.includes(permission.key)) {
      permissionPickerDrafts[context] = [...selected, permission.key];
      renderResourceContent();
    } else if (input) {
      input.value = '';
    }
  }
  if (action === 'remove-permission-selection') {
    const context = actionTarget.dataset.permissionContext;
    permissionPickerDrafts[context] = collectPermissionSelections(context)
      .filter((permissionKey) => permissionKey !== actionTarget.dataset.permissionKey);
    renderResourceContent();
  }
  if (action === 'delete-resource') {
    const rows = resourceRowsForTab(selectedResourceTab);
    const resourceIndex = Number(event.target.dataset.resourceIndex);
    const resource = rows[resourceIndex];
    const canDelete = selectedResourceTab === 'departments' ? canDeleteDepartment(resource)
      : selectedResourceTab === 'roles' ? canDeleteRole(resource)
      : selectedResourceTab === 'customer-statuses' ? canDeleteCustomerStatus(resource)
      : selectedResourceTab === 'customer-levels' ? canDeleteCustomerLevel(resource)
      : selectedResourceTab === 'order-types' ? canDeleteOrderType(resource)
      : selectedResourceTab === 'task-statuses' ? canDeleteTaskStatus(resource)
      : true;
    if (!canDelete) return;
    rows.splice(resourceIndex, 1);
    permissionPickerDrafts = {};
    resourceFormOpen = false;
    resourceEditIndex = null;
    renderResourceContent();
  }
  if (action === 'toggle-user-status') {
    const user = resourceData.users[Number(event.target.dataset.resourceIndex)];
    user.status = user.status === '启用' ? '停用' : '启用';
    renderResourceContent();
  }
  if (action === 'save-resource') {
    let nextItem = null;

    if (selectedResourceTab === 'users') {
      const name = document.getElementById('resource-user-name').value.trim();
      const account = document.getElementById('resource-user-email').value.trim();
      const departments = selectedCheckboxValues('[data-user-department]');
      if (name && account && departments.length) {
        nextItem = {
          name,
          account,
          departments,
          globalRoles: selectedCheckboxValues('[data-user-global-role]'),
          directPermissions: collectPermissionSelections('user-direct'),
          status: document.getElementById('resource-user-status').value,
        };
      }
    }

    if (selectedResourceTab === 'departments') {
      const name = document.getElementById('resource-department-name').value.trim();
      if (name) {
        nextItem = {
          name,
          parent: '-',
        };
      }
    }

    if (selectedResourceTab === 'roles') {
      const name = document.getElementById('resource-role-name').value.trim();
      if (name) {
        nextItem = {
          name,
          type: document.getElementById('resource-role-type').value,
          permissions: collectPermissionSelections('role-permissions'),
          status: document.getElementById('resource-role-status').value,
        };
      }
    }

    if (selectedResourceTab === 'customers') {
      const name = document.getElementById('customer-name').value.trim();
      const region = document.getElementById('customer-region').value.trim();
      if (name && region) {
        nextItem = {
          name,
          shortName: document.getElementById('customer-short-name').value.trim() || '-',
          region,
          salesOwners: collectPeopleInputValue('customer-sales-owners'),
          supportOwners: collectPeopleInputValue('customer-support-owners'),
          status: document.getElementById('customer-status').value,
          level: document.getElementById('customer-level').value,
        };
      }
    }

    if (selectedResourceTab === 'customer-levels') {
      const name = document.getElementById('customer-level-name').value.trim();
      if (name) {
        nextItem = {
          name,
          active: document.getElementById('customer-level-active').value === '启用',
        };
      }
    }

    if (selectedResourceTab === 'customer-statuses') {
      const name = document.getElementById('customer-status-option-name').value.trim();
      if (name) {
        nextItem = {
          name,
          active: document.getElementById('customer-status-option-active').value === '启用',
        };
      }
    }

    if (selectedResourceTab === 'order-types') {
      const name = document.getElementById('order-type-name').value.trim();
      if (name) {
        nextItem = {
          name,
          active: document.getElementById('order-type-active').value === '启用',
        };
      }
    }

    if (selectedResourceTab === 'task-statuses') {
      const name = document.getElementById('task-status-name').value.trim();
      if (name) {
        nextItem = {
          name,
          semantic: document.getElementById('task-status-semantic').value,
          active: document.getElementById('task-status-active').value === '启用',
        };
      }
    }

    if (nextItem) {
      const rows = resourceRowsForTab(selectedResourceTab);
      const previousItem = resourceEditIndex === null ? null : rows[resourceEditIndex];
      if (previousItem && selectedResourceTab === 'customer-statuses' && previousItem.active && !nextItem.active && customerStatusUsageCount(previousItem.name) > 0) {
        nextItem.active = true;
      }
      if (previousItem && selectedResourceTab === 'customer-levels' && previousItem.active && !nextItem.active && customerLevelUsageCount(previousItem.name) > 0) {
        nextItem.active = true;
      }
      if (previousItem && selectedResourceTab === 'order-types' && previousItem.active && !nextItem.active && orderTypeUsageCount(previousItem.name) > 0) {
        nextItem.active = true;
      }
      if (previousItem && selectedResourceTab === 'task-statuses' && previousItem.active && !nextItem.active && taskStatusUsageCount(previousItem.name) > 0) {
        nextItem.active = true;
      }
      if (resourceEditIndex === null) {
        rows.unshift(nextItem);
      } else {
        rows[resourceEditIndex] = nextItem;
        if (selectedResourceTab === 'users') {
          renameUserReferences(previousItem.name, nextItem.name);
          renameUserAccountReferences(previousItem.account, nextItem.account);
        }
        if (selectedResourceTab === 'departments') renameDepartmentReferences(previousItem.name, nextItem.name);
        if (selectedResourceTab === 'roles') {
          renameRoleReferences(previousItem.name, nextItem.name);
          if (previousItem.type === '全局角色' && nextItem.type !== '全局角色') {
            resourceData.users.forEach((user) => {
              user.globalRoles = user.globalRoles.filter((role) => role !== nextItem.name);
            });
          }
        }
        if (selectedResourceTab === 'customers') renameCustomerReferences(previousItem.name, nextItem.name);
        if (selectedResourceTab === 'customers') syncCustomerSnapshotReferences(nextItem.name);
        if (selectedResourceTab === 'customer-statuses') {
          renameCustomerProjectStatusReferences(previousItem.name, nextItem.name);
        }
        if (selectedResourceTab === 'customer-levels') {
          renameCustomerLevelReferences(previousItem.name, nextItem.name);
        }
        if (selectedResourceTab === 'order-types') {
          renameOrderTypeReferences(previousItem.name, nextItem.name);
        }
        if (selectedResourceTab === 'task-statuses' && previousItem.name !== nextItem.name) {
          tasks.filter((task) => task.status === previousItem.name).forEach((task) => {
            task.status = nextItem.name;
          });
          taskStatusTransitions
            .filter((transition) => transition.from === previousItem.name)
            .forEach((transition) => {
              transition.from = nextItem.name;
            });
          taskStatusTransitions
            .filter((transition) => transition.to === previousItem.name)
            .forEach((transition) => {
              transition.to = nextItem.name;
            });
        }
      }
      resourceFormOpen = false;
      resourceEditIndex = null;
      permissionPickerDrafts = {};
      renderResourceContent();
      if (['customer-statuses', 'customer-levels', 'order-types'].includes(selectedResourceTab)) {
        renderProjectCustomers();
        renderCustomerDetail();
        renderOrderManagement();
        renderAnalytics();
      }
    }
  }
  if (action === 'toggle-customer-status-option') {
    const index = Number(event.target.dataset.statusOptionIndex);
    if (!canToggleCustomerStatusOption(customerProjectStatusOptions[index])) return;
    customerProjectStatusOptions[index].active = !customerProjectStatusOptions[index].active;
    renderResourceContent();
  }
  if (action === 'toggle-customer-level-option') {
    const index = Number(event.target.dataset.levelOptionIndex);
    if (!canToggleCustomerLevelOption(customerLevelOptions[index])) return;
    customerLevelOptions[index].active = !customerLevelOptions[index].active;
    renderResourceContent();
  }
  if (action === 'toggle-order-type-option') {
    const index = Number(event.target.dataset.orderTypeIndex);
    if (!canToggleOrderTypeOption(orderTypeOptions[index])) return;
    orderTypeOptions[index].active = !orderTypeOptions[index].active;
    renderResourceContent();
  }
  if (action === 'toggle-task-status-option') {
    const index = Number(event.target.dataset.statusOptionIndex);
    if (!canToggleTaskStatusOption(taskStatusOptions[index])) return;
    taskStatusOptions[index].active = !taskStatusOptions[index].active;
    renderResourceContent();
  }
  if (action === 'toggle-task-transition-form') {
    taskTransitionFormOpen = !taskTransitionFormOpen;
    renderResourceContent();
  }
  if (action === 'save-task-transition') {
    const from = document.getElementById('task-transition-from').value;
    const to = document.getElementById('task-transition-to').value;
    if (from !== to && !taskStatusTransitions.some((transition) => transition.from === from && transition.to === to)) {
      taskStatusTransitions.push({ from, to });
    }
    taskTransitionFormOpen = false;
    renderResourceContent();
  }
  if (action === 'delete-task-transition') {
    taskStatusTransitions.splice(Number(event.target.dataset.transitionIndex), 1);
    renderResourceContent();
  }
  if (action === 'request-stage-file-publish') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const stage = project.stages[selectedStageIndex];
    const fileName = event.target.dataset.fileName;
    const alreadyPublished = project.projectMaterials.some((material) => material.name === fileName);

    if (!alreadyPublished) {
      openStageFilePublishConfirmation(project, stage, fileName);
    }
  }
  if (action === 'publish-stage-message') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const stage = project.stages[selectedStageIndex];
    const textValue = document.getElementById('stage-message-text').value.trim();
    const attachments = [...document.getElementById('stage-message-files').files].map((file) => ({
      name: file.name,
      type: file.type.startsWith('image/') ? '图片' : file.type.startsWith('video/') ? '视频' : '文件',
    }));

    if (textValue || attachments.length) {
      stage.messages.push({
        author: '李娜',
        time: prototypeUploadTime,
        text: textValue || '补充附件',
        attachments,
      });
      renderStageDetail();
    }
  }
  if (action === 'toggle-requirement-form') {
    requirementFormOpen = !requirementFormOpen;
    renderCustomerRequirements();
  }
  if (action === 'save-requirement') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const customer = project.projectCustomers[selectedCustomerIndex];
    const title = document.getElementById('requirement-title').value.trim();
    const userStory = document.getElementById('requirement-user-story').value.trim();
    const value = document.getElementById('requirement-value').value.trim();
    const acceptance = document.getElementById('requirement-acceptance').value.trim();
    const createLinkedTask = document.getElementById('requirement-create-task').checked;

    if (validateRequiredFields([
      { id: 'requirement-title', label: '需求标题', value: title, valid: requiredMaxLength(120), message: '需求标题必填，且不能超过 120 个字符' },
      { id: 'requirement-user-story', label: '用户故事', value: userStory, valid: requiredMaxLength(1500), message: '用户故事必填，且不能超过 1500 个字符' },
      { id: 'requirement-value', label: '业务价值', value, valid: requiredMaxLength(1000), message: '业务价值必填，且不能超过 1000 个字符' },
      { id: 'requirement-acceptance', label: '验收标准', value: acceptance, valid: requiredMaxLength(1500), message: '验收标准必填，且不能超过 1500 个字符' },
    ])) {
      const requirementId = nextRequirementId();
      const linkedTaskId = createLinkedTask ? nextTaskId() : '';
      customer.requirements.unshift({
        id: requirementId,
        title,
        userStory,
        value,
        acceptance,
        priority: document.getElementById('requirement-priority').value,
        status: createLinkedTask ? '实现中' : '待评估',
        proposer: customer.customerName,
        creator: currentUser,
        date: '2026-05-15',
        taskId: linkedTaskId,
      });
      if (createLinkedTask) {
        tasks.unshift({
          id: linkedTaskId,
          title: `实现需求：${title}`,
          description: `${customer.customerName} 提出需求：${userStory}`,
          project: project.externalName,
          stage: '客户需求',
          category: '需求',
          status: activeTaskStatusNames()[0],
          priority: document.getElementById('requirement-priority').value,
          creator: currentUser,
          assignees: [currentUser],
          participants: [],
          expectedCompletionAt: '2026-05-30',
          dueDate: '2026-05-30',
          source: '客户需求',
          linkedRequirementId: requirementId,
          customerName: customer.customerName,
          attachments: [],
          comments: [],
        });
        renderTaskManagement();
      }
      requirementFormOpen = false;
      renderCustomerRequirements();
    }
  }
  if (action === 'void-requirement') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const customer = project.projectCustomers[selectedCustomerIndex];
    customer.requirements[Number(event.target.dataset.requirementIndex)].status = '已作废';
    renderCustomerRequirements();
  }
  if (action === 'delete-requirement') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const customer = project.projectCustomers[selectedCustomerIndex];
    customer.requirements.splice(Number(event.target.dataset.requirementIndex), 1);
    renderCustomerRequirements();
  }
  const stepButton = event.target.closest('[data-step]');
  if (stepButton) {
    if (wizardStep === 1 && Number(stepButton.dataset.step) > 1) captureWizardStepOne();
    if (wizardStep === 3 && Number(stepButton.dataset.step) !== 3) captureWizardStepThree();
    if (wizardStep === 4 && Number(stepButton.dataset.step) !== 4) captureWizardStepFour();
    wizardStep = Number(stepButton.dataset.step);
    renderWizard();
  }

  const tab = event.target.closest('[data-tab]');
  if (tab) {
    selectedResourceTab = tab.dataset.tab;
    resourceFormOpen = false;
    resourceEditIndex = null;
    resourceSearchKeyword = '';
    permissionTypeFilter = '全部类型';
    permissionPickerDrafts = {};
    document.querySelectorAll('.tab').forEach((item) => item.classList.toggle('active', item.dataset.tab === selectedResourceTab));
    renderResourceContent();
  }

  const analyticsTabButton = event.target.closest('[data-analytics-tab]');
  if (analyticsTabButton) {
    analyticsTab = analyticsTabButton.dataset.analyticsTab;
    selectedActivityCell = null;
    renderAnalytics();
  }

  if (action === 'select-support-customer') {
    selectedSupportCustomer = actionTarget.dataset.customerName;
    supportCustomerKeyword = selectedSupportCustomer;
    renderSupportAnalytics();
  }
  if (action === 'open-activity-cell') {
    selectedActivityCell = {
      customerName: actionTarget.dataset.activityCustomer,
      projectName: actionTarget.dataset.activityProject,
    };
    renderCustomerActivityAnalytics();
  }
  if (action === 'close-activity-cell') {
    selectedActivityCell = null;
    renderCustomerActivityAnalytics();
  }
  if (action === 'open-resource-map-fullscreen') {
    mapFullscreenOpen = true;
    renderResourceAnalytics();
  }
  if (action === 'close-resource-map-fullscreen') {
    mapFullscreenOpen = false;
    renderResourceAnalytics();
  }
  if (action === 'toggle-analytics-multiselect') {
    analyticsDropdownOpen = analyticsDropdownOpen === actionTarget.dataset.filterType ? null : actionTarget.dataset.filterType;
    renderOrderAnalytics();
  }
  if (action === 'clear-analytics-filter') {
    const filterType = actionTarget.dataset.filterType;
    if (filterType === 'project') analyticsProjectFilter = [];
    if (filterType === 'customer') analyticsCustomerFilter = [];
    if (filterType === 'region') analyticsRegionFilter = [];
    renderOrderAnalytics();
  }
});


document.addEventListener('change', async (event) => {
  if (event.target.matches('[data-project-member-user]')) {
    document.querySelector(`[data-project-member-role="${event.target.value}"]`).disabled = !event.target.checked;
  }

  if (event.target.matches('[data-edit-member-user]')) {
    document.querySelector(`[data-edit-member-role="${event.target.value}"]`).disabled = !event.target.checked;
  }

  if (event.target.matches('[data-member-modal-user]')) {
    document.querySelector(`[data-member-modal-role="${event.target.value}"]`).disabled = !event.target.checked;
  }

  const stageSelect = event.target.closest('[data-stage-index]');
  if (stageSelect) {
    const project = projects.find((item) => item.id === selectedProjectId);
    project.stages[Number(stageSelect.dataset.stageIndex)].status = stageSelect.value;
    syncProjectStatusFromStages(project);
    renderProjectDetail();
    renderProjectTable(projectSearch.value);
    renderDashboard();
  }

  const projectCustomerSelect = event.target.closest('[data-project-customer-index]');
  if (projectCustomerSelect) {
    const project = projects.find((item) => item.id === selectedProjectId);
    project.projectCustomers[Number(projectCustomerSelect.dataset.projectCustomerIndex)].projectStatus = projectCustomerSelect.value;
    renderProjectCustomers();
    renderCustomerDetail();
    renderAnalytics();
  }

  if (event.target.id === 'stage-file-input') {
    const project = projects.find((item) => item.id === selectedProjectId);
    const stage = project.stages[selectedStageIndex];
    [...event.target.files].forEach((file) => {
      stage.files.unshift({
        name: file.name,
        type: file.type.startsWith('image/') ? '图片' : file.type.startsWith('video/') ? '视频' : '文件',
        size: '新上传',
        uploader: '李娜',
        time: prototypeUploadTime,
      });
    });
    renderStageDetail();
  }

  if (event.target.id === 'task-file-input') {
    const task = tasks.find((item) => item.id === selectedTaskId);
    [...event.target.files].forEach((file) => {
      task.attachments.unshift({
        name: file.name,
        type: fileTypeLabel(file),
        size: '新上传',
        uploader: currentUser,
        time: prototypeNow,
      });
    });
    renderTaskDetail();
  }

  if (event.target.id === 'customer-material-input') {
    const customer = selectedCustomer();
    [...event.target.files].forEach((file) => {
      customer.materials.unshift({
        name: file.name,
        type: fileTypeLabel(file),
        size: '新上传',
        uploader: currentUser,
        time: prototypeUploadTime,
      });
    });
    renderCustomerDetail();
    renderCustomerManagement();
  }

  if (event.target.id === 'task-detail-status') {
    const task = tasks.find((item) => item.id === selectedTaskId);
    task.status = event.target.value;
    syncRequirementStatusFromTask(task);
    renderTaskDetail();
    renderTaskManagement();
  }
});

document.addEventListener('input', (event) => {
  if (event.target.id === 'task-keyword') {
    taskListFilters.keyword = event.target.value;
    renderTaskManagement();
  }
  if (event.target.id === 'order-keyword') {
    renderOrderManagement();
  }
  if (event.target.id === 'customer-master-keyword') {
    customerSearchKeyword = event.target.value;
    renderCustomerManagement();
  }
  if (event.target.id === 'template-search') {
    if (templateFormOpen) captureTemplateFormDraft();
    templateSearchKeyword = event.target.value;
    renderTemplates();
  }
  if (event.target.id === 'resource-search') {
    resourceSearchKeyword = event.target.value;
    document.getElementById('resource-table-area').innerHTML = renderResourceTable();
  }
  if (event.target.id === 'support-customer-search') {
    supportCustomerKeyword = event.target.value;
    document.getElementById('support-customer-results').innerHTML = renderSupportCustomerResults(selectedSupportCustomer);
  }
  if (event.target.id === 'activity-search') {
    activitySearchKeyword = event.target.value;
    selectedActivityCell = null;
    renderCustomerActivityAnalytics();
  }
  if (event.target.matches('[data-analytics-search]')) {
    const filterType = event.target.dataset.analyticsSearch;
    analyticsFilterKeywords[filterType] = event.target.value;
    document.getElementById(`analytics-${filterType}-options`).innerHTML = renderAnalyticsFilterOptionList(filterType);
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'wizard-project-salesability') {
    projectWizardDraft.salesability = event.target.value;
    if (projectWizardDraft.salesability === '可销售') projectWizardDraft.unsellableReason = '';
    toggleUnsellableReasonField('wizard');
  }
  if (event.target.id === 'edit-project-salesability') {
    toggleUnsellableReasonField('edit');
  }
  if (event.target.id === 'task-project') {
    taskFormState.project = event.target.value;
    taskFormState.stage = projects.find((project) => project.externalName === taskFormState.project)?.stages[0]?.name || '';
    renderTaskManagement();
  }
  if (event.target.id === 'task-stage') {
    taskFormState.stage = event.target.value;
  }
  if (event.target.id === 'task-category') {
    taskFormState.category = event.target.value;
  }
  if (event.target.id === 'task-project-filter') {
    taskListFilters.project = event.target.value;
    renderTaskManagement();
  }
  if (event.target.id === 'task-status-filter') {
    taskListFilters.status = event.target.value;
    renderTaskManagement();
  }
  if (event.target.id === 'task-priority-filter') {
    taskListFilters.priority = event.target.value;
    renderTaskManagement();
  }
  if (event.target.id === 'task-assignee-filter') {
    taskListFilters.assignee = event.target.value;
    renderTaskManagement();
  }
  if (event.target.id === 'task-category-filter') {
    taskListFilters.category = event.target.value;
    renderTaskManagement();
  }
  if (event.target.id === 'analytics-period') {
    analyticsOrderPeriod = event.target.value;
    renderOrderAnalytics();
  }
  if (event.target.id === 'analytics-year') {
    analyticsYear = event.target.value;
    renderOrderAnalytics();
  }
  if (event.target.id === 'analytics-quarter') {
    analyticsQuarter = event.target.value;
    renderOrderAnalytics();
  }
  if (event.target.id === 'analytics-month') {
    analyticsMonth = event.target.value;
    renderOrderAnalytics();
  }
  if (event.target.id === 'analytics-target-currency') {
    analyticsTargetCurrency = event.target.value;
    renderOrderAnalytics();
  }
  if (event.target.id === 'activity-status-filter') {
    activityStatusFilter = event.target.value;
    selectedActivityCell = null;
    renderCustomerActivityAnalytics();
  }
  if (event.target.id === 'activity-level-filter') {
    activityLevelFilter = event.target.value;
    selectedActivityCell = null;
    renderCustomerActivityAnalytics();
  }
  if (event.target.matches('[data-analytics-filter]')) {
    const filterType = event.target.dataset.analyticsFilter;
    const values = selectedCheckboxValues(`[data-analytics-filter="${filterType}"]`);
    if (filterType === 'project') analyticsProjectFilter = values;
    if (filterType === 'customer') analyticsCustomerFilter = values;
    if (filterType === 'region') analyticsRegionFilter = values;
    renderOrderAnalytics();
  }
  if (event.target.id === 'template-status-filter') {
    if (templateFormOpen) captureTemplateFormDraft();
    templateStatusKeyword = event.target.value;
    renderTemplates();
  }
  if (event.target.id === 'permission-type-filter') {
    permissionTypeFilter = event.target.value;
    document.getElementById('resource-table-area').innerHTML = renderResourceTable();
  }
});

function toggleLanguage() {
  currentLanguage = 'zh';
  localStorage.setItem('kpm.language', 'zh');
  applyLanguage();
}

languageToggle?.addEventListener('click', toggleLanguage);
loginLanguageToggle?.addEventListener('click', toggleLanguage);

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validateRequiredFields([
    { id: 'login-account', label: '登录邮箱', valid: requiredEmailValue, message: '登录账号必须是邮箱格式，例如 admin@kozenmobile.com' },
    { id: 'login-password', label: '密码', valid: (value) => textLengthBetween(value, 1, 128), message: '密码不能为空，且不能超过 128 个字符' },
  ], { title: '请检查登录信息' })) return;
  try {
    const loginResult = await kpmApi.post('/api/iam/login', {
      account: loginAccount.value.trim(),
      password: loginPassword.value,
    });
    syncSession(loginResult);
    await loadBusinessDataFromBackend();
    renderAllPrototypeSurfaces();
    loginScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
    loginError.textContent = '';
    showToast(textFor('login.success', '登录成功，欢迎 {name}').replace('{name}', currentUser), 'success');
    startNotificationRefresh();
  } catch (error) {
    console.error('[KPM] login failed', error);
    loginError.textContent = textFor('login.failed', '账号或密码不正确');
  }
});

userMenuTrigger.addEventListener('click', () => {
  userDropdown.classList.toggle('open');
});

notificationTrigger?.addEventListener('click', async () => {
  notificationDropdown?.classList.toggle('open');
  await refreshNotifications({ loadList: true });
});

loginPassword.addEventListener('focus', () => {
  loginScreen.classList.add('cover-eyes');
});

loginPassword.addEventListener('blur', () => {
  loginScreen.classList.remove('cover-eyes');
});

loginScreen.addEventListener('mousemove', (event) => {
  if (loginScreen.classList.contains('cover-eyes')) return;
  document.querySelectorAll('.watcher').forEach((watcher) => {
    const rect = watcher.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    watcher.style.setProperty('--eye-x', `${Math.cos(angle) * 4}px`);
    watcher.style.setProperty('--eye-y', `${Math.sin(angle) * 4}px`);
  });
});

document.addEventListener('mousedown', (event) => {
  const viewport = event.target.closest('[data-map-viewport]');
  if (viewport) {
    mapDragState = {
      startX: event.clientX,
      startY: event.clientY,
      originX: mapOffset.x,
      originY: mapOffset.y,
      canvasId: viewport.dataset.mapCanvas,
    };
  }
});

document.addEventListener('mousemove', (event) => {
  if (!mapDragState) return;
  mapOffset = {
    x: mapDragState.originX + event.clientX - mapDragState.startX,
    y: mapDragState.originY + event.clientY - mapDragState.startY,
  };
  const mapCanvas = document.getElementById(mapDragState.canvasId);
  if (mapCanvas) mapCanvas.style.transform = `translate(${mapOffset.x}px, ${mapOffset.y}px)`;
});

document.addEventListener('mouseup', () => {
  mapDragState = null;
});

projectSearch.addEventListener('input', (event) => {
  renderProjectTable(event.target.value);
});

salesabilityFilter.addEventListener('change', () => {
  renderProjectTable(projectSearch.value);
});

archiveFilter.addEventListener('change', () => {
  renderProjectTable(projectSearch.value);
});

initializePrototypeApp();
