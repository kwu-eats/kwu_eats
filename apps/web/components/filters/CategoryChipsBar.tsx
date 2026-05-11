'use client';

import { useCategories } from '@/hooks/queries/useCategories';
import { useFilterStore } from '@/lib/stores/filterStore';

/**
 * 카테고리 빠른 필터 — 가로 스크롤 칩.
 * 탭하면 해당 카테고리 toggle (이미 적용 중이면 해제).
 * 칩에는 카테고리 이모지(icon) 가 있으면 함께 표시.
 */
export function CategoryChipsBar() {
  const { data: categories } = useCategories();
  const { categoryIds, toggleCategoryId } = useFilterStore();

  if (!categories?.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((c) => {
        const active = categoryIds.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => toggleCategoryId(c.id)}
            className={
              active
                ? 'flex flex-shrink-0 items-center gap-1 rounded-full bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white'
                : 'flex flex-shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-body'
            }
          >
            {c.icon && <span className="text-sm leading-none">{c.icon}</span>}
            <span>{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
