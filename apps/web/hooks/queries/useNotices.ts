import { useQuery } from '@tanstack/react-query';

import type { NoticeQueryParams } from '@pangchelin/types';

import { getNotice, getNotices } from '../../lib/api/notices';

export function useNotices(params: NoticeQueryParams = {}) {
  return useQuery({
    queryKey: ['notices', params],
    queryFn: () => getNotices(params),
    staleTime: 60 * 1000,
  });
}

export function useNotice(id: string) {
  return useQuery({
    queryKey: ['notices', id],
    queryFn: () => getNotice(id),
    enabled: !!id,
  });
}
