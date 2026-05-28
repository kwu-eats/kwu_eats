-- 메뉴 외 식당 정보 수정 (2026-05 사용자 제보 반영)
-- ⚠️ py-menus-import.sql 보다 먼저 적용할 것.
--    '마루' → '마루덮밥' 이름 변경이 먼저 되어야 메뉴 import 가 새 이름으로 매칭됨.
BEGIN;

-- 마루 → 마루덮밥 (가게명 변경)
UPDATE "Restaurant" SET name = '마루덮밥', "updatedAt" = NOW() WHERE name = '마루';

-- 전주밥상쌈밥: 사장님 전화번호 추가
UPDATE "Restaurant" SET phone = '010-8859-8631', "updatedAt" = NOW() WHERE name = '전주밥상쌈밥';

COMMIT;
