import { useQuery } from '@tanstack/react-query';

import type { RestaurantQueryParams } from '@pangchelin/types';

import { getRestaurant, getRestaurants } from '../../lib/api/restaurants';

export function useRestaurants(params: RestaurantQueryParams = {}) {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => getRestaurants(params),
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurants', id],
    queryFn: () => getRestaurant(id),
    enabled: !!id,
  });
}
