'use client';

import type { RestaurantListItem } from '@pangchelin/types';

interface Props {
  /** 가시 영역 내 식당 (또는 전체 — 호출 측 결정) */
  restaurants: RestaurantListItem[];
}

/**
 * 첫 화면 (필터/선택 없는 peek) 에 노출되는 인사말 + 통계.
 * 광운대 맛집 가이드 브랜드를 첫인상에 짧게 노출.
 */
export function WelcomeStats({ restaurants }: Props) {
  const openCount = restaurants.filter((r) => r.isOpen).length;
  const partnerCount = restaurants.filter((r) => r.isPartner).length;

  return (
    <div className="px-4 pb-3 pt-2">
      <p className="text-[15px] font-semibold text-ink-primary">
        팡슐랭에 오신 걸 환영해요 🍽
      </p>
      <p className="mt-0.5 text-xs text-ink-muted">
        지금 영업중{' '}
        <span className="font-semibold text-primary-500">{openCount}</span>개 · 제휴{' '}
        <span className="font-semibold text-primary-500">{partnerCount}</span>개
      </p>
    </div>
  );
}
