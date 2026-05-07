'use client';

import type { Zone } from '@/lib/stores/filterStore';
import { useFilterStore } from '@/lib/stores/filterStore';

const ZONES: Array<{ label: string; value: Zone }> = [
  { label: '정문', value: 'FRONT_GATE' },
  { label: '후문', value: 'BACK_GATE' },
  { label: '광운대역', value: 'KWANGWOON_STATION' },
  { label: '우이천', value: 'UICHEON' },
];

export function ZoneTabs() {
  const { zone, setZone } = useFilterStore();

  return (
    <div className="flex gap-2 px-4 py-2">
      {ZONES.map(({ label, value }) => {
        const isActive = zone === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setZone(isActive ? null : value)}
            className={[
              'flex-1 min-h-touch-lg rounded-full text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-900 text-primary-50'
                : 'bg-surface border border-border text-ink-body',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
