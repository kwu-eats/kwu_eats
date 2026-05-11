-- ============================================================
-- 단과대학별 제휴 매핑 일괄 등록 (2026-05-11)
-- ============================================================
-- 사용자 제공 제휴 리스트 → (식당명, 단과대학, 인스타URL) 쌍으로 매핑.
-- 식당명은 DB 의 정식명 기준 (별칭은 사전에 사용자 확인 거쳐 변환).
-- ON CONFLICT 로 멱등성 보장 (재실행 안전).
-- ============================================================

BEGIN;

WITH partnership_data(restaurant_name, college, url) AS (
  VALUES
    -- 인공지능융합대학
    ('중화호반닭갈비 광운대점',   'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-TqwilFqb/'),
    ('민들레뜨락2',              'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-TjKDlC8O/'),
    ('갤러리eat',                'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-TWwbFN71/'),
    ('별난주점 광운대점',        'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-S7zwlDlK/'),
    ('푸른스시',                'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-SqnlFJgM/'),
    ('로스2000',                'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-ShUxlIE9/'),
    ('진심카츠',                'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-SXGvFJMs/'),
    ('꽃님맥주',                'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-RbaSFNVB/'),
    ('포 레오',                 'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-RUjblNfG/'),
    ('수해복마라탕 광운대점',     'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-RKNBFNBJ/'),
    ('와플대학 광운대캠퍼스',     'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-RBQDlHhY/'),
    ('큰집닭강정 광운대점',      'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-Q3UblLlI/'),
    ('썬더치킨 광운대점',        'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-QpJ7FO1k/'),
    ('카페베르데',              'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-QUP8lKmi/'),
    ('여우곱창',                'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-QNR4lL1t/'),
    ('이층집',                  'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-QA0ZlPCq/'),
    ('부리또잇',                'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-P5gQlDDO/'),
    ('장수국수 광운대점',        'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-PycFFD0-/'),
    ('맛불',                    'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-Pp-hlL0p/'),
    ('디델리 광운대점',          'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-PiyklG8U/'),
    ('더진국 광운대점',          'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-PYBNILWB/'),
    ('미식성',                  'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-O7zQIONm/'),
    ('고씨네 광운대점',          'AI_CONVERGENCE', 'https://www.instagram.com/p/DU-ObZZFHc5/'),

    -- 경영대학
    ('맛불',                    'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=2'),
    ('경대컵밥 광운대점',        'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=3'),
    ('부리또잇',                'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=4'),
    ('영축산정육식당',          'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=5'),
    ('중화호반닭갈비 광운대점',   'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=6'),
    ('수해복마라탕 광운대점',     'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=7'),
    ('푸른스시',                'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=8'),
    ('치킨플러스 월계점',        'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=9'),
    ('고씨네 광운대점',          'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=10'),
    ('이층집',                  'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=11'),
    ('미식성',                  'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=12'),
    ('장수국수 광운대점',        'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=13'),
    ('더진국 광운대점',          'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=14'),
    ('포 레오',                 'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=15'),
    ('여우곱창',                'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=16'),
    ('민들레뜨락2',              'BUSINESS', 'https://www.instagram.com/p/DVaatr2kZpl/?img_index=17'),

    -- 정책법학대학
    ('경대컵밥 광운대점',        'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=3'),
    ('고씨네 광운대점',          'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=4'),
    ('디델리 광운대점',          'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=5'),
    ('미식성',                  'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=6'),
    ('수해복마라탕 광운대점',     'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=7'),
    ('영축산정육식당',          'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=9'),
    ('중화호반닭갈비 광운대점',   'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=11'),
    ('푸른스시',                'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=12'),
    ('민들레뜨락2',              'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=13'),
    ('치킨클럽 성북역본점',       'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=14'),
    ('치킨플러스 월계점',        'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=15'),
    ('별난주점 광운대점',        'POLICY_LAW', 'https://www.instagram.com/p/DVlGzgaEWnH/?img_index=16'),

    -- 공과대학
    ('카페베르데',              'ENGINEERING', 'https://www.instagram.com/p/DUUp0LNkTPY/'),
    ('꽃님맥주',                'ENGINEERING', 'https://www.instagram.com/p/DUUpoWrEfje/'),
    ('민들레뜨락2',              'ENGINEERING', 'https://www.instagram.com/p/DUUpjOykdHD/'),
    ('중화호반닭갈비 광운대점',   'ENGINEERING', 'https://www.instagram.com/p/DUUpbNdkcr4/'),
    ('여우곱창',                'ENGINEERING', 'https://www.instagram.com/p/DUUpTwskYkZ/'),
    ('로스2000',                'ENGINEERING', 'https://www.instagram.com/p/DUUpN33kQKx/'),
    ('고씨네 광운대점',          'ENGINEERING', 'https://www.instagram.com/p/DUUpFrVkdrb/'),
    ('더진국 광운대점',          'ENGINEERING', 'https://www.instagram.com/p/DUUo59FkZh-/'),

    -- 자연과학대학
    ('중화호반닭갈비 광운대점',   'NATURAL_SCIENCE', 'https://www.instagram.com/p/DWY17M1Elxu/'),
    ('고씨네 광운대점',          'NATURAL_SCIENCE', 'https://www.instagram.com/p/DWY1yrukr0y/'),
    ('꽃님맥주',                'NATURAL_SCIENCE', 'https://www.instagram.com/p/DWY1oHukpeL/'),
    ('미식성',                  'NATURAL_SCIENCE', 'https://www.instagram.com/p/DWNaVQxklal/'),
    ('민들레뜨락2',              'NATURAL_SCIENCE', 'https://www.instagram.com/p/DWNaIqxkisD/'),
    ('더진국 광운대점',          'NATURAL_SCIENCE', 'https://www.instagram.com/p/DViQWEvkggO/'),

    -- 인문사회과학대학
    ('경대컵밥 광운대점',        'HUMANITIES_SOCIAL', 'https://www.instagram.com/p/DVd1kCvkiNS/'),
    ('꽃님맥주',                'HUMANITIES_SOCIAL', 'https://www.instagram.com/p/DVd1bWGkuDF/'),
    ('미식성',                  'HUMANITIES_SOCIAL', 'https://www.instagram.com/p/DVd1B5REizr/'),
    ('장수국수 광운대점',        'HUMANITIES_SOCIAL', 'https://www.instagram.com/p/DVd06NJEisK/'),
    ('카페베르데',              'HUMANITIES_SOCIAL', 'https://www.instagram.com/p/DVd0zpckqMy/'),

    -- 전자정보공과대학
    ('치킨플러스 월계점',        'ELECTRONICS_INFO', 'https://www.instagram.com/p/DVGce7ujxxl/?img_index=1'),
    ('민들레뜨락2',              'ELECTRONICS_INFO', 'https://www.instagram.com/p/DVGcIRZj2FJ/?img_index=1'),
    ('미식성',                  'ELECTRONICS_INFO', 'https://www.instagram.com/p/DVGbqs-jw8d/?img_index=1'),
    ('꽃님맥주',                'ELECTRONICS_INFO', 'https://www.instagram.com/p/DVGbhjij-jf/?img_index=1'),

    -- 자유전공학부
    ('카페베르데',              'FREE_MAJOR', 'https://www.instagram.com/p/DVfEWhSkisN/'),
    ('푸른스시',                'FREE_MAJOR', 'https://www.instagram.com/p/DVczYw0knaH/'),
    ('꽃님맥주',                'FREE_MAJOR', 'https://www.instagram.com/p/DVcyyKXEhtn/'),
    ('민들레뜨락2',              'FREE_MAJOR', 'https://www.instagram.com/p/DVcyrwaktF2/'),
    ('치킨플러스 월계점',        'FREE_MAJOR', 'https://www.instagram.com/p/DVcyD0Mkq0j/'),
    ('맛불',                    'FREE_MAJOR', 'https://www.instagram.com/p/DVcx2dskqbZ/'),
    ('미식성',                  'FREE_MAJOR', 'https://www.instagram.com/p/DVcxirGkuTY/')
)
INSERT INTO "RestaurantPartnership" (id, "restaurantId", college, "instagramUrl", "updatedAt")
SELECT gen_random_uuid()::text, r.id, p.college::"College", p.url, NOW()
FROM partnership_data p
JOIN "Restaurant" r ON r.name = p.restaurant_name
ON CONFLICT ("restaurantId", college) DO NOTHING;

