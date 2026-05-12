/**
 * 광운대 주변 식당 일괄 등록 스크립트
 *
 * 사용법:
 *   KAKAO_REST_KEY=xxxx node scripts/seed-restaurants/seed.mjs > out.sql 2> report.txt
 *
 * 결과:
 *   stdout: 실행 가능한 SQL (INSERT/COMMIT)
 *   stderr: 처리 요약 + 실패 항목 + 모호한 매칭
 */

const KEY = process.env.KAKAO_REST_KEY;
if (!KEY) {
  console.error('환경변수 KAKAO_REST_KEY 가 필요합니다');
  process.exit(1);
}

// 광운대 캠퍼스 중심
const CENTER = { x: 127.0590, y: 37.6191 };
const RADIUS = 1500;

// (검색어 → zone) 매핑. 사용자가 준 그룹핑 그대로.
// '본도시락'은 이미 추가됐으므로 제외.
// 사용자 검토 후 수정된 검색어 사용 (예: 'Burrito eat' → '부리또잇').
// 스킵 항목 제거: 끝집, FM.25.1st(폐업), 뉴욕쟁이디저트(폐업), 스트릿츄러스.
const LIST = [
  // 1. 광운대역
  ['인생아구찜', 'KWANGWOON_STATION'],
  // 정담소반은 카카오 REST API에 없어 MANUAL_ENTRIES 로 이동
  ['서초우동', 'KWANGWOON_STATION'],
  ['짝태촌노가리', 'KWANGWOON_STATION'],
  ['치킨클럽', 'KWANGWOON_STATION'],
  ['친친', 'KWANGWOON_STATION'],
  ['여자만아구찜', 'KWANGWOON_STATION'],
  ['커피는 기억의 끌림', 'KWANGWOON_STATION'],
  ['꽃님맥주', 'KWANGWOON_STATION'],
  ['야타이', 'KWANGWOON_STATION'],
  ['명태이야기', 'KWANGWOON_STATION'],
  ['미미식당', 'KWANGWOON_STATION'],
  ['생마차 광운대점', 'KWANGWOON_STATION'],
  ['명동찌개마을', 'KWANGWOON_STATION'],
  ['가마솥뼈다귀감자탕', 'KWANGWOON_STATION'],
  ['왕토종순대국', 'KWANGWOON_STATION'],
  ['마산아구찜', 'KWANGWOON_STATION'],
  ['엄마손 김밥&분식', 'KWANGWOON_STATION'],
  ['사계절김밥', 'KWANGWOON_STATION'],
  ['돈장군', 'KWANGWOON_STATION'],
  ['빈대떡 신사', 'KWANGWOON_STATION'],
  ['집밥', 'KWANGWOON_STATION'],
  ['큰맘할매순대국', 'KWANGWOON_STATION'],
  ['여우곱창', 'KWANGWOON_STATION'],
  ['가마솥소머리곰탕', 'KWANGWOON_STATION'],
  ['한방전주콩나물국밥', 'KWANGWOON_STATION'],
  ['마포 연탄불고기', 'KWANGWOON_STATION'],
  ['놀부부대찌개', 'KWANGWOON_STATION'],
  ['착한족발', 'KWANGWOON_STATION'],
  ['스마일돈까스', 'KWANGWOON_STATION'],
  ['마떡다이천', 'KWANGWOON_STATION'],
  ['맛닭꼬', 'KWANGWOON_STATION'],
  ['THE ONE', 'KWANGWOON_STATION'],
  ['전주밥상쌈밥', 'KWANGWOON_STATION'],

  // 2. 정문
  ['OSSE Coffee', 'FRONT_GATE'],
  ['1947 왕만두', 'FRONT_GATE'],
  ['굿킨', 'FRONT_GATE'],
  ['전설의 멸치국수', 'FRONT_GATE'],
  ['큰집 닭강정', 'FRONT_GATE'],
  ['영축산 정육식당', 'FRONT_GATE'],
  ['진미통닭', 'FRONT_GATE'],
  ['로스2000', 'FRONT_GATE'],
  ['썬더치킨', 'FRONT_GATE'],
  ['종로전집', 'FRONT_GATE'],
  ['맛불', 'FRONT_GATE'],
  ['수해복마라탕', 'FRONT_GATE'],
  ['더진국', 'FRONT_GATE'],
  ['고씨네 카레전문점', 'FRONT_GATE'],
  ['화로상회', 'FRONT_GATE'],
  ['부리또잇', 'FRONT_GATE'],
  // 레드컵스: 카카오 REST API 에 없음
  ['재리스토스트&빙수바보빙식이 광운대점', 'FRONT_GATE'],
  ['신연마라탕', 'FRONT_GATE'],
  ['민들레뜨락2', 'FRONT_GATE'],
  ['푸른스시', 'FRONT_GATE'],
  ['일심텐동', 'FRONT_GATE'],
  ['디델리라볶이', 'FRONT_GATE'],
  ['마루덮밥', 'FRONT_GATE'],
  ['윤스쿡', 'FRONT_GATE'],
  ['한끼철판', 'FRONT_GATE'],
  ['장수국수', 'FRONT_GATE'],
  ['지지고', 'FRONT_GATE'],
  ['광운커피', 'FRONT_GATE'],
  ['프랭크버거', 'FRONT_GATE'],
  ['팔팔부대찌개', 'FRONT_GATE'],
  ['카츠백', 'FRONT_GATE'],
  ['민들레국시', 'FRONT_GATE'],
  // 샐러리아 광운대점: 카카오 REST API 에 없음
  ['중화 호반 닭갈비 막국수', 'FRONT_GATE'],
  ['전주밥상', 'FRONT_GATE'],
  ['또와집순대국', 'FRONT_GATE'],

  // 3. 후문
  ['튀맥', 'BACK_GATE'],
  // CAFE FIASCO 는 카카오 REST API 에 없음 — 사용자 추가 정보 필요
  ['서선생김치찜', 'BACK_GATE'],
  ['한라산 감자탕', 'BACK_GATE'],
  ['국수천왕', 'BACK_GATE'],
  // 포 레오는 MANUAL_ENTRIES 로 이동
  ['한그릇', 'BACK_GATE'],
  ['DAYLONG COFFEE', 'BACK_GATE'],
  ['별난주점', 'BACK_GATE'],
  ['꽃제비칼국수', 'BACK_GATE'],
  ['밥은화', 'BACK_GATE'],
  ['하이레', 'BACK_GATE'],
  ['아, 그집', 'BACK_GATE'],
  ['CORD.jr', 'BACK_GATE'],
  ['치킨플러스', 'BACK_GATE'],
  ['후문식당', 'BACK_GATE'],
  ['천년초칼국수', 'BACK_GATE'],
  ['월계돈', 'BACK_GATE'],
  ['일심해장국', 'BACK_GATE'],
  // 용기사 식당은 MANUAL_ENTRIES 로 이동
  // 레드컵스, 샐러리아 광운대점 은 카카오 REST API 에 없음 — 사용자 추가 정보 필요
  ['볼카츠마켙', 'BACK_GATE'],
  ['카페베르데', 'BACK_GATE'],
  ['이층집', 'BACK_GATE'],
  ['병천순대', 'BACK_GATE'],
  ['경대컵밥', 'BACK_GATE'],
  ['소담밥상', 'BACK_GATE'],
  ['쉐프밥버거', 'BACK_GATE'],
  ['미식성', 'BACK_GATE'],
  ['빠말', 'BACK_GATE'],
  ['스시덤', 'BACK_GATE'],
  ['1일1잔', 'BACK_GATE'],
  ['이찌마 김치', 'BACK_GATE'],
  ['목포홍탁', 'BACK_GATE'],

  // 제휴 리스트에만 있는 신규 식당 — zone은 카카오 검색 결과로 추정
  ['갤러리eat', null],
  ['진심카츠', null],
  ['와플대학', null],
];

