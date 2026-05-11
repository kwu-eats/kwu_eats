import type { RestaurantWithRelations } from '@pangchelin/types';
import { Info, MapPin, Phone } from 'lucide-react';

import { formatNextOpen } from '@/lib/formatNextOpen';

const ZONE_LABEL: Record<string, string> = {
  KWANGWOON_STATION: '광운대역',
  FRONT_GATE: '정문',
  BACK_GATE: '후문',
  UICHEON: '우이천',
};

interface Props {
  restaurant: RestaurantWithRelations;
}

export function RestaurantInfo({ restaurant }: Props) {
  const businessHoursNote =
    typeof (restaurant.businessHours as { note?: unknown })?.note === 'string'
      ? ((restaurant.businessHours as { note: string }).note || '').trim()
      : '';

  return (
    <div className="space-y-3">
      {/* 이름 + 배지 */}
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-display text-ink-primary leading-tight">
          {restaurant.name}
        </h1>
        {restaurant.isPartner && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-medium bg-accent-100 text-accent-600">
            제휴
          </span>
        )}
        <span
          className={[
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-medium',
            restaurant.isOpen
              ? 'bg-[var(--color-success-bg)] text-[var(--color-success-dark)]'
              : 'bg-muted text-ink-muted',
          ].join(' ')}
        >
          {restaurant.isOpen
            ? '영업중'
            : `오늘은 끝났어요 · ${formatNextOpen(restaurant.nextOpenAt) || '내일 다시 와주세요'}`}
        </span>
      </div>

      {/* 카테고리 · 구역 */}
      <p className="text-sm font-body text-ink-muted">
        {restaurant.categories.map((c) => c.name).join(' · ')}
        {restaurant.categories.length > 0 && ' · '}
        {ZONE_LABEL[restaurant.zone]}
      </p>

      {/* 주소 */}
      <div className="flex items-start gap-2 text-sm font-body text-ink-body">
        <MapPin size={16} strokeWidth={1.75} className="mt-0.5 flex-shrink-0 text-ink-muted" />
        <span>{restaurant.address}</span>
      </div>

      {/* 전화번호 */}
      {restaurant.phone && (
        <a
          href={`tel:${restaurant.phone}`}
          className="flex items-center gap-2 text-sm font-body text-primary-500 min-h-touch"
        >
          <Phone size={16} strokeWidth={1.75} className="flex-shrink-0" />
          <span>{restaurant.phone}</span>
        </a>
      )}

      {/* 영업시간 비고 — 격주 휴무 등 정형화 못 한 정보 */}
      {businessHoursNote && (
        <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm font-body text-ink-body">
          <Info size={16} strokeWidth={1.75} className="mt-0.5 flex-shrink-0 text-ink-muted" />
          <span>{businessHoursNote}</span>
        </div>
      )}
    </div>
  );
}
