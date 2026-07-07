FROM postgres:18

COPY infra/database/schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY infra/database/seed.sql /docker-entrypoint-initdb.d/02-seed.sql
