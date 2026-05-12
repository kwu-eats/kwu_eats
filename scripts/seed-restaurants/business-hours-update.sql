-- ============================================================
-- 식당 영업시간 업데이트 (사용자 직접 조사, 학기중 기준)
-- 2026-05-11
-- ============================================================
-- 학기중 기준으로 적용. 방학과 다른 식당은 학기중 시간만 반영.
-- 브레이크타임은 현재 schema 미지원 → open~close 로 단순화.
-- 자정 넘어가는 시간은 23:59 로 마감 처리.
-- ============================================================

BEGIN;

-- =================== 매일 동일 시간 ===================

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"22:00"},"fri":{"open":"10:00","close":"22:00"},"sat":{"open":"10:00","close":"22:00"},"sun":{"open":"10:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '가마솥뼈다귀감자탕';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:30","close":"22:00"},"tue":{"open":"11:30","close":"22:00"},"wed":{"open":"11:30","close":"22:00"},"thu":{"open":"11:30","close":"22:00"},"fri":{"open":"11:30","close":"22:00"},"sat":{"open":"11:30","close":"22:00"},"sun":{"open":"11:30","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '마산아구찜';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"08:00","close":"20:00"},"tue":{"open":"08:00","close":"20:00"},"wed":{"open":"08:00","close":"20:00"},"thu":{"open":"08:00","close":"20:00"},"fri":{"open":"08:00","close":"20:00"},"sat":{"open":"08:00","close":"20:00"},"sun":{"open":"08:00","close":"20:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '엄마손김밥&분식';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"00:00","close":"23:59"},"tue":{"open":"00:00","close":"23:59"},"wed":{"open":"00:00","close":"23:59"},"thu":{"open":"00:00","close":"23:59"},"fri":{"open":"00:00","close":"23:59"},"sat":{"open":"00:00","close":"23:59"},"sun":{"open":"00:00","close":"23:59"}}'::jsonb, "updatedAt" = NOW() WHERE name = '큰맘할매순대국 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"07:00","close":"23:00"},"tue":{"open":"07:00","close":"23:00"},"wed":{"open":"07:00","close":"23:00"},"thu":{"open":"07:00","close":"23:00"},"fri":{"open":"07:00","close":"23:00"},"sat":{"open":"07:00","close":"23:00"},"sun":{"open":"07:00","close":"23:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '한방전주콩나물국밥 광운대역점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"21:30"},"tue":{"open":"11:00","close":"21:30"},"wed":{"open":"11:00","close":"21:30"},"thu":{"open":"11:00","close":"21:30"},"fri":{"open":"11:00","close":"21:30"},"sat":{"open":"11:00","close":"21:30"},"sun":{"open":"11:00","close":"21:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '마포연탄불고기';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"12:00","close":"23:59"},"tue":{"open":"12:00","close":"23:59"},"wed":{"open":"12:00","close":"23:59"},"thu":{"open":"12:00","close":"23:59"},"fri":{"open":"12:00","close":"23:59"},"sat":{"open":"12:00","close":"23:59"},"sun":{"open":"12:00","close":"23:59"}}'::jsonb, "updatedAt" = NOW() WHERE name = '영축산정육식당';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"12:30","close":"23:30"},"tue":{"open":"12:30","close":"23:30"},"wed":{"open":"12:30","close":"23:30"},"thu":{"open":"12:30","close":"23:30"},"fri":{"open":"12:30","close":"23:30"},"sat":{"open":"12:30","close":"23:30"},"sun":{"open":"12:30","close":"23:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '진미통닭';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"22:00"},"fri":{"open":"10:00","close":"22:00"},"sat":{"open":"10:00","close":"22:00"},"sun":{"open":"10:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '마루';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"21:00"},"tue":{"open":"10:30","close":"21:00"},"wed":{"open":"10:30","close":"21:00"},"thu":{"open":"10:30","close":"21:00"},"fri":{"open":"10:30","close":"21:00"},"sat":{"open":"10:30","close":"21:00"},"sun":{"open":"10:30","close":"21:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '한끼철판 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"21:30"},"tue":{"open":"10:00","close":"21:30"},"wed":{"open":"10:00","close":"21:30"},"thu":{"open":"10:00","close":"21:30"},"fri":{"open":"10:00","close":"21:30"},"sat":{"open":"10:00","close":"21:30"},"sun":{"open":"10:00","close":"21:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '신연마라탕';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"20:30"},"tue":{"open":"10:30","close":"20:30"},"wed":{"open":"10:30","close":"20:30"},"thu":{"open":"10:30","close":"20:30"},"fri":{"open":"10:30","close":"20:30"},"sat":{"open":"10:30","close":"20:30"},"sun":{"open":"10:30","close":"20:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '일심텐동 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"21:30"},"tue":{"open":"10:00","close":"21:30"},"wed":{"open":"10:00","close":"21:30"},"thu":{"open":"10:00","close":"21:30"},"fri":{"open":"10:00","close":"21:30"},"sat":{"open":"10:00","close":"21:30"},"sun":{"open":"10:00","close":"21:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '프랭크버거 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"open":"11:00","close":"22:00"},"thu":{"open":"11:00","close":"22:00"},"fri":{"open":"11:00","close":"22:00"},"sat":{"open":"11:00","close":"22:00"},"sun":{"open":"11:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '카츠백 월계점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"08:30","close":"23:59"},"tue":{"open":"08:30","close":"23:59"},"wed":{"open":"08:30","close":"23:59"},"thu":{"open":"08:30","close":"23:59"},"fri":{"open":"08:30","close":"23:59"},"sat":{"open":"08:30","close":"23:59"},"sun":{"open":"08:30","close":"23:59"}}'::jsonb, "updatedAt" = NOW() WHERE name = '카페베르데';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"20:00"},"tue":{"open":"10:30","close":"20:00"},"wed":{"open":"10:30","close":"20:00"},"thu":{"open":"10:30","close":"20:00"},"fri":{"open":"10:30","close":"20:00"},"sat":{"open":"10:30","close":"20:00"},"sun":{"open":"10:30","close":"20:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '미식성';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"20:30"},"tue":{"open":"11:00","close":"20:30"},"wed":{"open":"11:00","close":"20:30"},"thu":{"open":"11:00","close":"20:30"},"fri":{"open":"11:00","close":"20:30"},"sat":{"open":"11:00","close":"20:30"},"sun":{"open":"11:00","close":"20:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '국수천왕 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"20:30"},"tue":{"open":"10:30","close":"20:30"},"wed":{"open":"10:30","close":"20:30"},"thu":{"open":"10:30","close":"20:30"},"fri":{"open":"10:30","close":"20:30"},"sat":{"open":"10:30","close":"20:30"},"sun":{"open":"10:30","close":"20:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '포 레오';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"00:00","close":"23:59"},"tue":{"open":"00:00","close":"23:59"},"wed":{"open":"00:00","close":"23:59"},"thu":{"open":"00:00","close":"23:59"},"fri":{"open":"00:00","close":"23:59"},"sat":{"open":"00:00","close":"23:59"},"sun":{"open":"00:00","close":"23:59"}}'::jsonb, "updatedAt" = NOW() WHERE name = '데이롱카페 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"08:00","close":"17:00"},"tue":{"open":"08:00","close":"17:00"},"wed":{"open":"08:00","close":"17:00"},"thu":{"open":"08:00","close":"17:00"},"fri":{"open":"08:00","close":"17:00"},"sat":{"open":"08:00","close":"17:00"},"sun":{"open":"08:00","close":"17:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = 'CORD Jr.';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"06:00","close":"22:00"},"tue":{"open":"06:00","close":"22:00"},"wed":{"open":"06:00","close":"22:00"},"thu":{"open":"06:00","close":"22:00"},"fri":{"open":"06:00","close":"22:00"},"sat":{"open":"06:00","close":"22:00"},"sun":{"open":"06:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '일심해장국 월계점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"09:30","close":"22:00"},"tue":{"open":"09:30","close":"22:00"},"wed":{"open":"09:30","close":"22:00"},"thu":{"open":"09:30","close":"22:00"},"fri":{"open":"09:30","close":"22:00"},"sat":{"open":"09:30","close":"22:00"},"sun":{"open":"09:30","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '용기사 식당';

-- 썬더치킨: 14:30-02:30 매일 → schema 한계로 자정 부분 손실
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"14:30","close":"23:59"},"tue":{"open":"14:30","close":"23:59"},"wed":{"open":"14:30","close":"23:59"},"thu":{"open":"14:30","close":"23:59"},"fri":{"open":"14:30","close":"23:59"},"sat":{"open":"14:30","close":"23:59"},"sun":{"open":"14:30","close":"23:59"}}'::jsonb, "updatedAt" = NOW() WHERE name = '썬더치킨 광운대점';

