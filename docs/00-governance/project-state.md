# KPM Project State

> Last updated: 2026-06-05

## Current phase

- **Phase:** Phase 3 — Development and integration hardening
- **Workspace root:** `/Users/henry/Documents/KPM`
- **Primary source of truth:** `/Users/henry/Documents/KPM/项目介绍.md`

KPM has moved beyond the static prototype stage. The old prototype assets have been removed to avoid stale mock data and obsolete concepts leaking into current development.

## Current implementation

- Frontend: `apps/frontend/kpm-web`, Vite + React + TypeScript + Ant Design + ECharts + MapLibre.
- Backend: `apps/backend`, Java 21 + Spring Boot/Spring Cloud microservices.
- Gateway: Spring Cloud Gateway, routed through Nacos service discovery.
- Database: PostgreSQL.
- Cache: Valkey/Redis-compatible cache.
- File storage: Alibaba Cloud OSS through file-service abstraction.
- Notification: DB Outbox + notification-service asynchronous consumer; external MQ is reserved for production hardening.
- Deployment: Docker Compose under `infra/docker-compose/dev/docker-compose.yml` with `.env` environment variables and Nacos config publisher.

## Accepted product model highlights

- Project status is **not** stored as a standalone project field. Project progress is represented by stage statuses.
- Project master data no longer contains `salesability` or `unsellableReason`.
- Customer × project relationship status is the business lifecycle marker for each customer/product pair.
- Stages can run in parallel; there is no forced next/previous linear workflow.
- Only stage assignees/owners can update their stage status.
- Customer portal is part of the current product: customer contacts login by email OTP, view public project materials, receive announcements/messages, and create/view tasks.
- Task comments are split into internal and external comments; external comments are visible to customers.
- Permissions are menu/button based and enforced by backend RBAC through the gateway.

## Current technical focus

The current cleanup/performance track includes:

1. backend pagination for high-growth lists;
2. Redis/Valkey cache for read-heavy resource and analytics data;
3. DB Outbox hardening for idempotent asynchronous notification;
4. codebase cleanup and removal of obsolete prototype artifacts;
5. continued frontend/backend maintainability improvements.

## Files to read first in future sessions

1. `README.md`
2. `START-HERE.md`
3. `项目介绍.md`
4. `docs/03-architecture/technical-solution.md`
5. `docs/03-architecture/performance-cache-mq-observability-plan.md`
6. `docs/04-development/database-design.md`
