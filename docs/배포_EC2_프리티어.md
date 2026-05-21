# 팡슐랭 EC2 + RDS 프리티어 배포 가이드

AWS EC2 (Ubuntu 24.04, t3.micro/small/medium) 와 RDS db.t3.micro 조합으로 한 달 무료 운영하는 시나리오.

---

## 0. 준비물

- AWS 계정 (신규 가입 시 12개월 프리티어 무료)
- 도메인 (Route 53 또는 외부 등록처). 없으면 `EC2 퍼블릭 IP:80` 으로 임시 운영 가능 (단, HTTPS 안 됨)
- 카카오 개발자 콘솔 계정 (kakao.developers.com)

---

## 1. EC2 인스턴스 생성

| 설정 | 값 |
|---|---|
| AMI | Ubuntu Server 24.04 LTS (HVM), SSD Volume Type, 64bit x86 |
| 인스턴스 타입 | t3.micro (테스트) / t3.small (가벼운 운영) / t3.medium (쾌적) |
| 키 페어 | 새로 생성 (`pangchelin-key.pem`) — 안전한 곳에 보관 |
| EBS | 30GB gp3 (기본 8GB 는 부족) |
| 보안 그룹 인바운드 | SSH 22 (내 IP), HTTP 80 (0.0.0.0/0), HTTPS 443 (0.0.0.0/0) |
| 퍼블릭 IP 자동 할당 | 활성화 |

> **Elastic IP**: 인스턴스 중지·시작 시 퍼블릭 IP 가 바뀌므로, 운영하려면 Elastic IP 1개 할당 (인스턴스에 붙어 있으면 무료).

## 2. RDS 데이터베이스 생성 (db.t3.micro 프리티어)

| 설정 | 값 |
|---|---|
| 엔진 | PostgreSQL 16.x |
| 템플릿 | 프리 티어 |
| 인스턴스 타입 | db.t3.micro (1 vCPU / 1GB / 20GB SSD) |
| 마스터 사용자 | `pangchelin` |
| 마스터 암호 | 강력한 랜덤 (`openssl rand -base64 24`) |
| VPC | EC2 와 같은 VPC |
| 퍼블릭 액세스 | **아니요** (EC2 안에서만 접근) |
| 보안 그룹 | EC2 의 보안그룹에서 5432 인바운드 허용 |
| 초기 DB 이름 | `pangchelin` |

생성 후 엔드포인트 (예: `pangchelin.xxxxxx.ap-northeast-2.rds.amazonaws.com`) 메모.

> **EC2 안 컨테이너로 postgres 돌리고 싶다면** RDS 생성 생략. `docker-compose.prod.yml` 실행 시 `--profile self-hosted-db` 추가.

## 3. 카카오 개발자 콘솔 — 도메인 등록

1. developers.kakao.com → 내 애플리케이션 → 팡슐랭 (없으면 새로 만들기)
2. 앱 설정 > 플랫폼 > Web > 사이트 도메인에 운영 도메인 추가
   - 예: `https://pangchelin.app`, `http://<EC2-IP>` (테스트용)
3. JavaScript 키 복사 → `.env.production` 의 `KAKAO_MAP_KEY`

> 미등록 시 카카오맵 SDK 가 401/403 으로 죽습니다.

## 4. EC2 SSH 접속 + 환경 셋업

```bash
# 로컬에서:
chmod 400 ~/Downloads/pangchelin-key.pem
ssh -i ~/Downloads/pangchelin-key.pem ubuntu@<EC2-퍼블릭-IP>

# 이하 EC2 안에서:
sudo apt update && sudo apt upgrade -y
sudo apt install -y git ca-certificates curl

# Docker + Compose plugin 설치
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 현재 사용자에게 docker 권한 부여 (재로그인 필요)
sudo usermod -aG docker ubuntu
exit
# 다시 SSH 접속
ssh -i ~/Downloads/pangchelin-key.pem ubuntu@<EC2-퍼블릭-IP>

# t3.micro 라면 swap 4GB 추가 (빌드 OOM 방지)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 5. 소스 배포

```bash
# 작업 디렉터리
sudo mkdir -p /opt/pangchelin
sudo chown ubuntu:ubuntu /opt/pangchelin
cd /opt/pangchelin

# 소스 가져오기 (private repo 면 deploy key 또는 PAT 필요)
git clone -b docker https://github.com/<owner>/kwu_eats.git .

