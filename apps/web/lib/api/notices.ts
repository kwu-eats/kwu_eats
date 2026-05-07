import type {
  CreateNoticeRequest,
  Notice,
  NoticeListResponse,
  NoticeQueryParams,
  UpdateNoticeRequest,
} from '@pangchelin/types';

import { apiFetch } from './client';

function buildQuery(params: NoticeQueryParams): string {
  const sp = new URLSearchParams();
  if (params.category) sp.set('category', params.category);
  if (params.page) sp.set('page', String(params.page));
  if (params.limit) sp.set('limit', String(params.limit));
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export function getNotices(
  params: NoticeQueryParams = {},
): Promise<NoticeListResponse> {
  return apiFetch(`/notices${buildQuery(params)}`);
}

export function getNotice(id: string): Promise<Notice> {
  return apiFetch(`/notices/${id}`);
}

export function createNotice(
  data: CreateNoticeRequest,
  token: string,
): Promise<Notice> {
  return apiFetch('/notices', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export function updateNotice(
  id: string,
  data: UpdateNoticeRequest,
  token: string,
): Promise<Notice> {
  return apiFetch(`/notices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
}

export function deleteNotice(id: string, token: string): Promise<void> {
  return apiFetch(`/notices/${id}`, { method: 'DELETE', token });
}
