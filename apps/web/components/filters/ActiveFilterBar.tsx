'use client';

import { X } from 'lucide-react';

import { useCategories } from '@/hooks/queries/useCategories';
import { useFilterStore } from '@/lib/stores/filterStore';

const ZONE_LABEL: Record<string, string> = {
  FRONT_GATE: '정문',
  BACK_GATE: '후문',
  KWANGWOON_STATION: '광운대역',
  UICHEON: '우이천',
};

function formatBudget(price: number) {
  return price >= 10_000 ? `~${price / 10_000}만원` : `~${price / 1_000}천원`;
}

interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface Props {
  /**
   * 'floating' — 지도 위에 떠다니는 헤더 아래 칩 바 (frosted glass).
   * 'inline'   — BottomSheet/사이드바 내부 콘텐츠 (muted bg + border).
   */
  variant?: 'floating' | 'inline';
}

export function ActiveFilterBar({ variant = 'floating' }: Props) {
  const {
    zones,
    categoryIds,
    isOpen,
    maxPrice,
    toggleZone,
    toggleCategoryId,
    setIsOpen,
    setMaxPrice,
  } = useFilterStore();
  const { data: categories = [] } = useCategories();

  const chips: ActiveChip[] = [];

  zones.forEach((z) => {
    chips.push({
      key: `zone-${z}`,
      label: ZONE_LABEL[z] ?? z,
      onRemove: () => toggleZone(z),
    });
  });

  if (isOpen) {
    chips.push({
      key: 'isOpen',
      label: '영업중',
      onRemove: () => setIsOpen(false),
    });
  }

  categoryIds.forEach((id) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      chips.push({
        key: `cat-${id}`,
        label: cat.name,
        onRemove: () => toggleCategoryId(id),
      });
    }
  });

  if (maxPrice) {
    chips.push({
      key: 'maxPrice',
      label: formatBudget(maxPrice),
      onRemove: () => setMaxPrice(null),
    });
  }

  if (chips.length === 0) return null;

  const isFloating = variant === 'floating';
  const wrapperClass = isFloating
    ? 'pointer-events-none flex w-full overflow-x-auto scrollbar-none'
    : 'flex w-full overflow-x-auto scrollbar-none border-b border-border';
  const innerClass = isFloating
    ? 'pointer-events-auto flex gap-2 px-4 py-2'
    : 'flex gap-2 px-4 py-2.5';
  const chipClass = isFloating
    ? 'bg-surface/85 text-ink-primary shadow-md backdrop-blur-md'
    : 'bg-muted text-ink-body border border-border';

  return (
    <div className={wrapperClass}>
      <div className={innerClass}>
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={chip.onRemove}
            aria-label={`${chip.label} 필터 제거`}
            className={`flex h-8 min-h-0 min-w-0 flex-shrink-0 items-center gap-1.5 rounded-full pl-3 pr-2 text-xs font-medium ${chipClass}`}
          >
            <span>{chip.label}</span>
            <X size={12} strokeWidth={2.5} className="text-ink-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}
