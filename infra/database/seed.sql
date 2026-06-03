-- KPM seed data aligned with the approved V1 prototype.

INSERT INTO kpm_departments (id, name) VALUES
('dept-product','产品部'),('dept-hardware','硬件部'),('dept-software','软件部'),('dept-support','技术支持部'),
('dept-sales','销售部'),('dept-ops','运营部'),('dept-test','测试部'),('dept-workshop','车间');

INSERT INTO kpm_users (id, account, email, name, password_hash) VALUES
('user-zhangmin','admin@kozenmobile.com','admin@kozenmobile.com','张敏','{noop}123456'),('user-wangwei','wangwei@kozenmobile.com','wangwei@kozenmobile.com','王伟','{noop}123456'),
('user-lina','lina@kozenmobile.com','lina@kozenmobile.com','李娜','{noop}123456'),('user-chenchen','chenchen@kozenmobile.com','chenchen@kozenmobile.com','陈晨','{noop}123456'),
('user-zhaolei','zhaolei@kozenmobile.com','zhaolei@kozenmobile.com','赵磊','{noop}123456'),('user-gaojing','gaojing@kozenmobile.com','gaojing@kozenmobile.com','高静','{noop}123456'),
('user-zhouhang','zhouhang@kozenmobile.com','zhouhang@kozenmobile.com','周航','{noop}123456'),('user-sunqian','sunqian@kozenmobile.com','sunqian@kozenmobile.com','孙倩','{noop}123456'),
('user-liuyang','liuyang@kozenmobile.com','liuyang@kozenmobile.com','刘洋','{noop}123456'),('user-hejing','hejing@kozenmobile.com','hejing@kozenmobile.com','何静','{noop}123456'),('user-wuyue','wuyue@kozenmobile.com','wuyue@kozenmobile.com','吴越','{noop}123456');

INSERT INTO kpm_user_departments (user_id, department_id) VALUES
('user-zhangmin','dept-product'),('user-zhangmin','dept-ops'),('user-wangwei','dept-hardware'),('user-wangwei','dept-product'),
('user-lina','dept-software'),('user-chenchen','dept-support'),('user-zhaolei','dept-sales'),('user-gaojing','dept-sales'),
('user-zhouhang','dept-hardware'),('user-sunqian','dept-software'),('user-liuyang','dept-hardware'),('user-hejing','dept-hardware'),('user-wuyue','dept-sales');

INSERT INTO kpm_roles (id, name, role_type) VALUES
('role-admin','系统管理员','全局角色'),('role-employee','普通员工','全局角色'),('role-owner','项目负责人','项目内角色'),
('role-hw-pm','硬件项目经理','项目内角色'),('role-sw-pm','软件项目经理','项目内角色'),('role-support','技术支持','项目内角色'),('role-sales','销售','项目内角色');

INSERT INTO kpm_user_roles (user_id, role_id) VALUES
('user-zhangmin','role-admin'),('user-wangwei','role-employee'),('user-lina','role-employee'),('user-chenchen','role-employee'),
('user-zhaolei','role-employee'),('user-gaojing','role-employee'),('user-zhouhang','role-employee'),('user-sunqian','role-employee'),
('user-liuyang','role-employee'),('user-hejing','role-employee'),('user-wuyue','role-employee');

