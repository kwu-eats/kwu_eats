'use client';

import type { RestaurantListItem } from '@pangchelin/types';
import { RotateCcw } from 'lucide-react';

import { CategoryChipsBar } from '@/components/filters/CategoryChipsBar';
import { useFilterStore } from '@/lib/stores/filterStore';
import { useSheetStore } from '@/lib/stores/sheetStore';

import { RestaurantListItem as RestaurantCard } from './RestaurantListItem';
import { WelcomeStats } from './WelcomeStats';

interface Props {
  restaurants: RestaurantListItem[];
  isLoading: boolean;
  isError: boolean;
  // 필터/검색은 비어있지 않은데 지도 가시 영역 안에만 0건일 때 안내 메시지 분기
  hasMoreOutsideView?: boolean;
  // 지도 마커를 눌러 선택한 식당 id — 리스트에서 강조 표시
  selectedId?: string | null;
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

export function BottomSheetContent({
  restaurants,
  isLoading,
  isError,
  hasMoreOutsideView,
  selectedId,
}: Props) {
  const { snap, setSnap } = useSheetStore();
  const { zones, categoryIds, isOpen, maxPrice, reset } = useFilterStore();
  const hasActiveFilters =
    zones.length > 0 || categoryIds.length > 0 || isOpen || maxPrice !== null;

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
    if (hasMoreOutsideView) {
      return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-ink-muted">
          <p className="text-sm font-medium text-ink-body">
            이 화면 안에는 식당이 없어요
          </p>
          <p className="mt-1 text-xs">지도를 움직이거나 줌을 줄여 보세요</p>
        </div>
      );
    }
    if (hasActiveFilters) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
          <div className="text-center text-ink-muted">
            <p className="text-sm font-medium text-ink-body">
              이 조건에 맞는 식당이 없어요
            </p>
            <p className="mt-1 text-xs">
              필터를 줄이거나 다른 조합으로 시도해보세요
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink-body"
          >
            <RotateCcw size={14} strokeWidth={1.75} />
            필터 전체 초기화
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-16 text-ink-muted">
        <p className="text-sm">아직 등록된 식당이 없어요</p>
      </div>
    );
  }

  // 선택·필터 없는 '신선 진입' 상태에서만 환영 메시지 노출.
  const isFreshEntry = !selectedId && !hasActiveFilters;

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

      {/* 신선 진입 상태 + peek/half: 인사말 + 통계 */}
      {isFreshEntry && snap !== 'full' && (
        <WelcomeStats restaurants={restaurants} />
      )}

      {/* 카테고리 빠른 필터 칩 — 항상 노출 (단 full 상태 검색 모드 외) */}
      <CategoryChipsBar />

      {/* peek 상태: 첫 번째 카드 + 더보기 */}
      {snap === 'peek' ? (
        <div>
          <RestaurantCard
            restaurant={restaurants[0]}
            isSelected={restaurants[0].id === selectedId}
          />
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
            <RestaurantCard
              key={r.id}
              restaurant={r}
              isSelected={r.id === selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
