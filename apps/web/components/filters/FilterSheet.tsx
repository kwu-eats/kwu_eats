'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { useCategories } from '@/hooks/queries/useCategories';
import { useFilterStore, type Zone } from '@/lib/stores/filterStore';

const ZONE_OPTIONS: Array<{ value: Zone; label: string }> = [
  { value: 'FRONT_GATE', label: '정문' },
  { value: 'BACK_GATE', label: '후문' },
  { value: 'KWANGWOON_STATION', label: '광운대역' },
  { value: 'UICHEON', label: '우이천' },
];

const BUDGET_OPTIONS = [5_000, 10_000, 15_000, 20_000];

function formatBudget(price: number) {
  return price >= 10_000 ? `~${price / 10_000}만원` : `~${price / 1_000}천원`;
}

const chipBase =
  'h-10 px-4 rounded-full text-sm font-medium border transition-colors';
const chipActive = 'bg-primary-500 text-white border-primary-500';
const chipIdle = 'bg-surface text-ink-body border-border';

interface SectionHeaderProps {
  title: string;
  count?: number;
  active?: boolean;
  onReset: () => void;
}

function SectionHeader({ title, count, active, onReset }: SectionHeaderProps) {
  const isActive = count !== undefined ? count > 0 : !!active;
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-ink-primary">
        {title}
        {count !== undefined && count > 0 && (
          <span className="ml-1.5 text-primary-500">({count})</span>
        )}
      </h3>
      {isActive && (
        <button
          type="button"
          onClick={onReset}
          className="-mr-2 flex h-8 min-h-0 min-w-0 items-center px-2 text-xs font-medium text-ink-muted"
        >
          초기화
        </button>
      )}
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function FilterSheet({ open, onClose }: Props) {
  const {
    zones,
    categoryIds,
    isOpen,
    maxPrice,
    toggleZone,
    clearZones,
    toggleCategoryId,
    clearCategoryIds,
    setIsOpen,
    setMaxPrice,
    reset,
  } = useFilterStore();
  const { data: categories = [] } = useCategories();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[45] bg-ink-primary/40"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed inset-x-0 bottom-0 z-[46] flex max-h-[85dvh] flex-col rounded-t-xl bg-surface shadow-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="필터"
          >
            <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-5 pb-3 pt-4">
              <h2 className="text-base font-semibold text-ink-primary">필터</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
              <section>
                <SectionHeader
                  title="구역"
                  count={zones.length}
                  onReset={clearZones}
                />
                <div className="flex flex-wrap gap-2">
                  {ZONE_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleZone(value)}
                      className={`${chipBase} ${zones.includes(value) ? chipActive : chipIdle}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-ink-primary">
                  영업 여부
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`${chipBase} ${isOpen ? chipActive : chipIdle}`}
                >
                  지금 영업 중만
                </button>
              </section>

              <section>
                <SectionHeader
                  title="카테고리"
                  count={categoryIds.length}
                  onReset={clearCategoryIds}
                />
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategoryId(cat.id)}
                      className={`${chipBase} ${categoryIds.includes(cat.id) ? chipActive : chipIdle}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <SectionHeader
                  title="예산"
                  active={maxPrice !== null}
                  onReset={() => setMaxPrice(null)}
                />
                <div className="flex flex-wrap gap-2">
                  {BUDGET_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setMaxPrice(maxPrice === b ? null : b)}
                      className={`${chipBase} ${maxPrice === b ? chipActive : chipIdle}`}
                    >
                      {formatBudget(b)}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex flex-shrink-0 gap-3 border-t border-border px-5 py-3 pb-safe">
              <button
                type="button"
                onClick={reset}
                className="h-12 flex-1 rounded-lg border border-border text-sm font-medium text-ink-body"
              >
                전체 초기화
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-12 flex-1 rounded-lg bg-primary-500 text-sm font-semibold text-white"
              >
                결과 보기
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