// 카카오 키워드 검색에 안 잡혀서 주소만으로 직접 등록할 식당.
// 주소 → 좌표 API로 lat/lng 만 채우고 나머지는 사용자 제공.
const MANUAL_ENTRIES = [
  {
    place_name: '청계 빨간집',
    address: '서울 노원구 석계로 103 3층',
    zone: 'BACK_GATE',
    category: '한식',
    phone: null,
  },
  {
    place_name: '우우즈베이커리',
    address: '서울 노원구 광운로12길 32',
    zone: 'BACK_GATE',
    category: '카페',
    phone: null,
  },
  {
    place_name: '정담소반',
    address: '서울 노원구 석계로18길 23',
    zone: 'KWANGWOON_STATION',
    category: '한식',
    phone: null,
  },
  {
    place_name: '포 레오',
    address: '서울 노원구 광운로 46',
    zone: 'BACK_GATE',
    category: '아시안',
    phone: null,
  },
  {
    place_name: '용기사 식당',
    address: '서울 노원구 석계로15길 25',
    zone: 'BACK_GATE',
    category: '한식',
    phone: null,
  },
];

// 카테고리 자동 추정. 어떤 규칙에도 안 맞으면 한식(기본).
function guessCategory(name) {
  // 튀김류 (사용자 추가 카테고리)
  if (/튀김|튀맥/.test(name)) return '튀김류';
  // 카페 (영문 case-insensitive)
  if (/카페|커피|디저트|빙수|츄러스|와플|베이커리|토스트/i.test(name) || /coffee|cafe/i.test(name)) return '카페';
  // 주점
  if (/맥주|포차|노가리|주점|꽃님|생마차|1잔/.test(name)) return '주점';
  // 분식
  if (/김밥|떡볶이|라볶이|컵밥|마떡|분식/.test(name)) return '분식';
  // 일식
  if (/스시|초밥|우동|텐동|덮밥|돈까스|돈가스|카츠|야타이|철판/.test(name)) return '일식';
  // 중식
  if (/마라탕|마라샹궈|샹궈|만두|짜장|짬뽕|중화/.test(name)) {
    if (/닭갈비/.test(name)) return '한식'; // '중화 호반 닭갈비'는 한식
    return '중식';
  }
  // 아시안
  if (/pho|쌀국수|카레|팟타이|베트남|태국|포 레오/i.test(name)) return '아시안';
  // 양식
  if (/burrito|부리또|버거|파스타|피자|샐러드|샐러리|레드컵|red cups|치즈/i.test(name)) return '양식';
  // 닭강정 → 분식
  if (/닭강정/.test(name)) return '분식';
  // 치킨/통닭 → 양식
  if (/치킨|통닭/.test(name)) return '양식';
  // 기본: 한식
  return '한식';
}

