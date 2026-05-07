'use client';

import { Megaphone, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useUnreadNoticeCount } from '@/hooks/queries/useUnreadNoticeCount';

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = useUnreadNoticeCount();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-4 pb-2 pt-[max(env(safe-area-inset-top),0.75rem)]">
        <Link
          href="/"
          aria-label="팡슐랭 홈"
          className="flex h-11 min-w-0 items-center gap-2 rounded-full bg-surface/85 px-4 shadow-md backdrop-blur-md"
        >
          <span className="font-display text-lg leading-none text-primary-500">
            팡슐랭
          </span>
          <span className="hidden font-body text-xs text-ink-muted xs:block">
            광운대 맛집 가이드
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-surface/85 text-ink-body shadow-md backdrop-blur-md"
          aria-label={unread > 0 ? `메뉴 (새 공지 ${unread}개)` : '메뉴 열기'}
          aria-expanded={menuOpen}
        >
          <Megaphone size={20} strokeWidth={1.75} />
          {unread > 0 && (
            <span
              className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary-500"
              aria-hidden="true"
            />
          )}
        </button>
      </header>

      {/* 드롭다운 메뉴 */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[45]"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav className="fixed right-4 top-[calc(max(env(safe-area-inset-top),0.75rem)+3.5rem)] z-[46] min-w-[180px] rounded-lg border border-border bg-surface py-1 shadow-lg">
            <Link
              href="/notice"
              className="flex min-h-touch items-center gap-3 px-4 py-3 text-sm font-body text-ink-body"
              onClick={() => setMenuOpen(false)}
            >
              <Megaphone size={16} strokeWidth={1.75} className="text-ink-muted" />
              <span className="flex-1">공지사항</span>
              {unread > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 px-1.5 text-[11px] font-semibold text-white">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
            <Link
              href="/report"
              className="flex min-h-touch items-center gap-3 px-4 py-3 text-sm font-body text-ink-body"
              onClick={() => setMenuOpen(false)}
            >
              <MessageSquare size={16} strokeWidth={1.75} className="text-ink-muted" />
              <span>정보 제보하기</span>
            </Link>
          </nav>
        </>
      )}
    </>
  );
}
