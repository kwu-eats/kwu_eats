#!/usr/bin/env bash
# 팡슐랭 운영 배포 스크립트 (EC2 실제 구성)
#
# 실제 운영은 ECR/RDS 가 아니라 EC2 안에서 직접 빌드 + self-hosted postgres 로 돈다.
# (참고: scripts/deploy.sh 는 ECR pull 가정의 미사용 스크립트)
#
# 사용법 (EC2 /opt/pangchelin 안에서):
#   ./scripts/deploy-prod.sh
#
# 동작:
#   1) docker 브랜치 최신화 (git pull --ff-only)
#   2) 로컬 빌드 + 컨테이너 재기동 (kafka/api/web)
#   3) ⚠️ nginx 재시작 — 재생성된 web/api 의 새 컨테이너 IP 를 다시 해석시킨다.
#      (nginx 는 업스트림을 시작 시 1회만 DNS 해석 → 재시작 없이는 옛 IP 캐시로 502 발생)
#   4) 컨테이너 healthy 대기
#   5) 외부 HTTPS 200 확인
#
# (향후 개선) nginx conf 에 `resolver 127.0.0.11 valid=10s;` + 변수 proxy_pass 를 쓰면
#   nginx 가 자동 재해석하여 3) 단계가 불필요해진다. 현재는 안전하게 재시작으로 처리.

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/opt/pangchelin}"
ENV_FILE="${ENV_FILE:-$PROJECT_DIR/.env.production}"
COMPOSE_FILE="${COMPOSE_FILE:-$PROJECT_DIR/docker-compose.prod.yml}"
DOMAIN="${DOMAIN:-https://kwueats.kro.kr}"

COMPOSE=(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile self-hosted-db)

[[ -f "$ENV_FILE" ]]     || { echo "❌ env 파일 없음: $ENV_FILE"; exit 1; }
[[ -f "$COMPOSE_FILE" ]] || { echo "❌ compose 파일 없음: $COMPOSE_FILE"; exit 1; }

cd "$PROJECT_DIR"

echo "▶ 1) git pull --ff-only origin docker"
git pull --ff-only origin docker

echo "▶ 2) 빌드 + 재기동 (kafka/api/web)"
"${COMPOSE[@]}" up -d --build --remove-orphans

echo "▶ 3) nginx 재시작 (업스트림 새 IP 재해석 → 502 방지)"
docker restart pangchelin-nginx

echo "▶ 4) 헬스체크 대기 (최대 120초)"
deadline=$(( $(date +%s) + 120 ))
while (( $(date +%s) < deadline )); do
  api=$(docker inspect --format='{{.State.Health.Status}}' pangchelin-api 2>/dev/null || echo "starting")
  web=$(docker inspect --format='{{.State.Health.Status}}' pangchelin-web 2>/dev/null || echo "starting")
  if [[ "$api" == "healthy" && "$web" == "healthy" ]]; then
    echo "  ✅ api/web healthy"
    break
  fi
  sleep 3
done

echo "▶ 5) 외부 HTTPS 응답 확인"
home=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$DOMAIN/")
api_health=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$DOMAIN/api/health")
echo "  home=$home  api/health=$api_health"

if [[ "$home" == "200" && "$api_health" == "200" ]]; then
  echo "✅ 배포 완료"
  "${COMPOSE[@]}" ps
else
  echo "❌ 외부 응답 비정상 (home=$home, api/health=$api_health)"
  echo "   로그: ${COMPOSE[*]} logs --tail 50 api web nginx"
  exit 1
fi
