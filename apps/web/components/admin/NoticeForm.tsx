'use client';

import {
  NOTICE_CATEGORY_LABELS,
  NOTICE_CATEGORY_VALUES,
  type CreateNoticeRequest,
  type NoticeCategory,
} from '@pangchelin/types';
import { useState } from 'react';

interface NoticeFormProps {
  initial?: Partial<CreateNoticeRequest>;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (data: CreateNoticeRequest) => void;
  onCancel: () => void;
}

export function NoticeForm({
  initial = {},
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: NoticeFormProps) {
  const [title, setTitle] = useState(initial.title ?? '');
  const [content, setContent] = useState(initial.content ?? '');
  const [category, setCategory] = useState<NoticeCategory>(
    initial.category ?? 'ANNOUNCEMENT',
  );
  const [isPinned, setIsPinned] = useState(initial.isPinned ?? false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('제목을 입력해주세요');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력해주세요');
      return;
    }
    setError('');
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      isPinned,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-muted">
          카테고리
        </label>
        <div className="flex gap-2">
          {NOTICE_CATEGORY_VALUES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
                category === c
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-border bg-surface text-ink-body'
              }`}
            >
              {NOTICE_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-muted">
          제목 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="예: 5월 신메뉴 업데이트"
          className="h-12 w-full rounded-xl border border-border bg-canvas px-3 text-base text-ink-primary placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-ink-muted">
          내용 <span className="text-red-400">*</span>{' '}
          <span className="text-ink-subtle">(Markdown 지원 예정 — 지금은 줄바꿈 보존)</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="공지 내용을 입력하세요"
          className="w-full rounded-xl border border-border bg-canvas px-3 py-3 text-base text-ink-primary placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-primary-400"
          style={{ minHeight: '12rem' }}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-body">
        <input
          type="checkbox"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary-500"
        />
        상단 고정
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-12 flex-1 rounded-xl border border-border text-sm text-ink-body"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 flex-1 rounded-xl bg-primary-500 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
