import type { RestaurantListItem as RestaurantListItemType } from '@pangchelin/types';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

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
}

function RestaurantListItemComponent({ restaurant, isSelected = false }: Props) {
  const { id, name, zone, isOpen, isPartner, categories, featuredMenu } = restaurant;
  const category = categories[0];

  return (
    <Link
      href={`/restaurants/${id}`}
      className={
        isSelected
          ? 'flex items-center gap-3 px-4 py-3 min-h-[72px] transition-colors bg-primary-50 shadow-[inset_3px_0_0_0_#D85A30]'
          : 'flex items-center gap-3 px-4 py-3 min-h-[72px] transition-colors active:bg-primary-50'
      }
    >
      {/* 썸네일 */}
      <div className="relative h-[52px] w-[52px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {featuredMenu?.imageUrl ? (
          <Image
            src={featuredMenu.imageUrl}
            alt={name}
            fill
            sizes="52px"
            className="object-cover"
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
            {isOpen ? '영업중' : '마감'}
          </span>
        </div>

        {/* 카테고리 · 구역 */}
        <div className="mt-0.5 flex items-center gap-1 text-[13px] text-ink-muted">
          {category && <span>{category.name}</span>}
          {category && <span>·</span>}
          <span>{ZONE_LABEL[zone] ?? zone}</span>
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
