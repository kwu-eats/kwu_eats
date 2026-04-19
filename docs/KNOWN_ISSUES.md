# 🐛 KNOWN_ISSUES.md

> 프로젝트 진행 중 발생한 이슈와 해결법을 누적 기록합니다.
> **새 이슈 발생 시 반드시 여기에 추가하세요.** 다음에 같은 실수를 반복하지 않기 위함입니다.
>
> 🐎 이것이 하네스 엔지니어링의 핵심: 실수를 시스템화하여 영구적으로 방지

---

## 📋 작성 양식

새 이슈 발생 시 아래 템플릿을 복사해서 작성:

```markdown
### #번호. [짧은 제목]

**발생일**: YYYY-MM-DD
**카테고리**: Frontend | Backend | Docker | DB | Build | etc.
**심각도**: 🔴 Critical | 🟡 Major | 🟢 Minor
**작성자**: 이름

#### 증상
- 어떤 상황에서 어떤 에러가 났는지

#### 원인
- 왜 이런 문제가 발생했는지

#### 해결 방법
- 어떻게 해결했는지 (코드 예시 포함)

#### 재발 방지
- [ ] CLAUDE.md에 규칙 추가
- [ ] checklist.md에 점검 항목 추가
- [ ] 코드에 주석/lint 룰 추가

#### 참고 링크
- 관련 문서, 스택오버플로우 등
```

---

## 📂 카테고리별 이슈 목록

### 🟦 Frontend (Next.js / React)

> 이슈가 발생하면 여기에 추가하세요.

<!-- 예시 -->
<details>
<summary>#1. iOS Safari에서 input 포커스 시 화면 줌 됨 (예시)</summary>

**발생일**: 2026-XX-XX
**카테고리**: Frontend
**심각도**: 🟡 Major
**작성자**: TBD

#### 증상
- iPhone Safari에서 input 또는 textarea 클릭 시 화면이 자동으로 확대됨
- 다시 축소되지 않아 UX 저해

#### 원인
- iOS Safari는 font-size가 16px 미만인 input을 포커스하면 자동으로 줌 처리
- Tailwind 기본 클래스 `text-sm` (14px) 사용 시 발생

#### 해결 방법
```css
/* globals.css */
input, textarea, select {
  font-size: 16px; /* 최소 16px 강제 */
}
```

또는 Tailwind에서:
```tsx
<input className="text-base" /> {/* 16px */}
```

#### 재발 방지
- [x] CLAUDE.md에 "input/textarea/select font-size 16px 이상" 규칙 추가
- [x] checklist.md의 모바일 점검 항목에 추가
- [ ] ESLint 커스텀 룰 추가 검토

#### 참고
- https://stackoverflow.com/questions/2989263

</details>

---

### 🟩 Backend (NestJS / Prisma)

> 이슈가 발생하면 여기에 추가하세요.

---

### 🐳 Docker

> 이슈가 발생하면 여기에 추가하세요.

<details>
<summary>#1. Docker daemon 미실행 상태에서 compose 검증 불가</summary>

**발생일**: 2026-04-20
**카테고리**: Docker
**심각도**: 🟡 Major
**작성자**: Codex

#### 증상
- `docker compose up --build -d` 실행 시 Docker daemon에 연결하지 못하고 즉시 실패
- 에러: `Cannot connect to the Docker daemon at unix:///Users/choejeong-in/.docker/run/docker.sock`

#### 원인
- Docker Desktop 또는 Docker daemon이 실행 중이 아니어서 로컬 소켓이 열려 있지 않음

#### 해결 방법
- Docker Desktop을 실행한 뒤 다시 `docker compose up --build -d` 수행
- 상태 확인: `docker info` 또는 `docker compose ps`

#### 재발 방지
- [ ] CLAUDE.md에 규칙 추가
- [x] checklist.md에 작업 시작 전 `docker compose ps` 점검 항목 존재
- [ ] 코드에 주석/lint 룰 추가

#### 참고 링크
- https://docs.docker.com/desktop/

</details>

---

### 🗄️ Database (PostgreSQL)

> 이슈가 발생하면 여기에 추가하세요.

---

### 🗺️ 카카오맵 API

> 이슈가 발생하면 여기에 추가하세요.

---

### 🚀 빌드/배포

> 이슈가 발생하면 여기에 추가하세요.

---

### 🤖 Claude Code 사용 관련

> Claude가 자주 하는 실수도 여기에 기록!
> 예: "프로젝트 컨벤션과 다른 방식으로 코드 생성", "디자인 토큰 무시" 등

---

## 🏆 자주 마주치는 이슈 TOP 5

> 가장 많이 반복된 이슈를 상단에 두어 빠르게 확인 가능하도록.

1. (아직 데이터 없음)
2.
3.
4.
5.

---

## 📊 이슈 통계

> 월별 이슈 발생 추이 추적

| 월 | 발생 건수 | 해결 완료 | 미해결 |
|----|----------|----------|--------|
| 2026-04 | 0 | 0 | 0 |
| 2026-05 | - | - | - |
| 2026-06 | - | - | - |

---

## 🔗 외부 참고 자료

자주 참고하는 문서 모음:

- [Next.js App Router 공식 문서](https://nextjs.org/docs)
- [NestJS 공식 문서](https://docs.nestjs.com)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [카카오맵 API 가이드](https://apis.map.kakao.com/web/guide/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [iOS Safari 호환성 이슈 모음](https://caniuse.com)

---

*마지막 업데이트: 2026-04-19*
