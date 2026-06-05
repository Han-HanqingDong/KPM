-- KPM clean seed data for manual testing after BIGINT technical primary key migration.
-- Only system configuration and one administrator account are initialized.

INSERT INTO kpm_departments (id, name, status) VALUES
(101, '系统管理部', '启用');

INSERT INTO kpm_users (id, account, email, name, password_hash, status) VALUES
(1001, 'admin@kozenmobile.com', 'admin@kozenmobile.com', '系统管理员', '{noop}123456', '启用');

INSERT INTO kpm_user_departments (user_id, department_id) VALUES
(1001, 101);

INSERT INTO kpm_roles (id, name, role_type, status) VALUES
(2001, 'CTO', '全局角色', '启用');

INSERT INTO kpm_user_roles (user_id, role_id) VALUES
(1001, 2001);

INSERT INTO kpm_permissions (id, code, name, permission_type, target, location) VALUES
(3001,'menu:dashboard','菜单 / 工作台','菜单权限','工作台','左侧菜单'),
(3002,'menu:projects','菜单 / 项目管理','菜单权限','项目管理','左侧菜单'),
(3003,'menu:customer-master','菜单 / 客户管理','菜单权限','客户管理','左侧菜单'),
(3004,'menu:tasks','菜单 / 任务管理','菜单权限','任务管理','左侧菜单'),
(3005,'menu:orders','菜单 / 订单管理','菜单权限','订单管理','左侧菜单'),
(3006,'menu:analytics','菜单 / 统计看板','菜单权限','统计看板','左侧菜单'),
(3007,'menu:templates','菜单 / 流程模板','菜单权限','流程模板','左侧菜单'),
(3008,'menu:resources','菜单 / 资源管理','菜单权限','资源管理','左侧菜单'),
(3009,'button:dashboard:view-all','工作台 / 查看全部','按钮权限','查看全部','工作台'),
(3010,'button:projects:create','项目管理 / 新建项目','按钮权限','新建项目','项目管理'),
(3011,'button:projects:view-detail','项目管理 / 查看详情','按钮权限','查看详情','项目管理'),
(3012,'button:projects:edit','项目管理 / 编辑','按钮权限','编辑','项目管理'),
(3013,'button:projects:archive','项目管理 / 归档或恢复','按钮权限','归档 / 恢复','项目管理'),
(3014,'button:projects:delete','项目管理 / 删除','按钮权限','删除','项目管理'),
(3015,'button:project-detail:edit','项目详情 / 编辑项目','按钮权限','编辑项目','项目详情'),
(3016,'button:project-detail:archive','项目详情 / 归档项目','按钮权限','归档项目','项目详情'),
(3017,'button:project-detail:delete','项目详情 / 删除项目','按钮权限','删除项目','项目详情'),
(3018,'button:project-detail:stage-detail','项目详情 / 阶段查看详情','按钮权限','查看详情','项目详情'),
(3019,'button:project-detail:customers-entry','项目详情 / 客户列表入口','按钮权限','进入','项目详情'),
(3020,'button:project-detail:materials-entry','项目详情 / 项目资料区入口','按钮权限','进入','项目详情'),
(3021,'button:project-detail:requirement-overview-entry','项目详情 / 需求纵览入口','按钮权限','进入','项目详情'),
(3094,'button:project-detail:edit-members','项目详情 / 维护成员','按钮权限','维护成员','项目详情'),
(3095,'button:project-materials:upload','项目详情 / 上传项目资料','按钮权限','上传项目资料','项目详情'),
(3096,'button:project-materials:publish-customer','项目详情 / 公开项目资料','按钮权限','公开项目资料','项目详情'),
(3022,'button:project-edit:save','项目编辑 / 保存项目','按钮权限','保存项目','项目编辑'),
(3023,'button:project-skus:save','项目详情 / 保存 SKU','按钮权限','保存 SKU','项目详情'),
(3024,'button:project-skus:delete','项目详情 / 删除 SKU','按钮权限','删除 SKU','项目详情'),
(3025,'button:tasks:create','任务管理 / 新建任务','按钮权限','新建任务','任务管理'),
(3026,'button:tasks:save','任务管理 / 保存任务','按钮权限','保存任务','任务管理'),
(3027,'button:task-detail:save','任务详情 / 保存修改','按钮权限','保存修改','任务详情'),
(3028,'button:task-detail:publish-comment','任务详情 / 发布留言','按钮权限','发布留言','任务详情'),
(3029,'button:stage-detail:create-task','阶段详情 / 从该阶段新建任务','按钮权限','从该阶段新建任务','阶段详情'),
(3030,'button:stage-detail:blocker-help','阶段详情 / 卡点求助','按钮权限','卡点求助','阶段详情'),
(3031,'button:stage-detail:create-blocker-task','阶段详情 / 创建卡点任务','按钮权限','创建卡点任务','阶段详情'),
(3032,'button:stage-detail:publish-file','阶段详情 / 发布到项目资料区','按钮权限','发布到项目资料区','阶段详情'),
(3033,'button:stage-detail:publish-record','阶段详情 / 发布记录','按钮权限','发布记录','阶段详情'),
(3034,'button:project-customers:link','项目客户 / 关联已有客户','按钮权限','关联已有客户','项目客户'),
(3035,'button:project-customers:save-link','项目客户 / 保存关联','按钮权限','保存关联','项目客户'),
(3036,'button:project-customers:requirements','项目客户 / 需求列表','按钮权限','需求列表','项目客户'),
(3037,'button:requirements:create','客户需求 / 新增需求','按钮权限','新增需求','客户需求'),
(3038,'button:requirements:save','客户需求 / 保存需求','按钮权限','保存需求','客户需求'),
(3039,'button:requirements:void','客户需求 / 作废需求','按钮权限','作废需求','客户需求'),
(3040,'button:requirements:delete','客户需求 / 删除需求','按钮权限','删除需求','客户需求'),
(3041,'button:templates:create','流程模板 / 新建模板','按钮权限','新建模板','流程模板'),
(3042,'button:templates:edit','流程模板 / 编辑模板','按钮权限','编辑模板','流程模板'),
(3043,'button:templates:toggle','流程模板 / 启用或停用','按钮权限','启用 / 停用','流程模板'),
(3044,'button:templates:delete','流程模板 / 删除模板','按钮权限','删除','流程模板'),
(3045,'button:templates:add-stage','流程模板 / 新增阶段','按钮权限','新增阶段','流程模板'),
(3046,'button:templates:move-stage-up','流程模板 / 阶段上移','按钮权限','上移','流程模板'),
(3047,'button:templates:move-stage-down','流程模板 / 阶段下移','按钮权限','下移','流程模板'),
(3048,'button:templates:save','流程模板 / 保存模板','按钮权限','保存模板','流程模板'),
(3049,'button:users:create','用户管理 / 新增','按钮权限','新增','用户管理'),
(3050,'button:users:edit','用户管理 / 编辑','按钮权限','编辑','用户管理'),
(3051,'button:users:toggle','用户管理 / 启用或停用','按钮权限','启用 / 停用','用户管理'),
(3052,'button:users:reset-password','用户管理 / 重置密码','按钮权限','重置密码','用户管理'),
(3053,'button:resources:edit','资源管理 / 维护配置','按钮权限','维护资源','资源管理'),
(3054,'button:departments:create','部门管理 / 新增','按钮权限','新增','部门管理'),
(3055,'button:departments:edit','部门管理 / 编辑','按钮权限','编辑','部门管理'),
(3056,'button:departments:delete','部门管理 / 删除','按钮权限','删除','部门管理'),
(3057,'button:roles:create','角色管理 / 新增','按钮权限','新增','角色管理'),
(3058,'button:roles:edit','角色管理 / 编辑','按钮权限','编辑','角色管理'),
(3059,'button:roles:delete','角色管理 / 删除','按钮权限','删除','角色管理'),
(3060,'button:customers:create','客户管理 / 新增','按钮权限','新增','客户管理'),
(3061,'button:customers:edit','客户管理 / 编辑','按钮权限','编辑','客户管理'),
(3062,'button:customers:delete','客户管理 / 删除','按钮权限','删除','客户管理'),
(3063,'button:customers:view-detail','客户管理 / 查看详情','按钮权限','查看详情','客户管理'),
(3064,'button:customer-detail:add-contact','客户详情 / 新增联系人','按钮权限','新增联系人','客户详情'),
(3065,'button:customer-detail:upload-material','客户详情 / 上传客户资料','按钮权限','上传资料','客户详情'),
(3066,'button:customer-detail:add-followup','客户详情 / 新增跟进记录','按钮权限','新增跟进记录','客户详情'),
(3067,'button:customer-detail:create-order','客户详情 / 创建订单','按钮权限','创建订单','客户详情'),
(3068,'button:customer-statuses:create','客户项目状态配置 / 新增','按钮权限','新增','客户项目状态配置'),
(3069,'button:customer-statuses:edit','客户项目状态配置 / 编辑','按钮权限','编辑','客户项目状态配置'),
(3070,'button:customer-statuses:toggle','客户项目状态配置 / 启用或停用','按钮权限','启用 / 停用','客户项目状态配置'),
(3071,'button:customer-statuses:delete','客户项目状态配置 / 删除','按钮权限','删除','客户项目状态配置'),
(3072,'button:customer-levels:create','客户等级配置 / 新增','按钮权限','新增','客户等级配置'),
(3073,'button:customer-levels:edit','客户等级配置 / 编辑','按钮权限','编辑','客户等级配置'),
(3074,'button:customer-levels:toggle','客户等级配置 / 启用或停用','按钮权限','启用 / 停用','客户等级配置'),
(3075,'button:customer-levels:delete','客户等级配置 / 删除','按钮权限','删除','客户等级配置'),
(3076,'button:order-types:create','订单类型配置 / 新增','按钮权限','新增','订单类型配置'),
(3077,'button:order-types:edit','订单类型配置 / 编辑','按钮权限','编辑','订单类型配置'),
(3078,'button:order-types:toggle','订单类型配置 / 启用或停用','按钮权限','启用 / 停用','订单类型配置'),
(3079,'button:order-types:delete','订单类型配置 / 删除','按钮权限','删除','订单类型配置'),
(3080,'button:order-statuses:create','订单状态配置 / 新增','按钮权限','新增','订单状态配置'),
(3081,'button:order-statuses:edit','订单状态配置 / 编辑','按钮权限','编辑','订单状态配置'),
(3082,'button:order-statuses:toggle','订单状态配置 / 启用或停用','按钮权限','启用 / 停用','订单状态配置'),
(3083,'button:order-statuses:delete','订单状态配置 / 删除','按钮权限','删除','订单状态配置'),
(3084,'button:task-statuses:create','任务状态配置 / 新增状态','按钮权限','新增状态','任务状态配置'),
(3085,'button:task-statuses:edit','任务状态配置 / 编辑状态','按钮权限','编辑状态','任务状态配置'),
(3086,'button:task-statuses:toggle','任务状态配置 / 启用或停用','按钮权限','启用 / 停用','任务状态配置'),
(3087,'button:task-statuses:delete','任务状态配置 / 删除状态','按钮权限','删除状态','任务状态配置'),
(3088,'button:task-statuses:add-transition','任务状态配置 / 新增流转','按钮权限','新增流转','任务状态配置'),
(3089,'button:task-statuses:delete-transition','任务状态配置 / 删除流转','按钮权限','删除流转','任务状态配置'),
(3090,'button:orders:create','订单管理 / 新增订单','按钮权限','新增订单','订单管理'),
(3091,'button:orders:edit','订单管理 / 编辑订单','按钮权限','编辑订单','订单管理'),
(3092,'button:orders:delete','订单管理 / 删除订单','按钮权限','删除订单','订单管理'),
(3093,'button:orders:view-history','订单管理 / 查看修改记录','按钮权限','查看修改记录','订单管理'),
(3097,'button:project-detail:publish-announcement','项目详情 / 发布公告','按钮权限','发布公告','项目详情'),
(3098,'button:customer-detail:send-notification','客户详情 / 发送通知','按钮权限','发送通知','客户详情');

