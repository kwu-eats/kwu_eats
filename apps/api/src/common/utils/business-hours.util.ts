type DayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

interface DayHours {
  open?: string;
  close?: string;
  closed?: boolean;
}

type BusinessHoursMap = Partial<Record<DayKey, DayHours>>;

const DAY_KEYS: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function isRestaurantOpen(businessHours: unknown): boolean {
  if (!businessHours || typeof businessHours !== 'object') return false;

  const hours = businessHours as BusinessHoursMap;

  // KST = UTC+9
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const dayKey = DAY_KEYS[now.getUTCDay()];
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  const currentTime = `${hh}:${mm}`;

  const today = hours[dayKey];
  if (!today || today.closed || !today.open || !today.close) return false;

  return currentTime >= today.open && currentTime <= today.close;
}

/**
 * 다음 영업 시작 시각을 ISO datetime (UTC) 으로 반환.
 * 오늘이면 오늘 남은 시간 / 마감 후라면 다음 영업일.
 * 7일 안에 영업 시작이 없으면 null.
 *
 * 호출 시 이미 영업 중인지 별도로 체크하지 않으니, 호출 측에서 isRestaurantOpen
 * 으로 분기 후 사용.
 */
export function getNextOpenAt(businessHours: unknown): string | null {
  if (!businessHours || typeof businessHours !== 'object') return null;
  const hours = businessHours as BusinessHoursMap;

  // nowKst — UTC 메서드를 호출하면 KST 값이 나오도록 +9h 시프트한 Date
  const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000);

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const candidate = new Date(nowKst);
    candidate.setUTCDate(candidate.getUTCDate() + dayOffset);

    const dayKey = DAY_KEYS[candidate.getUTCDay()];
    const day = hours[dayKey];
    if (!day || day.closed || !day.open) continue;

    const [oh, om] = day.open.split(':').map(Number);
    if (Number.isNaN(oh) || Number.isNaN(om)) continue;
    candidate.setUTCHours(oh, om, 0, 0);

    // 오늘이고 이미 영업 시작 시각이 지났으면 skip
    if (dayOffset === 0 && candidate <= nowKst) continue;

    // candidate 는 KST 시각을 UTC 로 표현한 것이라 실제 UTC 로 -9h 보정
    const actualUtc = new Date(candidate.getTime() - 9 * 60 * 60 * 1000);
    return actualUtc.toISOString();
  }

  return null;
}
