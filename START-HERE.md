# KPM — Start Here

If you are continuing KPM in a new conversation, read these files in order before making product or technical decisions:

1. `README.md`
2. `docs/00-governance/project-state.md`
3. `docs/00-governance/session-handoff.md`
4. `docs/00-governance/decision-log.md`
5. `docs/01-requirements/prd.md`
6. `docs/03-architecture/technical-solution.md`
7. `docs/03-architecture/performance-cache-mq-observability-plan.md`
8. `docs/04-development/database-design.md`

## Project identity

- **Project:** KPM — Kozen Project Management
- **Organization:** Kozen
- **Workspace root:** `/Users/henry/Documents/KPM`
- **Current phase:** Phase 3 — Development and integration hardening

## How to continue

Before doing new work:

1. Reconstruct the current product model from the documents above
2. Compare any new request with the accepted decisions in `decision-log.md`
3. Update the relevant source-of-truth documents when decisions change
4. Keep all project files inside this workspace

## Current continuation point

The project has entered Phase 3. The current continuation point is the formal React + Java microservice implementation, with ongoing cleanup, pagination, Redis/Valkey cache usage, DB Outbox hardening, and integration testing.

The latest architecture direction remains: controlled microservices, 1000 concurrent users, Nacos-based service/config governance, free/open-source components by default, Eclipse Temurin OpenJDK 21, PostgreSQL, Valkey-compatible cache, built-in IAM login, Alibaba Cloud OSS file storage, and Kubernetes-ready deployment.