// 식당 ID 슬러그 (영문/숫자만, 충돌 방지용 인덱스 포함)
function slug(name, index) {
  // 한글 포함 이름은 인덱스만으로 식별
  return `rst_${String(index + 1).padStart(3, '0')}`;
}

// 기본 영업시간
const DEFAULT_HOURS = {
  mon: { open: '09:00', close: '22:00' },
  tue: { open: '09:00', close: '22:00' },
  wed: { open: '09:00', close: '22:00' },
  thu: { open: '09:00', close: '22:00' },
  fri: { open: '09:00', close: '22:00' },
  sat: { open: '09:00', close: '22:00' },
  sun: { open: '09:00', close: '22:00' },
};

// zone 추정 (좌표 기준 — 신규 식당 4개용)
function inferZone(x, y) {
  // 광운대역: 북쪽 ~37.624, 127.061
  // 정문: 서쪽 ~37.6189, 127.0582
  // 후문: 남쪽 ~37.6178, 127.0595
  if (y > 37.622) return 'KWANGWOON_STATION';
  if (x < 127.0585) return 'FRONT_GATE';
  return 'BACK_GATE';
}

async function searchPlace(name) {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(name)}&x=${CENTER.x}&y=${CENTER.y}&radius=${RADIUS}&size=5`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${KEY}` },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return await res.json();
}

