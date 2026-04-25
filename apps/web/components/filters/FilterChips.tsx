'use client';

import { useState } from 'react';

import { useCategories } from '@/hooks/queries/useCategories';
import { useFilterStore } from '@/lib/stores/filterStore';

const BUDGET_OPTIONS = [5_000, 10_000, 15_000, 20_000];

function formatBudget(price: number) {
  return price >= 10_000 ? `~${price / 10_000}만원` : `~${price / 1_000}천원`;
}

export function FilterChips() {
  const { categoryId, isOpen, maxPrice, setCategoryId, setIsOpen, setMaxPrice } = useFilterStore();
  const { data: categories = [] } = useCategories();
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  const chipBase = 'flex-shrink-0 h-10 px-4 rounded-full text-sm font-medium border transition-colors';
  const chipActive = 'bg-primary-500 text-white border-primary-500';
  const chipIdle = 'bg-surface text-ink-body border-border';

  return (
    <>
      <div className="relative">
      {/* 우측 페이드 */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-canvas to-transparent z-10" />
      <div
        className="flex gap-2 overflow-x-auto scrollbar-none pl-4 pr-6 pb-2"
        style={{ scrollSnapType: 'x proximity' }}
      >
        {/* 영업중 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`${chipBase} ${isOpen ? chipActive : chipIdle}`}
          style={{ scrollSnapAlign: 'start' }}
        >
          영업중만
        </button>

        {/* 예산 */}
        <button
          type="button"
          onClick={() => setBudgetModalOpen(true)}
          className={`${chipBase} ${maxPrice ? chipActive : chipIdle}`}
          style={{ scrollSnapAlign: 'start' }}
        >
          {maxPrice ? formatBudget(maxPrice) : '예산'}
        </button>

        {/* 카테고리 */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoryId(categoryId === cat.id ? null : cat.id)}
            className={`${chipBase} ${categoryId === cat.id ? chipActive : chipIdle}`}
            style={{ scrollSnapAlign: 'start' }}
          >
            {cat.name}
          </button>
        ))}
      </div>
      </div>

      {/* 예산 모달 */}
      {budgetModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-primary/30"
          onClick={() => setBudgetModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-xl bg-surface p-6 pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-base font-semibold text-ink-primary">예산 설정</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setMaxPrice(null); setBudgetModalOpen(false); }}
                className={`h-12 rounded-lg border text-sm font-medium transition-colors ${
                  !maxPrice
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-border text-ink-body'
                }`}
              >
                제한 없음
              </button>
              {BUDGET_OPTIONS.map((budget) => (
                <button
                  key={budget}
                  type="button"
                  onClick={() => { setMaxPrice(budget); setBudgetModalOpen(false); }}
                  className={`h-12 rounded-lg border text-sm font-medium transition-colors ${
                    maxPrice === budget
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-border text-ink-body'
                  }`}
                >
                  {formatBudget(budget)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
