# ✅ checklist.md

> 작업 단계별 점검 리스트입니다.
> 새 기능 개발 / 버그 수정 / 배포 전 반드시 해당 섹션을 체크하세요.

---

## 🚀 작업 시작 전

- [ ] 최신 main 브랜치 pull 받았는가?
- [ ] feature 브랜치 새로 생성했는가? (`feat/`, `fix/`, `chore/` 접두사)
- [ ] `KNOWN_ISSUES.md`에서 유사한 이슈 확인했는가?
- [ ] 작업 범위가 한 PR로 적절한 크기인가? (너무 크면 분할)
- [ ] Docker 컨테이너 정상 실행 중인가? (`docker compose ps`)

---

## 🎨 Frontend 개발 시

### 📱 모바일 우선 점검
- [ ] 디자인이 모바일(360px~) 기준으로 먼저 만들어졌는가?
- [ ] 탭 가능 요소 모두 최소 44x44px인가?
- [ ] input/textarea/select가 font-size 16px 이상인가?
- [ ] safe-area-inset 적용했는가? (헤더 top, 바텀바 bottom)
- [ ] hover 스타일이 `@media (hover: hover)`로 감싸져 있는가?
- [ ] 100vh 대신 100dvh 사용했는가?
- [ ] 한 손 조작 가능한가? (주요 액션이 화면 하단에 있는가?)

### 🎨 디자인 시스템 준수
- [ ] Tailwind 커스텀 토큰 사용했는가? (`primary-500` 등)
- [ ] 인라인 색상(`text-[#xxx]`)을 사용하지 않았는가?
- [ ] 폰트 패밀리 명시했는가? (`font-display`, `font-body`, `font-accent`)
- [ ] 톤앤매너 가이드대로 한국어 작성했는가? (친근한 존댓말)
- [ ] 보라색 그라데이션, Inter 폰트 사용 안 했는가?

### ⚛️ React/Next.js 베스트 프랙티스
- [ ] 함수형 컴포넌트인가?
- [ ] `key` prop이 list rendering에 모두 있는가?
- [ ] 이미지는 `next/image` 사용했는가?
- [ ] Server Component vs Client Component 적절히 구분했는가?
- [ ] `'use client'` 필요한 컴포넌트만 클라이언트 컴포넌트인가?
- [ ] `localStorage`/`sessionStorage` 사용 시 `typeof window !== 'undefined'` 체크했는가?

### 🌐 접근성
- [ ] 모든 button/a 요소에 텍스트 또는 aria-label 있는가?
- [ ] 폼 input에 label 연결돼 있는가?
- [ ] 색상만으로 정보 전달하지 않는가? (영업중/마감 = 색상 + 텍스트 + 아이콘)
- [ ] prefers-reduced-motion 대응했는가?

---

## 🔧 Backend 개발 시

### 📋 API 설계
- [ ] DTO에 class-validator 데코레이터 모두 붙어있는가?
- [ ] Swagger 데코레이터 작성했는가? (`@ApiOperation`, `@ApiResponse`)
- [ ] 적절한 HTTP 상태 코드 사용했는가? (200/201/204/400/401/403/404/500)
- [ ] 에러 메시지가 사용자 친화적인가?
- [ ] 인증 필요 API에 `JwtAuthGuard` 적용했는가?

### 🗄️ Database / Prisma
- [ ] 스키마 변경 후 마이그레이션 생성했는가? (`prisma migrate dev`)
- [ ] CASCADE DELETE 관계가 의도대로 동작하는가?
- [ ] N+1 쿼리 문제 없는가? (Prisma `include` 적절히 사용)
- [ ] 트랜잭션 필요한 작업에 `$transaction` 사용했는가?
- [ ] 인덱스 필요한 자주 검색 컬럼에 추가했는가?
- [ ] `select`로 필요한 필드만 가져오는가? (`include` 남발 X)

### 🔒 보안
- [ ] API 키, 비밀번호가 코드에 하드코딩 안 됐는가?
- [ ] `.env` 파일이 `.gitignore`에 포함됐는가?
- [ ] Rate limiting 적용했는가? (특히 public API)
- [ ] CORS 설정 정확한가? (프로덕션 도메인만 허용)
- [ ] 사용자 입력 검증/이스케이프 됐는가?
- [ ] 비밀번호는 bcrypt 등으로 해시했는가?

### 🧪 에러 처리
- [ ] try-catch 또는 NestJS 예외 필터로 에러 처리했는가?
- [ ] 외부 API 호출 시 timeout 설정했는가?
- [ ] DB 연결 실패 시 적절한 에러 응답하는가?

---

## 🐳 Docker 작업 시

