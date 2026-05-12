'use client';

import { useRestaurants } from '@/hooks/queries/useRestaurants';

/**
 * 첫 화면 (필터/선택 없는 peek) 에 노출되는 인사말 + 통계.
 * 광운대 맛집 가이드 브랜드를 첫인상에 짧게 노출.
 *
 * 통계는 지도 가시 영역과 무관한 '전체' 기준 — 화면 줌/이동에 따라
 * 숫자가 바뀌면 의미가 약해지므로 useRestaurants() 결과(API 응답)를
 * 직접 사용. fresh entry 상태에서만 호출되므로 filter 도 없는 상태.
 */
export function WelcomeStats() {
  const { data: restaurants = [] } = useRestaurants();
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
