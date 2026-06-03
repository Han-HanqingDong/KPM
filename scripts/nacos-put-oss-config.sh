#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_NACOS_CONFIG_DIR="${KPM_LOCAL_NACOS_CONFIG_DIR:-$ROOT_DIR/.local/nacos/configs}"
mkdir -p "$LOCAL_NACOS_CONFIG_DIR"

NACOS_ADDR="${KPM_NACOS_ADDR:-127.0.0.1:8848}"
NACOS_GROUP="${KPM_NACOS_CONFIG_GROUP:-DEFAULT_GROUP}"
NACOS_NAMESPACE="${KPM_NACOS_NAMESPACE:-public}"
DATA_ID="${KPM_NACOS_OSS_DATA_ID:-kpm-file-service.yaml}"

DB_HOST="${KPM_DB_HOST:-host.docker.internal}"
DB_PORT="${KPM_DB_PORT:-5432}"
DB_NAME="${KPM_DB_NAME:-kpm}"
DB_USER="${KPM_DB_USER:-kpm}"
DB_PASSWORD="${KPM_DB_PASSWORD:-kpm_dev_password}"
AUTH_SECRET="${KPM_AUTH_TOKEN_SECRET:-kpm-local-dev-secret-change-me}"

OSS_ENABLED="${KPM_OSS_ENABLED:-true}"
OSS_ENDPOINT="${KPM_OSS_ENDPOINT:-https://oss-cn-shanghai.aliyuncs.com}"
OSS_BUCKET="${KPM_OSS_BUCKET:-xc-kozen-sh-fw}"
OSS_ROOT_PREFIX="${KPM_OSS_ROOT_PREFIX:-KPM/}"
OSS_EXPIRE_SECONDS="${KPM_OSS_DOWNLOAD_URL_EXPIRE_SECONDS:-900}"
UPLOAD_MAX_FILE_SIZE="${KPM_UPLOAD_MAX_FILE_SIZE:-200MB}"
UPLOAD_MAX_REQUEST_SIZE="${KPM_UPLOAD_MAX_REQUEST_SIZE:-500MB}"

if [[ -z "${KPM_OSS_ACCESS_KEY_ID:-}" || -z "${KPM_OSS_ACCESS_KEY_SECRET:-}" ]]; then
  cat >&2 <<'MSG'
Missing OSS credentials.
Please run this script with runtime environment variables, for example:

  KPM_OSS_ACCESS_KEY_ID='***' \
  KPM_OSS_ACCESS_KEY_SECRET='***' \
  ./scripts/nacos-put-oss-config.sh

The script publishes the secret to Nacos only; it does not store secrets in the repository.
MSG
  exit 1
fi

TMP_FILE="$(mktemp)"
cleanup() { rm -f "$TMP_FILE"; }
trap cleanup EXIT

BACKUP_FILE="$LOCAL_NACOS_CONFIG_DIR/$DATA_ID"
cat > "$TMP_FILE" <<CONFIG
server:
  port: 8107
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  servlet:
    multipart:
      max-file-size: ${UPLOAD_MAX_FILE_SIZE}
      max-request-size: ${UPLOAD_MAX_REQUEST_SIZE}
kpm:
  service:
    code: file
  auth:
    token-secret: ${AUTH_SECRET}
  oss:
    enabled: ${OSS_ENABLED}
    endpoint: ${OSS_ENDPOINT}
    bucket: ${OSS_BUCKET}
    root-prefix: ${OSS_ROOT_PREFIX}
    access-key-id: ${KPM_OSS_ACCESS_KEY_ID}
    access-key-secret: ${KPM_OSS_ACCESS_KEY_SECRET}
    download-url-expiration-seconds: ${OSS_EXPIRE_SECONDS}
CONFIG

BASE_URL="http://${NACOS_ADDR}"
publish_config() {
  local namespace="$1"
  local args=(
    -fsS -X POST "${BASE_URL}/nacos/v1/cs/configs"
    -d "dataId=${DATA_ID}"
    -d "group=${NACOS_GROUP}"
    -d "type=yaml"
    --data-urlencode "content@${TMP_FILE}"
  )
  if [[ -n "$namespace" ]]; then
    args+=( -d "tenant=${namespace}" )
  fi
  curl "${args[@]}"
}

publish_config "$NACOS_NAMESPACE" >/tmp/kpm-nacos-put-oss-namespace.out
umask 077
cp "$TMP_FILE" "$BACKUP_FILE"
chmod 600 "$BACKUP_FILE"

echo "Nacos OSS file-service config published and backed up locally: dataId=${DATA_ID} group=${NACOS_GROUP} namespace=${NACOS_NAMESPACE} bucket=${OSS_BUCKET} root=${OSS_ROOT_PREFIX}"