- [ ] `.dockerignore`가 적절한가? (node_modules, .env, .git 등)
- [ ] 멀티스테이지 빌드 활용했는가? (이미지 크기 최소화)
- [ ] 비root 유저로 실행되는가?
- [ ] 환경변수가 docker-compose에 하드코딩 안 됐는가?
- [ ] 볼륨 마운트가 의도대로 동작하는가?
- [ ] healthcheck 설정했는가?
- [ ] 로컬에서 `docker compose up`으로 정상 동작하는가?

---

## 🗺️ 카카오맵 관련 작업 시

- [ ] API 키가 환경변수로 관리되는가? (`NEXT_PUBLIC_KAKAO_MAP_KEY`)
- [ ] SDK 로딩 후 `kakao.maps.load()` 콜백 안에서 지도 생성하는가?
- [ ] 마커 클러스터링 적용했는가? (마커 100개 이상)
- [ ] 지도 위 오버레이 버튼이 지도 제스처 방해 안 하는가?
- [ ] 모바일에서 핀치줌, 더블탭 줌 정상 동작하는가?

---

## 📝 사용자 제보 기능 작업 시

- [ ] 제보 타입별 suggestedData 검증 (Zod discriminated union)
- [ ] Rate limiting 적용 (스팸 방지)
- [ ] 이미지 업로드 크기 제한 (5MB 이하)
- [ ] 관리자 승인 시 트랜잭션 사용 (제보 상태 + 실제 데이터 반영 원자적)
- [ ] 반려 시 사유 필수 입력
- [ ] 제보 상태 전이 검증 (PENDING → APPROVED/REJECTED 외 금지)

---

## 🧪 PR 생성 전

- [ ] 로컬에서 빌드 성공? (`pnpm build`)
- [ ] Lint 통과? (`pnpm lint`)
- [ ] 타입 체크 통과? (`pnpm type-check`)
- [ ] Docker 환경에서도 정상 동작?
- [ ] 의미 있는 커밋 메시지로 작성됐는가?
- [ ] AI 생성 코드를 본인이 설명할 수 있는가?
- [ ] 새로운 환경변수가 `.env.example`에 추가됐는가?
- [ ] README 업데이트 필요한 변경인가?
- [ ] **새 이슈 발생했다면 KNOWN_ISSUES.md에 기록했는가?**

---

## 🚀 배포 전 (프로덕션)

### 환경
- [ ] 프로덕션 환경변수 모두 설정됐는가?
- [ ] CORS 프로덕션 도메인 허용 설정?
- [ ] SSL 인증서 발급/갱신됐는가?
- [ ] DB 백업 스크립트 동작하는가?

### 성능
- [ ] Lighthouse 모바일 점수 90+ 인가?
- [ ] 이미지 최적화 (WebP, lazy loading)?
- [ ] 번들 크기 적절한가? (`next-bundle-analyzer`)
- [ ] DB 쿼리 N+1 없는가?
- [ ] 캐싱 전략 적용됐는가?

### 모니터링
- [ ] 에러 트래킹 도구 설정? (Sentry 등 - 선택사항)
- [ ] 로그 수집 가능한가?
- [ ] 헬스체크 엔드포인트 정상?

### 테스트
- [ ] 실제 모바일 기기에서 테스트했는가? (iPhone Safari, Android Chrome)
- [ ] 다양한 화면 크기 테스트?
- [ ] 가로/세로 회전 정상?
- [ ] 키보드 올라왔을 때 레이아웃 정상?

---

## 🐛 버그 수정 시

- [ ] 재현 단계 명확히 파악했는가?
- [ ] 근본 원인(root cause) 찾았는가? (증상만 가리지 말기)
- [ ] 동일/유사 문제가 다른 곳에 있는지 확인했는가?
- [ ] 회귀(regression) 방지 위해 테스트 추가했는가?
- [ ] **KNOWN_ISSUES.md에 기록했는가?** ⭐
- [ ] CLAUDE.md에 새 규칙 추가 필요한가?

---

## 🤖 Claude Code 사용 시

- [ ] 새 대화 시작 시 CLAUDE.md 읽도록 컨텍스트 제공했는가?
- [ ] 작업 단위가 한 Step 정도로 적절한가?
- [ ] 생성된 코드를 한 줄씩 리뷰했는가?
- [ ] AI가 만든 코드의 동작을 설명할 수 있는가?
- [ ] API 키 등 민감 정보를 입력하지 않았는가?
- [ ] 코드 생성 후 lint/type-check 돌렸는가?

---

## 📚 정기 점검 (주 1회)

- [ ] KNOWN_ISSUES.md를 팀과 공유하고 반복 이슈 분석
- [ ] CLAUDE.md 업데이트 필요 항목 확인
- [ ] 의존성 보안 업데이트 (`pnpm audit`)
- [ ] Docker 이미지 정리 (`docker system prune`)
- [ ] 진행 상황 회의록 업데이트

---

*마지막 업데이트: 2026-04-19*