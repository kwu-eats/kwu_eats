# 팡슐랭 (Pangchelin)

광운대학교 맛집 추천 웹서비스 — 미슐랭 가이드의 위트를 담은 대학가 맛집 지도

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL 16
- **지도**: 카카오맵 JavaScript SDK
- **인프라**: Docker Compose, Nginx

## 프로젝트 구조

```
pangchelin/
├── apps/
│   ├── web/          # Next.js 프론트엔드 (포트 3000)
│   └── api/          # NestJS 백엔드 (포트 4000)
├── packages/
│   └── types/        # 프론트/백 공통 타입
├── docker/
│   └── nginx/        # Nginx 설정
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## 개발 환경 세팅

### 사전 요구사항

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치
- [Node.js 20 LTS](https://nodejs.org/) 설치
- [pnpm](https://pnpm.io/) 설치 (`npm install -g pnpm`)

### 환경변수 설정

```bash
# 루트 .env 복사 후 값 입력
cp .env.example .env

# apps/api 환경변수
cp apps/api/.env.example apps/api/.env

# apps/web 환경변수
cp apps/web/.env.example apps/web/.env
```

### Docker로 전체 스택 실행 (권장)

```bash
# 전체 스택 실행 (postgres + api + web)
docker compose up

# 백그라운드 실행
docker compose up -d

# 로그 확인
docker compose logs -f

# 중지
docker compose down
```

서버가 뜨면:
- 웹: http://localhost:3000
- API: http://localhost:4000
- API 문서: http://localhost:4000/api/docs

### 로컬 개발 (Docker 없이)

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (web + api 동시)
pnpm dev
```

### DB 초기화

```bash
# 마이그레이션 실행
docker compose exec api pnpm prisma migrate dev

# 시드 데이터 삽입
docker compose exec api pnpm prisma:seed
```

초기 스키마 생성 시에는 다음처럼 마이그레이션 이름을 지정해 실행합니다.

```bash
docker compose exec api pnpm prisma migrate dev --name init
```

## 주요 명령어

```bash
# 전체 빌드
pnpm build

# 린트
pnpm lint

# 포맷
pnpm format

# 특정 앱만 실행
pnpm --filter web dev
pnpm --filter api dev
```
