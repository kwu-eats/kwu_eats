import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  CreateNoticeRequest,
  UpdateNoticeRequest,
} from '@pangchelin/types';

import {
  createNotice,
  deleteNotice,
  updateNotice,
} from '@/lib/api/notices';
import { useAuthStore } from '@/lib/stores/authStore';

export function useCreateNotice() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNoticeRequest) => createNotice(data, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notices'] }),
  });
}

export function useUpdateNotice() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateNoticeRequest;
    }) => updateNotice(id, data, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notices'] }),
  });
}

export function useDeleteNotice() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotice(id, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notices'] }),
  });
}
