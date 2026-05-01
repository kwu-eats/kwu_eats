'use client';

import type { ReportStatus, ReportType } from '@pangchelin/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAdminReports, useAdminReportStats } from '@/hooks/queries/useReports';

const TYPE_LABEL: Record<ReportType, string> = {
  RESTAURANT_INFO: '정보 수정',
  MENU_CHANGE: '메뉴 변경',
  NEW_RESTAURANT: '신규 식당',
  CLOSED: '폐업',
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING: '대기중',
  APPROVED: '승인됨',
  REJECTED: '반려됨',
  APPLIED: '반영됨',
};

const STATUS_CLASS: Record<ReportStatus, string> = {
  PENDING: 'bg-accent-100 text-accent-600',
  APPROVED: 'bg-blue-50 text-blue-600',
  REJECTED: 'bg-red-50 text-red-500',
  APPLIED: 'bg-green-50 text-green-600',
};

export default function AdminReportsPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const { data: stats } = useAdminReportStats();
  const { data, isLoading } = useAdminReports({
    status: status || undefined,
    type: type || undefined,
    page,
    limit: 20,
  });

  const approvalRate = stats
    ? Math.round(((stats.approved + stats.applied) / Math.max(stats.total, 1)) * 100)
    : 0;

  const selectClass =
    'h-9 rounded-lg border border-border bg-surface px-3 text-sm text-ink-body focus:border-primary-500 focus:outline-none';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold font-body text-ink-primary">제보 관리</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '대기중', value: stats?.pending ?? '—', unit: '건' },
          { label: '이번 주 접수', value: stats?.thisWeek.reports ?? '—', unit: '건' },
          { label: '전체 승인률', value: stats ? approvalRate : '—', unit: '%' },
        ].map(({ label, value, unit }) => (
          <div key={label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs font-body text-ink-muted">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-ink-primary">
              {value}
              <span className="ml-1 text-sm font-normal text-ink-muted">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">전체 상태</option>
          <option value="PENDING">대기중</option>
          <option value="APPROVED">승인됨</option>
          <option value="REJECTED">반려됨</option>
          <option value="APPLIED">반영됨</option>
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">전체 유형</option>
          <option value="RESTAURANT_INFO">정보 수정</option>
          <option value="MENU_CHANGE">메뉴 변경</option>
          <option value="NEW_RESTAURANT">신규 식당</option>
          <option value="CLOSED">폐업</option>
        </select>
      </div>

      {/* 테이블 */}
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              {['유형', '식당', '제보 내용', '상태', '접수일시'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              : data?.items.length === 0
              ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-ink-muted">
                    제보 내역이 없어요
                  </td>
                </tr>
              )
              : data?.items.map((report) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const r = report as any;
                  return (
                    <tr
                      key={report.id}
                      onClick={() => router.push(`/admin/reports/${report.id}`)}
                      className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted"
                    >
                      <td className="px-4 py-3 text-ink-body">
                        {TYPE_LABEL[report.type as ReportType] ?? report.type}
                      </td>
                      <td className="px-4 py-3 text-ink-body">
                        {r.restaurant?.name ?? '—'}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-ink-muted">
                        {report.content}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[report.status as ReportStatus]}`}>
                          {STATUS_LABEL[report.status as ReportStatus] ?? report.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {new Date(report.createdAt).toLocaleString('ko-KR', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 rounded-lg border border-border px-3 text-sm text-ink-body disabled:opacity-40"
          >
            이전
          </button>
          <span className="text-sm text-ink-muted">
            {page} / {data.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
            disabled={page === data.pagination.totalPages}
            className="h-8 rounded-lg border border-border px-3 text-sm text-ink-body disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
