'use client';

import { ExternalLink, Flag } from 'lucide-react';
import Link from 'next/link';

interface Props {
  restaurantId: string;
  kakaoNavUrl: string;
  kakaoAppUrl: string;
}

export function StickyBottomBar({ restaurantId, kakaoNavUrl, kakaoAppUrl }: Props) {
  function handleNavClick() {
    // 카카오맵 앱 딥링크 시도, 없으면 웹으로 fallback
    const timeout = setTimeout(() => {
      window.location.href = kakaoNavUrl;
    }, 1500);

    window.location.href = kakaoAppUrl;

    // 앱이 열렸으면 타임아웃 취소
    window.addEventListener('blur', () => clearTimeout(timeout), { once: true });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 bg-surface border-t border-border px-4 pt-3 pb-safe">
      <button
        type="button"
        onClick={handleNavClick}
        className="flex flex-1 items-center justify-center gap-2 min-h-touch-lg rounded-lg border border-border bg-surface text-ink-body text-sm font-body font-medium"
      >
        <ExternalLink size={16} strokeWidth={1.75} />
        길찾기
      </button>

      <Link
        href={`/report?restaurantId=${restaurantId}&type=RESTAURANT_INFO`}
        className="flex flex-1 items-center justify-center gap-2 min-h-touch-lg rounded-lg bg-primary-500 text-surface text-sm font-body font-medium"
      >
        <Flag size={16} strokeWidth={1.75} />
        정보 제보
      </Link>
    </div>
  );
}
