'use client';

import type { RestaurantListItem } from '@pangchelin/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useRestaurants } from '@/hooks/queries/useRestaurants';

interface Props {
  open: boolean;
  onClose: () => void;
  /** 검색 결과 선택 시 호출. 미지정이면 기본 동작(상세 페이지로 이동) 안 함 — 호출 측이 처리. */
  onSelect?: (restaurant: RestaurantListItem) => void;
}

export function SearchSheet({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // 검색은 필터와 무관하게 전체 식당에서 — 별도 쿼리 키
  const { data: restaurants = [], isLoading } = useRestaurants();

  // 시트 열릴 때 input 자동 포커스 + 닫힐 때 입력 리셋
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
    setQuery('');
  }, [open]);

  const trimmed = query.trim();
  const filtered = trimmed
    ? restaurants.filter((r) =>
        r.name.toLowerCase().includes(trimmed.toLowerCase()),
      )
    : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 420, damping: 42 }}
          className="fixed inset-0 z-[50] flex flex-col bg-canvas"
          role="dialog"
          aria-modal="true"
          aria-label="식당 검색"
        >
          <header className="flex flex-shrink-0 items-center gap-1 border-b border-border bg-surface px-2 pb-2 pt-[max(env(safe-area-inset-top),0.75rem)]">
            <div className="ml-2 flex h-11 items-center text-ink-muted">
              <Search size={18} strokeWidth={1.75} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="식당 이름으로 검색"
              autoComplete="off"
              className="h-11 min-w-0 flex-1 bg-transparent px-2 text-base text-ink-primary placeholder:text-ink-subtle focus:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-ink-muted"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto pb-safe">
            {!trimmed && (
              <p className="px-4 py-12 text-center text-sm text-ink-muted">
                식당 이름을 입력해주세요
              </p>
            )}

            {trimmed && isLoading && (
              <div className="space-y-2 px-4 py-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            )}

            {trimmed && !isLoading && filtered.length === 0 && (
              <p className="px-4 py-12 text-center text-sm text-ink-muted">
                &quot;{query}&quot; 검색 결과가 없어요
              </p>
            )}

            {filtered.length > 0 && (
              <>
                <p className="px-4 pb-1 pt-3 text-xs text-ink-subtle">
                  {filtered.length}개 검색됨
                </p>
                <ul className="divide-y divide-border">
                  {filtered.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect?.(r);
                          onClose();
                        }}
                        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-muted"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-ink-primary">
                            {r.name}
                          </h3>
                          <p className="truncate text-xs text-ink-muted">
                            {r.address}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          strokeWidth={1.75}
                          className="flex-shrink-0 text-ink-muted"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
