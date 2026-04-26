import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/api/categories';
import { useAuthStore } from '@/lib/stores/authStore';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@pangchelin/types';

export function useCreateCategory() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useUpdateCategory() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      updateCategory(id, data, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useDeleteCategory() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}