-- isPartner 플래그 갱신: 제휴 행이 1개 이상 있는 식당
UPDATE "Restaurant" r
SET "isPartner" = true, "updatedAt" = NOW()
WHERE EXISTS (SELECT 1 FROM "RestaurantPartnership" rp WHERE rp."restaurantId" = r.id)
  AND r."isPartner" = false;

-- 검증
SELECT COUNT(*) AS partnerships_total FROM "RestaurantPartnership";
SELECT COUNT(*) AS partner_restaurants FROM "Restaurant" WHERE "isPartner" = true;
SELECT college, COUNT(*) FROM "RestaurantPartnership" GROUP BY college ORDER BY college;

-- 매칭 실패 확인 (DB 에 없는 이름)
WITH partnership_input(restaurant_name) AS (
  VALUES ('중화호반닭갈비 광운대점'), ('민들레뜨락2'), ('갤러리eat'), ('별난주점 광운대점'),
         ('푸른스시'), ('로스2000'), ('진심카츠'), ('꽃님맥주'), ('포 레오'),
         ('수해복마라탕 광운대점'), ('와플대학 광운대캠퍼스'), ('큰집닭강정 광운대점'),
         ('썬더치킨 광운대점'), ('카페베르데'), ('여우곱창'), ('이층집'), ('부리또잇'),
         ('장수국수 광운대점'), ('맛불'), ('디델리 광운대점'), ('더진국 광운대점'),
         ('미식성'), ('고씨네 광운대점'), ('경대컵밥 광운대점'), ('영축산정육식당'),
         ('치킨플러스 월계점'), ('치킨클럽 성북역본점')
)
SELECT p.restaurant_name AS unmatched_name
FROM partnership_input p
LEFT JOIN "Restaurant" r ON r.name = p.restaurant_name
WHERE r.id IS NULL;

COMMIT;