INSERT INTO kpm_permissions (id, code, name, permission_type, target, location) VALUES
('perm-menu-dashboard','menu:dashboard','菜单 / 工作台','菜单权限','工作台','左侧菜单'),
('perm-menu-projects','menu:projects','菜单 / 项目管理','菜单权限','项目管理','左侧菜单'),
('perm-menu-customers','menu:customer-master','菜单 / 客户管理','菜单权限','客户管理','左侧菜单'),
('perm-menu-tasks','menu:tasks','菜单 / 任务管理','菜单权限','任务管理','左侧菜单'),
('perm-menu-orders','menu:orders','菜单 / 订单管理','菜单权限','订单管理','左侧菜单'),
('perm-menu-analytics','menu:analytics','菜单 / 统计看板','菜单权限','统计看板','左侧菜单'),
('perm-menu-templates','menu:templates','菜单 / 流程模板','菜单权限','流程模板','左侧菜单'),
('perm-menu-resources','menu:resources','菜单 / 资源管理','菜单权限','资源管理','左侧菜单'),
('perm-button-dashboard-view-all','button:dashboard:view-all','工作台 / 查看全部','按钮权限','查看全部','工作台'),
('perm-button-projects-create','button:projects:create','项目管理 / 新建项目','按钮权限','新建项目','项目管理'),
('perm-button-projects-view-detail','button:projects:view-detail','项目管理 / 查看详情','按钮权限','查看详情','项目管理'),
('perm-button-projects-edit','button:projects:edit','项目管理 / 编辑','按钮权限','编辑','项目管理'),
('perm-button-projects-archive','button:projects:archive','项目管理 / 归档或恢复','按钮权限','归档 / 恢复','项目管理'),
('perm-button-projects-delete','button:projects:delete','项目管理 / 删除','按钮权限','删除','项目管理'),
('perm-button-project-detail-edit','button:project-detail:edit','项目详情 / 编辑项目','按钮权限','编辑项目','项目详情'),
('perm-button-project-detail-archive','button:project-detail:archive','项目详情 / 归档项目','按钮权限','归档项目','项目详情'),
('perm-button-project-detail-delete','button:project-detail:delete','项目详情 / 删除项目','按钮权限','删除项目','项目详情'),
('perm-button-project-detail-stage-detail','button:project-detail:stage-detail','项目详情 / 阶段查看详情','按钮权限','查看详情','项目详情'),
('perm-button-project-detail-customers-entry','button:project-detail:customers-entry','项目详情 / 客户列表入口','按钮权限','进入','项目详情'),
('perm-button-project-detail-materials-entry','button:project-detail:materials-entry','项目详情 / 项目资料区入口','按钮权限','进入','项目详情'),
('perm-button-project-detail-requirement-overview-entry','button:project-detail:requirement-overview-entry','项目详情 / 需求纵览入口','按钮权限','进入','项目详情'),
('perm-button-project-edit-save','button:project-edit:save','项目编辑 / 保存项目','按钮权限','保存项目','项目编辑'),
('perm-button-project-skus-save','button:project-skus:save','项目详情 / 保存 SKU','按钮权限','保存 SKU','项目详情'),
('perm-button-project-skus-delete','button:project-skus:delete','项目详情 / 删除 SKU','按钮权限','删除 SKU','项目详情'),
('perm-button-tasks-create','button:tasks:create','任务管理 / 新建任务','按钮权限','新建任务','任务管理'),
('perm-button-tasks-save','button:tasks:save','任务管理 / 保存任务','按钮权限','保存任务','任务管理'),
('perm-button-task-detail-save','button:task-detail:save','任务详情 / 保存修改','按钮权限','保存修改','任务详情'),
('perm-button-task-detail-publish-comment','button:task-detail:publish-comment','任务详情 / 发布留言','按钮权限','发布留言','任务详情'),
('perm-button-stage-detail-create-task','button:stage-detail:create-task','阶段详情 / 从该阶段新建任务','按钮权限','从该阶段新建任务','阶段详情'),
('perm-button-stage-detail-blocker-help','button:stage-detail:blocker-help','阶段详情 / 卡点求助','按钮权限','卡点求助','阶段详情'),
('perm-button-stage-detail-create-blocker-task','button:stage-detail:create-blocker-task','阶段详情 / 创建卡点任务','按钮权限','创建卡点任务','阶段详情'),
('perm-button-stage-detail-publish-file','button:stage-detail:publish-file','阶段详情 / 发布到项目资料区','按钮权限','发布到项目资料区','阶段详情'),
('perm-button-stage-detail-publish-record','button:stage-detail:publish-record','阶段详情 / 发布记录','按钮权限','发布记录','阶段详情'),
('perm-button-project-customers-link','button:project-customers:link','项目客户 / 关联已有客户','按钮权限','关联已有客户','项目客户'),
('perm-button-project-customers-save-link','button:project-customers:save-link','项目客户 / 保存关联','按钮权限','保存关联','项目客户'),
('perm-button-project-customers-requirements','button:project-customers:requirements','项目客户 / 需求列表','按钮权限','需求列表','项目客户'),
('perm-button-requirements-create','button:requirements:create','客户需求 / 新增需求','按钮权限','新增需求','客户需求'),
('perm-button-requirements-save','button:requirements:save','客户需求 / 保存需求','按钮权限','保存需求','客户需求'),
('perm-button-requirements-void','button:requirements:void','客户需求 / 作废需求','按钮权限','作废需求','客户需求'),
('perm-button-requirements-delete','button:requirements:delete','客户需求 / 删除需求','按钮权限','删除需求','客户需求'),
('perm-button-templates-create','button:templates:create','流程模板 / 新建模板','按钮权限','新建模板','流程模板'),
('perm-button-templates-edit','button:templates:edit','流程模板 / 编辑模板','按钮权限','编辑模板','流程模板'),
('perm-button-templates-toggle','button:templates:toggle','流程模板 / 启用或停用','按钮权限','启用 / 停用','流程模板'),
('perm-button-templates-delete','button:templates:delete','流程模板 / 删除模板','按钮权限','删除','流程模板'),
('perm-button-templates-add-stage','button:templates:add-stage','流程模板 / 新增阶段','按钮权限','新增阶段','流程模板'),
('perm-button-templates-move-stage-up','button:templates:move-stage-up','流程模板 / 阶段上移','按钮权限','上移','流程模板'),
('perm-button-templates-move-stage-down','button:templates:move-stage-down','流程模板 / 阶段下移','按钮权限','下移','流程模板'),
('perm-button-templates-save','button:templates:save','流程模板 / 保存模板','按钮权限','保存模板','流程模板'),
('perm-button-users-create','button:users:create','用户管理 / 新增','按钮权限','新增','用户管理'),
('perm-button-users-edit','button:users:edit','用户管理 / 编辑','按钮权限','编辑','用户管理'),
('perm-button-users-toggle','button:users:toggle','用户管理 / 启用或停用','按钮权限','启用 / 停用','用户管理'),
('perm-button-users-reset-password','button:users:reset-password','用户管理 / 重置密码','按钮权限','重置密码','用户管理'),
('perm-button-resources-edit','button:resources:edit','资源管理 / 维护配置','按钮权限','维护资源','资源管理'),
('perm-button-departments-create','button:departments:create','部门管理 / 新增','按钮权限','新增','部门管理'),
('perm-button-departments-edit','button:departments:edit','部门管理 / 编辑','按钮权限','编辑','部门管理'),
('perm-button-departments-delete','button:departments:delete','部门管理 / 删除','按钮权限','删除','部门管理'),
('perm-button-roles-create','button:roles:create','角色管理 / 新增','按钮权限','新增','角色管理'),
('perm-button-roles-edit','button:roles:edit','角色管理 / 编辑','按钮权限','编辑','角色管理'),
('perm-button-roles-delete','button:roles:delete','角色管理 / 删除','按钮权限','删除','角色管理'),
('perm-button-customers-create','button:customers:create','客户管理 / 新增','按钮权限','新增','客户管理'),
('perm-button-customers-edit','button:customers:edit','客户管理 / 编辑','按钮权限','编辑','客户管理'),
('perm-button-customers-delete','button:customers:delete','客户管理 / 删除','按钮权限','删除','客户管理'),
('perm-button-customers-view-detail','button:customers:view-detail','客户管理 / 查看详情','按钮权限','查看详情','客户管理'),
('perm-button-customer-detail-add-contact','button:customer-detail:add-contact','客户详情 / 新增联系人','按钮权限','新增联系人','客户详情'),
('perm-button-customer-detail-upload-material','button:customer-detail:upload-material','客户详情 / 上传客户资料','按钮权限','上传资料','客户详情'),
('perm-button-customer-detail-add-followup','button:customer-detail:add-followup','客户详情 / 新增跟进记录','按钮权限','新增跟进记录','客户详情'),
('perm-button-customer-detail-create-order','button:customer-detail:create-order','客户详情 / 创建订单','按钮权限','创建订单','客户详情'),
('perm-button-customer-statuses-create','button:customer-statuses:create','客户项目状态配置 / 新增','按钮权限','新增','客户项目状态配置'),
('perm-button-customer-statuses-edit','button:customer-statuses:edit','客户项目状态配置 / 编辑','按钮权限','编辑','客户项目状态配置'),
('perm-button-customer-statuses-toggle','button:customer-statuses:toggle','客户项目状态配置 / 启用或停用','按钮权限','启用 / 停用','客户项目状态配置'),
('perm-button-customer-statuses-delete','button:customer-statuses:delete','客户项目状态配置 / 删除','按钮权限','删除','客户项目状态配置'),
('perm-button-customer-levels-create','button:customer-levels:create','客户等级配置 / 新增','按钮权限','新增','客户等级配置'),
('perm-button-customer-levels-edit','button:customer-levels:edit','客户等级配置 / 编辑','按钮权限','编辑','客户等级配置'),
('perm-button-customer-levels-toggle','button:customer-levels:toggle','客户等级配置 / 启用或停用','按钮权限','启用 / 停用','客户等级配置'),
('perm-button-customer-levels-delete','button:customer-levels:delete','客户等级配置 / 删除','按钮权限','删除','客户等级配置'),
('perm-button-order-types-create','button:order-types:create','订单类型配置 / 新增','按钮权限','新增','订单类型配置'),
('perm-button-order-types-edit','button:order-types:edit','订单类型配置 / 编辑','按钮权限','编辑','订单类型配置'),
('perm-button-order-types-toggle','button:order-types:toggle','订单类型配置 / 启用或停用','按钮权限','启用 / 停用','订单类型配置'),
('perm-button-order-types-delete','button:order-types:delete','订单类型配置 / 删除','按钮权限','删除','订单类型配置'),
('perm-button-order-statuses-create','button:order-statuses:create','订单状态配置 / 新增','按钮权限','新增','订单状态配置'),
('perm-button-order-statuses-edit','button:order-statuses:edit','订单状态配置 / 编辑','按钮权限','编辑','订单状态配置'),
('perm-button-order-statuses-toggle','button:order-statuses:toggle','订单状态配置 / 启用或停用','按钮权限','启用 / 停用','订单状态配置'),
('perm-button-order-statuses-delete','button:order-statuses:delete','订单状态配置 / 删除','按钮权限','删除','订单状态配置'),
('perm-button-task-statuses-create','button:task-statuses:create','任务状态配置 / 新增状态','按钮权限','新增状态','任务状态配置'),
('perm-button-task-statuses-edit','button:task-statuses:edit','任务状态配置 / 编辑状态','按钮权限','编辑状态','任务状态配置'),
('perm-button-task-statuses-toggle','button:task-statuses:toggle','任务状态配置 / 启用或停用','按钮权限','启用 / 停用','任务状态配置'),
('perm-button-task-statuses-delete','button:task-statuses:delete','任务状态配置 / 删除状态','按钮权限','删除状态','任务状态配置'),
('perm-button-task-statuses-add-transition','button:task-statuses:add-transition','任务状态配置 / 新增流转','按钮权限','新增流转','任务状态配置'),
('perm-button-task-statuses-delete-transition','button:task-statuses:delete-transition','任务状态配置 / 删除流转','按钮权限','删除流转','任务状态配置'),
('perm-button-orders-create','button:orders:create','订单管理 / 新增订单','按钮权限','新增订单','订单管理'),
('perm-button-orders-edit','button:orders:edit','订单管理 / 编辑订单','按钮权限','编辑订单','订单管理'),
('perm-button-orders-delete','button:orders:delete','订单管理 / 删除订单','按钮权限','删除订单','订单管理'),
('perm-button-orders-view-history','button:orders:view-history','订单管理 / 查看修改记录','按钮权限','查看修改记录','订单管理');

