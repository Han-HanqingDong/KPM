# KPM 前后端联调覆盖测试报告 - 20260605003613

- 测试地址：`http://127.0.0.1:8080`
- 测试数据前缀：`IT05003613`
- 结果：**17 PASS / 0 FAIL / 17 TOTAL**

## 覆盖说明

- 覆盖 React 前端中调用 `kpmApi` 的主要按钮/动作：新增、编辑、删除、归档、上传、下载、状态修改、评论、消息已读、密码修改等。
- 覆盖当前后端所有 Controller 暴露的业务 REST 接口和 service-info/ping 接口。
- 对核心写接口均做 PostgreSQL 直查：确认数据落库、关联 ID 正确、金额/状态/附件/修改记录正确、删除为逻辑删除。

## 明细

| Case | 模块 | 状态 | 接口/动作 | 说明 |
| --- | --- | --- | --- | --- |
| `IAM-001` | 身份 | **PASS** | `POST /api/iam/login` | 管理员登录：admin=admin@kozenmobile.com |
| `SVC-001` | 服务 | **PASS** | `GET /api/*/ping` | 所有服务健康接口：service endpoints=10 |
| `RES-001` | 资源 | **PASS** | `POST /api/resources/*` | 部门/角色/用户新增并落库：dept=178059097339300005 role=178059097340600006 user=178059097342800007 |
| `RES-002` | 资源 | **PASS** | `PUT/POST /api/resources/*` | 部门/角色/用户修改和重置密码：resource update/reset ok |
| `IAM-002` | 身份 | **PASS** | `GET /api/iam/me; POST /api/iam/change-password` | 当前用户、修改密码、登录校验：me/change-password/login-validation ok |
| `RES-003` | 资源 | **PASS** | `POST/PUT/DELETE /api/resources/enums; /task-status-transitions` | 枚举和任务状态流转 CRUD：enum=178059097385900008 transition=178059097388100009 |
| `TPL-001` | 模板 | **PASS** | `GET/POST/PUT /api/projects/templates` | 流程模板新增修改查询：template=178059097401300028 |
| `PROJ-001` | 项目客户 | **PASS** | `POST/PUT /api/projects; /customers; /skus` | 项目、阶段、SKU、客户、关联客户全链路：project=178059097411900034 customer=178059097430400008 sku=178059097426700048 |
| `CUST-001` | 客户 | **PASS** | `POST /api/customers/{id}/contacts|materials|followups` | 联系人、客户资料、跟进记录：contact=178059097482700013 file=KPM/customer/materials/178059097430400008/2026/06/04/df483a00-4906-4d34-b18c-81967299d2d7-kpm-IT05003613-customer.txt |
| `PROJ-002` | 项目 | **PASS** | `POST /api/projects/stages/*; /requirements` | 阶段资料、发布、阶段记录、需求：requirement=178059097534400053 linkedTask=178059097534400054 |
| `PORTAL-001` | 客户门户 | **PASS** | `POST /api/projects/{id}/announcements; /api/customers/{id}/notifications; /api/customer-portal/*` | 公告类型、客户通知、公开资料和门户登录：portal projects=1 materials=1 messages=2 |
| `TASK-001` | 任务 | **PASS** | `GET/POST/PUT /api/tasks` | 任务新增修改附件评论：task=178059097603100004 taskNo=KYRUR142 |
| `ORD-001` | 订单 | **PASS** | `GET/POST/PUT /api/orders` | 订单新增修改历史和金额：order=178059097653700003 amount=42.0 |
| `ANA-001` | 统计文件 | **PASS** | `GET /api/analytics/*; /api/files/*` | 统计看板和文件下载地址：ossReady=True downloadUrl=yes |
| `MSG-001` | 消息 | **PASS** | `GET/POST /api/notifications/*` | 消息查询和已读：messages=11 |
| `UI-001` | 前端 | **PASS** | `React kpmApi actions` | 前端 kpmApi 按钮动作静态覆盖：frontend kpmApi action lines=56 |
| `CLEAN-001` | 清理 | **PASS** | `DELETE/POST archive endpoints` | 删除接口和逻辑删除校验：task_attachment,task,linked_requirement_task,requirement,order,sku,contact,project,customer,template,transition,enum,user,role,department |
