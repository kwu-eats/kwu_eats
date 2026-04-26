'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Script from 'next/script';

import { useAdminReport } from '@/hooks/queries/useReports';
import { useApproveReport } from '@/hooks/mutations/useApproveReport';
import { useRejectReport } from '@/hooks/mutations/useRejectReport';
import { clientEnv } from '@/env';
import type { ReportStatus, ReportType } from '@pangchelin/types';

const TYPE_LABEL: Record<ReportType, string> = {
  RESTAURANT_INFO: '정보 수정',
  MENU_CHANGE: '메뉴 변경',
  NEW_RESTAURANT: '신규 식당',
  CLOSED: '폐업',
};

const STATUS_CLASS: Record<ReportStatus, string> = {
  PENDING: 'bg-accent-100 text-accent-600',
  APPROVED: 'bg-blue-50 text-blue-600',
  REJECTED: 'bg-red-50 text-red-500',
  APPLIED: 'bg-green-50 text-green-600',
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING: '대기중',
  APPROVED: '승인됨',
  REJECTED: '반려됨',
  APPLIED: '반영됨',
};

const FIELD_LABEL: Record<string, string> = {
  name: '식당명',
  address: '주소',
  phone: '전화번호',
  category: '카테고리',
  businessHours: '영업시간',
  lat: '위도',
  lng: '경도',
  description: '설명',
};

function fieldLabel(key: string) {
  return FIELD_LABEL[key] ?? key;
}

