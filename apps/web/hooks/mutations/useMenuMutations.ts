import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMenu, updateMenu, deleteMenu } from '@/lib/api/menus';
import { useAuthStore } from '@/lib/stores/authStore';
import type { CreateMenuData, UpdateMenuData } from '@/lib/api/menus';

export function useCreateMenu(restaurantId: string) {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMenuData) => createMenu(restaurantId, data, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants', restaurantId] }),
  });
}

export function useUpdateMenu(restaurantId: string) {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuData }) =>
      updateMenu(id, data, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants', restaurantId] }),
  });
}

export function useDeleteMenu(restaurantId: string) {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMenu(id, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants', restaurantId] }),
  });
}
