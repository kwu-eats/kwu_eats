-- ============================================================
-- 샐러리아 광운대점 + CAFE FIASCO 신규 추가
-- 샐러리아 POLICY_LAW 제휴 매핑까지
-- ============================================================

BEGIN;

-- =================== 샐러리아 광운대점 ===================
-- 카카오 미등록 → 주소 geocoding 으로 좌표 (37.62239, 127.05932)
-- 영업: 평일 09:30-20:30, 일 휴무
INSERT INTO "Restaurant" (id, name, zone, latitude, longitude, address, phone, "businessHours", "isPartner", "updatedAt")
VALUES (
  'rst_saleria_kwoondae',
  '샐러리아 광운대점',
  'KWANGWOON_STATION',
  37.6223852869365,
  127.059323007018,
  '서울 노원구 광운로 53',
  NULL,
  '{"mon":{"open":"09:30","close":"20:30"},"tue":{"open":"09:30","close":"20:30"},"wed":{"open":"09:30","close":"20:30"},"thu":{"open":"09:30","close":"20:30"},"fri":{"open":"09:30","close":"20:30"},"sat":{"open":"09:30","close":"20:30"},"sun":{"closed":true}}'::jsonb,
  true,  -- POLICY_LAW 제휴
  NOW()
);

INSERT INTO "RestaurantCategory" ("restaurantId", "categoryId")
SELECT 'rst_saleria_kwoondae', id FROM "Category" WHERE name = '양식';

-- 샐러리아 POLICY_LAW 제휴 (메모리에 보류돼있던 매핑)
INSERT INTO "RestaurantPartnership" (id, "restaurantId", college, "instagramUrl", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'rst_saleria_kwoondae',
  'POLICY_LAW'::"College",
  'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=8',
  NOW()
);

-- =================== CAFE FIASCO ===================
-- 카카오 미등록 → 주소 geocoding 으로 좌표 (37.62238, 127.06115)
-- 영업: 월-토 09:30-22:00, 일 휴무
INSERT INTO "Restaurant" (id, name, zone, latitude, longitude, address, phone, "businessHours", "isPartner", "updatedAt")
VALUES (
  'rst_cafe_fiasco',
  'CAFE FIASCO',
  'KWANGWOON_STATION',
  37.6223829150598,
  127.061145482383,
  '서울 노원구 석계로15길 17',
  NULL,
  '{"mon":{"open":"09:30","close":"22:00"},"tue":{"open":"09:30","close":"22:00"},"wed":{"open":"09:30","close":"22:00"},"thu":{"open":"09:30","close":"22:00"},"fri":{"open":"09:30","close":"22:00"},"sat":{"open":"09:30","close":"22:00"},"sun":{"closed":true}}'::jsonb,
  false,
  NOW()
);

INSERT INTO "RestaurantCategory" ("restaurantId", "categoryId")
SELECT 'rst_cafe_fiasco', id FROM "Category" WHERE name = '카페';

-- =================== 검증 ===================
SELECT r.id, r.name, r.zone, r.address, r."isPartner",
       (SELECT array_agg(c.name) FROM "RestaurantCategory" rc JOIN "Category" c ON c.id = rc."categoryId" WHERE rc."restaurantId" = r.id) AS categories,
       (SELECT array_agg(rp.college::text) FROM "RestaurantPartnership" rp WHERE rp."restaurantId" = r.id) AS partnerships
FROM "Restaurant" r
WHERE r.name IN ('샐러리아 광운대점', 'CAFE FIASCO');

COMMIT;
