-- ============================================================
-- 대표 사진(coverImageUrl) 일괄 적용
-- ============================================================
-- public/restaurants/ 의 *.jpg 파일명을 DB Restaurant.name 으로 매칭.
-- 파일명 = DB name 가정 (사전에 rename-images.py 로 정리됨).
-- ============================================================

BEGIN;

UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/1%EC%9D%BC1%EC%9E%94.jpg', "updatedAt" = NOW() WHERE name = '1일1잔';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/5%EC%9D%BC%EC%9E%A5%20%ED%96%84%EB%B2%84%EA%B1%B0.jpg', "updatedAt" = NOW() WHERE name = '5일장 햄버거';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/CAFE%20FIASCO.jpg', "updatedAt" = NOW() WHERE name = 'CAFE FIASCO';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/CORD%20Jr..jpg', "updatedAt" = NOW() WHERE name = 'CORD Jr.';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EA%B0%80%EB%A7%88%EC%86%A5%EB%BC%88%EB%8B%A4%EA%B7%80%EA%B0%90%EC%9E%90%ED%83%95.jpg', "updatedAt" = NOW() WHERE name = '가마솥뼈다귀감자탕';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EA%B2%BD%EB%8C%80%EC%BB%B5%EB%B0%A5%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '경대컵밥 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EA%B3%A0%EC%94%A8%EB%84%A4%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '고씨네 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EA%B4%91%EC%9A%B4%EC%BB%A4%ED%94%BC.jpg', "updatedAt" = NOW() WHERE name = '광운커피';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EA%B5%AD%EC%88%98%EC%B2%9C%EC%99%95%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '국수천왕 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EA%B7%B8%EC%98%9B%EB%82%A01947%EC%99%95%EB%A7%8C%EB%91%90.jpg', "updatedAt" = NOW() WHERE name = '그옛날1947왕만두';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EA%BD%83%EC%A0%9C%EB%B9%84%EC%B9%BC%EA%B5%AD%EC%88%98.jpg', "updatedAt" = NOW() WHERE name = '꽃제비칼국수';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%8D%94%EC%9B%90.jpg', "updatedAt" = NOW() WHERE name = '더원';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%8D%B0%EC%9D%B4%EB%A1%B1%EC%B9%B4%ED%8E%98%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '데이롱카페 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%8F%88%EC%9E%A5%EA%B5%B0%20%EA%B4%91%EC%9A%B4%EB%8C%80%EB%B3%B8%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '돈장군 광운대본점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%94%94%EB%8D%B8%EB%A6%AC%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '디델리 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%98%90%EC%99%80%EC%A7%91%EC%88%9C%EB%8C%80%EA%B5%AD.jpg', "updatedAt" = NOW() WHERE name = '또와집순대국';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%A1%9C%EC%8A%A42000.jpg', "updatedAt" = NOW() WHERE name = '로스2000';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%A7%88%EB%A3%A8.jpg', "updatedAt" = NOW() WHERE name = '마루';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%A7%88%EC%82%B0%EC%95%84%EA%B5%AC%EC%B0%9C.jpg', "updatedAt" = NOW() WHERE name = '마산아구찜';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%A7%88%ED%8F%AC%EC%97%B0%ED%83%84%EB%B6%88%EA%B3%A0%EA%B8%B0.jpg', "updatedAt" = NOW() WHERE name = '마포연탄불고기';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%A7%9B%EB%B6%88.jpg', "updatedAt" = NOW() WHERE name = '맛불';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%AA%85%ED%83%9C%EC%9D%B4%EC%95%BC%EA%B8%B0.jpg', "updatedAt" = NOW() WHERE name = '명태이야기';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%AA%A9%ED%8F%AC%ED%99%8D%ED%83%81.jpg', "updatedAt" = NOW() WHERE name = '목포홍탁';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%AF%B8%EC%8B%9D%EC%84%B1.jpg', "updatedAt" = NOW() WHERE name = '미식성';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%AF%BC%EB%93%A4%EB%A0%88%EA%B5%AD%EC%8B%9C.jpg', "updatedAt" = NOW() WHERE name = '민들레국시';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%B0%A5%EC%9D%80%ED%99%94%20%EA%B4%91%EC%9A%B4%EB%8C%80%EB%B3%B8%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '밥은화 광운대본점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%B3%84%EB%82%9C%EC%A3%BC%EC%A0%90%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '별난주점 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%B3%B8%EB%8F%84%EC%8B%9C%EB%9D%BD%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%97%AD%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '본도시락 광운대역점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%B9%88%EB%8C%80%EB%96%A1%EC%8B%A0%EC%82%AC.jpg', "updatedAt" = NOW() WHERE name = '빈대떡신사';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EB%B9%A0%EB%A7%90.jpg', "updatedAt" = NOW() WHERE name = '빠말';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%82%AC%EA%B3%84%EC%A0%88%EA%B9%80%EB%B0%A5.jpg', "updatedAt" = NOW() WHERE name = '사계절김밥';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%83%90%EB%9F%AC%EB%A6%AC%EC%95%84%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '샐러리아 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%84%9C%EC%84%A0%EC%83%9D%EA%B9%80%EC%B9%98%EC%B0%9C.jpg', "updatedAt" = NOW() WHERE name = '서선생김치찜';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%84%9C%EC%B4%88%EC%9A%B0%EB%8F%99%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%97%AD%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '서초우동 광운대역점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%86%8C%EB%8B%B4%EB%B0%A5%EC%83%81.jpg', "updatedAt" = NOW() WHERE name = '소담밥상';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%8A%A4%EB%A7%88%EC%9D%BC%EB%8F%88%EA%B9%8C%EC%8A%A4.jpg', "updatedAt" = NOW() WHERE name = '스마일돈까스';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%8B%A0%EC%97%B0%EB%A7%88%EB%9D%BC%ED%83%95.jpg', "updatedAt" = NOW() WHERE name = '신연마라탕';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%8D%AC%EB%8D%94%EC%B9%98%ED%82%A8%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '썬더치킨 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%95%84%20%EA%B7%B8%EC%A7%91.jpg', "updatedAt" = NOW() WHERE name = '아 그집';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%97%84%EB%A7%88%EC%86%90%EA%B9%80%EB%B0%A5%26%EB%B6%84%EC%8B%9D.jpg', "updatedAt" = NOW() WHERE name = '엄마손김밥&분식';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%98%81%EC%B6%95%EC%82%B0%EC%A0%95%EC%9C%A1%EC%8B%9D%EB%8B%B9.jpg', "updatedAt" = NOW() WHERE name = '영축산정육식당';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%98%A4%EC%8E%84.jpg', "updatedAt" = NOW() WHERE name = '오쎄';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%99%95%ED%86%A0%EC%A2%85%EC%88%9C%EB%8C%80%EA%B5%AD.jpg', "updatedAt" = NOW() WHERE name = '왕토종순대국';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%9A%A9%EA%B8%B0%EC%82%AC%20%EC%8B%9D%EB%8B%B9.jpg', "updatedAt" = NOW() WHERE name = '용기사 식당';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%9A%B0%EC%9A%B0%EC%A6%88%EB%B2%A0%EC%9D%B4%EC%BB%A4%EB%A6%AC.jpg', "updatedAt" = NOW() WHERE name = '우우즈베이커리';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%9C%A4%EC%8A%A4%EC%BF%A1.jpg', "updatedAt" = NOW() WHERE name = '윤스쿡';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%9D%B4%EC%B8%B5%EC%A7%91.jpg', "updatedAt" = NOW() WHERE name = '이층집';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%9D%BC%EC%8B%AC%ED%85%90%EB%8F%99%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '일심텐동 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%9D%BC%EC%8B%AC%ED%95%B4%EC%9E%A5%EA%B5%AD%20%EC%9B%94%EA%B3%84%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '일심해장국 월계점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%9E%A5%EC%88%98%EA%B5%AD%EC%88%98%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '장수국수 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%A0%84%EC%84%A4%EC%9D%98%EB%A9%B8%EC%B9%98%EA%B5%AD%EC%88%98%20%EC%9B%94%EA%B3%84%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '전설의멸치국수 월계점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%A0%84%EC%A3%BC%EB%B0%A5%EC%83%81%EC%8C%88%EB%B0%A5.jpg', "updatedAt" = NOW() WHERE name = '전주밥상쌈밥';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%A0%95%EB%8B%B4%EC%86%8C%EB%B0%98.jpg', "updatedAt" = NOW() WHERE name = '정담소반';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%A4%91%ED%99%94%ED%98%B8%EB%B0%98%EB%8B%AD%EA%B0%88%EB%B9%84%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '중화호반닭갈비 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%A7%80%EC%A7%80%EA%B3%A0%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '지지고 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%A7%84%EB%AF%B8%ED%86%B5%EB%8B%AD.jpg', "updatedAt" = NOW() WHERE name = '진미통닭';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%A7%91%EB%B0%A5.jpg', "updatedAt" = NOW() WHERE name = '집밥';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%A7%9D%ED%83%9C%EC%B4%8C%EB%85%B8%EA%B0%80%EB%A6%AC.jpg', "updatedAt" = NOW() WHERE name = '짝태촌노가리';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%B2%9C%EB%85%84%EC%B4%88%EC%9A%B0%EB%A6%AC%EB%B0%80%EC%B9%BC%EA%B5%AD%EC%88%98.jpg', "updatedAt" = NOW() WHERE name = '천년초우리밀칼국수';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%B2%AD%EA%B3%84%20%EB%B9%A8%EA%B0%84%EC%A7%91.jpg', "updatedAt" = NOW() WHERE name = '청계 빨간집';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%B9%98%ED%82%A8%ED%81%B4%EB%9F%BD%20%EC%84%B1%EB%B6%81%EC%97%AD%EB%B3%B8%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '치킨클럽 성북역본점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%B9%B4%EC%B8%A0%EB%B0%B1%20%EC%9B%94%EA%B3%84%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '카츠백 월계점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%B9%B4%ED%8E%98%EB%B2%A0%EB%A5%B4%EB%8D%B0.jpg', "updatedAt" = NOW() WHERE name = '카페베르데';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%EC%BB%A4%ED%94%BC%EB%8A%94%EA%B8%B0%EC%96%B5%EC%9D%98%EB%81%8C%EB%A6%BC.jpg', "updatedAt" = NOW() WHERE name = '커피는기억의끌림';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%81%B0%EB%A7%98%ED%95%A0%EB%A7%A4%EC%88%9C%EB%8C%80%EA%B5%AD%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '큰맘할매순대국 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%81%B0%EC%A7%91%EB%8B%AD%EA%B0%95%EC%A0%95%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '큰집닭강정 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%8A%80%EB%A7%A5.jpg', "updatedAt" = NOW() WHERE name = '튀맥';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%8F%AC%20%EB%A0%88%EC%98%A4.jpg', "updatedAt" = NOW() WHERE name = '포 레오';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%91%B8%EB%A5%B8%EC%8A%A4%EC%8B%9C.jpg', "updatedAt" = NOW() WHERE name = '푸른스시';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%94%84%EB%9E%AD%ED%81%AC%EB%B2%84%EA%B1%B0%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '프랭크버거 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%95%98%EC%9D%B4%EB%A0%88.jpg', "updatedAt" = NOW() WHERE name = '하이레';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%95%9C%EA%B7%B8%EB%A6%87.jpg', "updatedAt" = NOW() WHERE name = '한그릇';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%95%9C%EB%81%BC%EC%B2%A0%ED%8C%90%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '한끼철판 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%95%9C%EB%9D%BC%EC%82%B0%EA%B0%90%EC%9E%90%ED%83%95.jpg', "updatedAt" = NOW() WHERE name = '한라산감자탕';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%95%9C%EB%B0%A9%EC%A0%84%EC%A3%BC%EC%BD%A9%EB%82%98%EB%AC%BC%EA%B5%AD%EB%B0%A5%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%97%AD%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '한방전주콩나물국밥 광운대역점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%99%94%EB%A1%9C%EC%83%81%ED%9A%8C%20%EA%B4%91%EC%9A%B4%EB%8C%80%EC%A0%90.jpg', "updatedAt" = NOW() WHERE name = '화로상회 광운대점';
UPDATE "Restaurant" SET "coverImageUrl" = '/restaurants/%ED%9B%84%EB%AC%B8%EC%8B%9D%EB%8B%B9.jpg', "updatedAt" = NOW() WHERE name = '후문식당';

-- 검증
SELECT COUNT(*) AS cover_image_set_count FROM "Restaurant" WHERE "coverImageUrl" IS NOT NULL;

COMMIT;
