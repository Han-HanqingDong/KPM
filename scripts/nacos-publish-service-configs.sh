#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_NACOS_CONFIG_DIR="${KPM_LOCAL_NACOS_CONFIG_DIR:-$ROOT_DIR/.local/nacos/configs}"
mkdir -p "$LOCAL_NACOS_CONFIG_DIR"

NACOS_ADDR="${KPM_NACOS_ADDR:-127.0.0.1:8848}"
NAMESPACE="${KPM_NACOS_NAMESPACE:-public}"
GROUP="${KPM_NACOS_CONFIG_GROUP:-DEFAULT_GROUP}"
DB_HOST="${KPM_DB_HOST:-kpm-postgres}"
DB_PORT="${KPM_DB_PORT:-5432}"
DB_NAME="${KPM_DB_NAME:-kpm}"
DB_USER="${KPM_DB_USER:-kpm}"
DB_PASSWORD="${KPM_DB_PASSWORD:-kpm_dev_password}"
AUTH_SECRET="${KPM_AUTH_TOKEN_SECRET:-kpm-local-dev-secret-change-me}"

publish() {
  local data_id="$1"
  local content="$2"
  curl -fsS -X POST "http://${NACOS_ADDR}/nacos/v1/cs/configs" \
    --data-urlencode "tenant=${NAMESPACE}" \
    --data-urlencode "group=${GROUP}" \
    --data-urlencode "dataId=${data_id}" \
    --data-urlencode "content=${content}" >/dev/null
  maybe_backup_config "${data_id}" "${content}"
  echo "Published ${data_id} to namespace=${NAMESPACE}, group=${GROUP}"
}

config_backup_path() {
  local data_id="$1"
  printf '%s/%s' "$LOCAL_NACOS_CONFIG_DIR" "$data_id"
}

maybe_backup_config() {
  local data_id="$1"
  local content="$2"
  if has_non_empty_secret "${content}"; then
    local backup_path
    backup_path="$(config_backup_path "$data_id")"
    umask 077
    printf '%s
' "${content}" > "${backup_path}"
    chmod 600 "${backup_path}"
  fi
}

has_non_empty_secret() {
  local content="$1"
  printf '%s
' "${content}" | grep -Eq 'access-key-secret:[[:space:]]*[^[:space:]]+'
}

fetch_backup_config() {
  local data_id="$1"
  local backup_path
  backup_path="$(config_backup_path "$data_id")"
  if [[ -f "$backup_path" ]]; then
    cat "$backup_path"
  fi
}

fetch_config() {
  local data_id="$1"
  curl -fsS -G "http://${NACOS_ADDR}/nacos/v1/cs/configs" \
    --data-urlencode "tenant=${NAMESPACE}" \
    --data-urlencode "group=${GROUP}" \
    --data-urlencode "dataId=${data_id}" 2>/dev/null || true
}

extract_oss_block() {
  awk '
    /^  oss:/ { in_oss=1 }
    in_oss && /^  [A-Za-z0-9_-]+:/ && !/^  oss:/ { exit }
    in_oss { print }
  '
}

normalize_oss_block() {
  local content="$1"
  local enabled="${KPM_OSS_ENABLED:-true}"
  printf '%s\n' "${content}" | awk -v enabled="${enabled}" '
    BEGIN { seen_enabled=0 }
    /^[[:space:]]+enabled:/ {
      print "    enabled: " enabled
      seen_enabled=1
      next
    }
    { print }
    END {
      if (!seen_enabled) {
        print "    enabled: " enabled
      }
    }
  '
}

file_oss_config_block() {
  if [[ -n "${KPM_OSS_ACCESS_KEY_ID:-}" && -n "${KPM_OSS_ACCESS_KEY_SECRET:-}" ]]; then
    cat <<YAML
  oss:
    enabled: ${KPM_OSS_ENABLED:-true}
    endpoint: ${KPM_OSS_ENDPOINT:-https://oss-cn-shanghai.aliyuncs.com}
    bucket: ${KPM_OSS_BUCKET:-xc-kozen-sh-fw}
    root-prefix: ${KPM_OSS_ROOT_PREFIX:-KPM/}
    access-key-id: ${KPM_OSS_ACCESS_KEY_ID}
    access-key-secret: ${KPM_OSS_ACCESS_KEY_SECRET}
    download-url-expiration-seconds: ${KPM_OSS_DOWNLOAD_URL_EXPIRE_SECONDS:-900}
YAML
    return
  fi

  local existing_oss
  existing_oss="$(fetch_config kpm-file-service.yaml | extract_oss_block)"
  if [[ -n "${existing_oss}" ]] && has_non_empty_secret "${existing_oss}"; then
    normalize_oss_block "${existing_oss}"
    return
  fi

  local backup_oss
  backup_oss="$(fetch_backup_config kpm-file-service.yaml | extract_oss_block)"
  if [[ -n "${backup_oss}" ]] && has_non_empty_secret "${backup_oss}"; then
    normalize_oss_block "${backup_oss}"
    return
  fi

  cat <<YAML
  oss:
    enabled: ${KPM_OSS_ENABLED:-false}
    endpoint: ${KPM_OSS_ENDPOINT:-https://oss-cn-shanghai.aliyuncs.com}
    bucket: ${KPM_OSS_BUCKET:-xc-kozen-sh-fw}
    root-prefix: ${KPM_OSS_ROOT_PREFIX:-KPM/}
    access-key-id: ${KPM_OSS_ACCESS_KEY_ID:-}
    access-key-secret: ${KPM_OSS_ACCESS_KEY_SECRET:-}
    download-url-expiration-seconds: ${KPM_OSS_DOWNLOAD_URL_EXPIRE_SECONDS:-900}
YAML
}

base_config() {
  local port="$1"
  local code="$2"
  cat <<YAML
server:
  port: ${port}
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}?stringtype=unspecified
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: ${KPM_DB_POOL_MAX_SIZE:-5}
      minimum-idle: ${KPM_DB_POOL_MIN_IDLE:-1}
kpm:
  service:
    code: ${code}
  auth:
    token-secret: ${AUTH_SECRET}
YAML
}

publish kpm-iam-service.yaml "$(base_config 8101 iam)"
publish kpm-resource-service.yaml "$(base_config 8102 resource)"
publish kpm-project-service.yaml "$(base_config 8103 project)"
publish kpm-customer-service.yaml "$(base_config 8104 customer)"
publish kpm-task-service.yaml "$(base_config 8105 task)"
publish kpm-order-service.yaml "$(base_config 8106 order)"
publish kpm-integration-service.yaml "$(cat <<YAML
server:
  port: 8109
kpm:
  service:
    code: integration
  auth:
    token-secret: ${AUTH_SECRET}
YAML
)"

