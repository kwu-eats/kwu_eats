'use client';

import type { RestaurantListItem as RestaurantListItemType } from '@pangchelin/types';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';

import { formatNextOpen } from '@/lib/formatNextOpen';
import { formatDistance, walkMinutes } from '@/lib/utils/distance';

const ZONE_LABEL: Record<string, string> = {
  FRONT_GATE: '정문',
  BACK_GATE: '후문',
  KWANGWOON_STATION: '광운대역',
  UICHEON: '우이천',
};

interface Props {
  restaurant: RestaurantListItemType;
  /** 지도에서 클릭해 선택된 식당이면 시각적으로 강조 */
  isSelected?: boolean;
  /** 내 위치로부터의 직선 거리 (km). 값이 있으면 카드에 거리 표시 */
  distanceKm?: number;
}

function RestaurantListItemComponent({ restaurant, isSelected = false, distanceKm }: Props) {
  const { id, name, zone, isOpen, isPartner, categories, featuredMenu, nextOpenAt, coverImageUrl } =
    restaurant;
  const category = categories[0];
  const closedLabel = !isOpen ? formatNextOpen(nextOpenAt) || '마감' : null;
  // 썸네일 우선순위: 대표사진 → 대표 메뉴 사진 → public/restaurants 이름 기반 정적 이미지 → 이모지.
  // DB 의 coverImageUrl 이 비어있는 식당이 많아 마지막 정적 매칭으로 일관된 이미지 노출.
  // raw 식당명을 src 에 그대로 넘김 — next/image 가 자체적으로 URL 인코딩 처리.
  // encodeURIComponent 를 미리 적용하면 이중 인코딩으로 _next/image 가 400.
  const candidates = [
    coverImageUrl,
    featuredMenu?.imageUrl,
    `/restaurants/${name}.jpg`,
  ].filter((u): u is string => Boolean(u));
  const [thumbIdx, setThumbIdx] = useState(0);
  const thumbnailUrl = candidates[thumbIdx] ?? null;

  return (
    <Link
      href={`/restaurants/${id}`}
      className={
        isSelected
          ? 'flex items-center gap-3 px-4 py-3 min-h-[72px] transition-colors bg-primary-50 shadow-[inset_3px_0_0_0_#D85A30]'
          : 'flex items-center gap-3 px-4 py-3 min-h-[72px] transition-colors active:bg-primary-50'
      }
    >
      {/* 썸네일 — 대표사진 우선, 없으면 대표 메뉴 사진 */}
      <div className="relative h-[52px] w-[52px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {thumbnailUrl ? (
          <Image
            // key 를 src 와 함께 줘서 후보가 바뀔 때 next/image 가 새 요청을 보내도록 함
            key={thumbnailUrl}
            src={thumbnailUrl}
            alt={name}
            fill
            sizes="52px"
            className="object-cover"
            // public/restaurants 정적 이미지는 파일명에 공백(예: "경대컵밥 광운대점.jpg")이 있으면
            // next/image 최적화기의 내부 fetch 가 파일을 못 찾아 _next/image 가 400 을 반환한다.
            // 로컬 정적 후보일 때만 최적화를 건너뛰어 원본을 그대로 서빙한다 (원격 S3 이미지는 최적화 유지).
            unoptimized={thumbnailUrl.startsWith('/restaurants/')}
            // 후보 이미지가 404 등으로 실패하면 다음 후보로 자동 전환
            onError={() => setThumbIdx((i) => i + 1)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl text-ink-subtle">
            🍽
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="min-w-0 flex-1">
        {/* 이름 + 뱃지 */}
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-semibold text-ink-primary">{name}</span>
          {isPartner && (
            <span className="flex-shrink-0 rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-semibold text-accent-600">
              제휴
            </span>
          )}
          <span
            className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
            style={
              isOpen
                ? { background: 'var(--color-success-bg)', color: 'var(--color-success)' }
                : { background: 'var(--color-closed-bg)', color: 'var(--color-closed)' }
            }
          >
            {isOpen ? '영업중' : closedLabel}
          </span>
        </div>

        {/* 카테고리 · 구역 · 거리 */}
        <div className="mt-0.5 flex items-center gap-1 text-[13px] text-ink-muted">
          {category && <span>{category.name}</span>}
          {category && <span>·</span>}
          <span>{ZONE_LABEL[zone] ?? zone}</span>
          {distanceKm !== undefined && (
            <>
              <span>·</span>
              <span className="text-primary-500 font-medium">
                {formatDistance(distanceKm)} ({walkMinutes(distanceKm)}분)
              </span>
            </>
          )}
        </div>

        {/* 대표 메뉴 */}
        {featuredMenu && (
          <div className="mt-1 flex items-center gap-1">
            <span className="truncate text-[13px] text-ink-muted">{featuredMenu.name}</span>
            <span className="flex-shrink-0 font-accent text-[13px] font-semibold text-primary-500">
              {featuredMenu.price.toLocaleString()}원
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// 필터 변경/시트 드래그 등으로 부모가 자주 리렌더되어도 동일 식당은 재렌더 안 되도록 메모화
export const RestaurantListItem = memo(RestaurantListItemComponent);
