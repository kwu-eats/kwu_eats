"""
docs/기술과 경영_메뉴판 정리.xlsx 의 메뉴+가격을 DB Menu 테이블에 일괄 삽입.

특이 처리:
- 괄호 안 쉼표를 메뉴 구분자로 잘못 인식하지 않도록 정규식으로 보호 (·로 치환)
- 가격 셀에서 #VALUE! 같은 엑셀 오류 무시
- 같은 식당 기존 Menu 는 모두 삭제 후 새로 INSERT (멱등 보장)
"""
import os
import re
import openpyxl

XLSX = os.path.join(os.path.dirname(__file__), '..', '..', 'docs', '기술과 경영_메뉴판 정리.xlsx')
OUT = os.path.join(os.path.dirname(__file__), 'menus-import.sql')

# 스시덤은 메뉴 셀에 (...) ×2 + 구성품 형태가 있어 자동 파싱 불가 → hardcode
SPECIAL_MENUS = {
    '스시덤': [
        ('덤으로 연어 사시미 12pcs', 22700),
        ('덤으로 광어 사시미 12pcs', 22700),
        ('덤으로 모듬 사시미 12pcs', 25700),
        ('덤으로 1인 모듬 사시미 8pcs', 13700),
        ('캘리포니아 롤 10pcs', 8700),
        ('연어 롤 10pcs', 16700),
        ('사케동 (연어덮밥)', 18700),
        ('카이센동', 21700),
        ('회덮밥', 9700),
        ('어린이 초밥 5pcs (계란1·초새우1·마요새우1·날치알군함1·유부1)', 7700),
        ('계란초밥 5pcs', 4700),
        ('유부초밥 5pcs', 4700),
        ('덤으로 세트 1번 10pcs (광어1·활어2·연어1·생새우1·문어1·계란1·참치1·구운초밥1·유부1)', 12700),
        ('덤으로 세트 2번 11pcs (광어1·활어2·연어2·생새우1·초새우1·참치1·황새치1·구운초밥1·날치알군함1)', 15700),
        ('덤으로 세트 3번 12pcs (광어1·활어2·두툼한치1·연어2·참치1·참돔1·장새우1·구운초밥1·오늘초밥1·연어아부리1)', 17700),
        ('덤으로 세트 4번 13pcs (광어1·활어1·연어2·참치1·안키모군함1·장어1·참돔1·참소라1·오늘초밥1·광어지느러미1·단새우1·우니1)', 21700),
        ('덤으로 연어 모둠 10pcs (연어4·연어대뱃살3·연어아부리3)', 20000),
        ('덤으로 직화 초밥 모둠 10pcs (연어아부리2·직화참치2·직화황새치2·직화새우2·직화한치2)', 14700),
        ('덤으로 2인세트 16pcs + 구성품 (광어1·활어1·연어1·참치1·생새우1·문어1·두툼한치1·계란1)×2 + 새우튀김·고로케2·샐러드2·우동2·롤2', 34700),
        ('대광어 초밥 8pcs', 18700),
        ('연어 초밥 8pcs', 18700),
        ('대광어 초밥 4pcs + 연어 초밥 4pcs', 18700),
        ('연어 초밥 4pcs + 연어 뱃살 4pcs', 19700),
        ('대광어 초밥 4pcs + 대광어 지느러미 4pcs', 19700),
        ('초새우 4pcs + 생새우 4pcs', 12700),
        ('새우모듬 10pcs (초새우2·생새우2·간장새우2·계란새우2·직화새우2)', 17700),
        ('생새우 4pcs + 간장새우 4pcs', 14700),
    ],
}

# 엑셀 상호명 → DB 식당명 매핑
NAME_MAP = {
    'DAYLONG COFFEE': '데이롱카페 광운대점',
    'PHO LEO': '포 레오',
    'Pas;mal(빠말)': '빠말',
    'CORD Jr': 'CORD Jr.',
    '5일장햄버거': '5일장 햄버거',
    '이찌마김치': '이찌마 김치',
    '병천순대': '병천청년순대 광운대점',
    '기사식당': '용기사 식당',
    '경대컵밥': '경대컵밥 광운대점',
    '국수천왕': '국수천왕 광운대점',
    '밥은화': '밥은화 광운대본점',
    '별난주점': '별난주점 광운대점',
    '셰프밥버거': '쉐프밥버거 광운대점',
    '치킨플러스': '치킨플러스 월계점',
    '아, 그집': '아 그집',
    '청계빨간집': '청계 빨간집',
    '카페 베르데': '카페베르데',
    '우우즈 베이커리': '우우즈베이커리',
    '일심해장국': '일심해장국 월계점',
    '천년초칼국수': '천년초우리밀칼국수',
}


