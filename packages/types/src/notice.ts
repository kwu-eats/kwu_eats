export type NoticeCategory = 'ANNOUNCEMENT' | 'UPDATE' | 'EVENT';

export const NOTICE_CATEGORY_LABELS: Record<NoticeCategory, string> = {
  ANNOUNCEMENT: '공지',
  UPDATE: '업데이트',
  EVENT: '이벤트',
};

export const NOTICE_CATEGORY_VALUES: NoticeCategory[] = [
  'ANNOUNCEMENT',
  'UPDATE',
  'EVENT',
];

interface NoticeAuthor {
  id: string;
  name: string;
}

export interface NoticeListItem {
  id: string;
  title: string;
  category: NoticeCategory;
  isPinned: boolean;
  publishedAt: string;
  createdAt: string;
  author: NoticeAuthor | null;
}

export interface Notice extends NoticeListItem {
  content: string;
  updatedAt: string;
}

export interface NoticeListResponse {
  items: NoticeListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  category?: NoticeCategory;
  isPinned?: boolean;
  publishedAt?: string;
}

export type UpdateNoticeRequest = Partial<CreateNoticeRequest>;

export interface NoticeQueryParams {
  category?: NoticeCategory;
  page?: number;
  limit?: number;
}