# 환경변수
cp .env.production.example .env.production
nano .env.production  # 또는 vim
# 채울 항목:
#  - DATABASE_URL (RDS 엔드포인트)
#  - JWT_SECRET (openssl rand -base64 48)
#  - PUBLIC_API_URL (https://<도메인>/api)
#  - KAKAO_MAP_KEY
#  - CORS_ORIGIN
chmod 660 .env.production
```

## 6. 빌드 + 기동

```bash
# RDS 사용 (기본)
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# self-hosted postgres 사용
docker compose -f docker-compose.prod.yml --env-file .env.production \
  --profile self-hosted-db up -d --build
```

빌드는 t3.micro 에서 swap 켜고 **15~25분**, t3.medium 에서 **3~5분** 정도.

## 7. DB 마이그레이션 + 시드 데이터

```bash
# Prisma 마이그레이션
docker compose -f docker-compose.prod.yml --env-file .env.production \
  exec api node_modules/.bin/prisma migrate deploy \
  --schema=apps/api/prisma/schema.prisma

# 시드 SQL 일괄 적용 (순서 중요)
PG="docker compose -f docker-compose.prod.yml --env-file .env.production exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB"
# RDS 사용 시 위 명령 대신:
PG="psql $DATABASE_URL"

cat scripts/seed-restaurants/out.sql                          | $PG
cat scripts/seed-restaurants/partnerships.sql                 | $PG
cat scripts/seed-restaurants/cover-images-update.sql          | $PG
cat scripts/seed-restaurants/business-hours-update.sql        | $PG
cat scripts/seed-restaurants/business-hours-update-v2.sql     | $PG
cat scripts/seed-restaurants/business-hours-update-v3.sql     | $PG
cat scripts/seed-restaurants/menus-import.sql                 | $PG
cat scripts/seed-restaurants/py-menus-import.sql              | $PG
cat scripts/seed-restaurants/external-menu-urls.sql           | $PG
```

## 8. SSL 인증서 (Let's Encrypt)

도메인이 EC2 IP 로 향하도록 Route 53 또는 외부 DNS 설정 후:

```bash
sudo apt install -y certbot
# 인증서 발급 (Nginx 컨테이너 잠시 중지 후)
docker compose -f docker-compose.prod.yml --env-file .env.production stop nginx
sudo certbot certonly --standalone -d <도메인>
sudo cp -r /etc/letsencrypt /opt/pangchelin/docker/nginx/certbot/conf
# docker/nginx/conf.d/default.conf 의 443 블록 주석 해제, 도메인 수정
docker compose -f docker-compose.prod.yml --env-file .env.production up -d nginx

# 갱신 자동화 (cron)
sudo crontab -e
# 다음 줄 추가:
0 3 * * * certbot renew --quiet && cp -r /etc/letsencrypt /opt/pangchelin/docker/nginx/certbot/conf && docker compose -f /opt/pangchelin/docker-compose.prod.yml --env-file /opt/pangchelin/.env.production restart nginx
```

## 9. 동작 확인

```bash
# 컨테이너 상태
docker compose -f docker-compose.prod.yml --env-file .env.production ps

# 헬스 체크
curl http://localhost/api/health
curl http://localhost/

# 외부 접속
# 브라우저에서 https://<도메인> 열기
```

## 10. 운영 메모

| 항목 | 명령 |
|---|---|
| 로그 보기 | `docker compose -f docker-compose.prod.yml logs -f api` |
| 재시작 | `docker compose -f docker-compose.prod.yml restart api` |
| 새 코드 배포 | `git pull && docker compose -f docker-compose.prod.yml up -d --build` |
| DB 백업 (RDS) | AWS 콘솔 > RDS > 스냅샷 |
| DB 백업 (self-hosted) | `docker compose exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql` |
| 디스크 사용량 | `df -h && docker system df` |
| 사용 안 하는 이미지 정리 | `docker system prune -a -f` |

---

## 트러블슈팅

### 빌드가 OOM 으로 죽음 (t3.micro)
swap 추가 (위 4번 마지막). 또는 인스턴스 일시적으로 t3.medium 으로 변경 후 빌드 → 다시 t3.micro 로 변경.

### 카카오맵이 안 보임 (401/403)
카카오 개발자 콘솔에서 운영 도메인 등록 안 됐음. 위 3번 참고.

### API 호출이 localhost:4000 으로 감
`PUBLIC_API_URL` 을 채우지 않고 빌드함. `.env.production` 수정 후 `docker compose ... up -d --build web` 으로 재빌드.

### CORS 에러
`CORS_ORIGIN` 에 프론트 도메인이 빠짐. 쉼표로 여러 origin 가능.

### 프리티어 한도 초과 알림
- EC2: 시간당 과금. 안 쓸 땐 stop (EBS만 과금)
- RDS: 750시간/월 무료 (1개 인스턴스라면 한 달 풀 가동 가능)
- 데이터 전송: 월 1GB 무료. 그 이상은 GB 당 $0.09
