import type {
  CreateRestaurantRequest,
  RestaurantListItem,
  RestaurantQueryParams,
  RestaurantWithRelations,
  UpdateRestaurantRequest,
} from '@pangchelin/types';

import { apiFetch } from './client';

function toQueryString(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined && v !== null) q.append(key, String(v));
      }
    } else {
      q.set(key, String(value));
    }
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export function getRestaurants(params: RestaurantQueryParams = {}): Promise<RestaurantListItem[]> {
  return apiFetch(`/restaurants${toQueryString(params as Record<string, unknown>)}`);
}

export function getRestaurant(id: string): Promise<RestaurantWithRelations> {
  return apiFetch(`/restaurants/${id}`);
}

export function createRestaurant(
  data: CreateRestaurantRequest,
  token: string,
): Promise<RestaurantWithRelations> {
  return apiFetch('/restaurants', { method: 'POST', body: JSON.stringify(data), token });
}

export function updateRestaurant(
  id: string,
  data: UpdateRestaurantRequest,
  token: string,
): Promise<RestaurantWithRelations> {
  return apiFetch(`/restaurants/${id}`, { method: 'PATCH', body: JSON.stringify(data), token });
}

export function deleteRestaurant(id: string, token: string): Promise<void> {
  return apiFetch(`/restaurants/${id}`, { method: 'DELETE', token });
}
