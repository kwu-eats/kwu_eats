"""
public/restaurants/ 의 이미지 파일명을 일괄 정리.
- "X.jpg의 사본.jpg" 형식의 suffix 제거
- 일부 파일명을 DB 식당명에 맞춰 rename
- 중복 파일 삭제
- 한글 NFD/NFC 정규화 차이 우회 (Python os.listdir 후 NFC 비교)
"""
import os
import sys
import unicodedata

BASE = os.path.join(os.path.dirname(__file__), '..', '..', 'apps', 'web', 'public', 'restaurants')
BASE = os.path.normpath(BASE)

if not os.path.isdir(BASE):
    print(f"❌ 디렉토리 없음: {BASE}")
    sys.exit(1)

# Step 1: 모든 파일명을 NFC 정규화 (필요한 경우 rename)
print(f"== {BASE} 안 파일 NFC 정규화 ==")
normalized = 0
for fname in os.listdir(BASE):
    nfc = unicodedata.normalize('NFC', fname)
    if fname != nfc:
        src = os.path.join(BASE, fname)
        dst = os.path.join(BASE, nfc)
        os.rename(src, dst)
        normalized += 1
print(f"  정규화 {normalized}개")

# 이후 모든 비교는 NFC 기준

# Step 2: 삭제할 중복 파일
to_delete = [
    'OSSE Coffee(2).jpg',
    '장수국수(1).jpg',
]

# Step 3: rename 매핑 (현재 파일명 → 최종 DB 이름)
# 사본 suffix 가 붙은 것도 여기서 한 번에 처리
renames = {
    # 사본 suffix 정리 + DB 명 매핑
    '1일1잔.jpg의 사본.jpg': '1일1잔.jpg',
    '5일장 햄버거.jpg의 사본.jpg': '5일장 햄버거.jpg',
    'CAFE FIASCO.jpg의 사본.jpg': 'CAFE FIASCO.jpg',
    'CORD Jr..jpg의 사본.jpg': 'CORD Jr..jpg',
    'DAYLONG COFFEE.jpg의 사본.jpg': '데이롱카페 광운대점.jpg',
    'OSSE Coffee.jpg': '오쎄.jpg',
    'PHO LEO.jpg의 사본.jpg': '포 레오.jpg',
    'Pas_mal.jpg의 사본.jpg': '빠말.jpg',
    '경대컵밥(한식밥상).jpg의 사본.jpg': '경대컵밥 광운대점.jpg',
    '국수천왕.jpg의 사본.jpg': '국수천왕 광운대점.jpg',
    '기사식당.jpg의 사본.jpg': '용기사 식당.jpg',
    '꽃제비칼국수.jpg의 사본.jpg': '꽃제비칼국수.jpg',
    '목포홍탁.jpg의 사본.jpg': '목포홍탁.jpg',
    '미식성.jpg의 사본.jpg': '미식성.jpg',
    '밥은화.jpg의 사본.jpg': '밥은화 광운대본점.jpg',
    '별난주점.jpg의 사본.jpg': '별난주점 광운대점.jpg',
    '서선생김치찜.jpg의 사본.jpg': '서선생김치찜.jpg',
    '소담밥상.jpg의 사본.jpg': '소담밥상.jpg',
    '아, 그집.jpg의 사본.jpg': '아 그집.jpg',
    '우우즈 베이커리.jpg의 사본.jpg': '우우즈베이커리.jpg',
    '이층집.jpg의 사본.jpg': '이층집.jpg',
    '일심해장국.jpg의 사본.jpg': '일심해장국 월계점.jpg',
    '천년초칼국수.jpg의 사본.jpg': '천년초우리밀칼국수.jpg',
    '청계빨간집.jpg의 사본.jpg': '청계 빨간집.jpg',
    '카페 베르데.jpg의 사본.jpg': '카페베르데.jpg',
    '튀맥(Tui Mac).jpg의 사본.jpg': '튀맥.jpg',
    '하이레(HAIRE).jpg의 사본.jpg': '하이레.jpg',
    '한그릇.jpg의 사본.jpg': '한그릇.jpg',
    '한라산감자탕.jpg의 사본.jpg': '한라산감자탕.jpg',
    '후문식당.jpg의 사본.jpg': '후문식당.jpg',
    # 그 외 단순 이름들
    '고씨네.jpg': '고씨네 광운대점.jpg',
    '디델리.jpg': '디델리 광운대점.jpg',
    '로스 2000.jpg': '로스2000.jpg',
    '마루덮밥.jpg': '마루.jpg',
    '민들레밥상.jpg': '민들레국시.jpg',
    '샐러리아.jpg': '샐러리아 광운대점.jpg',
    '썬더치킨.jpg': '썬더치킨 광운대점.jpg',
    '영축산.jpg': '영축산정육식당.jpg',
    '일심텐동(1).jpg': '일심텐동 광운대점.jpg',
    '장수국수.jpg': '장수국수 광운대점.jpg',
    '전설의 멸치국수.jpg': '전설의멸치국수 월계점.jpg',
    '전주밥상.jpg': '전주밥상쌈밥.jpg',
    '중화호반닭갈비.jpg': '중화호반닭갈비 광운대점.jpg',
    '지지고.jpg': '지지고 광운대점.jpg',
    '카츠백.jpg': '카츠백 월계점.jpg',
    '큰집닭강정.jpg': '큰집닭강정 광운대점.jpg',
    '프랭크버거.jpg': '프랭크버거 광운대점.jpg',
    '한끼철판.jpg': '한끼철판 광운대점.jpg',
    '화로상회.jpg': '화로상회 광운대점.jpg',
}

# Step 4: 삭제 먼저
print("\n== 중복 삭제 ==")
for fname in to_delete:
    path = os.path.join(BASE, fname)
    if os.path.exists(path):
        os.remove(path)
        print(f"  [DEL]{fname}")
    else:
        print(f"  - {fname} (없음, skip)")

# Step 5: rename
print("\n== rename ==")
done = 0
skipped = 0
for src_name, dst_name in renames.items():
    src = os.path.join(BASE, src_name)
    dst = os.path.join(BASE, dst_name)
    if not os.path.exists(src):
        print(f"  - {src_name} → {dst_name} (소스 없음, skip)")
        skipped += 1
        continue
    if src_name == dst_name:
        # 같은 이름이라 rename 불필요
        continue
    if os.path.exists(dst):
        print(f"  [SKIP]{src_name} → {dst_name} (target 이미 존재, skip)")
        skipped += 1
        continue
    os.rename(src, dst)
    print(f"  [OK]{src_name} → {dst_name}")
    done += 1

print(f"\n== 완료 ==")
print(f"rename: {done}개 / skip: {skipped}개")
print(f"최종 파일 수: {len(os.listdir(BASE))}")
