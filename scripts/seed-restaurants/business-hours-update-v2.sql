-- ============================================================
-- 영업시간 v2 업데이트 — 브레이크타임 + 자정 넘김 지원
-- ============================================================
-- 자정 넘김: close < open 으로 표기 (예: 14:30 ~ 02:30)
-- 브레이크: breakStart / breakEnd 필드 (옵션)
-- ============================================================

BEGIN;

-- =================== 신규 확인된 6개 ===================

-- 인생아구찜: 매일 10:00 ~ 01:00 (자정 넘김)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"01:00"},"tue":{"open":"10:00","close":"01:00"},"wed":{"open":"10:00","close":"01:00"},"thu":{"open":"10:00","close":"01:00"},"fri":{"open":"10:00","close":"01:00"},"sat":{"open":"10:00","close":"01:00"},"sun":{"open":"10:00","close":"01:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '인생아구찜 월계점';

-- 친친: 매일 11:00-22:00, 브레이크 15:00-16:30
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:30"},"tue":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:30"},"wed":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:30"},"thu":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:30"},"fri":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:30"},"sat":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:30"},"sun":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '친친';

-- 커피는기억의끌림: 월-토 08-22, 일 09-22
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"08:00","close":"22:00"},"tue":{"open":"08:00","close":"22:00"},"wed":{"open":"08:00","close":"22:00"},"thu":{"open":"08:00","close":"22:00"},"fri":{"open":"08:00","close":"22:00"},"sat":{"open":"08:00","close":"22:00"},"sun":{"open":"09:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '커피는기억의끌림';

-- 명태이야기: 매일 10-22
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"22:00"},"fri":{"open":"10:00","close":"22:00"},"sat":{"open":"10:00","close":"22:00"},"sun":{"open":"10:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '명태이야기';

-- 미미식당: 월-토 11-22 (브레이크 15-16), 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:00"},"tue":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:00"},"wed":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:00"},"thu":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:00"},"fri":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:00"},"sat":{"open":"11:00","close":"22:00","breakStart":"15:00","breakEnd":"16:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '미미식당 월계점';

