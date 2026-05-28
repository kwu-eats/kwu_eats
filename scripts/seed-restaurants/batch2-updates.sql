-- batch-2 (2026-05-28) 사용자 제보 반영
-- 1) 카테고리 교체 8곳  2) 병천 삼색순대 가격  3) py 파일 외 식당 대표메뉴(isSignature)
-- ※ backgate(py) 13곳 대표메뉴는 import-py-menus.py 의 SIGNATURE_MENUS 로 처리됨.
BEGIN;

-- ───────── 1) 카테고리 교체 (단일 카테고리로 재설정) ─────────
-- helper: 식당의 카테고리를 name 기준 단일로 교체
DO $$
DECLARE
  pairs text[][] := ARRAY[
    ['미식성','중식'],
    ['하이레','일식'],
    ['광운양꼬치','한식'],
    ['5일장 햄버거','한식'],
    ['경대컵밥 광운대점','한식'],
    ['치킨플러스 월계점','한식'],
    ['청계 빨간집','주점'],
    ['튀맥','주점'],
    ['쉐프밥버거 광운대점','한식'],
    ['빠말','카페'],
    ['CORD Jr.','카페']
  ];
  i int;
  rid text; cid text;
BEGIN
  FOR i IN 1 .. array_length(pairs,1) LOOP
    SELECT id INTO rid FROM "Restaurant" WHERE name = pairs[i][1];
    SELECT id INTO cid FROM "Category"   WHERE name = pairs[i][2];
    IF rid IS NULL THEN RAISE NOTICE '식당 없음: %', pairs[i][1]; CONTINUE; END IF;
    IF cid IS NULL THEN RAISE NOTICE '카테고리 없음: %', pairs[i][2]; CONTINUE; END IF;
    DELETE FROM "RestaurantCategory" WHERE "restaurantId" = rid;
    INSERT INTO "RestaurantCategory" ("restaurantId","categoryId") VALUES (rid, cid);
  END LOOP;
END $$;

-- ───────── 2) 병천청년순대: 삼색순대 가격 0 → 13,000 ─────────
UPDATE "Menu" m SET price = 13000, "updatedAt" = NOW()
FROM "Restaurant" r
WHERE m."restaurantId" = r.id AND r.name = '병천청년순대 광운대점'
  AND m.name = '삼색순대 (병천순대 + 김치순대 + 백순대)';

-- ───────── 3) py 외 식당 대표메뉴 마킹 ─────────
-- 멱등: 대상 식당 기존 signature 해제 후 1개만 재지정
UPDATE "Menu" SET "isSignature" = false
WHERE "isSignature" AND "restaurantId" IN (
  SELECT id FROM "Restaurant" WHERE name IN (
    '5일장 햄버거','카페베르데','이층집','병천청년순대 광운대점','경대컵밥 광운대점',
    '소담밥상','미식성','스시덤','이찌마 김치','목포홍탁','서선생김치찜',
    '국수천왕 광운대점','한그릇','밥은화 광운대본점','하이레','우우즈베이커리',
    '아 그집','천년초우리밀칼국수','일심해장국 월계점','광운양꼬치','용기사 식당'
  )
);

UPDATE "Menu" m SET "isSignature" = true, "updatedAt" = NOW()
FROM "Restaurant" r, (VALUES
  ('5일장 햄버거','빅 오일장햄버거(단품)'),
  ('카페베르데','아메리카노'),
  ('이층집','의정부 부대찌개(소)'),
  ('병천청년순대 광운대점','순대국밥'),
  ('경대컵밥 광운대점','경대컵밥'),
  ('소담밥상','쫄면순두부(쫄순)'),
  ('미식성','짜장면'),
  ('스시덤','덤으로 연어 사시미 12pcs'),
  ('이찌마 김치','보쌈 정식'),
  ('목포홍탁','홍어찜'),
  ('서선생김치찜','김치찌개(1인)'),
  ('국수천왕 광운대점','잔치국수'),
  ('한그릇','잔치국수'),
  ('밥은화 광운대본점','돼지숙주'),
  ('하이레','로스가츠 (등심)'),
  ('우우즈베이커리','소금빵'),
  ('아 그집','김모치 (김치· 베이컨· 참치· 갈비· 알)'),
  ('천년초우리밀칼국수','천년초 바지락칼국수'),
  ('일심해장국 월계점','도가니탕'),
  ('광운양꼬치','수육국밥'),
  ('용기사 식당','동태탕')
) AS s(rname, mname)
WHERE m."restaurantId" = r.id AND r.name = s.rname AND m.name = s.mname;

COMMIT;

-- 검증: 위 20곳 중 대표메뉴 0개인 식당 (이름 불일치 의심)
SELECT r.name FROM "Restaurant" r
WHERE r.name IN (
  '5일장 햄버거','카페베르데','이층집','병천청년순대 광운대점','경대컵밥 광운대점',
  '소담밥상','미식성','스시덤','이찌마 김치','목포홍탁','서선생김치찜',
  '국수천왕 광운대점','한그릇','밥은화 광운대본점','하이레','우우즈베이커리',
  '아 그집','천년초우리밀칼국수','일심해장국 월계점','광운양꼬치','용기사 식당'
) AND NOT EXISTS (
  SELECT 1 FROM "Menu" m WHERE m."restaurantId" = r.id AND m."isSignature"
);
