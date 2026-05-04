#!/usr/bin/env bash
# 팡슐랭 수동 배포 스크립트
#
# 사용법 (EC2 안에서):
#   ./scripts/deploy.sh <git-sha>
#   ./scripts/deploy.sh latest                # 디버그용 (운영에서는 SHA 박는 것을 권장)
#
# 동작:
#   1) ECR 로그인
#   2) 지정한 태그로 API_IMAGE / WEB_IMAGE 환경변수 설정
#   3) docker compose pull -> up -d
#   4) 헬스체크 통과까지 대기
#   5) 결과 출력 (실패 시 logs 안내)

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <image-tag>"
  echo "  e.g. $0 a3f8b21        # 권장: 배포할 git SHA"
  echo "  e.g. $0 latest         # 디버그용"
  exit 1
fi

IMAGE_TAG="$1"
PROJECT_DIR="${PROJECT_DIR:-/opt/pangchelin}"
COMPOSE_FILE="${PROJECT_DIR}/docker-compose.prod.yml"
ENV_FILE="${PROJECT_DIR}/.env.production"
AWS_REGION="${AWS_REGION:-ap-northeast-2}"
ECR_REGISTRY="${ECR_REGISTRY:?Set ECR_REGISTRY env var (예: 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com)}"

# 사전 검증
[[ -f "$COMPOSE_FILE" ]] || { echo "❌ compose 파일 없음: $COMPOSE_FILE"; exit 1; }
[[ -f "$ENV_FILE" ]] || { echo "❌ env 파일 없음: $ENV_FILE"; exit 1; }
command -v aws >/dev/null || { echo "❌ aws CLI 필요"; exit 1; }
command -v docker >/dev/null || { echo "❌ docker 필요"; exit 1; }

cd "$PROJECT_DIR"

echo "▶ ECR 로그인 ($ECR_REGISTRY)"
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# 이미지 태그 export (compose 가 .env.production 와 함께 읽음)
export API_IMAGE="${ECR_REGISTRY}/pangchelin-api:${IMAGE_TAG}"
export WEB_IMAGE="${ECR_REGISTRY}/pangchelin-web:${IMAGE_TAG}"

echo "▶ 이미지 pull"
echo "  API: $API_IMAGE"
echo "  WEB: $WEB_IMAGE"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" pull

echo "▶ 컨테이너 재기동 (rolling)"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --remove-orphans

echo "▶ 헬스체크 대기 (최대 90초)"
deadline=$(( $(date +%s) + 90 ))
while (( $(date +%s) < deadline )); do
  api_status=$(docker inspect --format='{{.State.Health.Status}}' pangchelin-api 2>/dev/null || echo "starting")
  web_status=$(docker inspect --format='{{.State.Health.Status}}' pangchelin-web 2>/dev/null || echo "starting")
  if [[ "$api_status" == "healthy" && "$web_status" == "healthy" ]]; then
    echo "✅ 모든 컨테이너 healthy"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    exit 0
  fi
  sleep 3
done

echo "❌ 헬스체크 타임아웃"
echo "   api=$api_status / web=$web_status"
echo "   로그: docker compose -f $COMPOSE_FILE logs --tail 50 api web"
exit 1
