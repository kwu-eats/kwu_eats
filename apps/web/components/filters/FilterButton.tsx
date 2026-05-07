'use client';

import { SlidersHorizontal } from 'lucide-react';

import { useFilterStore } from '@/lib/stores/filterStore';

interface Props {
  onClick: () => void;
}

export function FilterButton({ onClick }: Props) {
  const { zone, categoryId, isOpen, maxPrice } = useFilterStore();

  let count = 0;
  if (zone) count += 1;
  if (categoryId) count += 1;
  if (isOpen) count += 1;
  if (maxPrice) count += 1;

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
