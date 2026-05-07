'use client';

import {
  NOTICE_CATEGORY_LABELS,
  type NoticeCategory,
} from '@pangchelin/types';
import { ChevronLeft, Megaphone, Pin } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useNotice } from '@/hooks/queries/useNotices';

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${date} ${time}`;
}

const CATEGORY_BADGE: Record<NoticeCategory, string> = {
  ANNOUNCEMENT: 'bg-primary-50 text-primary-600 border-primary-100',
  UPDATE: 'bg-accent-50 text-accent-600 border-accent-100',
  EVENT: 'bg-success-bg text-success border-success/20',
};

interface Props {
  params: { id: string };
}

export default function NoticeDetailPage({ params }: Props) {
  const router = useRouter();
  const { data: notice, isLoading, isError } = useNotice(params.id);

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

      {isLoading && (
        <div className="space-y-3 px-4 py-6">
          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-32 animate-pulse rounded bg-muted" />
        </div>
      )}

      {isError && (
        <p className="py-12 text-center text-sm text-ink-muted">
          공지를 불러오지 못했어요
        </p>
      )}

      {notice && (
        <article className="px-4 py-6">
          <div className="mb-3 flex items-center gap-2">
            {notice.isPinned && (
              <Pin
                size={14}
                strokeWidth={2}
                className="text-primary-500"
                aria-label="고정"
              />
            )}
            <span
              className={`rounded border px-2 py-0.5 text-[11px] font-medium ${CATEGORY_BADGE[notice.category]}`}
            >
              {NOTICE_CATEGORY_LABELS[notice.category]}
            </span>
          </div>

          <h1 className="font-display text-xl font-bold text-ink-primary leading-snug">
            {notice.title}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-xs text-ink-muted">
            <span>{formatDateTime(notice.publishedAt)}</span>
            {notice.author && (
              <>
                <span>·</span>
                <span>{notice.author.name}</span>
              </>
            )}
          </div>

          <hr className="my-5 border-border" />

          {/* MVP: Markdown 렌더 라이브러리 미사용. whitespace-pre-wrap 으로 줄바꿈 보존. */}
          <div className="text-sm leading-7 text-ink-body whitespace-pre-wrap break-words">
            {notice.content}
          </div>
        </article>
      )}
    </div>
  );
}
