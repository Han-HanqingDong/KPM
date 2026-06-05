# KPM Session Handoff

> Last updated: 2026-06-05

## Continuation summary

KPM is an internal project/product lifecycle collaboration system for Kozen POS products. The project is now in active development, not prototype-only planning.

Use `/Users/henry/Documents/KPM` as the single workspace root. Do not create files outside this workspace.

## Current codebase

- Formal frontend app: `apps/frontend/kpm-web`
- Backend microservices: `apps/backend/*-service`
- Gateway: `apps/backend/kpm-gateway`
- Database schema and migrations: `infra/database/`
- Local deployment: `infra/docker-compose/dev/docker-compose.yml`
- Main project introduction: `项目介绍.md`

The old static prototype assets have been removed because they contained stale mock data and obsolete fields.

## Important current decisions

1. Java 21 / Spring Boot microservices are the selected implementation direction.
2. Nacos is used for service discovery and runtime technical configuration.
3. PostgreSQL is the primary database.
4. Valkey/Redis-compatible cache is used for customer portal OTP, resource bootstrap data, and analytics caches.
5. Alibaba Cloud OSS is the file storage implementation.
6. Project master data does not contain project-level `status`, `salesability`, or `unsellableReason`.
7. Product/customer commercial lifecycle is represented by customer-project relationship status.
8. Stages are parallel and independently maintained; only stage assignees/owners can modify stage status.
9. Notifications currently use DB Outbox with idempotent async consumption; external MQ is reserved for the production hardening phase.
10. The user explicitly wants maintainable code: DTO/entity separation, converter layer, service/serviceImpl/mapper layering, MyBatis SQL, backend validation, and clean frontend modularization.

## Current working rule

Only commit or push when the user explicitly asks. Local changes may be made and tested, but do not stage/commit/push automatically.

## Before continuing work

Read these files:

1. `START-HERE.md`
2. `项目介绍.md`
3. `docs/00-governance/project-state.md`
4. `docs/03-architecture/performance-cache-mq-observability-plan.md`

Then inspect current git status before editing.
