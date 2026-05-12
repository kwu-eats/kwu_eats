"""
apps/web/public/restaurants/*.jpg 를 웹용으로 일괄 압축.

- 최대 폭 1200px (Hero 캐러셀 + 리스트 썸네일 양쪽 커버)
- JPEG 품질 80 + progressive
- EXIF orientation 반영 후 EXIF 메타 제거 (개인정보·용량 둘 다 줄임)

멱등 보장: 이미 1200px 이하이면 그대로 두고 재인코딩만 수행.
"""
import os
import sys
from PIL import Image, ImageOps

# 콘솔 utf-8
sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.join(os.path.dirname(__file__), '..', '..', 'apps', 'web', 'public', 'restaurants')
MAX_WIDTH = 1200
QUALITY = 80


def fmt(n: int) -> str:
    for u in ('B', 'KB', 'MB'):
        if n < 1024:
            return f'{n:.1f}{u}'
        n /= 1024
    return f'{n:.1f}GB'


def main():
    files = sorted(f for f in os.listdir(ROOT) if f.lower().endswith(('.jpg', '.jpeg')))
    total_before = 0
    total_after = 0

    for f in files:
        path = os.path.join(ROOT, f)
        before = os.path.getsize(path)
        total_before += before

        try:
            img = Image.open(path)
            # EXIF orientation 회전 적용
            img = ImageOps.exif_transpose(img)
            # 폭 기준 리사이즈
            if img.width > MAX_WIDTH:
                ratio = MAX_WIDTH / img.width
                new_h = int(img.height * ratio)
                img = img.resize((MAX_WIDTH, new_h), Image.LANCZOS)
            # RGB 보장 (RGBA·P 모드 대비)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            img.save(path, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
        except Exception as e:
            print(f'[FAIL] {f}: {e}')
            continue

        after = os.path.getsize(path)
        total_after += after
        ratio_pct = (1 - after / before) * 100 if before else 0
        print(f'  {f:<50} {fmt(before):>8} -> {fmt(after):>8}  (-{ratio_pct:.0f}%)')

    print()
    print(f'TOTAL {fmt(total_before)} -> {fmt(total_after)} '
          f'(-{(1 - total_after/total_before)*100:.0f}%, '
          f'{len(files)} files)')


if __name__ == '__main__':
    main()