INSERT INTO kpm_role_permissions (role_id, permission_id)
SELECT 'role-admin', id FROM kpm_permissions;
INSERT INTO kpm_role_permissions (role_id, permission_id)
SELECT 'role-employee', id FROM kpm_permissions WHERE code IN ('menu:dashboard');
INSERT INTO kpm_role_permissions (role_id, permission_id)
SELECT 'role-owner', id FROM kpm_permissions WHERE code IN ('menu:dashboard','menu:projects','menu:tasks','button:projects:create','button:projects:edit','button:tasks:create','button:tasks:save','button:task-detail:save','button:task-detail:publish-comment','button:stage-detail:create-task','button:stage-detail:blocker-help');
INSERT INTO kpm_user_permissions (user_id, permission_id)
SELECT 'user-chenchen', id FROM kpm_permissions WHERE code IN ('button:customers:create','button:customers:edit');

INSERT INTO kpm_enum_items (id, enum_type, name, value, semantic, active, sort_order) VALUES
('enum-project-status-1','project_status','未开始','未开始','DEFAULT',true,10),('enum-project-status-2','project_status','进行中','进行中','ACTIVE',true,20),('enum-project-status-3','project_status','已完成','已完成','COMPLETED',true,30),
('enum-stage-status-1','stage_status','未开始','未开始','DEFAULT',true,10),('enum-stage-status-2','stage_status','进行中','进行中','ACTIVE',true,20),('enum-stage-status-3','stage_status','已完成','已完成','COMPLETED',true,30),
('enum-salesability-1','salesability','可销售','可销售',NULL,true,10),('enum-salesability-2','salesability','不可销售','不可销售','DEFAULT',true,20),
('enum-unsellable-1','unsellable_reason','仍处于设计或测试阶段','仍处于设计或测试阶段',NULL,true,10),('enum-unsellable-2','unsellable_reason','产品过老，不再继续推广','产品过老，不再继续推广',NULL,true,20),('enum-unsellable-3','unsellable_reason','被遗弃的老项目','被遗弃的老项目',NULL,true,30),
('enum-customer-status-1','customer_master_status','潜在客户','潜在客户','DEFAULT',true,10),('enum-customer-status-2','customer_master_status','合作中','合作中',NULL,true,20),('enum-customer-status-3','customer_master_status','已停用','已停用',NULL,true,30),
('enum-customer-project-1','customer_project_status','商机发掘','商机发掘','DEFAULT',true,10),('enum-customer-project-2','customer_project_status','样机测试','样机测试',NULL,true,20),('enum-customer-project-3','customer_project_status','研发投入','研发投入',NULL,true,30),('enum-customer-project-4','customer_project_status','订单冲刺','订单冲刺',NULL,true,40),('enum-customer-project-5','customer_project_status','首单护航','首单护航',NULL,true,50),('enum-customer-project-6','customer_project_status','量产维护','量产维护',NULL,true,60),('enum-customer-project-7','customer_project_status','EOL 声明','EOL 声明',NULL,true,70),('enum-customer-project-8','customer_project_status','EOL','EOL',NULL,true,80),('enum-customer-project-9','customer_project_status','Support Ended','Support Ended',NULL,true,90),
('enum-customer-level-1','customer_level','A / 战略客户','A / 战略客户',NULL,true,10),('enum-customer-level-2','customer_level','B / 重点客户','B / 重点客户',NULL,true,20),('enum-customer-level-3','customer_level','C / 普通客户','C / 普通客户','DEFAULT',true,30),('enum-customer-level-4','customer_level','D / 观察客户','D / 观察客户',NULL,true,40),('enum-customer-level-5','customer_level','黑名单 / 暂停合作','黑名单 / 暂停合作',NULL,true,50),
('enum-order-type-1','order_type','样品订单','样品订单','样机测试',true,10),('enum-order-type-2','order_type','预订单','预订单','商机发掘',true,20),('enum-order-type-3','order_type','正式订单','正式订单','订单冲刺',true,30),
('enum-order-status-1','order_status','已创建','已创建','DEFAULT',true,10),('enum-order-status-2','order_status','生产中','生产中','IN_PRODUCTION',true,20),('enum-order-status-3','order_status','已发货','已发货','SHIPPED',true,30),('enum-order-status-4','order_status','已收货','已收货','RECEIVED',true,40),('enum-order-status-5','order_status','已完成','已完成','COMPLETED',true,50),
('enum-task-category-1','task_category','需求','需求','REQUIREMENT',true,10),('enum-task-category-2','task_category','Bug','Bug',NULL,true,20),('enum-task-category-3','task_category','技术支持','技术支持',NULL,true,30),('enum-task-category-4','task_category','其他','其他',NULL,true,40),
('enum-task-status-1','task_status','待处理','待处理','DEFAULT',true,10),('enum-task-status-2','task_status','进行中','进行中','普通',true,20),('enum-task-status-3','task_status','已完成','已完成','完成',true,30),('enum-task-status-4','task_status','已拒绝','已拒绝','拒绝',true,40),
('enum-priority-1','priority','高','高',NULL,true,10),('enum-priority-2','priority','中','中','DEFAULT',true,20),('enum-priority-3','priority','低','低',NULL,true,30),
('enum-requirement-status-1','requirement_status','待评估','待评估','DEFAULT',true,10),('enum-requirement-status-2','requirement_status','已采纳','已采纳',NULL,true,20),('enum-requirement-status-3','requirement_status','实现中','实现中',NULL,true,30),('enum-requirement-status-4','requirement_status','已实现','已实现','完成',true,40),('enum-requirement-status-5','requirement_status','已拒绝','已拒绝','拒绝',true,50),('enum-requirement-status-6','requirement_status','已作废','已作废','VOID',true,60),
('enum-currency-1','currency','USD','USD',NULL,true,10),('enum-currency-2','currency','EUR','EUR',NULL,true,20),('enum-currency-3','currency','CNY','CNY',NULL,true,30);

