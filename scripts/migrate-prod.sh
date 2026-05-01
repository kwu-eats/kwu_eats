#!/usr/bin/env bash
# 팡슐랭 운영 DB 마이그레이션
#
# 사용법:
#   ./scripts/migrate-prod.sh
#   ./scripts/migrate-prod.sh status     # 적용 현황만 확인
#
# 정책:
#   - 새 배포 직전에 별도로 실행 (deploy.sh 가 자동으로 안 함)
#   - 일회용 컨테이너에서 prisma migrate deploy 실행
#   - 실패하면 배포 진행하지 말 것

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/opt/pangchelin}"
COMPOSE_FILE="${PROJECT_DIR}/docker-compose.prod.yml"
ENV_FILE="${PROJECT_DIR}/.env.production"

[[ -f "$COMPOSE_FILE" ]] || { echo "❌ compose 파일 없음: $COMPOSE_FILE"; exit 1; }
[[ -f "$ENV_FILE" ]] || { echo "❌ env 파일 없음: $ENV_FILE"; exit 1; }

cd "$PROJECT_DIR"

ACTION="${1:-deploy}"

case "$ACTION" in
  deploy)
    echo "▶ Prisma migrations 적용 (RDS)"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm \
      api ./node_modules/.bin/prisma migrate deploy --schema=prisma/schema.prisma
    echo "✅ 마이그레이션 완료"
    ;;
  status)
    echo "▶ 마이그레이션 상태 조회"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm \
      api ./node_modules/.bin/prisma migrate status --schema=prisma/schema.prisma
    ;;
  *)
    echo "Usage: $0 [deploy|status]"
    exit 1
    ;;
esac