publish kpm-file-service.yaml "$(cat <<YAML
server:
  port: 8107
spring:
  servlet:
    multipart:
      max-file-size: ${KPM_UPLOAD_MAX_FILE_SIZE:-500MB}
      max-request-size: ${KPM_UPLOAD_MAX_REQUEST_SIZE:-520MB}
kpm:
  service:
    code: file
  auth:
    token-secret: ${AUTH_SECRET}
$(file_oss_config_block)
YAML
)"

publish kpm-analytics-service.yaml "$(cat <<YAML
server:
  port: 8108
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}?stringtype=unspecified
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: ${KPM_DB_POOL_MAX_SIZE:-5}
      minimum-idle: ${KPM_DB_POOL_MIN_IDLE:-1}
kpm:
  service:
    code: analytics
  auth:
    token-secret: ${AUTH_SECRET}
  geocoding:
    external-enabled: ${KPM_GEOCODING_EXTERNAL_ENABLED:-false}
    provider: ${KPM_GEOCODING_PROVIDER:-nominatim}
    nominatim-url: ${KPM_GEOCODING_NOMINATIM_URL:-https://nominatim.openstreetmap.org/search}
    user-agent: ${KPM_GEOCODING_USER_AGENT:-Kozen-KPM/0.1}
    minimum-request-interval-millis: ${KPM_GEOCODING_MIN_INTERVAL_MS:-1100}
    request-timeout-seconds: ${KPM_GEOCODING_TIMEOUT_SECONDS:-3}
YAML
)"

publish kpm-gateway.yaml "$(cat <<YAML
server:
  port: 8080
spring:
  cloud:
    gateway:
      server:
        webflux:
          globalcors:
            cors-configurations:
              '[/**]':
                allowedOriginPatterns:
                  - "*"
                allowedMethods:
                  - GET
                  - POST
                  - PUT
                  - DELETE
                  - OPTIONS
                allowedHeaders:
                  - "*"
                exposedHeaders:
                  - Authorization
                allowCredentials: false
kpm:
  iam:
    uri: ${KPM_IAM_URI:-http://kpm-iam-service-dev:8101}
  auth:
    enabled: ${KPM_AUTH_ENABLED:-true}
    rbac-enabled: ${KPM_RBAC_ENABLED:-true}
    token-secret: ${AUTH_SECRET}
YAML
)"

publish kpm-notification-service.yaml "$(cat <<YAML
server:
  port: 8110
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}?stringtype=unspecified
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: ${KPM_DB_POOL_MAX_SIZE:-5}
      minimum-idle: ${KPM_DB_POOL_MIN_IDLE:-1}
  mail:
    host: ${KPM_MAIL_HOST:-}
    port: ${KPM_MAIL_PORT:-587}
    username: ${KPM_MAIL_USERNAME:-}
    password: ${KPM_MAIL_PASSWORD:-}
    properties:
      mail:
        smtp:
          auth: ${KPM_MAIL_SMTP_AUTH:-true}
          starttls:
            enable: ${KPM_MAIL_STARTTLS_ENABLE:-true}
management:
  health:
    mail:
      enabled: ${KPM_NOTIFICATION_MAIL_HEALTH_ENABLED:-${KPM_NOTIFICATION_MAIL_ENABLED:-false}}
kpm:
  service:
    code: notification
  auth:
    token-secret: ${AUTH_SECRET}
  notification:
    refresh-interval-seconds: ${KPM_NOTIFICATION_REFRESH_INTERVAL_SECONDS:-120}
    processor-interval-ms: ${KPM_NOTIFICATION_PROCESSOR_INTERVAL_MS:-15000}
    mail-enabled: ${KPM_NOTIFICATION_MAIL_ENABLED:-false}
    mail-from: ${KPM_NOTIFICATION_MAIL_FROM:-noreply@kozen.example}
YAML
)"
