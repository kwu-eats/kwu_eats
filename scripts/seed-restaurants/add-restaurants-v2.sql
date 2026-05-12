-- ============================================================
-- 신규 식당 추가 + 이름 변경
-- ============================================================

BEGIN;

-- =================== 광운양꼬치 신규 추가 ===================
-- 카카오: 광운로 15, 37.6192, 127.0577, 02-941-9288
-- 영업: 월-금 10:00-21:00, 주말 휴무
-- 카테고리: 중식 (양꼬치)
INSERT INTO "Restaurant" (id, name, zone, latitude, longitude, address, phone, "businessHours", "isPartner", "updatedAt")
VALUES (
  'rst_kwoonyangkkochi',
  '광운양꼬치',
  'FRONT_GATE',
  37.6191578397147,
  127.057727981824,
  '서울 노원구 광운로 15',
  '02-941-9288',
  '{"mon":{"open":"10:00","close":"21:00"},"tue":{"open":"10:00","close":"21:00"},"wed":{"open":"10:00","close":"21:00"},"thu":{"open":"10:00","close":"21:00"},"fri":{"open":"10:00","close":"21:00"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb,
  false,
  NOW()
);

INSERT INTO "RestaurantCategory" ("restaurantId", "categoryId")
SELECT 'rst_kwoonyangkkochi', id FROM "Category" WHERE name = '중식';

-- =================== 김바삭군의 볼카츠마켙 광운대점 → 5일장 햄버거 ===================
-- 카테고리도 일식(카츠) → 양식(버거) 변경
UPDATE "Restaurant"
SET name = '5일장 햄버거',
    "businessHours" = '{"mon":{"open":"11:00","close":"22:00"},"tue":{"open":"11:00","close":"22:00"},"wed":{"open":"11:00","close":"22:00"},"thu":{"open":"11:00","close":"22:00"},"fri":{"open":"11:00","close":"22:00"},"sat":{"closed":true},"sun":{"closed":true}}'::jsonb,
    "updatedAt" = NOW()
WHERE name = '김바삭군의 볼카츠마켙 광운대점';

-- 기존 카테고리(일식) 제거, 양식 추가
DELETE FROM "RestaurantCategory"
WHERE "restaurantId" IN (SELECT id FROM "Restaurant" WHERE name = '5일장 햄버거');

INSERT INTO "RestaurantCategory" ("restaurantId", "categoryId")
SELECT r.id, c.id
FROM "Restaurant" r, "Category" c
WHERE r.name = '5일장 햄버거' AND c.name = '양식';

-- =================== 검증 ===================
SELECT r.id, r.name, r.zone, r.address, r.phone, r."businessHours",
       (SELECT array_agg(c.name) FROM "RestaurantCategory" rc JOIN "Category" c ON c.id = rc."categoryId" WHERE rc."restaurantId" = r.id) AS categories
FROM "Restaurant" r
WHERE r.name IN ('광운양꼬치', '5일장 햄버거');

COMMIT;
