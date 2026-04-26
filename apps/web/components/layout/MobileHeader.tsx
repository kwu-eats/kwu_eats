'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-surface px-4 pt-safe shadow-card">
        <Link href="/" className="flex items-center gap-2 min-h-touch min-w-0">
          <span
            className="text-xl font-display text-primary-500 leading-none"
            aria-label="팡슐랭 홈"
          >
            팡슐랭
          </span>
          <span className="text-xs font-body text-ink-muted mt-0.5 hidden xs:block">
            광운대 맛집 가이드
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center justify-center min-h-touch min-w-touch rounded-md text-ink-body"
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
        >
          <Menu size={22} strokeWidth={1.75} />
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
          <nav className="fixed right-4 top-14 z-[46] min-w-[160px] rounded-lg bg-surface shadow-lg border border-border py-1">
            <Link
              href="/report"
              className="flex items-center px-4 py-3 text-sm font-body text-ink-body min-h-touch"
              onClick={() => setMenuOpen(false)}
            >
              정보 제보하기
            </Link>
          </nav>
        </>
      )}
    </>
  );
}
