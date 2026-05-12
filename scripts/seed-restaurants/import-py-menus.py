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
    '민들레밥상': '민들레뜨락2',
    '또와순대국': '또와집순대국',
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
    for _, db_name, item in all_menus:
        name, price, category, price_options = item
        sql.append(
            'INSERT INTO "Menu" (id, "restaurantId", name, price, category, '
            '"priceOptions", "isSignature", "createdAt", "updatedAt") '
            f'SELECT gen_random_uuid()::text, r.id, {to_sql_text(name)}, {price}, '
            f'{to_sql_text(category)}, {to_sql_json(price_options)}, false, '
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
    print(f'\nNAME_MAP 매핑:')
    for k, v in NAME_MAP.items():
        print(f'  {k} -> {v}')


if __name__ == '__main__':
    main()
