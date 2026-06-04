# KPM V1 RESTful API 设计

> 约定：所有接口统一返回 `ApiResponse<T>`；所有写操作后返回最新资源快照或 `true`。Swagger 地址为每个微服务的 `/swagger-ui/index.html`，OpenAPI JSON 为 `/v3/api-docs`。

## IAM 服务 `/api/iam`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/iam/login` | 登录 |
| GET | `/api/iam/me?account=` | 查询当前用户信息 |

## 资源管理服务 `/api/resources`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/resources/bootstrap` | 获取前端启动所需用户、部门、角色、权限、枚举和任务状态流转 |
| GET | `/api/resources/users` | 用户列表 |
| POST | `/api/resources/users` | 新增用户 |
| PUT | `/api/resources/users/{id}` | 修改用户 |
| DELETE | `/api/resources/users/{id}` | 删除用户 |
| GET | `/api/resources/departments` | 部门列表，人数由用户关系自动统计 |
| POST | `/api/resources/departments` | 新增部门 |
| PUT | `/api/resources/departments/{id}` | 修改部门 |
| DELETE | `/api/resources/departments/{id}` | 删除部门 |
| GET | `/api/resources/roles` | 角色列表 |
| POST | `/api/resources/roles` | 新增角色并配置角色权限 |
| PUT | `/api/resources/roles/{id}` | 修改角色和角色权限 |
| DELETE | `/api/resources/roles/{id}` | 删除角色 |
| POST | `/api/resources/enums` | 新增枚举值 |
| PUT | `/api/resources/enums/{id}` | 修改枚举值 |
| DELETE | `/api/resources/enums/{id}` | 删除枚举值 |
| POST | `/api/resources/task-status-transitions` | 新增任务状态流转规则 |
| DELETE | `/api/resources/task-status-transitions/{id}` | 删除任务状态流转规则 |

## 项目服务 `/api/projects`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/projects` | 项目列表，支持关键字、归档状态过滤；项目总体状态由阶段状态体现 |
| GET | `/api/projects/{id}` | 项目详情 |
| POST | `/api/projects` | 新建项目，项目负责人自动加入成员 |
| PUT | `/api/projects/{id}` | 修改项目基本信息、成员、阶段负责人 |
| DELETE | `/api/projects/{id}` | 删除项目 |
| POST | `/api/projects/{id}/archive` | 归档/恢复项目 |
| PUT | `/api/projects/{id}/members` | 替换项目成员 |
| PUT | `/api/projects/stages/{stageId}` | 修改阶段状态；仅阶段负责人可操作 |
| POST | `/api/projects/stages/{stageId}/records` | 新增阶段留言/记录 |
| POST | `/api/projects/stages/{stageId}/materials` | 新增阶段资料，文件元数据支持 `description` 资料描述 |
| POST | `/api/projects/stage-materials/{materialId}/publish` | 发布阶段资料到项目资料区，保留资料描述 |
| POST | `/api/projects/{id}/materials` | 直接新增项目资料区文件元数据，支持 `description` 资料描述 |
| POST | `/api/projects/{id}/materials/{materialId}/public` | 二次确认后公开项目资料给客户门户 |
| POST | `/api/projects/{id}/announcements` | 发布项目公告；二次确认后同步到客户门户顶部公告和客户消息盒子 |
| POST | `/api/projects/{projectId}/customers` | 关联项目客户 |
| PUT | `/api/projects/{projectId}/customers/{customerId}` | 修改客户在项目中的状态 |
| GET | `/api/projects/{id}/requirements-overview` | 需求纵览 |
| POST | `/api/projects/{projectId}/customers/{customerId}/requirements` | 新增客户需求，可自动创建关联任务 |
| POST | `/api/projects/requirements/{id}/void` | 作废需求 |
| DELETE | `/api/projects/requirements/{id}` | 删除需求 |
| GET | `/api/projects/templates` | 流程模板列表 |
| POST | `/api/projects/templates` | 新增流程模板 |
| PUT | `/api/projects/templates/{id}` | 修改流程模板 |
| DELETE | `/api/projects/templates/{id}` | 删除流程模板 |

## 客户服务 `/api/customers`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/customers` | 客户列表，支持关键字 |
| GET | `/api/customers/{id}` | 客户详情 |
| POST | `/api/customers` | 新增客户 |
| PUT | `/api/customers/{id}` | 修改客户 |
| DELETE | `/api/customers/{id}` | 删除客户 |
| POST | `/api/customers/{id}/contacts` | 新增客户联系人 |
| DELETE | `/api/customers/{id}/contacts/{contactId}` | 删除客户联系人 |
| POST | `/api/customers/{id}/materials` | 上传客户资料记录 |
| POST | `/api/customers/{id}/followups` | 新增客户跟进记录 |


## 客户门户 `/api/customer-portal`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/customer-portal/request-code` | 客户联系人邮箱发送动态验证码；邮箱必须存在于客户联系人信息中 |
| POST | `/api/customer-portal/login` | 客户联系人验证码登录，返回客户门户 token |
| GET | `/api/customer-portal/me` | 查询当前客户联系人身份 |
| GET | `/api/customer-portal/data` | 查询客户关联项目、公开项目资料、公告、客户消息和客户任务进度 |
| GET | `/api/customer-portal/messages` | 查询客户门户消息，支持 `unreadOnly` |
| GET | `/api/customer-portal/unread-count` | 查询当前客户联系人未读消息数量 |
| POST | `/api/customer-portal/messages/{id}/read` | 标记单条客户门户消息已读 |
| POST | `/api/customer-portal/messages/read-all` | 一键标记当前客户联系人所有门户消息已读 |
| POST | `/api/customer-portal/tasks` | 客户创建任务；项目必选，标题/描述必填，自动分配给客户技术支持负责人并写入通知事件 |
| POST | `/api/customer-portal/tasks/{id}/comments` | 客户在门户中新增任务留言；默认写入外部留言，Kozen 内部任务详情同步可见 |

> 说明：客户门户验证码使用 Redis/Valkey 临时存储，10 分钟过期，不使用数据库验证码表。客户门户 token 默认 8 小时，并通过响应头 `X-KPM-Refresh-Token` 实现滑动续期。

## 任务服务 `/api/tasks`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/tasks` | 任务列表，支持关键字、状态、分类过滤 |
| GET | `/api/tasks/{id}` | 任务详情 |
| POST | `/api/tasks` | 新建任务 |
| PUT | `/api/tasks/{id}` | 修改任务；任务完成/拒绝时同步关联需求状态 |
| DELETE | `/api/tasks/{id}` | 删除任务 |
| POST | `/api/tasks/{id}/comments` | 新增任务评论，`commentType=internal/external`；内部用户发布外部留言时会同步客户门户消息并写入邮件 outbox |
| POST | `/api/tasks/{id}/attachments` | 新增任务附件记录 |

## 订单服务 `/api/orders`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/orders` | 订单列表，支持年份、客户、项目过滤 |
| GET | `/api/orders/{id}` | 订单详情 |
| POST | `/api/orders` | 新增订单；自动计算金额并关联客户项目状态 |
| PUT | `/api/orders/{id}` | 修改订单；写入修改记录 |
| DELETE | `/api/orders/{id}` | 删除订单 |

## 统计服务 `/api/analytics`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/analytics/dashboard` | 工作台统计 |
| GET | `/api/analytics/orders?targetCurrency=USD` | 订单统计，支持币种统一换算 |
| GET | `/api/analytics/resource-map` | 资源分布数据 |
| GET | `/api/analytics/support?customerId=` | 技术支持情况 |
| GET | `/api/analytics/activity` | 客户活跃度 |