async function geocodeAddress(address) {
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${KEY}` },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return await res.json();
}

function sqlString(s) {
  if (s == null) return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

async function main() {
  const results = [];
  const failures = [];
  const ambiguous = [];

  for (let i = 0; i < LIST.length; i++) {
    const [name, zoneHint] = LIST[i];
    try {
      const data = await searchPlace(name);
      if (data.documents.length === 0) {
        failures.push({ name, zoneHint, reason: '카카오 검색 0건' });
        continue;
      }
      // 첫 결과 = 가장 정확/가까운 매칭
      const best = data.documents[0];
      const zone = zoneHint ?? inferZone(parseFloat(best.x), parseFloat(best.y));
      const category = guessCategory(name) || guessCategory(best.place_name);

      // 결과가 2개 이상이고 둘 다 distance < 1000m면 모호
      if (data.documents.length > 1 && parseInt(data.documents[1].distance ?? '9999') < 500) {
        ambiguous.push({
          name,
          candidates: data.documents.slice(0, 3).map((d) => ({
            place_name: d.place_name,
            address: d.road_address_name || d.address_name,
            distance: d.distance,
          })),
        });
      }

      results.push({
        index: i,
        originalName: name,
        id: slug(name, i),
        place_name: best.place_name,
        zone,
        category,
        latitude: parseFloat(best.y),
        longitude: parseFloat(best.x),
        address: best.road_address_name || best.address_name,
        phone: best.phone || null,
        distance: best.distance,
        kakao_category: best.category_name,
      });
    } catch (err) {
      failures.push({ name, zoneHint, reason: err.message });
    }
    // rate limit 보호: 50ms 슬립
    await new Promise((r) => setTimeout(r, 50));
  }

  // Manual entries — 주소만으로 좌표 조회 후 추가
  for (let i = 0; i < MANUAL_ENTRIES.length; i++) {
    const m = MANUAL_ENTRIES[i];
    try {
      const data = await geocodeAddress(m.address);
      if (data.documents.length === 0) {
        failures.push({ name: m.place_name, zoneHint: m.zone, reason: '주소 좌표 변환 실패' });
        continue;
      }
      const best = data.documents[0];
      results.push({
        index: 1000 + i, // manual entries는 별도 인덱스 범위
        originalName: m.place_name,
        id: slug(m.place_name, 1000 + i),
        place_name: m.place_name,
        zone: m.zone,
        category: m.category,
        latitude: parseFloat(best.y),
        longitude: parseFloat(best.x),
        address: best.road_address?.address_name || best.address_name || m.address,
        phone: m.phone,
        distance: 'manual',
        kakao_category: 'manual entry',
      });
    } catch (err) {
      failures.push({ name: m.place_name, zoneHint: m.zone, reason: err.message });
    }
    await new Promise((r) => setTimeout(r, 50));
  }

  // SQL 출력 (stdout)
  console.log('-- 자동 생성됨: kwu_eats 식당 일괄 등록');
  console.log(`-- 생성 시각: ${new Date().toISOString()}`);
  console.log(`-- 총 ${results.length}건 INSERT`);
  console.log('');
  console.log('BEGIN;');
  console.log('');

  // 신규 카테고리 (없으면 생성). cuid를 직접 만들 수 없으니 gen_random_uuid 사용.
  console.log("-- 신규 카테고리: 튀김류 (없으면 생성)");
  console.log("INSERT INTO \"Category\" (id, name) SELECT gen_random_uuid()::text, '튀김류' WHERE NOT EXISTS (SELECT 1 FROM \"Category\" WHERE name = '튀김류');");
  console.log('');

  // Restaurant
  for (const r of results) {
    const hours = JSON.stringify(DEFAULT_HOURS).replace(/'/g, "''");
    console.log(
      `INSERT INTO "Restaurant" (id, name, zone, latitude, longitude, address, phone, "businessHours", "isPartner", "updatedAt") VALUES (${sqlString(r.id)}, ${sqlString(r.place_name)}, '${r.zone}', ${r.latitude}, ${r.longitude}, ${sqlString(r.address)}, ${sqlString(r.phone)}, '${hours}'::jsonb, false, NOW());`,
    );
  }

  // RestaurantCategory
  console.log('');
  console.log('-- 카테고리 매핑');
  for (const r of results) {
    console.log(
      `INSERT INTO "RestaurantCategory" ("restaurantId", "categoryId") SELECT ${sqlString(r.id)}, id FROM "Category" WHERE name = ${sqlString(r.category)};`,
    );
  }

  console.log('');
  console.log('-- 검증');
  console.log('SELECT COUNT(*) AS restaurants FROM "Restaurant";');
  console.log('SELECT COUNT(*) AS restaurant_categories FROM "RestaurantCategory";');
  console.log('');
  console.log('COMMIT;');

  // 리포트 (stderr)
  console.error('=== 처리 요약 ===');
  console.error(`성공: ${results.length}건`);
  console.error(`실패: ${failures.length}건`);
  console.error(`모호한 매칭: ${ambiguous.length}건`);
  console.error('');

  if (failures.length > 0) {
    console.error('=== 실패 항목 ===');
    for (const f of failures) {
      console.error(`- ${f.name} (zone: ${f.zoneHint || '미정'}) — ${f.reason}`);
    }
    console.error('');
  }

  if (ambiguous.length > 0) {
    console.error('=== 모호한 매칭 (둘 이상 가까운 결과) ===');
    for (const a of ambiguous) {
      console.error(`- ${a.name}:`);
      for (const c of a.candidates) {
        console.error(`    · ${c.place_name} | ${c.address} | ${c.distance}m`);
      }
    }
    console.error('');
  }

  console.error('=== 매칭 결과 (이름, 카카오명, 거리, 카테고리) ===');
  for (const r of results) {
    console.error(`[${r.zone}] ${r.originalName.padEnd(20)} → ${r.place_name.padEnd(30)} | ${r.distance}m | ${r.category}`);
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
