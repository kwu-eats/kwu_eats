'use client';

import {
  NOTICE_CATEGORY_LABELS,
  type NoticeCategory,
} from '@pangchelin/types';
import { Pencil, Pin, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useDeleteNotice } from '@/hooks/mutations/useNoticeMutations';
import { useNotices } from '@/hooks/queries/useNotices';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

const CATEGORY_BADGE: Record<NoticeCategory, string> = {
  ANNOUNCEMENT: 'bg-primary-50 text-primary-600',
  UPDATE: 'bg-accent-50 text-accent-600',
  EVENT: 'bg-success-bg text-success',
};

export default function AdminNoticesPage() {
  const { data, isLoading } = useNotices({ limit: 100 });
  const deleteNotice = useDeleteNotice();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const items = data?.items ?? [];

  function handleDeleteConfirm() {
    if (!deleteTargetId) return;
    deleteNotice.mutate(deleteTargetId, {
      onSuccess: () => setDeleteTargetId(null),
    });
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-body text-xl font-semibold text-ink-primary">
          공지 관리
        </h1>
        <Link
          href="/admin/notices/new"
          className="flex h-9 items-center gap-2 rounded-lg bg-primary-500 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-600"
        >
          <Plus size={16} />
          공지 작성
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              {['', '카테고리', '제목', '게시일', ''].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-medium text-ink-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-ink-muted"
                >
                  아직 공지가 없어요. 새 공지를 작성해주세요.
                </td>
              </tr>
            ) : (
              items.map((n) => (
                <tr key={n.id} className="border-b border-border last:border-0">
                  <td className="w-10 px-4 py-3">
                    {n.isPinned ? (
                      <Pin
                        size={14}
                        className="text-primary-500"
                        aria-label="고정"
                      />
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${CATEGORY_BADGE[n.category]}`}
                    >
                      {NOTICE_CATEGORY_LABELS[n.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-primary">
                    {n.title}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {formatDate(n.publishedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/notices/${n.id}`}
                        className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink-body transition-colors hover:bg-muted"
                      >
                        <Pencil size={13} />
                        수정
                      </Link>
                      <button
                        onClick={() => setDeleteTargetId(n.id)}
                        className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm space-y-4 rounded-2xl bg-surface p-6 shadow-xl">
            <h3 className="text-base font-semibold text-ink-primary">
              공지 삭제
            </h3>
            <p className="text-sm text-ink-muted">
              삭제한 공지는 복구할 수 없어요. 계속할까요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="h-11 flex-1 rounded-xl border border-border text-sm text-ink-body"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteNotice.isPending}
                className="h-11 flex-1 rounded-xl bg-red-500 text-sm font-medium text-white disabled:opacity-50"
              >
                {deleteNotice.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
