'use client';

import {
  NOTICE_CATEGORY_LABELS,
  NOTICE_CATEGORY_VALUES,
  type NoticeCategory,
} from '@pangchelin/types';
import { ChevronLeft, Megaphone, Pin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useNotices } from '@/hooks/queries/useNotices';

const NOTICE_LAST_SEEN_KEY = 'pangchelin-notice-last-seen';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

const CATEGORY_BADGE: Record<NoticeCategory, string> = {
  ANNOUNCEMENT: 'bg-primary-50 text-primary-600 border-primary-100',
  UPDATE: 'bg-accent-50 text-accent-600 border-accent-100',
  EVENT: 'bg-success-bg text-success border-success/20',
};

export default function NoticeListPage() {
  const router = useRouter();
  const [category, setCategory] = useState<NoticeCategory | null>(null);
  const { data, isLoading, isError } = useNotices({
    category: category ?? undefined,
  });

  // 페이지 진입 시 마지막 확인 시각 기록 — 메뉴 미확인 배지 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(NOTICE_LAST_SEEN_KEY, new Date().toISOString());
    }
  }, []);

  const items = data?.items ?? [];

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface px-2 pt-safe">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="flex h-11 w-11 items-center justify-center rounded-md text-ink-body"
        >
          <ChevronLeft size={22} strokeWidth={1.75} />
        </button>
        <Megaphone size={18} strokeWidth={1.75} className="text-primary-500" />
        <h1 className="font-display text-lg text-ink-primary">공지사항</h1>
      </header>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-3">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`flex-shrink-0 h-9 px-4 rounded-full text-sm font-medium border transition-colors ${
            !category
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-surface text-ink-body border-border'
          }`}
        >
          전체
        </button>
        {NOTICE_CATEGORY_VALUES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(category === c ? null : c)}
            className={`flex-shrink-0 h-9 px-4 rounded-full text-sm font-medium border transition-colors ${
              category === c
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-surface text-ink-body border-border'
            }`}
          >
            {NOTICE_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <main className="px-4 pb-12">
        {isLoading && (
          <div className="space-y-3 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {isError && (
          <p className="py-12 text-center text-sm text-ink-muted">
            앗, 잠시 후 다시 시도해주세요
          </p>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-muted">
            아직 공지가 없어요
          </p>
        )}

        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id}>
              <Link
                href={`/notice/${n.id}`}
                className="block rounded-lg border border-border bg-surface p-4 active:bg-muted"
              >
                <div className="mb-2 flex items-center gap-2">
                  {n.isPinned && (
                    <Pin
                      size={14}
                      strokeWidth={2}
                      className="text-primary-500"
                      aria-label="고정"
                    />
                  )}
                  <span
                    className={`rounded border px-2 py-0.5 text-[11px] font-medium ${CATEGORY_BADGE[n.category]}`}
                  >
                    {NOTICE_CATEGORY_LABELS[n.category]}
                  </span>
                  <span className="ml-auto text-xs text-ink-muted">
                    {formatDate(n.publishedAt)}
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-ink-primary line-clamp-2">
                  {n.title}
                </h2>
                {n.author && (
                  <p className="mt-1 text-xs text-ink-subtle">{n.author.name}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
