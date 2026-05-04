# DGX STATION 임시 배포 가이드

> AWS 서버 신청이 지연되어 광운대 내부망의 **DGX STATION (10G)** 으로 임시 운영하는 시나리오.
> AWS 신청 완료 후에는 환경변수 교체만으로 AWS 로 복귀 가능.
> AWS 정식 운영 가이드는 [배포_환경.md](배포_환경.md), [운영_가이드.md](운영_가이드.md) 참고.

---

## 1. 인프라 구성

```
┌──────────────────────────────────────────────────────────────┐
│ DGX STATION (Linux 호스트)                                    │
│                                                               │
│  외부 :20320 ──NAT──▶ 호스트 :6006 ──┐                        │
│                                       ▼                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Docker network: pangchelin-prod                         │  │
│  │                                                         │  │
│  │  nginx:80 ──/api/*─────▶ api:4000                       │  │
│  │           ──/uploads/*─▶ minio:9000                     │  │
│  │           ──/_next/*───▶ web:3000                       │  │
│  │           ──/────────-─▶ web:3000                       │  │
│  │                                                         │  │
│  │  api ──▶ postgres:5432 (named volume: pg_data)          │  │
│  │  api ──▶ minio:9000   (named volume: minio_data)        │  │
│  │                                                         │  │
│  │  minio-init (일회성: bucket 생성 + anonymous download)  │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

- **외부 노출**: nginx (호스트 6006 → 외부 20320) **단 한 개**
- **postgres / minio / api / web** 은 도커 네트워크 내부에서만 통신 (호스트 publish 없음)

---

## 2. 포트 매핑

| 호스트 포트 | 외부 포트 | 컨테이너 | 내부 포트 | 용도 |
|---|---|---|---|---|
| **6006** | **20320** | nginx | 80 | HTTP 진입점 (web + /api + /uploads) |
| 미사용 | 20321~20329 | — | — | 디버깅/예비 (필요 시 임시 매핑) |

**예비 포트 활용 예** (디버깅):
- pgAdmin 임시 추가 시: 컨테이너 80 → 호스트 6007 → 외부 20321
- MinIO Console 일시 노출 시: 컨테이너 9001 → 호스트 6008 → 외부 20322

---

## 3. 사전 요구사항

DGX STATION 호스트에서:
- Docker Engine 24+ 및 Docker Compose v2
- git, bash
- 디스크 여유 공간 (postgres + minio 데이터 + 백업)
- 호스트 6006 포트 사용 가능 (`ss -tlnp | grep 6006` 으로 확인)

---

## 4. 최초 셋업

```bash
# 1) 프로젝트 clone
git clone <repo-url> pangchelin
cd pangchelin

# 2) 환경변수 파일 작성
cp .env.production.dgx.example .env.production
chmod 600 .env.production
# 에디터로 열어 다음 값 채우기:
#   POSTGRES_PASSWORD, JWT_SECRET, MINIO_ROOT_PASSWORD, S3_SECRET_KEY
#   CORS_ORIGIN=http://<DGX 외부 IP 또는 도메인>:20320
nano .env.production

# 3) 배포 스크립트 실행 권한
chmod +x scripts/deploy.dgx.sh scripts/backup-dgx.sh

# 4) 배포 (빌드 + 기동 + 마이그레이션)
./scripts/deploy.dgx.sh

# 5) 시드 데이터 (선택)
docker compose -f docker-compose.prod.yml \
  --profile self-hosted-db --profile self-hosted-storage \
  --env-file .env.production \
  run --rm api node_modules/.bin/ts-node prisma/seed.ts
```

배포 완료 확인:
```bash
curl -I http://localhost:6006/                  # 200
curl -I http://localhost:6006/api/health        # 200
```

---

## 5. 일상 운영

### 로그 확인
```bash
# 모든 서비스 실시간
docker compose -f docker-compose.prod.yml \
  --profile self-hosted-db --profile self-hosted-storage \
  --env-file .env.production logs -f --tail 100

# 개별 서비스
docker compose ... logs -f --tail 100 api
docker compose ... logs -f --tail 100 nginx
```

### 컨테이너 상태
```bash
docker compose -f docker-compose.prod.yml \
  --profile self-hosted-db --profile self-hosted-storage \
  --env-file .env.production ps
```

### 재기동 (코드 변경 후 재배포)
```bash
./scripts/deploy.dgx.sh
```

### DB 직접 접속
```bash
docker compose ... exec postgres psql -U pangchelin pangchelin
```

### MinIO 데이터 확인 (mc)
```bash
docker run --rm --network pangchelin-prod \
  -e MC_HOST_local="http://${MINIO_ROOT_USER}:${MINIO_ROOT_PASSWORD}@minio:9000" \
  minio/mc:latest ls local/pangchelin
```

---

## 6. 백업 / 복원

### 수동 백업
```bash
./scripts/backup-dgx.sh
# → backups/db_<ts>.sql.gz, backups/minio_<ts>/
# 7일 이전 자동 삭제
```

### cron 등록 (매일 03:30)
```bash
crontab -e
# 추가:
30 3 * * * cd /opt/pangchelin && ./scripts/backup-dgx.sh >> backups/cron.log 2>&1
```

### 복원 (postgres)
```bash
gunzip < backups/db_20260504-033000.sql.gz | \
  docker compose ... exec -T postgres psql -U pangchelin -d pangchelin