INSERT INTO kpm_role_permissions (role_id, permission_id)
SELECT 2001, id FROM kpm_permissions;

INSERT INTO kpm_enum_items (id, enum_type, name, value, semantic, active, sort_order) VALUES
(5004,'stage_status','未开始','未开始','DEFAULT',true,10),(5005,'stage_status','进行中','进行中','ACTIVE',true,20),(5006,'stage_status','已完成','已完成','COMPLETED',true,30),
(5012,'customer_master_status','潜在客户','潜在客户','DEFAULT',true,10),(5013,'customer_master_status','合作中','合作中',NULL,true,20),(5014,'customer_master_status','已停用','已停用',NULL,true,30),
(5015,'customer_project_status','商机发掘','商机发掘','DEFAULT',true,10),(5016,'customer_project_status','样机测试','样机测试',NULL,true,20),(5017,'customer_project_status','研发投入','研发投入',NULL,true,30),(5018,'customer_project_status','订单冲刺','订单冲刺',NULL,true,40),(5019,'customer_project_status','首单护航','首单护航',NULL,true,50),(5020,'customer_project_status','量产维护','量产维护',NULL,true,60),(5021,'customer_project_status','EOL 声明','EOL 声明',NULL,true,70),(5022,'customer_project_status','EOL','EOL',NULL,true,80),(5023,'customer_project_status','Support Ended','Support Ended',NULL,true,90),
(5024,'customer_level','A / 战略客户','A / 战略客户',NULL,true,10),(5025,'customer_level','B / 重点客户','B / 重点客户',NULL,true,20),(5026,'customer_level','C / 普通客户','C / 普通客户','DEFAULT',true,30),(5027,'customer_level','D / 观察客户','D / 观察客户',NULL,true,40),(5028,'customer_level','黑名单 / 暂停合作','黑名单 / 暂停合作',NULL,true,50),
(5029,'order_type','样品订单','样品订单','样机测试',true,10),(5030,'order_type','预订单','预订单','商机发掘',true,20),(5031,'order_type','正式订单','正式订单','订单冲刺',true,30),
(5032,'order_status','已创建','已创建','DEFAULT',true,10),(5033,'order_status','生产中','生产中','IN_PRODUCTION',true,20),(5034,'order_status','已发货','已发货','SHIPPED',true,30),(5035,'order_status','已收货','已收货','RECEIVED',true,40),(5036,'order_status','已完成','已完成','COMPLETED',true,50),
(5037,'task_category','需求','需求','REQUIREMENT',true,10),(5038,'task_category','Bug','Bug',NULL,true,20),(5039,'task_category','技术支持','技术支持',NULL,true,30),(5040,'task_category','其他','其他',NULL,true,40),
(5041,'task_status','待处理','待处理','DEFAULT',true,10),(5042,'task_status','进行中','进行中','普通',true,20),(5043,'task_status','已完成','已完成','完成',true,30),(5044,'task_status','已拒绝','已拒绝','拒绝',true,40),
(5045,'priority','高','高',NULL,true,10),(5046,'priority','中','中','DEFAULT',true,20),(5047,'priority','低','低',NULL,true,30),
(5057,'task_priority','高','高',NULL,true,10),(5058,'task_priority','中','中','DEFAULT',true,20),(5059,'task_priority','低','低',NULL,true,30),
(5048,'requirement_status','待评估','待评估','DEFAULT',true,10),(5049,'requirement_status','已采纳','已采纳',NULL,true,20),(5050,'requirement_status','实现中','实现中',NULL,true,30),(5051,'requirement_status','已实现','已实现','完成',true,40),(5052,'requirement_status','已拒绝','已拒绝','拒绝',true,50),(5053,'requirement_status','已作废','已作废','VOID',true,60),
(5054,'currency','USD','USD',NULL,true,10),(5055,'currency','EUR','EUR',NULL,true,20),(5056,'currency','CNY','CNY',NULL,true,30),
(5060,'project_announcement_type','普通公告','普通公告','DEFAULT',true,10),(5061,'project_announcement_type','产品 EOL 公告','产品EOL公告','EOL',true,20);

