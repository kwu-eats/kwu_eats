-- 카테고리 시드 (멱등)
--
-- 적용 순서:
--   1) 이 파일 먼저 — Category 테이블에 16종 insert
--   2) out.sql 의 `INSERT INTO "RestaurantCategory" ...` 매핑 — Category 가 있어야 매핑 성공
--
-- 적용 명령:
--   cat scripts/seed-restaurants/categories-seed.sql \
--     | docker compose -f docker-compose.prod.yml --env-file .env.production \
--       exec -T postgres psql -U pangchelin pangchelin
--
-- 참고: Category 스키마는 id(cuid)/name(unique)/icon 만 가짐. createdAt/updatedAt 없음.
--       id 를 'cat_*' prefix 로 고정해 재배포 시 충돌·중복 방지.

BEGIN;

INSERT INTO "Category" (id, name, icon) VALUES
  ('cat_korean',  '한식',     '🍚'),
  ('cat_chinese', '중식',     '🥟'),
  ('cat_japanese','일식',     '🍣'),
  ('cat_western', '양식',     '🍝'),
  ('cat_asian',   '아시안',   '🍜'),
  ('cat_cafe',    '카페',     '☕'),
  ('cat_dessert', '디저트',   '🍰'),
  ('cat_chicken', '치킨',     '🍗'),
  ('cat_pizza',   '피자',     '🍕'),
  ('cat_burger',  '버거·샌드위치', '🍔'),
  ('cat_pork',    '고기·구이', '🥩'),
  ('cat_noodle',  '면류',     '🍜'),
  ('cat_bunsik',  '분식',     '🍢'),
  ('cat_pub',     '주점·바',  '🍻'),
  ('cat_fish',    '회·해물',  '🐟')
ON CONFLICT (id) DO NOTHING;

-- 기존에 admin UI 등으로 만든 카테고리 (예: '튀김류') 도 그대로 유지됨.

-- 검증
SELECT name, icon FROM "Category" ORDER BY name;

COMMIT;