```

### 복원 (minio)
```bash
docker run --rm --network pangchelin-prod \
  -e MC_HOST_local="http://${MINIO_ROOT_USER}:${MINIO_ROOT_PASSWORD}@minio:9000" \
  -v "$(pwd)/backups/minio_20260504-033000:/backup" \
  minio/mc:latest \
  mirror --overwrite /backup local/pangchelin
```

---

## 7. 트러블슈팅

### `minio-init` 컨테이너가 종료 상태로 남아있음
정상. `restart: "no"` 로 설정되어 일회성 실행 후 종료. 로그 확인:
```bash
docker logs pangchelin-minio-init
# "minio init done" 보이면 OK
```

### 이미지 업로드는 되는데 표시가 안 됨
- `PUBLIC_IMAGE_BASE_URL=/uploads` 설정 확인
- nginx 의 `/uploads/` location 동작 확인:
  ```bash
  curl -I http://localhost:6006/uploads/pangchelin/restaurants/<key>.jpg
  ```
- minio bucket 의 anonymous policy 확인:
  ```bash
  docker run --rm --network pangchelin-prod \
    -e MC_HOST_local="http://${MINIO_ROOT_USER}:${MINIO_ROOT_PASSWORD}@minio:9000" \
    minio/mc:latest anonymous get local/pangchelin
  # "Access permission for `local/pangchelin` is `download`" 보여야 함
  ```

### 카카오맵이 안 보임
카카오 디벨로퍼스 콘솔에서 도메인/IP 등록 필요. DGX 외부 IP 또는 도메인을 JS 키의 사이트 도메인 목록에 추가.

### `docker compose` 가 minio 서비스를 못 찾음
`--profile self-hosted-db --profile self-hosted-storage` 두 프로파일 모두 지정했는지 확인. 둘 중 하나라도 빠지면 해당 서비스 비활성.

### postgres 데이터 영구 손실 방지
- `pg_data` named volume 은 `docker compose down -v` 시 삭제됨. **`-v` 절대 금지**.
- 정기 `./scripts/backup-dgx.sh` 로 외부 백업 필수.

---

## 8. AWS 복귀 절차

AWS 셋업 완료 후:

### 8.1 환경변수 교체
```bash
# 현재 DGX 환경변수 백업
mv .env.production .env.production.dgx.bak

# AWS 템플릿 복사 후 값 채움
cp .env.production.example .env.production
# AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
# DATABASE_URL (RDS), JWT_SECRET, CORS_ORIGIN 등 채움.
# PUBLIC_IMAGE_BASE_URL 비워둠 (또는 CloudFront URL).
```

### 8.2 데이터 마이그레이션 (DGX → AWS)
```bash
# 1) postgres → RDS
./scripts/backup-dgx.sh
# backups/db_<ts>.sql.gz 를 새 RDS 에 임포트
gunzip < backups/db_<ts>.sql.gz | psql -h <rds-endpoint> -U <user> -d pangchelin

# 2) minio → S3
docker run --rm --network pangchelin-prod \
  -e MC_HOST_local="http://${MINIO_ROOT_USER}:${MINIO_ROOT_PASSWORD}@minio:9000" \
  -e MC_HOST_aws="https://<aws-key>:<aws-secret>@s3.ap-northeast-2.amazonaws.com" \
  minio/mc:latest \
  mirror local/pangchelin aws/pangchelin-images-prod

# 3) DB 안의 /uploads/ URL 을 AWS 절대 URL 로 일괄 변환
# (DGX 시기에 업로드된 데이터가 있을 경우만)
psql -h <rds-endpoint> -U <user> -d pangchelin <<'SQL'
UPDATE restaurants
SET image_url = REPLACE(
  image_url,
  '/uploads/pangchelin/',
  'https://pangchelin-images-prod.s3.ap-northeast-2.amazonaws.com/pangchelin/'
)
WHERE image_url LIKE '/uploads/%';

UPDATE reports
SET image_url = REPLACE(
  image_url,
  '/uploads/pangchelin/',
  'https://pangchelin-images-prod.s3.ap-northeast-2.amazonaws.com/pangchelin/'
)
WHERE image_url LIKE '/uploads/%';
-- 이미지 URL 보유 다른 테이블이 있으면 동일하게 추가
SQL
```

### 8.3 AWS 환경에서 기동
```bash
# AWS EC2 에서:
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
# (profiles 미지정 → postgres / minio / minio-init 비활성)
```

기존 [scripts/deploy.sh](../scripts/deploy.sh) (ECR 기반) 사용 가능.

---

## 9. 이미지 URL 정책 요약

| 환경 | `PUBLIC_IMAGE_BASE_URL` | DB 저장 URL 형식 |
|---|---|---|
| DGX | `/uploads` | `/uploads/pangchelin/restaurants/<uuid>.jpg` (상대) |
| AWS | (비어있음) | `https://<bucket>.s3.<region>.amazonaws.com/pangchelin/...` (절대) |
| AWS + CloudFront | `https://images.example.com` | `https://images.example.com/pangchelin/...` |

**상대경로 사용 이점**: DGX IP 변경, AWS 복귀, 도메인 변경 모두 새 데이터에 영향 없음.
**단점**: 환경 전환 시점의 기존 데이터는 §8.2 처럼 일괄 변환 필요.