INSERT INTO kpm_task_status_transitions (id, from_status, to_status) VALUES
('tr-task-1','待处理','进行中'),('tr-task-2','待处理','已拒绝'),('tr-task-3','进行中','已完成'),('tr-task-4','进行中','已拒绝'),('tr-task-5','已拒绝','进行中');

INSERT INTO kpm_process_templates (id, name, scope, status, updated_at) VALUES
('tpl-standard-pos','标准 POS 产品流程','通用','启用','2026-05-15'),('tpl-overseas-custom','海外定制产品流程','海外项目','草稿','2026-05-15');
INSERT INTO kpm_template_stages (id, template_id, stage_name, sort_order) VALUES
('tpl-standard-1','tpl-standard-pos','提出想法',1),('tpl-standard-2','tpl-standard-pos','讨论可行性',2),('tpl-standard-3','tpl-standard-pos','核算成本',3),('tpl-standard-4','tpl-standard-pos','硬件设计',4),('tpl-standard-5','tpl-standard-pos','软件适配',5),('tpl-standard-6','tpl-standard-pos','测试生产',6),('tpl-standard-7','tpl-standard-pos','试用',7),('tpl-standard-8','tpl-standard-pos','客户推广',8),
('tpl-overseas-1','tpl-overseas-custom','提出想法',1),('tpl-overseas-2','tpl-overseas-custom','讨论可行性',2),('tpl-overseas-3','tpl-overseas-custom','硬件设计',3),('tpl-overseas-4','tpl-overseas-custom','软件适配',4),('tpl-overseas-5','tpl-overseas-custom','客户调试',5),('tpl-overseas-6','tpl-overseas-custom','客户下单',6);

