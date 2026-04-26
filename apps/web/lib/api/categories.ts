import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@pangchelin/types';

import { apiFetch } from './client';

export function getCategories(): Promise<Category[]> {
  return apiFetch('/categories');
}

export function createCategory(data: CreateCategoryRequest, token: string): Promise<Category> {
  return apiFetch('/categories', { method: 'POST', body: JSON.stringify(data), token });
}

export function updateCategory(
  id: string,
  data: UpdateCategoryRequest,
  token: string,
): Promise<Category> {
  return apiFetch(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data), token });
}

export function deleteCategory(id: string, token: string): Promise<void> {
  return apiFetch(`/categories/${id}`, { method: 'DELETE', token });
}
