#!/usr/bin/env bash
# 팡슐랭 DGX STATION 배포 스크립트
#
# 사용법 (DGX STATION 안에서):
#   ./scripts/deploy.dgx.sh                # 현재 브랜치 git pull + 빌드 + 기동
#   ./scripts/deploy.dgx.sh --no-pull      # 로컬 변경 그대로 빌드 (디버그)
#   ./scripts/deploy.dgx.sh --no-migrate   # 마이그레이션 스킵
#
# 동작:
#   1) git pull --ff-only (옵션)
#   2) docker compose build (api, web)
#   3) docker compose up -d (postgres, minio, minio-init, api, web, nginx)
#   4) prisma migrate deploy
#   5) 헬스체크 통과까지 대기
#
# 기존 scripts/deploy.sh 는 AWS(ECR) 시나리오용이므로 그대로 보존.

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
COMPOSE_FILE="${PROJECT_DIR}/docker-compose.prod.yml"
ENV_FILE="${PROJECT_DIR}/.env.production"

DO_PULL=true
DO_MIGRATE=true
for arg in "$@"; do
  case "$arg" in
    --no-pull) DO_PULL=false ;;
    --no-migrate) DO_MIGRATE=false ;;
    *) echo "Unknown option: $arg"; exit 1 ;;
  esac
done

# 사전 검증
[[ -f "$COMPOSE_FILE" ]] || { echo "❌ compose 파일 없음: $COMPOSE_FILE"; exit 1; }
[[ -f "$ENV_FILE" ]] || { echo "❌ env 파일 없음: $ENV_FILE (.env.production.dgx.example 참고)"; exit 1; }
command -v docker >/dev/null || { echo "❌ docker 필요"; exit 1; }
command -v git >/dev/null || { echo "❌ git 필요"; exit 1; }

cd "$PROJECT_DIR"

PROFILES=(--profile self-hosted-db --profile self-hosted-storage)
COMPOSE=(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "${PROFILES[@]}")

if $DO_PULL; then
  echo "▶ git pull --ff-only"
  git pull --ff-only
fi

echo "▶ 이미지 로컬 빌드 (api, web)"
"${COMPOSE[@]}" build api web

echo "▶ 컨테이너 기동 (rolling)"
"${COMPOSE[@]}" up -d --remove-orphans

if $DO_MIGRATE; then
  echo "▶ DB 마이그레이션 (prisma migrate deploy)"
  "${COMPOSE[@]}" run --rm api \
    ./node_modules/.bin/prisma migrate deploy --schema=prisma/schema.prisma
fi

echo "▶ 헬스체크 대기 (최대 90초)"
deadline=$(( $(date +%s) + 90 ))
while (( $(date +%s) < deadline )); do
  api_status=$(docker inspect --format='{{.State.Health.Status}}' pangchelin-api 2>/dev/null || echo "starting")
  web_status=$(docker inspect --format='{{.State.Health.Status}}' pangchelin-web 2>/dev/null || echo "starting")
  if [[ "$api_status" == "healthy" && "$web_status" == "healthy" ]]; then
    echo "✅ 모든 컨테이너 healthy"
    "${COMPOSE[@]}" ps
    exit 0
  fi
  sleep 3
done

echo "❌ 헬스체크 타임아웃"
echo "   api=$api_status / web=$web_status"
echo "   로그: ${COMPOSE[*]} logs --tail 50 api web"
exit 1