def split_menus(s: str) -> list[str]:
    """괄호 안 쉼표 보호 후 메뉴 분리."""
    protected = re.sub(
        r'\(([^)]*)\)',
        lambda m: '(' + m.group(1).replace(',', '·') + ')',
        s,
    )
    return [x.strip() for x in protected.split(',') if x.strip()]


def parse_prices(s: str) -> list[int]:
    """가격 셀에서 숫자만 추출."""
    if not s:
        return []
    return [int(x) for x in re.findall(r'\d+', s)]


def sql_escape(s: str) -> str:
    """SQL single-quote escape."""
    return s.replace("'", "''")


def main():
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    ws = wb['Sheet1']

    sql = ['BEGIN;', '']
    insert_count = 0
    restaurant_count = 0
    skipped = []

    # 22 식당의 기존 메뉴 한 번에 삭제 (멱등)
    target_db_names = []

    rows = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        zone, name, status, category, menu, price, *_ = list(row) + [None] * 8
        if not name or not str(name).strip():
            continue
        name = str(name).strip()
        if not menu or not price:
            continue
        rows.append((name, str(menu), str(price)))

    # 1) 대상 식당 메뉴 일괄 삭제
    sql.append('-- 대상 식당의 기존 Menu 삭제 (멱등)')
    for name, _, _ in rows:
        db_name = NAME_MAP.get(name, name)
        target_db_names.append(db_name)
        sql.append(
            f'DELETE FROM "Menu" WHERE "restaurantId" IN '
            f'(SELECT id FROM "Restaurant" WHERE name = \'{sql_escape(db_name)}\');'
        )
    sql.append('')

    # 2) 새 메뉴 INSERT
    sql.append('-- 메뉴 INSERT')
    for name, menu_str, price_str in rows:
        # SPECIAL_MENUS hardcode 우선
        if name in SPECIAL_MENUS:
            menu_price_pairs = SPECIAL_MENUS[name]
        else:
            menus = split_menus(menu_str)
            prices = parse_prices(price_str)
            if len(menus) != len(prices):
                skipped.append((name, len(menus), len(prices)))
                continue
            menu_price_pairs = list(zip(menus, prices))

        db_name = NAME_MAP.get(name, name)
        restaurant_count += 1

        for m, p in menu_price_pairs:
            sql.append(
                f'INSERT INTO "Menu" (id, "restaurantId", name, price, "isSignature", "updatedAt") '
                f'SELECT gen_random_uuid()::text, r.id, \'{sql_escape(m)}\', {p}, false, NOW() '
                f'FROM "Restaurant" r WHERE r.name = \'{sql_escape(db_name)}\';'
            )
            insert_count += 1

    # 3) 검증 쿼리
    sql.append('')
    sql.append('-- 검증')
    sql.append('SELECT COUNT(*) AS total_menus FROM "Menu";')
    sql.append(
        'SELECT r.name, r.zone, COUNT(m.id) AS menu_count '
        'FROM "Restaurant" r LEFT JOIN "Menu" m ON m."restaurantId" = r.id '
        'GROUP BY r.id, r.name, r.zone HAVING COUNT(m.id) = 0 '
        'ORDER BY r.zone, r.name;'
    )

    sql.append('')
    sql.append('COMMIT;')

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql))

    print(f'SQL 파일: {OUT}')
    print(f'대상 식당: {restaurant_count}개')
    print(f'INSERT 라인: {insert_count}개')
    if skipped:
        print('\n[SKIP - 메뉴 vs 가격 mismatch]')
        for name, m, p in skipped:
            print(f'  - {name}: 메뉴 {m} / 가격 {p}')


if __name__ == '__main__':
    main()