-- =================== 특정 요일 휴무 ===================

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"20:00"},"tue":{"closed":true},"wed":{"open":"10:00","close":"20:00"},"thu":{"open":"10:00","close":"20:00"},"fri":{"open":"10:00","close":"20:00"},"sat":{"open":"10:00","close":"20:00"},"sun":{"open":"10:00","close":"20:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '사계절김밥';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"21:30"},"tue":{"open":"10:00","close":"21:30"},"wed":{"open":"10:00","close":"21:30"},"thu":{"closed":true},"fri":{"open":"10:00","close":"21:30"},"sat":{"open":"10:00","close":"21:30"},"sun":{"open":"10:00","close":"21:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '한우가마솥소머리곰탕';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"closed":true},"thu":{"open":"11:00","close":"22:00"},"fri":{"open":"11:00","close":"22:00"},"sat":{"open":"11:00","close":"22:00"},"sun":{"open":"11:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '더원';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"09:00","close":"21:00"},"tue":{"open":"09:00","close":"21:00"},"wed":{"open":"09:00","close":"21:00"},"thu":{"open":"09:00","close":"21:00"},"fri":{"open":"09:00","close":"21:00"},"sat":{"open":"09:00","close":"21:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '전주밥상쌈밥';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"21:00"},"tue":{"open":"10:00","close":"21:00"},"wed":{"open":"10:00","close":"21:00"},"thu":{"open":"10:00","close":"21:00"},"fri":{"open":"10:00","close":"21:00"},"sat":{"open":"10:00","close":"21:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '그옛날1947왕만두';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"12:00","close":"22:30"},"tue":{"open":"12:00","close":"22:30"},"wed":{"open":"12:00","close":"22:30"},"thu":{"open":"12:00","close":"22:30"},"fri":{"open":"12:00","close":"22:30"},"sat":{"open":"12:00","close":"22:30"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '큰집닭강정 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"21:00"},"tue":{"open":"10:00","close":"21:00"},"wed":{"open":"10:00","close":"21:00"},"thu":{"open":"10:00","close":"21:00"},"fri":{"open":"10:00","close":"21:00"},"sat":{"open":"10:00","close":"21:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '더진국 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"14:00","close":"23:59"},"tue":{"closed":true},"wed":{"open":"14:00","close":"23:59"},"thu":{"open":"14:00","close":"23:59"},"fri":{"open":"14:00","close":"23:59"},"sat":{"open":"14:00","close":"23:59"},"sun":{"open":"14:00","close":"23:59"}}'::jsonb, "updatedAt" = NOW() WHERE name = '화로상회 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"20:00"},"tue":{"open":"11:00","close":"20:00"},"wed":{"open":"11:00","close":"20:00"},"thu":{"open":"11:00","close":"20:00"},"fri":{"open":"11:00","close":"20:00"},"sat":{"closed":true},"sun":{"open":"11:00","close":"20:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '부리또잇';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"21:30"},"tue":{"open":"10:30","close":"21:30"},"wed":{"open":"10:30","close":"21:30"},"thu":{"open":"10:30","close":"21:30"},"fri":{"open":"10:30","close":"21:30"},"sat":{"open":"10:30","close":"21:30"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '푸른스시';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"18:00"},"tue":{"open":"11:00","close":"18:00"},"wed":{"open":"11:00","close":"18:00"},"thu":{"open":"11:00","close":"18:00"},"fri":{"open":"11:00","close":"18:00"},"sat":{"open":"11:00","close":"18:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '지지고 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"07:30","close":"19:30"},"tue":{"open":"07:30","close":"19:30"},"wed":{"open":"07:30","close":"19:30"},"thu":{"open":"07:30","close":"19:30"},"fri":{"open":"07:30","close":"19:30"},"sat":{"open":"07:30","close":"19:30"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '광운커피';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"20:00"},"tue":{"open":"11:00","close":"20:00"},"wed":{"open":"11:00","close":"20:00"},"thu":{"open":"11:00","close":"20:00"},"fri":{"open":"11:00","close":"20:00"},"sat":{"open":"11:00","close":"20:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '중화호반닭갈비 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"23:00"},"tue":{"open":"10:00","close":"23:00"},"wed":{"open":"10:00","close":"23:00"},"thu":{"open":"10:00","close":"23:00"},"fri":{"open":"10:00","close":"23:00"},"sat":{"open":"10:00","close":"23:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '경대컵밥 광운대점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"20:00"},"tue":{"open":"11:00","close":"20:00"},"wed":{"open":"11:00","close":"20:00"},"thu":{"open":"11:00","close":"20:00"},"fri":{"open":"11:00","close":"20:00"},"sat":{"open":"11:00","close":"20:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '천년초우리밀칼국수';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"12:30","close":"21:30"},"tue":{"open":"12:30","close":"21:30"},"wed":{"open":"12:30","close":"21:30"},"thu":{"open":"12:30","close":"21:30"},"fri":{"open":"12:30","close":"21:30"},"sat":{"open":"12:30","close":"21:30"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '목포홍탁';

-- 한라산감자탕: 매일 10:30-20, 수 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"20:00"},"tue":{"open":"10:30","close":"20:00"},"wed":{"closed":true},"thu":{"open":"10:30","close":"20:00"},"fri":{"open":"10:30","close":"20:00"},"sat":{"open":"10:30","close":"20:00"},"sun":{"open":"10:30","close":"20:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '한라산감자탕';

-- 스시덤: 화-일 10:30-21:30 (브레이크 15-16 단순화), 월 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"closed":true},"tue":{"open":"10:30","close":"21:30"},"wed":{"open":"10:30","close":"21:30"},"thu":{"open":"10:30","close":"21:30"},"fri":{"open":"10:30","close":"21:30"},"sat":{"open":"10:30","close":"21:30"},"sun":{"open":"10:30","close":"21:30"}}'::jsonb, "updatedAt" = NOW() WHERE name = '스시덤';

