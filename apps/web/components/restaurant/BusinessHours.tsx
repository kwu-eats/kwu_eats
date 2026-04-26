import type { BusinessHoursMap } from '@pangchelin/types';

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_LABEL: Record<string, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
};

// 0=일 1=월 ... 6=토  →  mon/tue/.../sun
const TODAY_KEY = DAY_KEYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

interface Props {
  hours: BusinessHoursMap;
}

export function BusinessHours({ hours }: Props) {
  const todayHours = hours[TODAY_KEY];
  const todaySummary = todayHours?.closed
    ? '오늘은 쉬어요'
    : todayHours?.open && todayHours?.close
      ? `오늘은 ${todayHours.close}까지`
      : null;

  return (
    <div className="space-y-3">
      <h2 className="text-base font-body font-semibold text-ink-primary">영업시간</h2>

      {todaySummary && (
        <p className="text-sm font-body text-primary-500 font-medium">{todaySummary}</p>
      )}

      <table className="w-full text-sm font-body">
        <tbody className="divide-y divide-border">
          {DAY_KEYS.map((key) => {
            const h = hours[key];
            const isToday = key === TODAY_KEY;
            return (
              <tr
                key={key}
                className={isToday ? 'text-ink-primary font-medium' : 'text-ink-muted'}
              >
                <td className="py-2 w-8">{DAY_LABEL[key]}</td>
                <td className="py-2">
                  {!h || h.closed ? (
                    <span className="text-ink-subtle">쉬어요</span>
                  ) : h.open && h.close ? (
                    `${h.open} ~ ${h.close}`
                  ) : (
                    <span className="text-ink-subtle">정보 없음</span>
                  )}
                </td>
                {isToday && (
                  <td className="py-2 text-right">
                    <span className="text-xs text-primary-500">오늘</span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
