#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/infra/docker-compose/dev/docker-compose.yml"

mkdir -p "$ROOT_DIR/.local/nacos/data" "$ROOT_DIR/.local/nacos/configs"

docker compose -f "$COMPOSE_FILE" up -d postgres valkey nacos

echo "KPM dev infrastructure is starting:"
echo "- PostgreSQL: 127.0.0.1:5432 / db=kpm / user=kpm"
echo "- Valkey:     127.0.0.1:6379"
echo "- Nacos API:      http://127.0.0.1:8848"
echo "- Nacos Console:  http://127.0.0.1:8849/"


echo "Waiting for Nacos to become healthy before publishing service configs..."
for i in {1..40}; do
  if curl -fsS http://127.0.0.1:8848/nacos/v3/admin/core/state >/dev/null 2>&1; then
    "$ROOT_DIR/scripts/nacos-publish-service-configs.sh"
    break
  fi
  sleep 2
  if [[ "$i" == "40" ]]; then
    echo "Nacos is not ready yet; run ./scripts/nacos-publish-service-configs.sh after it starts." >&2
  fi
done
