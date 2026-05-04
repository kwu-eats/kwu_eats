#!/usr/bin/env bash
# 팡슐랭 RDS 수동 스냅샷
#
# 사용법:
#   ./scripts/backup-rds.sh
#   ./scripts/backup-rds.sh "before-major-migration"
#
# 참고:
#   - RDS 자동 백업이 매일 도므로 일상적으로는 불필요
#   - 큰 변경(스키마 마이그레이션, 대량 데이터 변환) 직전에만 실행 권장
#   - 자동 백업과 달리 수동 스냅샷은 사용자가 삭제할 때까지 보존됨 (요금 누적 주의)

set -euo pipefail

DB_INSTANCE="${DB_INSTANCE:-pangchelin-prod}"
AWS_REGION="${AWS_REGION:-ap-northeast-2}"
LABEL="${1:-manual}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
SNAPSHOT_ID="manual-${DB_INSTANCE}-${LABEL}-${TIMESTAMP}"

# 스냅샷 ID 규칙: 영문 소문자/숫자/하이픈만, 1~255자
SNAPSHOT_ID=$(echo "$SNAPSHOT_ID" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | cut -c1-255)

command -v aws >/dev/null || { echo "❌ aws CLI 필요"; exit 1; }

echo "▶ RDS 수동 스냅샷 생성"
echo "  DB instance: $DB_INSTANCE"
echo "  Snapshot ID: $SNAPSHOT_ID"

aws rds create-db-snapshot \
  --db-snapshot-identifier "$SNAPSHOT_ID" \
  --db-instance-identifier "$DB_INSTANCE" \
  --region "$AWS_REGION" \
  --tags Key=Source,Value=manual Key=CreatedBy,Value="${USER:-unknown}" \
  --output json | tee /tmp/snapshot-result.json | python3 -c "
import json, sys
d = json.load(sys.stdin)['DBSnapshot']
print(f\"  status: {d['Status']}\")
print(f\"  size:   {d.get('AllocatedStorage', '-')} GB\")
"

echo
echo "✅ 스냅샷 생성 요청 완료 (실제 완료까지 5~30분)"
echo "   진행 상태:"
echo "   aws rds describe-db-snapshots --db-snapshot-identifier $SNAPSHOT_ID --region $AWS_REGION"
echo
echo "   완료 대기 (블로킹):"
echo "   aws rds wait db-snapshot-available --db-snapshot-identifier $SNAPSHOT_ID --region $AWS_REGION"
