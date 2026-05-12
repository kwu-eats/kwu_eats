type DayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

interface DayHours {
  open?: string;
  close?: string;
  closed?: boolean;
  breakStart?: string;
  breakEnd?: string;
}

type BusinessHoursMap = Partial<Record<DayKey, DayHours>>;

const DAY_KEYS: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function kstNow(): Date {
  // UTC 메서드 호출 시 KST 값이 나오도록 +9h 시프트
  return new Date(Date.now() + 9 * 60 * 60 * 1000);
}

function timeStr(d: Date): string {
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * 영업 중 여부 판정.
 *
 * 지원하는 형태:
 * - 일반: open ≤ now ≤ close
 * - 자정 넘김: close < open (예: 14:30 ~ 02:30) — 자정 이후 시간은 0X 시로 표기
 *   · 어제의 close 가 오늘 새벽이면 그 구간도 영업중으로 인정
 * - 브레이크: breakStart ≤ now < breakEnd 구간은 영업 중에 있어도 false
 */
export function isRestaurantOpen(businessHours: unknown): boolean {
  if (!businessHours || typeof businessHours !== 'object') return false;
  const hours = businessHours as BusinessHoursMap;

  const now = kstNow();
  const todayIdx = now.getUTCDay();
  const yesterdayIdx = (todayIdx + 6) % 7;
  const t = timeStr(now);

  // 어제 영업이 자정 넘어 오늘 새벽까지 이어진 경우
  const yesterday = hours[DAY_KEYS[yesterdayIdx]];
  if (
    yesterday &&
    !yesterday.closed &&
    yesterday.open &&
    yesterday.close &&
    yesterday.close < yesterday.open && // 자정 넘김
    t <= yesterday.close
  ) {
    return true;
  }

  // 오늘 영업
  const today = hours[DAY_KEYS[todayIdx]];
  if (!today || today.closed || !today.open || !today.close) return false;

  // 오늘 영업 시간 내인지 (일반 vs 자정 넘김 분기)
  const inHours =
    today.close < today.open
      ? t >= today.open // 오늘 open ~ 23:59 까지 영업중 (자정 이후는 위 yesterday 분기로 처리)
      : t >= today.open && t <= today.close;

  if (!inHours) return false;

  // 브레이크 중이면 영업 중이 아님
  if (today.breakStart && today.breakEnd) {
    if (t >= today.breakStart && t < today.breakEnd) return false;
  }

  return true;
}

/**
 * 다음 영업 시작 시각을 ISO datetime (UTC) 으로 반환.
 * 마감 상태 / 휴무일 / 브레이크 중일 때의 "다음 열림 시각" 을 계산.
 * 7일 안에 영업 시작이 없으면 null.
 */
export function getNextOpenAt(businessHours: unknown): string | null {
  if (!businessHours || typeof businessHours !== 'object') return null;
  const hours = businessHours as BusinessHoursMap;

  const nowKst = kstNow();
  const nowT = timeStr(nowKst);

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const candidate = new Date(nowKst);
    candidate.setUTCDate(candidate.getUTCDate() + dayOffset);

    const dayKey = DAY_KEYS[candidate.getUTCDay()];
    const day = hours[dayKey];
    if (!day || day.closed || !day.open) continue;

    // 후보 시각 목록: open 시작 / 브레이크 종료
    const candidateTimes: string[] = [day.open];
    if (day.breakStart && day.breakEnd) candidateTimes.push(day.breakEnd);

    for (const targetT of candidateTimes.sort()) {
      // 오늘이면 미래 시각만 허용
      if (dayOffset === 0 && targetT <= nowT) continue;

      const [hh, mm] = targetT.split(':').map(Number);
      if (Number.isNaN(hh) || Number.isNaN(mm)) continue;

      const next = new Date(candidate);
      next.setUTCHours(hh, mm, 0, 0);

      // KST 표현을 실제 UTC 로 변환 (-9h)
      const actualUtc = new Date(next.getTime() - 9 * 60 * 60 * 1000);
      return actualUtc.toISOString();
    }
  }

  return null;
}
