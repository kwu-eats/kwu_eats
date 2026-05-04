#!/usr/bin/env bash
# 팡슐랭 DGX STATION 일일 백업 스크립트
#
# 사용법:
#   ./scripts/backup-dgx.sh
#
# 동작:
#   1) postgres → ./backups/db_<YYYYMMDD-HHMMSS>.sql.gz
#   2) minio    → ./backups/minio_<YYYYMMDD-HHMMSS>/
#   3) 7일 이전 백업 자동 삭제
#
# cron 등록 예 (매일 03:30):
#   30 3 * * * cd /opt/pangchelin && ./scripts/backup-dgx.sh >> backups/cron.log 2>&1

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
COMPOSE_FILE="${PROJECT_DIR}/docker-compose.prod.yml"
ENV_FILE="${PROJECT_DIR}/.env.production"
BACKUP_DIR="${PROJECT_DIR}/backups"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

[[ -f "$COMPOSE_FILE" ]] || { echo "❌ compose 파일 없음: $COMPOSE_FILE"; exit 1; }
[[ -f "$ENV_FILE" ]] || { echo "❌ env 파일 없음: $ENV_FILE"; exit 1; }

mkdir -p "$BACKUP_DIR"
TS="$(date +%Y%m%d-%H%M%S)"

# .env.production 에서 필요한 값 읽기 (export 안 하고 셸에 로드)
# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

PROFILES=(--profile self-hosted-db --profile self-hosted-storage)
COMPOSE=(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "${PROFILES[@]}")

# ─── 1) postgres dump ───
echo "▶ postgres dump"
DB_FILE="${BACKUP_DIR}/db_${TS}.sql.gz"
"${COMPOSE[@]}" exec -T postgres \
  pg_dump -U "${POSTGRES_USER:-pangchelin}" -d "${POSTGRES_DB:-pangchelin}" \
  --clean --if-exists --no-owner --no-privileges \
  | gzip > "$DB_FILE"
echo "   → $DB_FILE ($(du -h "$DB_FILE" | cut -f1))"

# ─── 2) minio mirror ───
echo "▶ minio mirror"
MINIO_DIR="${BACKUP_DIR}/minio_${TS}"
mkdir -p "$MINIO_DIR"
docker run --rm \
  --network pangchelin-prod \
  -e MC_HOST_local="http://${MINIO_ROOT_USER}:${MINIO_ROOT_PASSWORD}@minio:9000" \
  -v "${MINIO_DIR}:/backup" \
  minio/mc:latest \
  mirror --quiet "local/${S3_BUCKET:-pangchelin}" /backup
echo "   → $MINIO_DIR ($(du -sh "$MINIO_DIR" | cut -f1))"

# ─── 3) 보존 정책 ───
echo "▶ ${RETENTION_DAYS}일 이전 백업 삭제"
find "$BACKUP_DIR" -maxdepth 1 -name 'db_*.sql.gz' -mtime "+${RETENTION_DAYS}" -delete
find "$BACKUP_DIR" -maxdepth 1 -type d -name 'minio_*' -mtime "+${RETENTION_DAYS}" -exec rm -rf {} +

echo "✅ 백업 완료 ($TS)"
