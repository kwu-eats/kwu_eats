'use client';

import type { RestaurantListItem } from '@pangchelin/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useRestaurants } from '@/hooks/queries/useRestaurants';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
  open: boolean;
  onClose: () => void;
  /** 검색 결과 선택 시 호출. 미지정이면 기본 동작(상세 페이지로 이동) 안 함 — 호출 측이 처리. */
  onSelect?: (restaurant: RestaurantListItem) => void;
}

export function SearchSheet({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 입력 시점 즉시 호출 막기 위한 디바운스 (220ms — 한글 IME 와 잘 어울리는 짧은 값)
  const trimmed = query.trim();
  const debouncedQ = useDebounce(trimmed, 220);

  // 검색어 있을 때만 서버에 q 파라미터로 요청.
  // 검색어 없으면 전체 리스트도 안 부르고 빈 화면 — 첫 진입 비용 최소화.
  // 서버가 식당명·메뉴명 양쪽을 OR 매칭해주고, 매칭된 메뉴는 matchedMenus 로 응답.
  const { data: restaurants = [], isLoading } = useRestaurants(
    debouncedQ ? { q: debouncedQ } : undefined,
  );

  // 시트 열릴 때 input 자동 포커스 + 닫힐 때 입력 리셋
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
    setQuery('');
  }, [open]);

  // 검색어 없으면 결과 없음. 있으면 서버가 반환한 그대로 사용.
  const filtered = debouncedQ ? restaurants : [];

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
                            {highlight(r.name, debouncedQ)}
                          </h3>
                          <p className="truncate text-xs text-ink-muted">
                            {r.address}
                          </p>
                          {r.matchedMenus && r.matchedMenus.length > 0 && (
                            // 메뉴명으로 매칭된 경우만 — 어느 메뉴 때문에 떴는지 표시.
                            // 식당명만 매칭이면 matchedMenus 가 비어있어 이 블록 안 그려짐.
                            <ul className="mt-1.5 space-y-0.5">
                              {r.matchedMenus.slice(0, 2).map((m) => (
                                <li
                                  key={m.id}
                                  className="flex items-center gap-1.5 text-[12px] text-ink-muted"
                                >
                                  <span className="truncate">
                                    {highlight(m.name, debouncedQ)}
                                  </span>
                                  <span className="flex-shrink-0 font-accent text-primary-500">
                                    {m.price.toLocaleString()}원
                                  </span>
                                </li>
                              ))}
                              {r.matchedMenus.length > 2 && (
                                <li className="text-[11px] text-ink-subtle">
                                  외 {r.matchedMenus.length - 2}개 메뉴
                                </li>
                              )}
                            </ul>
                          )}
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

/**
 * 검색어와 일치하는 부분만 굵게 강조.
 * - 대소문자 무시 매칭, 첫 매치 1회만 표시
 * - q 가 비어있으면 그대로 반환 (재렌더 안전)
 */
function highlight(text: string, q: string) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <strong className="font-bold text-ink-primary">
        {text.slice(i, i + q.length)}
      </strong>
      {text.slice(i + q.length)}
    </>
  );
}
