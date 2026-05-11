'use client';

import type { RestaurantListItem } from '@pangchelin/types';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

import { formatNextOpen } from '@/lib/formatNextOpen';

const ZONE_LABEL: Record<string, string> = {
  FRONT_GATE: '정문',
  BACK_GATE: '후문',
  KWANGWOON_STATION: '광운대역',
  UICHEON: '우이천',
};

interface Props {
  open: boolean;
  /** 클러스터 안 식당들 */
  restaurants: RestaurantListItem[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

/**
 * 클러스터(겹친 마커) 클릭 시 그 안의 식당 리스트를 보여주는 작은 모달.
 * 사용자가 식당 하나 선택 → onSelect 호출 → 부모가 marker 선택 처리.
 *
 * 모바일 mid-sheet 스타일 (화면 중앙, 작은 카드). 백드롭 클릭/X/ESC 로 닫힘.
 */
export function ClusterPicker({ open, restaurants, onSelect, onClose }: Props) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-ink-primary">
            이 위치의 식당 {restaurants.length}개
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* 리스트 — 최대 60vh 까지, 그 이상은 스크롤 */}
        <ul className="max-h-[60vh] overflow-y-auto divide-y divide-border">
          {restaurants.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-primary-50"
              >
                <div className="relative h-[44px] w-[44px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  {r.featuredMenu?.imageUrl ? (
                    <Image
                      src={r.featuredMenu.imageUrl}
                      alt={r.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg text-ink-subtle">
                      🍽
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[14px] font-semibold text-ink-primary">
                      {r.name}
                    </span>
                    {r.isPartner && (
                      <span className="flex-shrink-0 rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-semibold text-accent-600">
                        제휴
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[12px] text-ink-muted">
                    {r.categories[0] && (
                      <>
                        <span>{r.categories[0].name}</span>
                        <span>·</span>
                      </>
                    )}
                    <span>{ZONE_LABEL[r.zone] ?? r.zone}</span>
                    <span>·</span>
                    <span className={r.isOpen ? 'text-success' : 'text-ink-muted'}>
                      {r.isOpen
                        ? '영업중'
                        : formatNextOpen(r.nextOpenAt) || '마감'}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
