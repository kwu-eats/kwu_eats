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

## E2E 테스트 (Playwright)

핵심 사용자 플로우(메인 지도 → 식당 상세 → 제보 → 관리자 검토)를
Playwright 로 검증합니다.

### 로컬 실행

```bash
# 1) 메인 스택 기동 + 시드 데이터 준비
docker compose up -d
docker compose exec api pnpm prisma migrate deploy
docker compose exec api pnpm prisma:seed

# 2) 최초 1회: 브라우저(Chromium) 설치
pnpm --filter web e2e:install

# 3) 테스트 실행
pnpm --filter web e2e

# HTML 리포트 확인
pnpm --filter web e2e:report
```

### Docker 컨테이너에서 실행

호스트에 Node/브라우저를 설치하지 않고도 실행할 수 있습니다.

```bash
docker compose -f docker-compose.yml -f docker-compose.e2e.yml \
  run --rm playwright
```

`web`, `api` 가 뜰 때까지 자동으로 대기한 뒤 테스트를 실행합니다.
리포트는 `apps/web/playwright-report/index.html` 에 저장됩니다.

### 시나리오

1. 메인 지도 페이지 진입 → 헤더/필터/식당 리스트 렌더링
2. "정문" 필터 토글 동작
3. ~~마커 클릭~~ (Kakao SDK 의존, 환경 불안정 → skip)
4. 식당 카드 → 상세 페이지 이동
5. 상세 페이지의 "정보 제보" → 제보 폼 진입
6. 제보 폼 작성 후 제출 → "알려주셔서 고마워요!" 성공 화면
7. 관리자 로그인 → 제보 목록에서 신규 제보 노출 확인

> 환경 변수로 베이스 URL 을 바꿀 수 있습니다.
> `E2E_BASE_URL`(웹), `E2E_API_URL`(API). 기본값은 각각
> `http://localhost:3000`, `http://localhost:4000` 입니다.

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