INSERT INTO kpm_projects (id, external_name, internal_name, model_name, manager_user_id, manager_account, status, archived, salesability, unsellable_reason, description) VALUES
('p8-dual','P8 dual','R2351','K1352','user-wangwei','wangwei@kozenmobile.com','进行中',false,'不可销售','仍处于设计或测试阶段','面向海外市场的双屏 POS 设备。'),
('s6-mini','S6 mini','R2290','K1290','user-zhouhang','zhouhang@kozenmobile.com','进行中',false,'不可销售','仍处于设计或测试阶段','轻量级移动收银终端。'),
('x10-pro','X10 Pro','R2410','K1410','user-liuyang','liuyang@kozenmobile.com','已完成',true,'不可销售','产品过老，不再继续推广','高端桌面式 POS 设备。'),
('m5-plus','M5 Plus','R2510','K1510','user-hejing','hejing@kozenmobile.com','进行中',false,'可销售',NULL,'已完成设计测试并进入客户推广的移动 POS。');

INSERT INTO kpm_project_skus (id, project_id, whole_machine_part_number, configuration_name, memory_type, active) VALUES
('sku-p8-dual-4-64','p8-dual','K1352-4G64G-DUAL','P8 dual / 4GB+64GB / 双屏','LPDDR4 + eMMC',true),
('sku-p8-dual-6-128','p8-dual','K1352-6G128G-DUAL','P8 dual / 6GB+128GB / 双屏','LPDDR4X + UFS',true),
('sku-m5-plus-4-64','m5-plus','K1510-4G64G-MOB','M5 Plus / 4GB+64GB / 移动版','LPDDR4 + eMMC',true),
('sku-x10-pro-8-128','x10-pro','K1410-8G128G-DESK','X10 Pro / 8GB+128GB / 桌面旗舰版','LPDDR4X + UFS',true);

INSERT INTO kpm_project_members (id, project_id, user_id, user_account, role_name) VALUES
('pm-p8-1','p8-dual','user-wangwei','wangwei@kozenmobile.com','硬件项目经理'),('pm-p8-2','p8-dual','user-lina','lina@kozenmobile.com','软件项目经理'),('pm-p8-3','p8-dual','user-chenchen','chenchen@kozenmobile.com','技术支持'),('pm-p8-4','p8-dual','user-zhaolei','zhaolei@kozenmobile.com','销售'),
('pm-s6-1','s6-mini','user-zhouhang','zhouhang@kozenmobile.com','硬件项目经理'),('pm-s6-2','s6-mini','user-sunqian','sunqian@kozenmobile.com','软件项目经理'),
('pm-x10-1','x10-pro','user-liuyang','liuyang@kozenmobile.com','硬件项目经理'),('pm-x10-2','x10-pro','user-gaojing','gaojing@kozenmobile.com','销售'),
('pm-m5-1','m5-plus','user-hejing','hejing@kozenmobile.com','硬件项目经理'),('pm-m5-2','m5-plus','user-wuyue','wuyue@kozenmobile.com','销售');

