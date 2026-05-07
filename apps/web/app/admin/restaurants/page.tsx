'use client';

import type { Zone } from '@pangchelin/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useDeleteRestaurant } from '@/hooks/mutations/useRestaurantMutations';
import { useRestaurants } from '@/hooks/queries/useRestaurants';

const ZONE_LABEL: Record<Zone, string> = {
  KWANGWOON_STATION: '광운대역',
  FRONT_GATE: '정문',
  BACK_GATE: '후문',
  UICHEON: '우이천',
};

export default function AdminRestaurantsPage() {
  const router = useRouter();
  const { data: restaurants, isLoading } = useRestaurants();
  const deleteRestaurant = useDeleteRestaurant();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  function handleDeleteConfirm() {
    if (!deleteTargetId) return;
    deleteRestaurant.mutate(deleteTargetId, {
      onSuccess: () => setDeleteTargetId(null),
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold font-body text-ink-primary">식당 관리</h1>
        <button
          onClick={() => router.push('/admin/restaurants/new')}
          className="flex items-center gap-2 h-9 rounded-lg bg-primary-500 px-4 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          식당 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              {['식당명', '구역', '카테고리', '제휴', ''].map((h) => (
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
              : restaurants?.length === 0
              ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-ink-muted">
                    등록된 식당이 없어요
                  </td>
                </tr>
              )
              : restaurants?.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-ink-primary">{r.name}</td>
                    <td className="px-4 py-3 text-ink-body">
                      {ZONE_LABEL[r.zone as Zone] ?? r.zone}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {r.categories?.map((c) => c.name ?? (c as unknown as { category: { name: string } }).category?.name).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {r.isPartner
                        ? <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600">제휴</span>
                        : <span className="text-ink-muted">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => router.push(`/admin/restaurants/${r.id}`)}
                          className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink-body hover:bg-muted transition-colors"
                        >
                          <Pencil size={13} />
                          수정
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(r.id)}
                          className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-ink-primary">식당 삭제</h3>
            <p className="text-sm text-ink-muted">
              삭제하면 해당 식당의 메뉴와 제보 데이터도 함께 삭제돼요. 계속할까요?
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
                disabled={deleteRestaurant.isPending}
                className="h-11 flex-1 rounded-xl bg-red-500 text-sm font-medium text-white disabled:opacity-50"
              >
                {deleteRestaurant.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
