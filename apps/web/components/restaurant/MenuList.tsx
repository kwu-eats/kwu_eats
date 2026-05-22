'use client';

import type { Menu, MenuPriceOption } from '@pangchelin/types';
import { Search } from 'lucide-react';
import { memo, useMemo, useRef, useState } from 'react';

interface Props {
  menus: Menu[];
}

const UNCATEGORIZED_LABEL = '기타';
const ALL_LABEL = '전체';
const DISCLAIMER = '메뉴 항목과 가격은 각 매장의 사정에 따라 기재된 내용과 다를 수 있습니다.';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR') + '원';
}

function formatPriceOptions(options: MenuPriceOption[]): string {
  return options.map((o) => `${o.label} ${o.price.toLocaleString('ko-KR')}원`).join(' / ');
}

/**
 * 카테고리를 메인 → (식사) → 사이드 → 기타 → 음료/주류 순으로 묶기 위한 점수.
 * 키워드 매칭으로 그룹화하고, 그룹 내에서는 입력 순서(idx) 유지.
 * 카페·전문점 (COFFEE/PHO 등) 처럼 카테고리가 곧 주력 메뉴면 default(20) 로 메인 직후에 배치.
 */
function categoryPriority(category: string): number {
  if (category === ALL_LABEL) return 0;
  if (/메인|대표|시그니처|main/i.test(category)) return 10;
  if (/사이드|토핑|안주|추가|side/i.test(category)) return 30;
  if (category === UNCATEGORIZED_LABEL) return 40;
  if (/음료|주류|드링크|칵테일|cocktail|juice|drink|soft/i.test(category)) return 50;
  return 20;
}

function MenuListComponent({ menus }: Props) {
  // 카테고리별 그룹화 → 우선순위(메인/사이드/음료) 재정렬, 동순위는 입력 순서 유지
  const { categories, grouped } = useMemo(() => {
    const inputOrder: string[] = [];
    const map = new Map<string, Menu[]>();
    for (const m of menus) {
      const key = m.category?.trim() || UNCATEGORIZED_LABEL;
      if (!map.has(key)) {
        map.set(key, []);
        inputOrder.push(key);
      }
      map.get(key)!.push(m);
    }
    // 각 카테고리 내부에서 추천 메뉴 먼저
    map.forEach((list) => {
      list.sort((a, b) => Number(b.isSignature) - Number(a.isSignature));
    });
    // 우선순위 정렬 (stable: 동순위는 입력 순서)
    const order = inputOrder
      .map((c, idx) => ({ c, idx, p: categoryPriority(c) }))
      .sort((a, b) => a.p - b.p || a.idx - b.idx)
      .map((x) => x.c);
    return { categories: order, grouped: map };
  }, [menus]);

  // 카테고리 2개 이상일 때만 탭 UI 사용. 그 외는 단일 리스트.
  const hasTabs = categories.length >= 2;
  const [activeTab, setActiveTab] = useState<string>(() =>
    hasTabs ? ALL_LABEL : categories[0] ?? UNCATEGORIZED_LABEL,
  );
  // 매장 내 메뉴 검색 (이름·카테고리 부분 일치)
  const [search, setSearch] = useState('');
  const trimmedSearch = search.trim().toLowerCase();

  const tabBarRef = useRef<HTMLDivElement>(null);

  if (menus.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-base font-body font-semibold text-ink-primary">메뉴</h2>
        <p className="text-sm font-body text-ink-muted">아직 등록된 메뉴가 없어요</p>
        <p className="text-xs font-body text-ink-muted">{DISCLAIMER}</p>
      </div>
    );
  }

  // 표시할 메뉴 선택 — 검색어 있으면 전체 메뉴에서 매칭, 없으면 카테고리 탭 기준
  const visibleMenus = trimmedSearch
    ? categories
        .flatMap((c) => grouped.get(c) ?? [])
        .filter(
          (m) =>
            m.name.toLowerCase().includes(trimmedSearch) ||
            (m.category ?? '').toLowerCase().includes(trimmedSearch),
        )
    : !hasTabs || activeTab === ALL_LABEL
      ? categories.flatMap((c) => grouped.get(c) ?? [])
      : grouped.get(activeTab) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-body font-semibold text-ink-primary">메뉴</h2>
        {menus.length >= 8 && (
          // 메뉴 8개 이상일 때만 검색창 노출 — 그 이하면 한 화면에 다 보임
          <div className="relative w-44">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="메뉴 검색"
              className="w-full rounded-full border border-border bg-surface px-3 py-1.5 pl-8 text-xs text-ink-primary placeholder:text-ink-subtle focus:border-primary-400 focus:outline-none"
              aria-label="이 매장 내 메뉴 검색"
            />
            <Search
              size={12}
              strokeWidth={2}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
          </div>
        )}
      </div>

      {/* 카테고리 탭: 검색어 없을 때만 노출 (검색 중엔 전체에서 매칭) */}
      {hasTabs && !trimmedSearch && (
        <div
          ref={tabBarRef}
          // 좌우 스크롤 가능한 탭 바. 모바일 터치 스크롤 + 스크롤바 숨김.
          className="-mx-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-2 px-4">
            <TabButton
              label={ALL_LABEL}
              active={activeTab === ALL_LABEL}
              onClick={() => setActiveTab(ALL_LABEL)}
            />
            {categories.map((c) => (
              <TabButton
                key={c}
                label={c}
                count={grouped.get(c)?.length ?? 0}
                active={activeTab === c}
                onClick={() => setActiveTab(c)}
              />
            ))}
          </div>
        </div>
      )}

      {trimmedSearch && visibleMenus.length === 0 && (
        <p className="py-6 text-center text-sm text-ink-muted">
          &quot;{search}&quot; 검색 결과가 없어요
        </p>
      )}

      <ul className="divide-y divide-border">
        {visibleMenus.map((menu) => (
          <li key={menu.id} className="py-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-body font-medium text-ink-primary truncate">
                {menu.name}
              </span>
              {menu.isSignature && (
                <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-body font-medium bg-primary-50 text-primary-600">
                  추천
                </span>
              )}
            </div>
            <span className="mt-0.5 block text-base font-accent font-semibold text-primary-500">
              {menu.priceOptions && menu.priceOptions.length > 0
                ? formatPriceOptions(menu.priceOptions)
                : formatPrice(menu.price)}
            </span>
          </li>
        ))}
      </ul>

      <p className="pt-2 text-xs font-body text-ink-muted">{DISCLAIMER}</p>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

function TabButton({ label, active, onClick, count }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      // 모바일 탭 타겟 44px 보장: py-2 + 텍스트 → 약 36px, 추가로 leading-relaxed.
      // 시각적 컴팩트하지만 터치 영역은 충분.
      className={[
        'flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 font-body text-[13px] font-medium transition-colors',
        active
          ? 'bg-primary-500 text-white'
          : 'bg-muted text-ink-body active:bg-border',
      ].join(' ')}
    >
      {label}
      {count !== undefined && (
        <span className={active ? 'ml-1 text-white/80' : 'ml-1 text-ink-muted'}>
          {count}
        </span>
      )}
    </button>
  );
}

export const MenuList = memo(MenuListComponent);
