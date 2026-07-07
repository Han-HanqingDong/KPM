# Railway deployment

This folder contains the Railway-specific deployment contract for KPM.

## Source repository

- Upstream source: `KozenSupport/KPM`
- Railway source fork: `Han-HanqingDong/KPM`

## Service model

KPM is deployed as multiple Railway services in one project:

- `postgres`: built from `railway/postgres.Dockerfile`, with `infra/database/schema.sql` and `infra/database/seed.sql` loaded on first volume initialization.
- `valkey`: deployed from `valkey/valkey:8-alpine`.
- Backend services: all use `apps/backend` as the root directory and run one Maven module each.
- `frontend`: built from `railway/frontend.Dockerfile`; it serves static assets and proxies `/api/` to `gateway` over Railway private networking.

## Backend build contract

For each backend service, set:

```text
root directory: /apps/backend
build command: ./mvnw -q -DskipTests -pl <module> -am package
start command: java -jar <module>/target/<module>-0.1.0-SNAPSHOT.jar
health check path: /actuator/health
```

Spring Boot service ports read Railway's `PORT` variable and keep the existing local defaults as fallbacks.

## Required shared runtime variables

Set these on all backend services:

```text
KPM_DB_HOST=${{postgres.RAILWAY_PRIVATE_DOMAIN}}
KPM_DB_PORT=5432
KPM_DB_NAME=kpm
KPM_DB_USER=kpm
KPM_DB_PASSWORD=${{postgres.POSTGRES_PASSWORD}}
KPM_VALKEY_HOST=${{valkey.RAILWAY_PRIVATE_DOMAIN}}
KPM_VALKEY_PORT=6379
KPM_NACOS_ENABLED=false
KPM_NACOS_CONFIG_ENABLED=false
KPM_AUTH_ENABLED=true
KPM_RBAC_ENABLED=true
KPM_AUTH_TOKEN_SECRET=<strong secret>
KPM_LOG_PATH=/tmp/kpm-logs
JAVA_TOOL_OPTIONS=-Xms128m -Xmx512m -XX:+UseG1GC -Duser.timezone=Asia/Shanghai
```

Set this additionally on `gateway`:

```text
KPM_IAM_URI=http://${{iam-service.RAILWAY_PRIVATE_DOMAIN}}:${{iam-service.PORT}}
KPM_ROUTE_IAM_URI=http://${{iam-service.RAILWAY_PRIVATE_DOMAIN}}:${{iam-service.PORT}}
KPM_ROUTE_RESOURCES_URI=http://${{resource-service.RAILWAY_PRIVATE_DOMAIN}}:${{resource-service.PORT}}
KPM_ROUTE_PROJECTS_URI=http://${{project-service.RAILWAY_PRIVATE_DOMAIN}}:${{project-service.PORT}}
KPM_ROUTE_CUSTOMERS_URI=http://${{customer-service.RAILWAY_PRIVATE_DOMAIN}}:${{customer-service.PORT}}
KPM_ROUTE_TASKS_URI=http://${{task-service.RAILWAY_PRIVATE_DOMAIN}}:${{task-service.PORT}}
KPM_ROUTE_ORDERS_URI=http://${{order-service.RAILWAY_PRIVATE_DOMAIN}}:${{order-service.PORT}}
KPM_ROUTE_FILES_URI=http://${{file-service.RAILWAY_PRIVATE_DOMAIN}}:${{file-service.PORT}}
KPM_ROUTE_ANALYTICS_URI=http://${{analytics-service.RAILWAY_PRIVATE_DOMAIN}}:${{analytics-service.PORT}}
KPM_ROUTE_INTEGRATIONS_URI=http://${{integration-service.RAILWAY_PRIVATE_DOMAIN}}:${{integration-service.PORT}}
KPM_ROUTE_NOTIFICATIONS_URI=http://${{notification-service.RAILWAY_PRIVATE_DOMAIN}}:${{notification-service.PORT}}
```

Set this on `frontend`:

```text
KPM_GATEWAY_PROXY_PASS=http://${{gateway.RAILWAY_PRIVATE_DOMAIN}}:${{gateway.PORT}}
```

## Public endpoint

Generate a Railway domain for `frontend` on port `80`. The frontend should be the primary public URL; API traffic is proxied from the same origin through `/api/`.
