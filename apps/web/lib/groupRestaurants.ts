import type { RestaurantListItem } from '@pangchelin/types';

/**
 * 같은 건물에 있는 식당을 좌표 기준으로 묶기.
 * 약 11m tolerance — 카카오 지오코딩이 같은 건물에 동일 좌표를 주는 경우가
 * 대부분이라 이 정도면 충분.
 *
 * 그룹은 입력 순서를 보존 (첫 번째 식당이 그룹 anchor).
 */
const COORD_TOLERANCE = 0.0001; // 약 11m

export interface RestaurantGroup {
  /** anchor 좌표 (그룹 내 첫 식당의 좌표) */
  lat: number;
  lng: number;
  restaurants: RestaurantListItem[];
}

export function groupRestaurantsByLocation(
  restaurants: RestaurantListItem[],
): RestaurantGroup[] {
  const groups: RestaurantGroup[] = [];
  for (const r of restaurants) {
    const existing = groups.find(
      (g) =>
        Math.abs(g.lat - r.latitude) < COORD_TOLERANCE &&
        Math.abs(g.lng - r.longitude) < COORD_TOLERANCE,
    );
    if (existing) {
      existing.restaurants.push(r);
    } else {
      groups.push({
        lat: r.latitude,
        lng: r.longitude,
        restaurants: [r],
      });
    }
  }
  return groups;
}