function JsonBlock({ value }: { value: unknown }) {
  if (value === null || value === undefined) return <span className="text-ink-muted">—</span>;
  if (typeof value === 'object') {
    return (
      <pre className="whitespace-pre-wrap break-all text-xs text-ink-body">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }
  return <span className="text-sm text-ink-body">{String(value)}</span>;
}

function MiniKakaoMap({ lat, lng }: { lat: number; lng: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(
    typeof window !== 'undefined' && !!window.kakao?.maps,
  );

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;
    window.kakao.maps.load(() => {
      if (!containerRef.current) return;
      const center = new window.kakao.maps.LatLng(lat, lng);
      if (!mapRef.current) {
        mapRef.current = new window.kakao.maps.Map(containerRef.current, { center, level: 4 });
      } else {
        mapRef.current.setCenter(center);
      }
      if (markerRef.current) markerRef.current.setMap(null);
      markerRef.current = new window.kakao.maps.Marker({ position: center, map: mapRef.current! });
    });
  }, [scriptLoaded, lat, lng]);

  const sdkUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${clientEnv.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;

  return (
    <>
      <Script src={sdkUrl} strategy="afterInteractive" onLoad={() => setScriptLoaded(true)} />
      <div ref={containerRef} className="h-48 w-full overflow-hidden rounded-xl border border-border" />
    </>
  );
}

export default function AdminReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: report, isLoading } = useAdminReport(id);
  const approve = useApproveReport(id);
  const reject = useRejectReport(id);

  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = report as any;
  const suggested = ((report?.suggestedData ?? {}) as Record<string, unknown>);
  const current = ((report?.currentData ?? {}) as Record<string, unknown>);
  const allKeys = Array.from(new Set([...Object.keys(suggested), ...Object.keys(current)]));
  const isNew = report?.type === 'NEW_RESTAURANT';
  const isPending = report?.status === 'PENDING' || report?.status === 'APPROVED';

  function handleApprove() {
    approve.mutate(
      { applyNow: true },
      { onSuccess: () => { setShowApproveConfirm(false); router.push('/admin/reports'); } },
    );
  }

  function handleReject() {
    if (!rejectReason.trim()) return;
    reject.mutate(rejectReason.trim(), {
      onSuccess: () => {
        setShowRejectModal(false);
        setRejectReason('');
        router.push('/admin/reports');
      },
    });
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6 text-center text-sm text-ink-muted">제보를 찾을 수 없어요</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/reports')}
            className="mb-2 flex items-center gap-1 text-sm text-ink-muted hover:text-ink-body"
          >
            ← 목록으로
          </button>
          <h1 className="text-xl font-semibold font-body text-ink-primary">
            {TYPE_LABEL[report.type as ReportType] ?? report.type} 제보
          </h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            {r.restaurant?.name && (
              <span className="mr-2 font-medium text-ink-body">{r.restaurant.name}</span>
            )}
            {new Date(report.createdAt).toLocaleString('ko-KR', {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASS[report.status as ReportStatus]}`}>
          {STATUS_LABEL[report.status as ReportStatus] ?? report.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 좌측: 제보 내용 */}
        <div className="space-y-4">
          {/* 제보자 정보 */}
          <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
            <h2 className="text-sm font-semibold text-ink-primary">제보자 정보</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-ink-muted">닉네임</span>
              <span className="text-ink-body">{r.user?.nickname ?? '—'}</span>
              <span className="text-ink-muted">이메일</span>
              <span className="text-ink-body">{r.user?.email ?? '—'}</span>
            </div>
          </div>

          {/* 제보 내용 */}
          <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
            <h2 className="text-sm font-semibold text-ink-primary">제보 내용</h2>
            <p className="text-sm text-ink-body whitespace-pre-wrap">
              {report.content || <span className="text-ink-muted">내용 없음</span>}
            </p>
          </div>

          {/* 제안 데이터 */}
          {Object.keys(suggested).length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
              <h2 className="text-sm font-semibold text-ink-primary">제안 데이터</h2>
              <div className="space-y-1">
                {Object.entries(suggested).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                    <span className="text-ink-muted">{fieldLabel(key)}</span>
                    <JsonBlock value={val} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 첨부 이미지 */}
          {report.imageUrls && report.imageUrls.length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
              <h2 className="text-sm font-semibold text-ink-primary">첨부 이미지</h2>
              <div className="flex flex-wrap gap-2">
                {report.imageUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`첨부 ${i + 1}`}
                      className="h-24 w-24 rounded-lg object-cover border border-border hover:opacity-80 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 우측: 위치 미리보기 or 변경 비교 */}
        <div className="space-y-4">
          {isNew ? (
            <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
              <h2 className="text-sm font-semibold text-ink-primary">제안 위치</h2>
              {suggested.lat && suggested.lng ? (
                <>
                  <MiniKakaoMap lat={Number(suggested.lat)} lng={Number(suggested.lng)} />
                  <div className="grid grid-cols-2 gap-x-4 text-sm">
                    <span className="text-ink-muted">위도</span>
                    <span className="text-ink-body">{String(suggested.lat)}</span>
                    <span className="text-ink-muted">경도</span>
                    <span className="text-ink-body">{String(suggested.lng)}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-ink-muted">위치 정보 없음</p>
              )}
            </div>
          ) : (
            allKeys.length > 0 && (
              <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                <h2 className="text-sm font-semibold text-ink-primary">변경 비교</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-3 text-left text-xs font-medium text-ink-muted">항목</th>
                      <th className="py-2 pr-3 text-left text-xs font-medium text-ink-muted">현재</th>
                      <th className="py-2 text-left text-xs font-medium text-ink-muted">제안</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allKeys.map((key) => {
                      const cur = current[key];
                      const sug = suggested[key];
                      const changed =
                        JSON.stringify(cur) !== JSON.stringify(sug) && sug !== undefined;
                      return (
                        <tr
                          key={key}
                          className={`border-b border-border last:border-0 ${changed ? 'bg-yellow-50' : ''}`}
                        >
                          <td className="py-2 pr-3 align-top text-ink-muted">{fieldLabel(key)}</td>
                          <td className="py-2 pr-3 align-top">
                            <JsonBlock value={cur} />
                          </td>
                          <td className={`py-2 align-top ${changed ? 'font-medium text-primary-600' : ''}`}>
                            <JsonBlock value={sug} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* 반려 사유 (반려된 경우 표시) */}
          {report.status === 'REJECTED' && r.rejectionReason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-1">
              <h2 className="text-sm font-semibold text-red-600">반려 사유</h2>
              <p className="text-sm text-red-500 whitespace-pre-wrap">{r.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      {isPending && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setShowApproveConfirm(true)}
            className="h-11 flex-1 rounded-xl bg-primary-500 text-sm font-medium text-white hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            승인 및 즉시 반영
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className="h-11 flex-1 rounded-xl border border-border bg-surface text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            반려
          </button>
        </div>
      )}

      {/* 승인 확인 모달 */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-ink-primary">승인 및 즉시 반영</h3>
            <p className="text-sm text-ink-muted">
              제보 내용을 승인하고 바로 서비스에 반영할게요. 계속할까요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="h-11 flex-1 rounded-xl border border-border text-sm text-ink-body"
              >
                취소
              </button>
              <button
                onClick={handleApprove}
                disabled={approve.isPending}
                className="h-11 flex-1 rounded-xl bg-primary-500 text-sm font-medium text-white disabled:opacity-50"
              >
                {approve.isPending ? '처리 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 반려 사유 모달 */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-ink-primary">반려 사유 입력</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="반려 사유를 입력해주세요 (최소 5자)"
              rows={4}
              className="w-full rounded-xl border border-border bg-muted p-3 text-sm text-ink-body placeholder:text-ink-muted focus:border-primary-500 focus:outline-none resize-none"
            />
            {rejectReason.length > 0 && rejectReason.length < 5 && (
              <p className="text-xs text-red-500">최소 5자 이상 입력해주세요 ({rejectReason.length}/5)</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                className="h-11 flex-1 rounded-xl border border-border text-sm text-ink-body"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                disabled={rejectReason.trim().length < 5 || reject.isPending}
                className="h-11 flex-1 rounded-xl bg-red-500 text-sm font-medium text-white disabled:opacity-50"
              >
                {reject.isPending ? '처리 중...' : '반려하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
