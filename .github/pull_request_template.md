## 무엇을 했나요

<!-- 한 줄로 변경의 목적과 결과를 요약. PR 제목과 어느 정도 중복돼도 OK -->

## 왜 했나요

<!-- 배경/원인. 이슈 링크가 있다면: Closes #123 -->

## 어떻게 검증했나요

<!-- 체크박스로 표시. 해당 없는 항목은 지워도 됨 -->

- [ ] `pnpm --filter api lint && pnpm --filter web lint`
- [ ] `pnpm --filter api build && pnpm --filter web build`
- [ ] `pnpm --filter web e2e` (UI 변경이 있는 경우)
- [ ] 로컬 `docker compose up` 으로 골든 패스 수동 확인
- [ ] (DB 변경) `prisma migrate dev` 로 마이그레이션 생성/적용 확인
- [ ] (운영 영향) `docker compose -f docker-compose.prod.yml` 로 prod 이미지 기동 확인

## 스크린샷 / 영상

<!-- UI 변경이면 모바일 스크린샷 필수. 가능하면 데스크톱도 -->

## 체크리스트

- [ ] [docs/checklist.md](../docs/checklist.md) 의 관련 항목을 점검했어요
- [ ] [docs/디자인_시스템.md](../docs/디자인_시스템.md) 의 모바일 규칙(탭 타겟 44px, 16px 폰트, 100dvh, safe-area)을 따랐어요
- [ ] 시크릿(.env, API 키 등) 이 커밋에 포함되지 않았어요
- [ ] 토스트/에러 메시지를 친근한 존댓말로 작성했어요
- [ ] (필요 시) `docs/KNOWN_ISSUES.md` 에 새로운 이슈/해결을 기록했어요
