import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '@/lib/api/restaurants';
import { useAuthStore } from '@/lib/stores/authStore';
import type { CreateRestaurantRequest, UpdateRestaurantRequest } from '@pangchelin/types';

export function useCreateRestaurant() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRestaurantRequest) => createRestaurant(data, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants'] }),
  });
}

export function useUpdateRestaurant(id: string) {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRestaurantRequest) => updateRestaurant(id, data, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants'] }),
  });
}

export function useDeleteRestaurant() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRestaurant(id, token!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['restaurants'] }),
  });
}
