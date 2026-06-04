# KPM Technical Solution Summary

> Last updated: 2026-05-26

## Final direction

KPM will be built as a controlled Java microservice system designed for at least 1000 concurrent users.

## Selected stack

| Area | Selection |
| --- | --- |
| Runtime | Eclipse Temurin OpenJDK 21 LTS |
| Backend | Spring Boot 4.x, Spring Cloud 2025.x, Spring Cloud Alibaba 2025.x |
| Service registry / config | Nacos cluster |
| Gateway | Spring Cloud Gateway |
| Traffic protection | Sentinel |
| Database | PostgreSQL 18 |
| Cache | Valkey, using Redis-compatible patterns where useful |
| Messaging | Apache RocketMQ or Kozen-approved MQ |
| File storage | Alibaba Cloud OSS behind a KPM storage abstraction |
| Auth | KPM built-in IAM: username/password, password hashing, lightweight bearer token with sliding renewal; later upgrade path to standard OAuth2/OIDC refresh-token, logout/revocation and login audit |
| Frontend | React 19, TypeScript, Vite, Ant Design, react-i18next |
| Deployment | Docker Compose for local development; Kubernetes-ready production deployment |
| Observability | Spring Boot Actuator, structured logs, Prometheus/Grafana first, tracing later |

## First-wave services

- `kpm-gateway`
- `kpm-iam-service`
- `kpm-resource-service`
- `kpm-project-service`
- `kpm-customer-service`
- `kpm-task-service`
- `kpm-order-service`
- `kpm-file-service`
- `kpm-analytics-service`
- `kpm-integration-service`

## Key design decisions

1. Use Java 21, not Java 8, for the new KPM core.
2. Use Nacos for runtime technical configuration, not as the source of truth for KPM business configuration.
3. Keep business configuration in KPM databases with permission control and audit history.
4. Use PostgreSQL schema-per-service first, not one physical database per service in the pilot.
5. Use outbox + MQ events for cross-service side effects.
6. Keep direct user experience smooth through the React frontend while enforcing permissions on backend APIs.
7. Use OSS for file binaries; keep metadata and permissions in KPM services.
