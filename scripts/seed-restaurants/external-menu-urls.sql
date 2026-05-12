-- 체인점 공식 메뉴 URL 일괄 적용 (재실행 가능 / 멱등)
BEGIN;

UPDATE "Restaurant"
SET "externalMenuUrl" = 'https://www.bonif.co.kr/brand/menu?brdCd=BF104',
    "updatedAt" = NOW()
WHERE name = '본도시락 광운대역점';

UPDATE "Restaurant"
SET "externalMenuUrl" = 'https://frankburger.co.kr/html/menu_1.html',
    "updatedAt" = NOW()
WHERE name = '프랭크버거 광운대점';

UPDATE "Restaurant"
SET "externalMenuUrl" = 'https://www.mythunder.co.kr/page.php?p_id=menu1',
    "updatedAt" = NOW()
WHERE name = '썬더치킨 광운대점';

UPDATE "Restaurant"
SET "externalMenuUrl" = 'https://www.mdcco.co.kr/contents/menu/foods.php?type=1',
    "updatedAt" = NOW()
WHERE name = '맛닭꼬 광운대점';

UPDATE "Restaurant"
SET "externalMenuUrl" = 'https://www.waffleuniv.com/child/sub/menu/waffle.php',
    "updatedAt" = NOW()
WHERE name = '와플대학 광운대캠퍼스';

UPDATE "Restaurant"
SET "externalMenuUrl" = 'https://xn--vl2b25awylm0e.com/bbs/content.php?co_id=menu',
    "updatedAt" = NOW()
WHERE name = '샐러리아 광운대점';

-- 검증
SELECT name, "externalMenuUrl" FROM "Restaurant"
WHERE "externalMenuUrl" IS NOT NULL
ORDER BY name;

COMMIT;