UPDATE kpm_enum_items
SET label_zh = COALESCE(label_zh, name),
    label_en = COALESCE(label_en, name),
    short_label_zh = COALESCE(short_label_zh, LEFT(name, 1)),
    short_label_en = COALESCE(short_label_en, LEFT(value, 1));

UPDATE kpm_enum_items SET label_zh='需求', label_en='Requirement', short_label_zh='需', short_label_en='R' WHERE enum_type='task_category' AND value='需求';
UPDATE kpm_enum_items SET label_zh='Bug', label_en='Bug', short_label_zh='B', short_label_en='B' WHERE enum_type='task_category' AND value='Bug';
UPDATE kpm_enum_items SET label_zh='技术支持', label_en='Support', short_label_zh='支', short_label_en='S' WHERE enum_type='task_category' AND value='技术支持';
UPDATE kpm_enum_items SET label_zh='其他', label_en='Other', short_label_zh='其', short_label_en='O' WHERE enum_type='task_category' AND value='其他';
UPDATE kpm_enum_items SET label_zh='高', label_en='High', short_label_zh='高', short_label_en='H' WHERE enum_type IN ('task_priority','priority') AND value='高';
UPDATE kpm_enum_items SET label_zh='中', label_en='Medium', short_label_zh='中', short_label_en='M' WHERE enum_type IN ('task_priority','priority') AND value='中';
UPDATE kpm_enum_items SET label_zh='低', label_en='Low', short_label_zh='低', short_label_en='L' WHERE enum_type IN ('task_priority','priority') AND value='低';

