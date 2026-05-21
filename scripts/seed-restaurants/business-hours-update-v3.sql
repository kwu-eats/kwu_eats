-- 영업시간/전화 추가 업데이트 (사용자 직접 제공)
-- 적용:
--   cat scripts/seed-restaurants/business-hours-update-v3.sql | docker compose exec -T postgres psql -U postgres pangchelin

BEGIN;

-- ──────────────────────────────────────────────────────────────
-- 로스2000 (정문): 월~토 17:00-24:00, 일 휴무
-- ──────────────────────────────────────────────────────────────
UPDATE "Restaurant" SET "businessHours" = '{
  "mon":{"open":"17:00","close":"00:00"},
  "tue":{"open":"17:00","close":"00:00"},
  "wed":{"open":"17:00","close":"00:00"},
  "thu":{"open":"17:00","close":"00:00"},
  "fri":{"open":"17:00","close":"00:00"},
  "sat":{"open":"17:00","close":"00:00"},
  "sun":{"closed":true}
}'::jsonb,
"updatedAt" = NOW()
WHERE name = '로스2000';

-- ──────────────────────────────────────────────────────────────
-- 스트릿츄러스 광운대점 (정문): 매일 10:30-19:30
-- (휴무일 별도 확인 필요 — 일단 매일 영업으로)
-- ──────────────────────────────────────────────────────────────
UPDATE "Restaurant" SET "businessHours" = '{
  "mon":{"open":"10:30","close":"19:30"},
  "tue":{"open":"10:30","close":"19:30"},
  "wed":{"open":"10:30","close":"19:30"},
  "thu":{"open":"10:30","close":"19:30"},
  "fri":{"open":"10:30","close":"19:30"},
  "sat":{"open":"10:30","close":"19:30"},
  "sun":{"open":"10:30","close":"19:30"}
}'::jsonb,
"updatedAt" = NOW()
WHERE name = '스트릿츄러스 광운대점';

-- ──────────────────────────────────────────────────────────────
-- 진심카츠 (정문): 월~금 10:00-19:00, 토·일 휴무 + 공휴일 휴무
-- ──────────────────────────────────────────────────────────────
UPDATE "Restaurant" SET "businessHours" = '{
  "mon":{"open":"10:00","close":"19:00"},
  "tue":{"open":"10:00","close":"19:00"},
  "wed":{"open":"10:00","close":"19:00"},
  "thu":{"open":"10:00","close":"19:00"},
  "fri":{"open":"10:00","close":"19:00"},
  "sat":{"closed":true},
  "sun":{"closed":true},
  "note":"공휴일 휴무"
}'::jsonb,
"updatedAt" = NOW()
WHERE name = '진심카츠';

-- ──────────────────────────────────────────────────────────────
-- 굿킨 광운대점 (정문): 월~토 17:00-01:00 (자정 넘김), 일 휴무
-- ──────────────────────────────────────────────────────────────
UPDATE "Restaurant" SET "businessHours" = '{
  "mon":{"open":"17:00","close":"01:00"},
  "tue":{"open":"17:00","close":"01:00"},
  "wed":{"open":"17:00","close":"01:00"},
  "thu":{"open":"17:00","close":"01:00"},
  "fri":{"open":"17:00","close":"01:00"},
  "sat":{"open":"17:00","close":"01:00"},
  "sun":{"closed":true}
}'::jsonb,
"updatedAt" = NOW()
WHERE name = '굿킨 광운대점';

-- ──────────────────────────────────────────────────────────────
-- 민들레뜨락2 (정문): 월~토 16:00-02:00 (자정 넘김), 일 휴무(예약 시 영업)
-- 전화번호도 함께 갱신: 010-5773-6613
-- ──────────────────────────────────────────────────────────────
UPDATE "Restaurant" SET "businessHours" = '{
  "mon":{"open":"16:00","close":"02:00"},
  "tue":{"open":"16:00","close":"02:00"},
  "wed":{"open":"16:00","close":"02:00"},
  "thu":{"open":"16:00","close":"02:00"},
  "fri":{"open":"16:00","close":"02:00"},
  "sat":{"open":"16:00","close":"02:00"},
  "sun":{"closed":true},
  "note":"일요일은 예약 시 영업. 학생 시간에 맞춰 영업시간 조정 가능"
}'::jsonb,
phone = '010-5773-6613',
"updatedAt" = NOW()
WHERE name = '민들레뜨락2';

-- 검증
SELECT name, "businessHours"->>'note' AS note, phone
FROM "Restaurant"
WHERE name IN ('로스2000','스트릿츄러스 광운대점','진심카츠','굿킨 광운대점','민들레뜨락2')
ORDER BY name;

COMMIT;
