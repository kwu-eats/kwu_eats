'use client';

import type { RestaurantListItem } from '@pangchelin/types';

import { useSheetStore } from '@/lib/stores/sheetStore';

import { RestaurantListItem as RestaurantCard } from './RestaurantListItem';

interface Props {
  restaurants: RestaurantListItem[];
  isLoading: boolean;
  isError: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 min-h-[72px]">
      <div className="h-[52px] w-[52px] flex-shrink-0 rounded-lg bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
        <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export function BottomSheetContent({ restaurants, isLoading, isError }: Props) {
  const { snap, setSnap } = useSheetStore();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-ink-muted">
        <p className="text-sm">앗, 잠시 후 다시 시도해주세요</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-ink-muted">
        <p className="text-sm">아직 등록된 식당이 없어요</p>
      </div>
    );
  }

  return (
    <div>
      {/* full 상태: 검색창 */}
      {snap === 'full' && (
        <div className="px-4 pb-2">
          <input
            type="search"
            placeholder="맛있는 식당 찾기"
            className="h-10 w-full rounded-lg bg-muted px-4 text-sm text-ink-body outline-none placeholder:text-ink-subtle"
          />
        </div>
      )}

      {/* peek 상태: 첫 번째 카드 + 더보기 */}
      {snap === 'peek' ? (
        <div>
          <RestaurantCard restaurant={restaurants[0]} />
          {restaurants.length > 1 && (
            <button
              type="button"
              className="w-full pb-3 text-center text-xs text-ink-muted"
              onClick={() => setSnap('half')}
            >
              외 {restaurants.length - 1}개 식당 더보기 ↑
            </button>
          )}
        </div>
      ) : (
        /* half / full 상태: 전체 리스트 */
        <div>
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
