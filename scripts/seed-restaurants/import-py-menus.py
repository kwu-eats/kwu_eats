"""
Python 메뉴 데이터 파일 (kwoondae/frontgate/backgate _menus.py) → DB Menu 일괄 임포트.

- 각 zone 별 dict 키 = DB Restaurant.name (정확히 일치해야 함)
- name mismatch 는 NAME_MAP 에서 보정
- 기존 Menu 는 식당 단위로 DELETE 후 INSERT (멱등 보장)
- category, priceOptions 도 함께 입력

실행:
    python -X utf8 scripts/seed-restaurants/import-py-menus.py
출력:
    scripts/seed-restaurants/py-menus-import.sql
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(__file__))

from kwoondae_menus import KWOONDAE_MENUS  # noqa: E402
from frontgate_menus import FRONTGATE_MENUS  # noqa: E402
from backgate_menus import BACKGATE_MENUS  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), 'py-menus-import.sql')

# Python 파일 키 → DB Restaurant.name 매핑 (불일치 시만 등록)
NAME_MAP = {
    # frontgate_menus.py 입력 시점에 잘못 적은 키
    '또와순대국': '또와집순대국',
}

# DB Restaurant.name → 대표 메뉴 이름 (정확히 일치하는 Menu 1개를 isSignature=true 로 마킹).
# 리스트 카드의 featuredMenu 는 isSignature 우선 → createdAt asc 로 결정되므로
# 식당당 1개만 지정한다. 메뉴명은 (수정 반영 후) frontgate_menus.py 의 실제 이름과 일치해야 함.
SIGNATURE_MENUS = {
    '그옛날1947왕만두': '고기왕만두 (5개)',
    '맛불': '고추장불백 (순한맛)',
    '민들레국시': '민들레 비빔국수',
    '민들레뜨락2': '삼겹살 김치 볶음밥',
    '부리또잇': '소세지 부리또',
    '수해복마라탕 광운대점': '마라탕 (100g)',
    '영축산정육식당': '돼지한마리 (600g)',
    '전설의멸치국수 월계점': '멸치국수',
    '진미통닭': '후라이드 (大/中)',
    '푸른스시': '오늘의 초밥 11pcs',
    '또와집순대국': '순대국',
    '신연마라탕': '마라탕 (100g)',
    '중화호반닭갈비 광운대점': '닭갈비',
    '더진국 광운대점': '더진국 수육국밥',
    '카츠백 월계점': '등심카츠',
    '화로상회 광운대점': '2시간 무제한 (5-7세/8-13세/14세 이상)',
    '굿킨 광운대점': '후라이드치킨 (뼈/순살)',
    '일심텐동 광운대점': '일심텐동',
    '광운커피': '아메리카노',
    '한끼철판 광운대점': '제육 철판 (2인 이상)',
    '팔팔전어횟집': '부대찌개 (2인/3인/4인 — 공기밥 포함)',
    '마루덮밥': '참치마요',
    '지지고 광운대점': '나이스 라이스 (NICE RICE)',
    '디델리 광운대점': '퓨전라볶이 (매운맛 1-3단계 선택)',
    '윤스쿡': '광운대 돈가스 (등심+치즈 200g 이상)',
    '재리스토스트&빙수바보빙식이 광운대점': '빙식이 팥 눈꽃빙수',
    '장수국수 광운대점': '얼큰 칼국수',
    '진심카츠': '더블진심카츠',
    '로스2000': '허브삼겹살 (네덜란드·스페인 200g)',
    '오쎄': '토스트',
    '큰집닭강정 광운대점': '닭강정 (맛 9종 - 매운/중간매운/약간매운/순한/간장/치즈/허니버터/순살후라이드/뿌링클)',
    '고씨네 광운대점': '닭튀김카레',
    '전주밥상쌈밥': '불고기쌈밥',
    # backgate (2026-05-28 batch-2)
    '쉐프밥버거 광운대점': '쉐프 (참치마요, 볶음김치)',
    '빠말': '휘낭시에 (단품)',
    '청계 빨간집': '미나리 순살 닭도리탕',
    '튀맥': '삼겹 두부김치',
    '한라산감자탕': '감자탕 (소/중/대)',
    '포 레오': '포레오쌀국수',
    '데이롱카페 광운대점': '아메리카노',
    '별난주점 광운대점': '치킨 앤 피자 (고르곤졸라피자 + 베라치킨)',
    '꽃제비칼국수': '어묵칼국수',
    'CORD Jr.': '아메리카노',
    '후문식당': '순두부찌개',
    '월계돈': '삼겹살 (180g)',
    '갤러리eat': '삼겹된장찌개',
}


def sql_escape(s: str) -> str:
    return s.replace("'", "''")


def to_sql_json(value) -> str:
    """priceOptions (list[dict]) → PostgreSQL JSONB 리터럴."""
    if value is None:
        return 'NULL'
    return "'" + sql_escape(json.dumps(value, ensure_ascii=False)) + "'::jsonb"


def to_sql_text(value) -> str:
    if value is None:
        return 'NULL'
    return "'" + sql_escape(str(value)) + "'"


def main():
    all_menus = []  # [(zone, db_name, menu_tuple), ...]
    for py_name, items in KWOONDAE_MENUS.items():
        db_name = NAME_MAP.get(py_name, py_name)
        for it in items:
            all_menus.append(('KWANGWOON_STATION', db_name, it))
    for py_name, items in FRONTGATE_MENUS.items():
        db_name = NAME_MAP.get(py_name, py_name)
        for it in items:
            all_menus.append(('FRONT_GATE', db_name, it))
    for py_name, items in BACKGATE_MENUS.items():
        db_name = NAME_MAP.get(py_name, py_name)
        for it in items:
            all_menus.append(('BACK_GATE', db_name, it))

    # 대상 식당 목록 (중복 제거)
    target_restaurants = sorted({(zone, name) for zone, name, _ in all_menus})

    sql = ['BEGIN;', '']

    # 1) 기존 Menu 일괄 삭제 (멱등)
    sql.append('-- 대상 식당의 기존 Menu 삭제 (멱등)')
    for _, name in target_restaurants:
        sql.append(
            f'DELETE FROM "Menu" WHERE "restaurantId" IN '
            f"(SELECT id FROM \"Restaurant\" WHERE name = '{sql_escape(name)}');"
        )
    sql.append('')

    # 2) 새 Menu INSERT (category, priceOptions 포함)
    # createdAt 을 clock_timestamp() 로 — row 별로 마이크로초 단위 차이를 줘서
    # 입력 순서(첫 메뉴 = 대표) 를 createdAt asc 정렬로 복원 가능.
    sql.append('-- 메뉴 INSERT (createdAt = clock_timestamp 으로 입력 순서 보존)')
    insert_count = 0
    signature_count = 0
    for _, db_name, item in all_menus:
        name, price, category, price_options = item
        is_signature = 'true' if SIGNATURE_MENUS.get(db_name) == name else 'false'
        if is_signature == 'true':
            signature_count += 1
        sql.append(
            'INSERT INTO "Menu" (id, "restaurantId", name, price, category, '
            '"priceOptions", "isSignature", "createdAt", "updatedAt") '
            f'SELECT gen_random_uuid()::text, r.id, {to_sql_text(name)}, {price}, '
            f'{to_sql_text(category)}, {to_sql_json(price_options)}, {is_signature}, '
            'clock_timestamp(), clock_timestamp() '
            f"FROM \"Restaurant\" r WHERE r.name = '{sql_escape(db_name)}';"
        )
        insert_count += 1

    # 3) 검증 쿼리
    sql.append('')
    sql.append('-- 검증: 메뉴 수가 0 인 대상 식당이 있으면 알림 (NAME 불일치 의심)')
    sql.append('SELECT r.name, r.zone FROM "Restaurant" r')
    sql.append('WHERE r.name IN (')
    sql.append(',\n'.join(f"  '{sql_escape(name)}'" for _, name in target_restaurants))
    sql.append(') AND NOT EXISTS (SELECT 1 FROM "Menu" m WHERE m."restaurantId" = r.id);')
    sql.append('')

    sql.append('COMMIT;')

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql))

    print(f'OUT: {OUT}')
    print(f'﻿대상 식당: {len(target_restaurants)}개')
    print(f'메뉴 INSERT: {insert_count}개')
    print(f'대표(isSignature) 마킹: {signature_count}개')
    print(f'\nNAME_MAP 매핑:')
    for k, v in NAME_MAP.items():
        print(f'  {k} -> {v}')

    # 대표 메뉴명이 실제 메뉴와 안 맞으면(오타 등) 마킹이 0 개가 되므로 경고.
    present = {(db_name, item[0]) for _, db_name, item in all_menus}
    unmatched = [
        (db_name, menu_name)
        for db_name, menu_name in SIGNATURE_MENUS.items()
        if (db_name, menu_name) not in present
    ]
    if unmatched:
        print('\n⚠️  대표 메뉴 이름이 메뉴 목록과 불일치 (마킹 안 됨):')
        for db_name, menu_name in unmatched:
            print(f'  [{db_name}] {menu_name!r}')


if __name__ == '__main__':
    main()
