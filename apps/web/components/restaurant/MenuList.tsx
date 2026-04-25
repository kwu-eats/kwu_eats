import type { Menu } from '@pangchelin/types';
import Image from 'next/image';

interface Props {
  menus: Menu[];
}

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR') + '원';
}

export function MenuList({ menus }: Props) {
  if (menus.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-base font-body font-semibold text-ink-primary">메뉴</h2>
        <p className="text-sm font-body text-ink-muted">아직 등록된 메뉴가 없어요</p>
      </div>
    );
  }

  // 추천 메뉴 먼저
  const sorted = [...menus].sort((a, b) => Number(b.isSignature) - Number(a.isSignature));

  return (
    <div className="space-y-3">
      <h2 className="text-base font-body font-semibold text-ink-primary">메뉴</h2>

      <ul className="divide-y divide-border">
        {sorted.map((menu) => (
          <li key={menu.id} className="flex items-center gap-3 py-3">
            {/* 썸네일 */}
            <div className="relative flex-shrink-0 w-[52px] h-[52px] rounded-md overflow-hidden bg-muted">
              {menu.imageUrl ? (
                <Image
                  src={menu.imageUrl}
                  alt={menu.name}
                  fill
                  className="object-cover"
                  sizes="52px"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>

            {/* 이름 + 가격 */}
            <div className="flex-1 min-w-0">
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
                {formatPrice(menu.price)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
