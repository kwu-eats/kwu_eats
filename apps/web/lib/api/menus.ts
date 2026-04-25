import type { Menu } from '@pangchelin/types';

import { apiFetch } from './client';

export interface CreateMenuData {
  name: string;
  price: number;
  imageUrl?: string;
  isSignature?: boolean;
}

export type UpdateMenuData = Partial<CreateMenuData>;

export function getMenus(restaurantId: string): Promise<Menu[]> {
  return apiFetch(`/restaurants/${restaurantId}/menus`);
}

export function createMenu(
  restaurantId: string,
  data: CreateMenuData,
  token: string,
): Promise<Menu> {
  return apiFetch(`/restaurants/${restaurantId}/menus`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export function updateMenu(id: string, data: UpdateMenuData, token: string): Promise<Menu> {
  return apiFetch(`/menus/${id}`, { method: 'PATCH', body: JSON.stringify(data), token });
}

export function deleteMenu(id: string, token: string): Promise<void> {
  return apiFetch(`/menus/${id}`, { method: 'DELETE', token });
}
