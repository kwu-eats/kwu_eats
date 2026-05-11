/**
 * 다음 영업 시작 시각 (ISO datetime UTC) 을 KST 기준 친근한 한국어 문자열로 변환.
 *
 * - 오늘 안 → "18:00 오픈" (오후 6시 같은 형태도 가능했지만 일관성 위해 HH:mm)
 * - 내일 → "내일 09:00 오픈"
 * - 그 이후 → "수요일 11:00 오픈"
 */
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function formatNextOpen(nextOpenAt: string | null): string {
  if (!nextOpenAt) return '';
  const target = new Date(nextOpenAt);
  if (Number.isNaN(target.getTime())) return '';

  // KST 기준 비교를 위해 둘 다 +9h 시프트 (UTC 메서드가 KST 값 반환하도록)
  const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const targetKst = new Date(target.getTime() + 9 * 60 * 60 * 1000);

  const hh = String(targetKst.getUTCHours()).padStart(2, '0');
  const mm = String(targetKst.getUTCMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;

  // 같은 KST 날짜(yyyy-mm-dd) 비교 — 자정 넘어가는 케이스를 일별로 판정
  const sameDay = (a: Date, b: Date) =>
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate();

  if (sameDay(nowKst, targetKst)) return `${timeStr} 오픈`;

  const tomorrow = new Date(nowKst);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  if (sameDay(tomorrow, targetKst)) return `내일 ${timeStr} 오픈`;

  const dayName = DAY_LABELS[targetKst.getUTCDay()];
  return `${dayName}요일 ${timeStr} 오픈`;
}