-- 병천청년순대: 월-토 10-20 (브레이크 14:30-16:30 단순화), 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"20:00"},"tue":{"open":"10:00","close":"20:00"},"wed":{"open":"10:00","close":"20:00"},"thu":{"open":"10:00","close":"20:00"},"fri":{"open":"10:00","close":"20:00"},"sat":{"open":"10:00","close":"20:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '병천청년순대 광운대점';

-- 서선생김치찜: 매일 11-22 (브레이크 14:30-17 단순화)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"open":"11:00","close":"22:00"},"thu":{"open":"11:00","close":"22:00"},"fri":{"open":"11:00","close":"22:00"},"sat":{"open":"11:00","close":"22:00"},"sun":{"open":"11:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '서선생김치찜';

-- =================== 주말 휴무 (월-금) ===================

-- 윤스쿡: 평일 10:30-19:30 (브레이크 15-16:30 단순화), 주말 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"19:30"},"tue":{"open":"10:30","close":"19:30"},"wed":{"open":"10:30","close":"19:30"},"thu":{"open":"10:30","close":"19:30"},"fri":{"open":"10:30","close":"19:30"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '윤스쿡';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"20:30"},"tue":{"open":"10:30","close":"20:30"},"wed":{"open":"10:30","close":"20:30"},"thu":{"open":"10:30","close":"20:30"},"fri":{"open":"10:30","close":"20:30"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '이층집';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"19:00"},"tue":{"open":"10:00","close":"19:00"},"wed":{"open":"10:00","close":"19:00"},"thu":{"open":"10:00","close":"19:00"},"fri":{"open":"10:00","close":"19:00"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '한그릇';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"20:00"},"tue":{"open":"10:30","close":"20:00"},"wed":{"open":"10:30","close":"20:00"},"thu":{"open":"10:30","close":"20:00"},"fri":{"open":"10:30","close":"20:00"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '밥은화 광운대본점';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"20:00"},"tue":{"open":"10:30","close":"20:00"},"wed":{"open":"10:30","close":"20:00"},"thu":{"open":"10:30","close":"20:00"},"fri":{"open":"10:30","close":"20:00"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '하이레';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"17:00"},"tue":{"open":"10:30","close":"17:00"},"wed":{"open":"10:30","close":"17:00"},"thu":{"open":"10:30","close":"17:00"},"fri":{"open":"10:30","close":"17:00"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '우우즈베이커리';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"20:00"},"tue":{"open":"11:00","close":"20:00"},"wed":{"open":"11:00","close":"20:00"},"thu":{"open":"11:00","close":"20:00"},"fri":{"open":"11:00","close":"20:00"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '아 그집';

UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:30","close":"20:30"},"tue":{"open":"10:30","close":"20:30"},"wed":{"open":"10:30","close":"20:30"},"thu":{"open":"10:30","close":"20:30"},"fri":{"open":"10:30","close":"20:30"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '민들레국시';

-- =================== 요일별 다른 시간 ===================

-- 집밥: 평일 7-19, 토 7-14, 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"07:00","close":"19:00"},"tue":{"open":"07:00","close":"19:00"},"wed":{"open":"07:00","close":"19:00"},"thu":{"open":"07:00","close":"19:00"},"fri":{"open":"07:00","close":"19:00"},"sat":{"open":"07:00","close":"14:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '집밥';

-- 맛불: 평일 10-21:30, 주말 11-21
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"21:30"},"tue":{"open":"10:00","close":"21:30"},"wed":{"open":"10:00","close":"21:30"},"thu":{"open":"10:00","close":"21:30"},"fri":{"open":"10:00","close":"21:30"},"sat":{"open":"11:00","close":"21:00"},"sun":{"open":"11:00","close":"21:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '맛불';

-- 스마일돈까스: 평일 11-20:30, 토 11-19:30, 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"20:30"},"tue":{"open":"11:00","close":"20:30"},"wed":{"open":"11:00","close":"20:30"},"thu":{"open":"11:00","close":"20:30"},"fri":{"open":"11:00","close":"20:30"},"sat":{"open":"11:00","close":"19:30"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '스마일돈까스';

-- 고씨네: 평일 09-21, 주말 11-21
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"09:00","close":"21:00"},"tue":{"open":"09:00","close":"21:00"},"wed":{"open":"09:00","close":"21:00"},"thu":{"open":"09:00","close":"21:00"},"fri":{"open":"09:00","close":"21:00"},"sat":{"open":"11:00","close":"21:00"},"sun":{"open":"11:00","close":"21:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '고씨네 광운대점';

-- 장수국수: 월-목 08:30-21:30, 금 09:30-20, 토 11-15, 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"08:30","close":"21:30"},"tue":{"open":"08:30","close":"21:30"},"wed":{"open":"08:30","close":"21:30"},"thu":{"open":"08:30","close":"21:30"},"fri":{"open":"09:30","close":"20:00"},"sat":{"open":"11:00","close":"15:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '장수국수 광운대점';

-- 빠말: 평일 09:30-19, 토 11:30-17, 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"09:30","close":"19:00"},"tue":{"open":"09:30","close":"19:00"},"wed":{"open":"09:30","close":"19:00"},"thu":{"open":"09:30","close":"19:00"},"fri":{"open":"09:30","close":"19:00"},"sat":{"open":"11:30","close":"17:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '빠말';

-- 꽃제비칼국수: 평일 10-21, 토 10-20, 일 12-20
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"21:00"},"tue":{"open":"10:00","close":"21:00"},"wed":{"open":"10:00","close":"21:00"},"thu":{"open":"10:00","close":"21:00"},"fri":{"open":"10:00","close":"21:00"},"sat":{"open":"10:00","close":"20:00"},"sun":{"open":"12:00","close":"20:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '꽃제비칼국수';

-- 이찌마김치: 평일 10-20 (브레이크 16-17:30 단순화), 토 11-16, 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"20:00"},"tue":{"open":"10:00","close":"20:00"},"wed":{"open":"10:00","close":"20:00"},"thu":{"open":"10:00","close":"20:00"},"fri":{"open":"10:00","close":"20:00"},"sat":{"open":"11:00","close":"16:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '이찌마 김치';

-- 후문식당: 학기중 평일 10-19, 토 11-14, 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"10:00","close":"19:00"},"tue":{"open":"10:00","close":"19:00"},"wed":{"open":"10:00","close":"19:00"},"thu":{"open":"10:00","close":"19:00"},"fri":{"open":"10:00","close":"19:00"},"sat":{"open":"11:00","close":"14:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '후문식당';

-- 소담밥상: 학기중 월-토 09-20:30, 일 휴무
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"09:00","close":"20:30"},"tue":{"open":"09:00","close":"20:30"},"wed":{"open":"09:00","close":"20:30"},"thu":{"open":"09:00","close":"20:30"},"fri":{"open":"09:00","close":"20:30"},"sat":{"open":"09:00","close":"20:30"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '소담밥상';

-- =================== 부분 정보 ===================

-- 본도시락: 토일 14시까지 (평일은 미확인 → 기존 9-22 유지)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"09:00","close":"22:00"},"tue":{"open":"09:00","close":"22:00"},"wed":{"open":"09:00","close":"22:00"},"thu":{"open":"09:00","close":"22:00"},"fri":{"open":"09:00","close":"22:00"},"sat":{"open":"09:00","close":"14:00"},"sun":{"open":"09:00","close":"14:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '본도시락 광운대역점';

-- 정담소반: 일 휴무 (평일은 미확인 → 기존 9-22 유지)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"09:00","close":"22:00"},"tue":{"open":"09:00","close":"22:00"},"wed":{"open":"09:00","close":"22:00"},"thu":{"open":"09:00","close":"22:00"},"fri":{"open":"09:00","close":"22:00"},"sat":{"open":"09:00","close":"22:00"},"sun":{"closed":true}}'::jsonb, "updatedAt" = NOW() WHERE name = '정담소반';

