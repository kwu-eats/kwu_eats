'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

import { useCategories } from '@/hooks/queries/useCategories';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/mutations/useCategoryMutations';
import type { Category } from '@pangchelin/types';

interface FormState {
  name: string;
  icon: string;
}

const EMPTY_FORM: FormState = { name: '', icon: '' };

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');

  function openAdd() {
    setForm(EMPTY_FORM);
    setError('');
    setShowAddModal(true);
  }

  function openEdit(category: Category) {
    setForm({ name: category.name, icon: category.icon ?? '' });
    setError('');
    setEditTarget(category);
  }

  function closeModals() {
    setShowAddModal(false);
    setEditTarget(null);
    setDeleteTargetId(null);
    setError('');
  }

  function handleAdd() {
    if (!form.name.trim()) {
      setError('카테고리 이름을 입력해주세요.');
      return;
    }
    createCategory.mutate(
      { name: form.name.trim(), icon: form.icon.trim() || undefined },
      {
        onSuccess: closeModals,
        onError: () => setError('이미 존재하는 카테고리 이름이에요.'),
      },
    );
  }

  function handleEdit() {
    if (!editTarget) return;
    if (!form.name.trim()) {
      setError('카테고리 이름을 입력해주세요.');
      return;
    }
    updateCategory.mutate(
      { id: editTarget.id, data: { name: form.name.trim(), icon: form.icon.trim() || undefined } },
      {
        onSuccess: closeModals,
        onError: () => setError('이미 존재하는 카테고리 이름이에요.'),
      },
    );
  }

  function handleDeleteConfirm() {
    if (!deleteTargetId) return;
    deleteCategory.mutate(deleteTargetId, { onSuccess: closeModals });
  }

  const isMutating =
    createCategory.isPending || updateCategory.isPending || deleteCategory.isPending;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold font-body text-ink-primary">카테고리 관리</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 h-9 rounded-lg bg-primary-500 px-4 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          카테고리 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              {['아이콘', '이름', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              : categories?.length === 0
              ? (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-sm text-ink-muted">
                    등록된 카테고리가 없어요
                  </td>
                </tr>
              )
              : categories?.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 w-16 text-xl">{c.icon ?? '—'}</td>
                    <td className="px-4 py-3 font-medium text-ink-primary">{c.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(c)}
                          className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink-body hover:bg-muted transition-colors"
                        >
                          <Pencil size={13} />
                          수정
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(c.id)}
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

      {/* 추가 / 수정 모달 */}
      {(showAddModal || editTarget) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-ink-primary">
                {editTarget ? '카테고리 수정' : '카테고리 추가'}
              </h3>
              <button onClick={closeModals} className="text-ink-muted hover:text-ink-body">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">
                  아이콘 (이모지)
                </label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="예: 🍜"
                  className="w-full h-11 rounded-xl border border-border bg-canvas px-3 text-xl text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary-400"
                  style={{ fontSize: '1.25rem' }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">
                  카테고리 이름 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }));
                    setError('');
                  }}
                  placeholder="예: 한식, 중식, 카페"
                  maxLength={50}
                  className="w-full h-11 rounded-xl border border-border bg-canvas px-3 text-base text-ink-primary placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-primary-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') editTarget ? handleEdit() : handleAdd();
                  }}
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={closeModals}
                className="h-11 flex-1 rounded-xl border border-border text-sm text-ink-body"
              >
                취소
              </button>
              <button
                onClick={editTarget ? handleEdit : handleAdd}
                disabled={isMutating}
                className="h-11 flex-1 rounded-xl bg-primary-500 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Check size={15} />
                {isMutating ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-ink-primary">카테고리 삭제</h3>
            <p className="text-sm text-ink-muted">
              삭제하면 이 카테고리가 연결된 모든 식당에서 해제돼요. 계속할까요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeModals}
                className="h-11 flex-1 rounded-xl border border-border text-sm text-ink-body"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isMutating}
                className="h-11 flex-1 rounded-xl bg-red-500 text-sm font-medium text-white disabled:opacity-50"
              >
                {isMutating ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
