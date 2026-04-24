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