INSERT INTO kpm_task_status_transitions (id, from_status, to_status) VALUES
(7001,'待处理','进行中'),(7002,'待处理','已拒绝'),(7003,'进行中','已完成'),(7004,'进行中','已拒绝'),(7005,'已拒绝','进行中');

INSERT INTO kpm_process_templates (id, name, scope, status, updated_at) VALUES
(8001,'标准 POS 产品流程','通用','启用','2026-05-15'),(8002,'海外定制产品流程','海外项目','草稿','2026-05-15');
INSERT INTO kpm_template_stages (id, template_id, stage_name, sort_order) VALUES
(8101,8001,'提出想法',1),(8102,8001,'讨论可行性',2),(8103,8001,'核算成本',3),(8104,8001,'硬件设计',4),(8105,8001,'软件适配',5),(8106,8001,'测试生产',6),(8107,8001,'试用',7),(8108,8001,'客户推广',8),
(8109,8002,'提出想法',1),(8110,8002,'讨论可行性',2),(8111,8002,'硬件设计',3),(8112,8002,'软件适配',4),(8113,8002,'客户调试',5),(8114,8002,'客户下单',6);

ALTER SEQUENCE kpm_task_no_seq RESTART WITH 1;

-- Knowledge base permissions. Internal users see all KB articles; customer portal visibility is handled separately by customer scope.
INSERT INTO kpm_permissions (id, code, name, permission_type, target, location) VALUES
(3099,'menu:knowledge','菜单 / 知识库管理','菜单权限','知识库管理','左侧菜单'),
(3100,'button:knowledge:create','知识库管理 / 新增文章','按钮权限','新增文章','知识库管理'),
(3101,'button:knowledge:edit','知识库管理 / 编辑文章','按钮权限','编辑文章','知识库管理'),
(3102,'button:knowledge:delete','知识库管理 / 删除文章','按钮权限','删除文章','知识库管理'),
(3103,'button:knowledge:review','知识库管理 / 审核发布','按钮权限','审核发布','知识库管理')
ON CONFLICT (code) DO UPDATE SET
  name=EXCLUDED.name,
  permission_type=EXCLUDED.permission_type,
  target=EXCLUDED.target,
  location=EXCLUDED.location;

INSERT INTO kpm_role_permissions (role_id, permission_id)
SELECT 2001, id FROM kpm_permissions WHERE code IN (
  'menu:knowledge',
  'button:knowledge:create',
  'button:knowledge:edit',
  'button:knowledge:delete',
  'button:knowledge:review'
)
ON CONFLICT DO NOTHING;
