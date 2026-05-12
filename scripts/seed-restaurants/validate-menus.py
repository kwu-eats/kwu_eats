"""
docs/기술과 경영_메뉴판 정리.xlsx 의 메뉴 vs 가격 개수 검증.
- 같은 행에서 쉼표로 분리된 메뉴 개수와 가격 개수가 일치해야 정상.
- DB 식당명 ↔ 엑셀 상호명 매핑도 함께 점검.
"""
import os
import openpyxl
import re

XLSX = os.path.join(os.path.dirname(__file__), '..', '..', 'docs', '기술과 경영_메뉴판 정리.xlsx')

# DB 의 식당명 (사전에 확인된 110개)
# 매핑이 어긋난 경우 사용자에게 보고하기 위해 사용
DB_NAMES = {
    # 광운대역 zone (sample subset — 후문/우이천만 검증하니까 광운대역 zone 은 무관)
    # 후문 zone (엑셀의 후문/우이천 구역과 매핑되는 식당들)
    '1일1잔', '5일장 햄버거', '갤러리eat', '경대컵밥 광운대점', '국수천왕 광운대점',
    '꽃제비칼국수', '데이롱카페 광운대점', '미식성', '밥은화 광운대본점', '별난주점 광운대점',
    '병천청년순대 광운대점', '서선생김치찜', '소담밥상', '쉐프밥버거 광운대점', '스시덤',
    '아 그집', '용기사 식당', '우우즈베이커리', '월계돈', '이찌마 김치', '이층집',
    '일심해장국 월계점', '천년초우리밀칼국수', '청계 빨간집', '치킨플러스 월계점',
    '카페베르데', '튀맥', '포 레오', '하이레', '한그릇', '한라산감자탕', '후문식당',
    'CAFE FIASCO', 'CORD Jr.', '광운양꼬치', '목포홍탁',
    # 정문 zone (엑셀에는 없지만 광운양꼬치는 정문)
}

# 엑셀 → DB 매핑 후보 (이름 약간 다른 경우)
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


def count_menus(s):
    """쉼표 기준 메뉴 개수. 빈 문자열이면 0."""
    if not s or not s.strip():
        return 0
    return len([x for x in s.split(',') if x.strip()])


def count_prices(s):
    """쉼표 기준 가격 개수."""
    if not s or not s.strip():
        return 0
    if '#VALUE!' in s or '#REF!' in s:
        return -1  # 엑셀 오류
    return len([x for x in s.split(',') if x.strip()])


def main():
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    ws = wb['Sheet1']

    rows_with_data = []
    rows_empty = []
    mismatches = []
    name_unmapped = []

    for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        zone, name, status, category, menu, price, request, note, *rest = list(row) + [None] * 8
        if not name or not str(name).strip():
            continue
        name = str(name).strip()

        m_count = count_menus(str(menu) if menu else '')
        p_count = count_prices(str(price) if price else '')

        # DB 매핑 확인
        mapped = NAME_MAP.get(name, name)
        in_db = mapped in DB_NAMES

        # 비어있는 케이스
        if m_count == 0 and p_count == 0:
            rows_empty.append((name, mapped, in_db))
            continue

        rows_with_data.append((name, mapped, in_db, m_count, p_count, note))

        # 개수 불일치
        if m_count != p_count:
            mismatches.append((name, mapped, m_count, p_count, note))

        # DB 에 없는 이름
        if not in_db:
            name_unmapped.append((name, mapped))

    # 출력
    print('=' * 60)
    print('메뉴/가격 데이터가 채워진 식당:', len(rows_with_data))
    print('비어있는 식당:', len(rows_empty))
    print('=' * 60)

    print('\n[전체 식당 — 메뉴/가격 개수]')
    print(f'{"엑셀상호명":<18} {"DB명":<22} {"메뉴":>4} {"가격":>4}  비고')
    print('-' * 80)
    for name, mapped, in_db, mc, pc, note in rows_with_data:
        ok = 'OK' if mc == pc else ('VAL' if pc == -1 else 'X')
        db_mark = '' if in_db else '!'
        note_short = (str(note)[:30] + '...') if note and len(str(note)) > 30 else (note or '')
        print(f'{name:<18} {mapped:<22} {mc:>4} {pc:>4}  [{ok}{db_mark}] {note_short}')

    if mismatches:
        print('\n\n[메뉴 vs 가격 개수 불일치] — 임포트 전 수정 필요')
        print(f'{"식당":<22} {"메뉴":>4} {"가격":>4}  비고')
        print('-' * 60)
        for name, mapped, mc, pc, note in mismatches:
            note_short = (str(note)[:40] + '...') if note and len(str(note)) > 40 else (note or '')
            mark = ' (#VALUE!)' if pc == -1 else ''
            print(f'{mapped:<22} {mc:>4} {pc:>4}  {note_short}{mark}')
    else:
        print('\n✓ 메뉴/가격 개수 모두 일치')

    if name_unmapped:
        print('\n\n[DB 에 없는 식당명] — 임포트 시 매칭 실패 예상')
        for name, mapped in name_unmapped:
            print(f'  - 엑셀: {name}  →  매핑: {mapped}')
    else:
        print('\n✓ 모든 식당명이 DB 와 매핑됨')

    print('\n\n[메뉴 비어있는 식당]')
    for name, mapped, in_db in rows_empty:
        db_mark = '' if in_db else ' (DB 없음)'
        print(f'  - {mapped}{db_mark}')


if __name__ == '__main__':
    main()
