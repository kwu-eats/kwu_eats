#!/usr/bin/env bash
# 팡슐랭 롤백 스크립트
#
# 사용법:
#   ./scripts/rollback.sh <previous-git-sha>
#
# 동작:
#   - 지정한 이전 git SHA 이미지로 즉시 되돌림 (deploy.sh 와 동일 매커니즘)
#   - DB 마이그레이션은 되돌리지 않음 (호환되는 SHA 인지 확인 필수)

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <previous-git-sha>"
  echo
  echo "주의: 마이그레이션은 자동으로 되돌리지 않습니다."
  echo "      이전 SHA 가 현재 DB 스키마와 호환되는지 확인하고 실행하세요."
  echo
  echo "롤백 가능한 최근 이미지 태그 보기:"
  echo "  aws ecr describe-images --repository-name pangchelin-api \\"
  echo "    --query 'sort_by(imageDetails,& imagePushedAt)[-10:].imageTags' --output table"
  exit 1
fi

PREV_SHA="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "⚠ 롤백: 이전 SHA=$PREV_SHA 로 되돌립니다"
read -r -p "진행하려면 'yes' 입력: " confirm
[[ "$confirm" == "yes" ]] || { echo "취소"; exit 0; }

# deploy.sh 를 그대로 호출 (같은 절차)
exec "$SCRIPT_DIR/deploy.sh" "$PREV_SHA"