INSERT INTO kpm_project_stages (id, project_id, stage_name, stage_order, status) VALUES
('st-p8-1','p8-dual','提出想法',1,'已完成'),('st-p8-2','p8-dual','讨论可行性',2,'已完成'),('st-p8-3','p8-dual','核算成本',3,'已完成'),('st-p8-4','p8-dual','硬件设计',4,'已完成'),('st-p8-5','p8-dual','软件适配',5,'进行中'),('st-p8-6','p8-dual','测试生产',6,'未开始'),('st-p8-7','p8-dual','试用',7,'未开始'),('st-p8-8','p8-dual','客户推广',8,'未开始'),
('st-s6-1','s6-mini','提出想法',1,'已完成'),('st-s6-2','s6-mini','讨论可行性',2,'已完成'),('st-s6-3','s6-mini','核算成本',3,'进行中'),('st-s6-4','s6-mini','硬件设计',4,'未开始'),('st-s6-5','s6-mini','测试生产',5,'未开始'),
('st-x10-1','x10-pro','提出想法',1,'已完成'),('st-x10-2','x10-pro','讨论可行性',2,'已完成'),('st-x10-3','x10-pro','核算成本',3,'已完成'),('st-x10-4','x10-pro','硬件设计',4,'已完成'),('st-x10-5','x10-pro','软件适配',5,'已完成'),('st-x10-6','x10-pro','测试生产',6,'已完成'),('st-x10-7','x10-pro','试用',7,'已完成'),('st-x10-8','x10-pro','客户推广',8,'已完成'),
('st-m5-1','m5-plus','硬件设计',1,'已完成'),('st-m5-2','m5-plus','软件适配',2,'已完成'),('st-m5-3','m5-plus','测试生产',3,'已完成'),('st-m5-4','m5-plus','客户推广',4,'进行中');

INSERT INTO kpm_stage_assignees (id, stage_id, assignee_type, assignee_name, account, user_id) VALUES
('sa-p8-1-1','st-p8-1','department','销售部',NULL,NULL),('sa-p8-1-2','st-p8-1','department','产品部',NULL,NULL),('sa-p8-4-1','st-p8-4','user','王伟','wangwei@kozenmobile.com','user-wangwei'),('sa-p8-5-1','st-p8-5','user','李娜','lina@kozenmobile.com','user-lina'),('sa-p8-8-1','st-p8-8','department','销售部',NULL,NULL),('sa-p8-8-2','st-p8-8','department','技术支持部',NULL,NULL),
('sa-s6-3-1','st-s6-3','department','运营部',NULL,NULL),('sa-m5-4-1','st-m5-4','department','销售部',NULL,NULL);

INSERT INTO kpm_stage_materials (id, stage_id, file_name, file_type, file_size, uploader, uploaded_at, published_to_project) VALUES
('sm-p8-1','st-p8-5','软件适配方案_v1.pdf','PDF','1.2 MB','李娜','2026-05-16 10:00',false),('sm-p8-2','st-p8-4','硬件接口说明_v2.pdf','PDF','2.4 MB','王伟','2026-05-10 11:00',true);
INSERT INTO kpm_stage_records (id, stage_id, author, content, attachments, created_at) VALUES
('sr-p8-1','st-p8-5','李娜','支付模块语言包正在补齐，优先完成德语和泰语字段。','[]','2026-05-17 09:10'),('sr-p8-2','st-p8-5','王伟','硬件接口文档已发布到项目资料区，客户推广阶段可引用。','[{"name":"接口截图.png","type":"图片"}]','2026-05-17 11:40');
INSERT INTO kpm_project_materials (id, project_id, source_stage, file_name, share_target, published_at) VALUES
('mat-p8-1','p8-dual','硬件设计','硬件接口说明_v2.pdf','项目资料区','2026-05-10 11:00');

INSERT INTO kpm_customers (id, name, short_name, region, address, level, status) VALUES
('cus-nova','Nova Retail','Nova','德国','Berlin, Germany','A / 战略客户','合作中'),
('cus-siam','Siam Pay','Siam','泰国','Bangkok, Thailand','B / 重点客户','潜在客户'),
('cus-andes','Andes Market','Andes','智利','Santiago, Chile','D / 观察客户','已停用'),
('cus-pacific','Pacific Mart','Pacific','菲律宾','Manila, Philippines','C / 普通客户','潜在客户'),
('cus-metro','Metro One','Metro','阿联酋','Dubai, United Arab Emirates','B / 重点客户','潜在客户');

INSERT INTO kpm_customer_owners (id, customer_id, owner_type, owner_user_id, owner_name) VALUES
('co-nova-sales','cus-nova','sales','user-zhaolei','赵磊'),('co-nova-support','cus-nova','support','user-chenchen','陈晨'),('co-siam-sales','cus-siam','sales','user-gaojing','高静'),('co-siam-support','cus-siam','support','user-chenchen','陈晨'),('co-andes-sales','cus-andes','sales','user-zhaolei','赵磊'),('co-andes-support','cus-andes','support','user-chenchen','陈晨'),('co-pacific-support','cus-pacific','support','user-chenchen','陈晨'),('co-metro-sales','cus-metro','sales','user-wuyue','吴越');

