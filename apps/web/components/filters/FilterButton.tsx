'use client';

import { SlidersHorizontal } from 'lucide-react';

import { useCategories } from '@/hooks/queries/useCategories';
import { useFilterStore } from '@/lib/stores/filterStore';

const ZONE_LABEL: Record<string, string> = {
  FRONT_GATE: '정문',
  BACK_GATE: '후문',
  KWANGWOON_STATION: '광운대역',
  UICHEON: '우이천',
};

interface Props {
  onClick: () => void;
}

export function FilterButton({ onClick }: Props) {
  const { zones, categoryIds, isOpen, maxPrice } = useFilterStore();

  const count =
    zones.length + categoryIds.length + (isOpen ? 1 : 0) + (maxPrice ? 1 : 0);
  const isActive = count > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isActive ? `필터 ${count}개 적용 중` : '필터 열기'}
      className="pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full bg-surface shadow-md transition-transform active:scale-95"
    >
      <SlidersHorizontal
        size={20}
        className={isActive ? 'text-primary-500' : 'text-ink-body'}
      />
      {isActive && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
