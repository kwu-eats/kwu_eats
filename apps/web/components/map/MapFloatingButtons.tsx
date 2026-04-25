'use client';

import { Crosshair, Search } from 'lucide-react';

interface MapFloatingButtonsProps {
  onLocate?: () => void;
  onSearch?: () => void;
  isLocating?: boolean;
}

export function MapFloatingButtons({
  onLocate,
  onSearch,
  isLocating = false,
}: MapFloatingButtonsProps) {
  return (
    <div className="pointer-events-auto flex flex-col gap-3">
      <button
        type="button"
        onClick={onLocate}
        disabled={isLocating}
        aria-label="현재 위치로 이동"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-surface shadow-md transition-transform active:scale-95 disabled:opacity-60"
      >
        <Crosshair
          size={20}
          className={isLocating ? 'animate-spin text-primary-500' : 'text-ink-body'}
        />
      </button>

      <button
        type="button"
        onClick={onSearch}
        aria-label="식당 검색"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-surface shadow-md transition-transform active:scale-95"
      >
        <Search size={20} className="text-ink-body" />
      </button>
    </div>
  );
}