INSERT INTO kpm_customer_contacts (id, customer_id, name, title, phone, email, remark) VALUES
('cc-nova-1','cus-nova','Anna Müller','采购经理','+49 30 1000 2000','anna.mueller@nova.example','负责门店采购与试点反馈'),('cc-nova-2','cus-nova','Lukas Bauer','IT 负责人','+49 30 1000 2001','lukas.bauer@nova.example','关注软件版本和设备部署'),('cc-siam-1','cus-siam','Niran Chai','产品负责人','+66 2 000 8899','niran@siampay.example','负责泰国本地化需求确认');

INSERT INTO kpm_customer_materials (id, customer_id, file_name, file_type, file_size, uploader, uploaded_at) VALUES
('cm-nova-1','cus-nova','Nova_年度合作框架.pdf','PDF','1.8 MB','赵磊','2026-05-08 11:20'),('cm-nova-2','cus-nova','Berlin门店照片.zip','压缩包','24 MB','陈晨','2026-05-10 16:45'),('cm-siam-1','cus-siam','泰语键盘膜需求.png','图片','920 KB','高静','2026-05-12 09:40'),('cm-pacific-1','cus-pacific','Pacific_门店网络照片.zip','压缩包','18 MB','陈晨','2026-05-15 14:00');

INSERT INTO kpm_customer_followups (id, customer_id, author, content, attachments, created_at) VALUES
('cf-nova-1','cus-nova','赵磊','客户确认 6 月初需要一批正式订单，重点关注欧规充电器和收据模板。','[{"name":"会议纪要.docx","type":"文档"}]','2026-05-18 15:30'),('cf-nova-2','cus-nova','陈晨','远程演示已完成，客户要求补充德语小票字段截图。','[]','2026-05-16 10:10'),('cf-siam-1','cus-siam','高静','客户希望先走预订单，待泰语键盘膜确认后转正式订单。','[]','2026-05-17 13:20'),('cf-pacific-1','cus-pacific','陈晨','销售线下带客户进行现场网络测试，已在 KPM 中记录客户跟进。','[]','2026-05-15 16:20');

INSERT INTO kpm_project_customers (id, project_id, customer_id, project_status) VALUES
('pc-p8-nova','p8-dual','cus-nova','商机发掘'),('pc-p8-siam','p8-dual','cus-siam','样机测试'),('pc-p8-pacific','p8-dual','cus-pacific','样机测试'),('pc-s6-nova','s6-mini','cus-nova','样机测试'),('pc-x10-nova','x10-pro','cus-nova','EOL');

INSERT INTO kpm_requirements (id, project_id, customer_id, title, user_story, business_value, acceptance, priority, status, proposer, creator, created_date, task_id) VALUES
('REQ-001','p8-dual','cus-nova','支持多语言收据模板','作为门店经理，我希望根据国家切换收据语言，以便服务当地客户。','减少前台人工解释成本','可选择至少中英两种语言模板；打印内容正确','高','待评估','Nova Retail','赵磊','2026-05-05',NULL),
('REQ-002','p8-dual','cus-nova','远程批量升级','作为运维人员，我希望批量升级设备，以便降低门店维护成本。','减少现场维护次数','可对指定设备组批量下发升级任务','高','已采纳','Nova Retail','赵磊','2026-05-07',NULL),
('REQ-003','p8-dual','cus-siam','支持多语言收据模板','作为区域运营，我希望为不同国家设置收据语言，以便统一服务体验。','降低培训复杂度','支持按国家配置语言模板','中','待评估','Siam Pay','高静','2026-05-08',NULL),
('REQ-004','p8-dual','cus-siam','低电量提醒','作为店员，我希望设备在低电量时提醒，以避免交易中断。','减少交易失败','低于 20% 电量时提醒','中','待评估','Siam Pay','高静','2026-05-09',NULL);

