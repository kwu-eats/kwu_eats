// public/restaurants/*.jpg 파일명을 스캔해 lib/restaurantImages.generated.ts 를 생성한다.
// 정적 썸네일 후보(/restaurants/{name}.jpg)를 실제 존재하는 파일로만 제한하기 위함.
// build 전에 자동 실행됨 (package.json 의 build 스크립트 참고).
import { readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(here, '..', 'public', 'restaurants');
const outFile = join(here, '..', 'lib', 'restaurantImages.generated.ts');

const stems = readdirSync(imagesDir)
  .filter((f) => f.toLowerCase().endsWith('.jpg'))
  .map((f) => f.slice(0, -'.jpg'.length))
  .sort((a, b) => a.localeCompare(b, 'ko'));

const body = stems.map((s) => `  ${JSON.stringify(s)},`).join('\n');
const content = `// AUTO-GENERATED — 직접 편집하지 마세요.
// \`node scripts/gen-restaurant-images.mjs\` (build 시 자동 실행) 로 재생성됩니다.
// public/restaurants/*.jpg 의 파일명(확장자 제외) 목록.
// 정적 썸네일 후보를 "실제 존재하는 파일"로만 제한해, 사진 없는 식당이
// /restaurants/{name}.jpg 로 404 요청을 보내는 것을 막는다 (없으면 바로 이모지 폴백).
export const RESTAURANT_IMAGE_NAMES: ReadonlySet<string> = new Set([
${body}
]);
`;

writeFileSync(outFile, content, 'utf8');
console.log(`[gen-restaurant-images] ${stems.length}개 이미지 → ${outFile}`);
