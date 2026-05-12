"""
apps/web/public/restaurants/ 의 모든 .jpg 파일을
DB 의 동일 이름 Restaurant 의 coverImageUrl 로 설정하는 SQL 생성.

URL 은 한글·공백·특수문자를 URL 인코딩해서 저장 (브라우저 호환).
"""
import os
import urllib.parse

BASE = os.path.join(os.path.dirname(__file__), '..', '..', 'apps', 'web', 'public', 'restaurants')
BASE = os.path.normpath(BASE)

OUT = os.path.join(os.path.dirname(__file__), 'cover-images-update.sql')

with open(OUT, 'w', encoding='utf-8') as f:
    f.write('-- ============================================================\n')
    f.write('-- 대표 사진(coverImageUrl) 일괄 적용\n')
    f.write('-- ============================================================\n')
    f.write('-- public/restaurants/ 의 *.jpg 파일명을 DB Restaurant.name 으로 매칭.\n')
    f.write('-- 파일명 = DB name 가정 (사전에 rename-images.py 로 정리됨).\n')
    f.write('-- ============================================================\n\n')
    f.write('BEGIN;\n\n')

    count = 0
    for fname in sorted(os.listdir(BASE)):
        if not fname.lower().endswith('.jpg'):
            continue
        # 파일명에서 .jpg 떼고 DB Restaurant.name 으로 사용
        name_stem = fname[:-4]
        # 브라우저 호환을 위해 URL 인코딩 (공백·&·괄호·한글 모두)
        encoded = urllib.parse.quote(fname)
        url = f'/restaurants/{encoded}'
        # SQL 단일따옴표 escape
        name_sql = name_stem.replace("'", "''")
        f.write(
            f'UPDATE "Restaurant" SET "coverImageUrl" = \'{url}\', "updatedAt" = NOW() '
            f'WHERE name = \'{name_sql}\';\n'
        )
        count += 1

    f.write('\n-- 검증\n')
    f.write('SELECT COUNT(*) AS cover_image_set_count FROM "Restaurant" WHERE "coverImageUrl" IS NOT NULL;\n')
    f.write('\nCOMMIT;\n')

print(f'생성된 UPDATE: {count}개')
print(f'출력 파일: {OUT}')