-- 서초우동: close 20:00 (open 미확인 → 11:00 추정)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"20:00"},"tue":{"open":"11:00","close":"20:00"},"wed":{"open":"11:00","close":"20:00"},"thu":{"open":"11:00","close":"20:00"},"fri":{"open":"11:00","close":"20:00"},"sat":{"open":"11:00","close":"20:00"},"sun":{"open":"11:00","close":"20:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '서초우동 광운대역점';

-- 명동찌개마을: 매일 11-22 (둘째/넷째 토 휴무는 schema 미지원 → 일단 매일)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"open":"11:00","close":"22:00"},"thu":{"open":"11:00","close":"22:00"},"fri":{"open":"11:00","close":"22:00"},"sat":{"open":"11:00","close":"22:00"},"sun":{"open":"11:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '명동찌개마을 광운대역점';

-- 왕토종순대국: 매일 11-22 (일요일 컨디션에 따라 일찍 닫음 → 일단 매일 동일)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"open":"11:00","close":"22:00"},"thu":{"open":"11:00","close":"22:00"},"fri":{"open":"11:00","close":"22:00"},"sat":{"open":"11:00","close":"22:00"},"sun":{"open":"11:00","close":"22:00"}}'::jsonb, "updatedAt" = NOW() WHERE name = '왕토종순대국';

-- 돈장군: 매일 12-24 (자정은 23:59 처리)
UPDATE "Restaurant" SET "businessHours" = '{"mon":{"open":"12:00","close":"23:59"},"tue":{"open":"12:00","close":"23:59"},"wed":{"open":"12:00","close":"23:59"},"thu":{"open":"12:00","close":"23:59"},"fri":{"open":"12:00","close":"23:59"},"sat":{"open":"12:00","close":"23:59"},"sun":{"open":"12:00","close":"23:59"}}'::jsonb, "updatedAt" = NOW() WHERE name = '돈장군 광운대본점';

-- =================== 검증 ===================

SELECT name, "businessHours" FROM "Restaurant" WHERE name IN (
  '가마솥뼈다귀감자탕', '본도시락 광운대역점', '집밥', '맛불', '카페베르데', '용기사 식당'
) ORDER BY name;

COMMIT;