-- 놀부부대찌개: 월/화/수/목/토/일 10:30-21, 금 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"21:00"},"tue":{"open":"10:30","close":"21:00"},"wed":{"open":"10:30","close":"21:00"},"thu":{"open":"10:30","close":"21:00"},"fri":{"closed":true},"sat":{"open":"10:30","close":"21:00"},"sun":{"open":"10:30","close":"21:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '놀부부대찌개 광운대역점';

-- =================== 이전에 단순화했던 곳 — 브레이크 정확히 반영 ===================

-- 윤스쿡: 평일 10:30-19:30 (브레이크 15:00-16:30), 주말 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"19:30","breakStart":"15:00","breakEnd":"16:30"},"tue":{"open":"10:30","close":"19:30","breakStart":"15:00","breakEnd":"16:30"},"wed":{"open":"10:30","close":"19:30","breakStart":"15:00","breakEnd":"16:30"},"thu":{"open":"10:30","close":"19:30","breakStart":"15:00","breakEnd":"16:30"},"fri":{"open":"10:30","close":"19:30","breakStart":"15:00","breakEnd":"16:30"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '윤스쿡';

-- 병천청년순대: 월-토 10:00-20:00 (브레이크 14:30-16:30), 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"20:00","breakStart":"14:30","breakEnd":"16:30"},"tue":{"open":"10:00","close":"20:00","breakStart":"14:30","breakEnd":"16:30"},"wed":{"open":"10:00","close":"20:00","breakStart":"14:30","breakEnd":"16:30"},"thu":{"open":"10:00","close":"20:00","breakStart":"14:30","breakEnd":"16:30"},"fri":{"open":"10:00","close":"20:00","breakStart":"14:30","breakEnd":"16:30"},"sat":{"open":"10:00","close":"20:00","breakStart":"14:30","breakEnd":"16:30"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '병천청년순대 광운대점';

-- 스시덤: 화-일 10:30-21:30 (브레이크 15:00-16:00), 월 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"closed":true},"tue":{"open":"10:30","close":"21:30","breakStart":"15:00","breakEnd":"16:00"},"wed":{"open":"10:30","close":"21:30","breakStart":"15:00","breakEnd":"16:00"},"thu":{"open":"10:30","close":"21:30","breakStart":"15:00","breakEnd":"16:00"},"fri":{"open":"10:30","close":"21:30","breakStart":"15:00","breakEnd":"16:00"},"sat":{"open":"10:30","close":"21:30","breakStart":"15:00","breakEnd":"16:00"},"sun":{"open":"10:30","close":"21:30","breakStart":"15:00","breakEnd":"16:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '스시덤';

-- 이찌마김치: 평일 10:00-20:00 (브레이크 16:00-17:30), 토 11-16, 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"20:00","breakStart":"16:00","breakEnd":"17:30"},"tue":{"open":"10:00","close":"20:00","breakStart":"16:00","breakEnd":"17:30"},"wed":{"open":"10:00","close":"20:00","breakStart":"16:00","breakEnd":"17:30"},"thu":{"open":"10:00","close":"20:00","breakStart":"16:00","breakEnd":"17:30"},"fri":{"open":"10:00","close":"20:00","breakStart":"16:00","breakEnd":"17:30"},"sat":{"open":"11:00","close":"16:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '이찌마 김치';

-- 서선생김치찜: 매일 11-22 (브레이크 14:30-17:00)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"22:00","breakStart":"14:30","breakEnd":"17:00"},"tue":{"open":"11:00","close":"22:00","breakStart":"14:30","breakEnd":"17:00"},"wed":{"open":"11:00","close":"22:00","breakStart":"14:30","breakEnd":"17:00"},"thu":{"open":"11:00","close":"22:00","breakStart":"14:30","breakEnd":"17:00"},"fri":{"open":"11:00","close":"22:00","breakStart":"14:30","breakEnd":"17:00"},"sat":{"open":"11:00","close":"22:00","breakStart":"14:30","breakEnd":"17:00"},"sun":{"open":"11:00","close":"22:00","breakStart":"14:30","breakEnd":"17:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '서선생김치찜';

-- =================== 자정 종료 → 00:00 으로 통일 ===================

-- 영축산정육식당: 매일 12:00 ~ 00:00 (자정)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"12:00","close":"00:00"},"tue":{"open":"12:00","close":"00:00"},"wed":{"open":"12:00","close":"00:00"},"thu":{"open":"12:00","close":"00:00"},"fri":{"open":"12:00","close":"00:00"},"sat":{"open":"12:00","close":"00:00"},"sun":{"open":"12:00","close":"00:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '영축산정육식당';

-- 돈장군: 매일 12:00 ~ 00:00
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"12:00","close":"00:00"},"tue":{"open":"12:00","close":"00:00"},"wed":{"open":"12:00","close":"00:00"},"thu":{"open":"12:00","close":"00:00"},"fri":{"open":"12:00","close":"00:00"},"sat":{"open":"12:00","close":"00:00"},"sun":{"open":"12:00","close":"00:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '돈장군 광운대본점';

-- 화로상회: 14:00 ~ 00:00, 화 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"14:00","close":"00:00"},"tue":{"closed":true},"wed":{"open":"14:00","close":"00:00"},"thu":{"open":"14:00","close":"00:00"},"fri":{"open":"14:00","close":"00:00"},"sat":{"open":"14:00","close":"00:00"},"sun":{"open":"14:00","close":"00:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '화로상회 광운대점';

-- 카페베르데: 학기중 매일 08:30 ~ 00:00
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"08:30","close":"00:00"},"tue":{"open":"08:30","close":"00:00"},"wed":{"open":"08:30","close":"00:00"},"thu":{"open":"08:30","close":"00:00"},"fri":{"open":"08:30","close":"00:00"},"sat":{"open":"08:30","close":"00:00"},"sun":{"open":"08:30","close":"00:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '카페베르데';

-- =================== 자정 넘김 → 0X:XX 표기 ===================

-- 썬더치킨: 매일 14:30 ~ 02:30
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"14:30","close":"02:30"},"tue":{"open":"14:30","close":"02:30"},"wed":{"open":"14:30","close":"02:30"},"thu":{"open":"14:30","close":"02:30"},"fri":{"open":"14:30","close":"02:30"},"sat":{"open":"14:30","close":"02:30"},"sun":{"open":"14:30","close":"02:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '썬더치킨 광운대점';

-- =================== 검증 ===================

SELECT name, "businessHours" FROM "Restaurant" WHERE name IN (
  '인생아구찜 월계점', '친친', '미미식당 월계점', '놀부부대찌개 광운대역점',
  '썬더치킨 광운대점', '영축산정육식당', '윤스쿡'
) ORDER BY name;

COMMIT;