INSERT INTO kpm_tasks (id, title, description, project_id, stage_id, category, status, priority, creator_user_id, creator, expected_completion_at, due_date, source, customer_id, blocked) VALUES
('KPM-101','确认支付模块语言包','核对中英文语言包与收据模板，确认海外版本可正常展示。','p8-dual','st-p8-5','需求','进行中','高','user-zhangmin','张敏','2026-05-20','2026-05-20','阶段详情','cus-nova',false),
('KPM-102','整理客户推广演示脚本','整理销售与技术支持联合演示时使用的讲解脚本。','p8-dual','st-p8-8','技术支持','待处理','中','user-zhangmin','张敏','2026-05-24','2026-05-24','任务管理','cus-nova',false),
('KPM-103','确认试产测试清单','确认试产前的硬件、软件与车间检查项。','s6-mini','st-s6-5','其他','已完成','高','user-zhouhang','周航','2026-05-10','2026-05-10','任务管理','cus-nova',false),
('KPM-104','现场网络环境技术支持','销售线下带客户试用设备，需要技术支持确认弱网环境下的联网稳定性。','p8-dual','st-p8-8','技术支持','进行中','中','user-chenchen','陈晨','2026-05-22','2026-05-22','线下支持补录','cus-pacific',true);
INSERT INTO kpm_task_assignees (task_id, user_id, assignee_name) VALUES ('KPM-101','user-lina','李娜'),('KPM-102','user-chenchen','陈晨'),('KPM-103','user-zhouhang','周航'),('KPM-104','user-chenchen','陈晨');
INSERT INTO kpm_task_participants (task_id, user_id, participant_name) VALUES ('KPM-101','user-wangwei','王伟'),('KPM-102','user-wangwei','王伟'),('KPM-102','user-zhaolei','赵磊');
INSERT INTO kpm_task_attachments (id, task_id, file_name, file_type, file_size, uploader, uploaded_at) VALUES ('ta-101-1','KPM-101','支付语言包说明.pdf','PDF','860 KB','李娜','2026-05-16 10:20');
INSERT INTO kpm_task_comments (id, task_id, author, content, attachments, created_at) VALUES ('tc-101-1','KPM-101','李娜','英语文案已确认，今天补齐德国版特殊字段。','[]','2026-05-17 09:10'),('tc-104-1','KPM-104','陈晨','已完成第一轮现场排查，等待销售确认下一步推进计划。','[]','2026-05-16 09:30');

INSERT INTO kpm_orders (id, order_date, customer_id, project_id, sku_id, sku_snapshot, order_type, status, quantity, specification, expected_ship_date, planned_ship_date, actual_ship_date, software_version, currency, unit_price, amount, creator_user_id, creator) VALUES
('ORD-202601-002','2026-01-16','cus-nova','m5-plus','sku-m5-plus-4-64','{"wholeMachinePartNumber":"K1510-4G64G-MOB","configurationName":"M5 Plus / 4GB+64GB / 移动版","memoryType":"LPDDR4 + eMMC"}','正式订单','已完成',90,'欧规充电器 / 黑色','2026-02-12','2026-02-10','2026-02-10','v3.0.0','USD',166,14940,'user-zhaolei','赵磊'),
('ORD-202602-004','2026-02-21','cus-siam','p8-dual','sku-p8-dual-4-64','{"wholeMachinePartNumber":"K1352-4G64G-DUAL","configurationName":"P8 dual / 4GB+64GB / 双屏","memoryType":"LPDDR4 + eMMC"}','样品订单','已收货',80,'泰语键盘膜 / 银色','2026-03-18','2026-03-20','2026-03-20','v2.6.0','USD',232,18560,'user-gaojing','高静'),
('ORD-202603-006','2026-03-10','cus-nova','m5-plus','sku-m5-plus-4-64','{"wholeMachinePartNumber":"K1510-4G64G-MOB","configurationName":"M5 Plus / 4GB+64GB / 移动版","memoryType":"LPDDR4 + eMMC"}','正式订单','已完成',120,'欧规充电器 / 黑色','2026-04-08','2026-04-06','2026-04-06','v3.1.0','USD',167,20040,'user-zhaolei','赵磊'),
('ORD-202605-001','2026-05-02','cus-nova','m5-plus','sku-m5-plus-4-64','{"wholeMachinePartNumber":"K1510-4G64G-MOB","configurationName":"M5 Plus / 4GB+64GB / 移动版","memoryType":"LPDDR4 + eMMC"}','正式订单','生产中',180,'欧规充电器 / 黑色','2026-06-05','2026-06-03',NULL,'v3.2.1','USD',168,30240,'user-zhaolei','赵磊'),
('ORD-202604-008','2026-04-18','cus-siam','p8-dual','sku-p8-dual-4-64','{"wholeMachinePartNumber":"K1352-4G64G-DUAL","configurationName":"P8 dual / 4GB+64GB / 双屏","memoryType":"LPDDR4 + eMMC"}','预订单','已创建',120,'泰语键盘膜 / 银色','2026-05-28','2026-05-30',NULL,'v2.8.0-beta','USD',236,28320,'user-gaojing','高静'),
('ORD-202605-011','2026-05-11','cus-siam','p8-dual','sku-p8-dual-6-128','{"wholeMachinePartNumber":"K1352-6G128G-DUAL","configurationName":"P8 dual / 6GB+128GB / 双屏","memoryType":"LPDDR4X + UFS"}','正式订单','已创建',140,'泰语键盘膜 / 银色','2026-06-08','2026-06-10',NULL,'v2.8.1','USD',238,33320,'user-gaojing','高静'),
('ORD-202503-014','2025-03-12','cus-nova','x10-pro','sku-x10-pro-8-128','{"wholeMachinePartNumber":"K1410-8G128G-DESK","configurationName":"X10 Pro / 8GB+128GB / 桌面旗舰版","memoryType":"LPDDR4X + UFS"}','正式订单','已完成',60,'NFC / 德语包','2025-04-10','2025-04-08','2025-04-08','v5.1.4','EUR',320,19200,'user-zhaolei','赵磊');
INSERT INTO kpm_order_histories (id, order_id, modifier, modified_at, changes, reason) VALUES
('oh-202605-001-1','ORD-202605-001','张敏','2026-05-06 14:20','计划发货日期：2026-06-01 → 2026-06-03','客户要求与门店开业时间对齐');
