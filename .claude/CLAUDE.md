# CLAUDE.md

> 🐎 **하네스 엔지니어링 파일**
> 이 파일은 Claude Code가 매 세션 시작 시 자동으로 읽는 프로젝트 규칙입니다.
> 새로운 오류나 패턴을 발견할 때마다 이 파일을 업데이트하세요.

---

## 🎯 프로젝트: 팡슐랭 (Pangchelin)

광운대학교 학생/주민 대상 맛집 추천 웹서비스 (모바일 우선)

### Tech Stack
- Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript, Prisma ORM
- Database: PostgreSQL
- Map: 카카오맵 JavaScript SDK
- State: Zustand + TanStack Query
- Container: Docker + Docker Compose
- Monorepo: pnpm workspace

### 📱 Platform Priority
**모바일 웹 우선 (Mobile-First)** — 90% 모바일 접속 예상

---

## ✅ 작업 시작 전 자동 체크 (Claude Code 필독)

매 작업 시작 전 다음을 확인하세요:

1. [ ] `docs/checklist.md` 읽고 관련 항목 점검했는가?
2. [ ] `docs/KNOWN_ISSUES.md`에서 유사한 이슈가 있었는지 확인했는가?
3. [ ] `docs/디자인_시스템.md`의 모바일 규칙을 따르고 있는가?
4. [ ] DB 스키마 변경 시 `apps/api/prisma/schema.prisma` 먼저 확인했는가?

---

## 🚫 절대 금지 (Never Do)

### 보안
- ❌ API 키, DB 비밀번호, JWT_SECRET을 코드에 하드코딩
- ❌ `.env` 파일을 git에 커밋
- ❌ 클라이언트 코드에서 서버 시크릿 사용
- ❌ 사용자 입력을 검증 없이 DB 쿼리에 사용 (Prisma는 기본 안전, raw query 주의)

### Frontend
- ❌ `localStorage` / `sessionStorage`를 artifact 환경에서 사용 (차단됨)
- ❌ `position: fixed`를 키보드 올라오는 input 근처에 사용
- ❌ `100vh` 사용 (iOS Safari 주소창 이슈) → `100dvh` 사용
- ❌ input/textarea/select에 font-size 16px 미만 (iOS 줌 발생)
- ❌ 흔한 폰트 사용 금지 (Inter, Roboto, Arial)
- ❌ 보라색 그라데이션 (AI 생성물 클리셰)
- ❌ Tailwind `hover:` 무분별 사용 → `@media (hover: hover)`로 감싸기

### Backend
- ❌ controller에 비즈니스 로직 작성 (service로 분리)
- ❌ Prisma `include` 남발 (필요한 필드만 `select`)
- ❌ 트랜잭션 없이 여러 테이블 동시 수정
- ❌ try-catch 없이 외부 API 호출
- ❌ rate limiting 없이 public API 노출

### Docker
- ❌ docker-compose에 비밀번호 하드코딩 → `.env` 또는 Docker secrets
- ❌ 프로덕션 이미지에 dev dependencies 포함
- ❌ root 유저로 실행 → 비root 유저 생성

---

## ✅ 반드시 지킬 것 (Always Do)

### 코드 스타일
- TypeScript strict mode (any 금지, unknown 사용)
- ESLint + Prettier 자동 포맷
- 함수형 컴포넌트만 사용 (class 컴포넌트 금지)
- 명확한 네이밍 (한글 변수명 금지, 약어 지양)
- Conventional Commits (feat, fix, docs, refactor, test, chore)

### 모바일 우선 설계
- 최소 탭 타겟 44x44px (주요 액션 48px)
- safe-area-inset 활용
- 주요 액션은 화면 하단 (엄지 영역)
- next/image로 모든 이미지 최적화
- 로딩은 스켈레톤 (spinner 금지)

### Backend
- 모든 API에 Swagger 데코레이터
- DTO에 class-validator 데코레이터
- Service에서 Prisma 직접 호출 (Repository 패턴 불필요, NestJS+Prisma는 단순)
- 에러는 NestJS 표준 예외 사용 (`NotFoundException` 등)

### 디자인 토큰
- Tailwind 커스텀 토큰 사용 (`primary-500` 등)
- 인라인 색상 금지 (`text-[#D85A30]` ❌, `text-primary-500` ⭕)
- font-display(제목) / font-body(본문) / font-accent(가격) 구분 사용

### Git
- 한 커밋 = 한 작업 단위
- AI 생성 코드도 사람이 리뷰 후 커밋
- PR은 작게 쪼개기 (한 PR에 한 기능)

---

## 🎨 톤앤매너 (한국어 UI)

시스템 언어 ❌ → 친근한 존댓말 ⭕

| 금지 | 권장 |
|------|------|
| "영업 종료" | "오늘은 끝났어요" |
| "필터 없음" | "모든 식당 보기" |
| "데이터 로딩 중" | "맛있는 정보 가져오는 중" |
| "오류 발생" | "앗, 잠시 후 다시 시도해주세요" |
| "제보 완료" | "알려주셔서 고마워요!" |
| "검색 결과 없음" | "아직 등록된 식당이 없어요" |

---

## 📂 프로젝트 구조

```
pangchelin/
├── apps/
│   ├── web/                # Next.js (모바일 우선)
│   └── api/                # NestJS
├── packages/
│   └── types/              # 공통 타입
├── docs/
│   ├── checklist.md
│   ├── KNOWN_ISSUES.md
│   ├── 개발_계획.md
│   ├── 디자인_시스템.md
│   └── 개발_프롬프트.md
├── .claude/
│   └── CLAUDE.md           # 이 파일
├── docker-compose.yml
└── pnpm-workspace.yaml
```

---

## 🔧 자주 쓰는 명령어

```bash
# 개발 환경 시작
docker compose up

# Prisma 마이그레이션
docker compose exec api pnpm prisma migrate dev

# 시드 데이터
docker compose exec api pnpm prisma:seed

# 컨테이너 재빌드
docker compose up --build

# DB 초기화 (주의: 데이터 삭제됨)
docker compose down -v

# 로그 확인
docker compose logs -f api
docker compose logs -f web

# DB 직접 접속
docker compose exec postgres psql -U user pangchelin
```

---

## 📚 핵심 참조 문서

작업 시 참고할 문서 (우선순위 순):

1. **이 파일 (CLAUDE.md)** — 가장 중요한 규칙
2. **docs/KNOWN_ISSUES.md** — 과거 발생한 이슈와 해결법
3. **docs/checklist.md** — 작업 단계별 체크리스트
4. **docs/디자인_시스템.md** — UI/UX 가이드
5. **docs/개발_프롬프트.md** — Step별 프롬프트
6. **docs/개발_계획.md** — 전체 계획

---

## 🔄 업데이트 이력

이 파일은 살아있는 문서입니다. 새로운 패턴/금지사항/규칙 발견 시 즉시 업데이트.

| 날짜 | 변경 내용 | 작성자 |
|------|----------|--------|
| 2026-04-19 | 초기 생성 | 팡슐랭 팀 |
| 2026-04-24 | 경로 수정 (claude/ → .claude/), docs/harness/ → docs/ | 팡슐랭 팀 |

---

> 💡 **하네스 엔지니어링 핵심 원칙**:
> "에이전트가 실수할 때마다, 그 실수가 다시는 발생하지 않도록 시스템을 엔지니어링하라"
> — Mitchell Hashimoto (HashiCorp)
