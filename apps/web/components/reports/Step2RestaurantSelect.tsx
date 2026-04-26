'use client';

import type { RestaurantListItem } from '@pangchelin/types';
import { Check, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useRestaurants } from '@/hooks/queries/useRestaurants';

interface Props {
  selectedId: string | null;
  onSelect: (id: string, restaurant: RestaurantListItem) => void;
}

export function Step2RestaurantSelect({ selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const { data: restaurants = [], isLoading } = useRestaurants();

  const filtered = useMemo(() => {
    if (!query.trim()) return restaurants;
    const q = query.trim().toLowerCase();
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q),
    );
  }, [restaurants, query]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-display text-ink-primary">어느 식당인가요?</h2>
        <p className="mt-1 text-sm font-body text-ink-muted">정보를 알고 싶은 식당을 골라주세요</p>
      </div>

      <div className="relative">
        <Search
          size={18}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="식당명 또는 주소"
          className="h-12 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-base font-body text-ink-primary placeholder:text-ink-subtle focus:border-primary-500 focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm font-body text-ink-muted">
          {query ? '일치하는 식당이 없어요' : '아직 등록된 식당이 없어요'}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((r) => {
            const isActive = selectedId === r.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => onSelect(r.id, r)}
                  className={[
                    'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors min-h-touch-lg',
                    isActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-border bg-surface',
                  ].join(' ')}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-semibold text-ink-primary truncate">
                      {r.name}
                    </p>
                    <p className="mt-0.5 text-xs font-body text-ink-muted truncate">
                      {r.address}
                    </p>
                  </div>
                  {isActive && (
                    <Check size={18} strokeWidth={2} className="text-primary-500 flex-shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
