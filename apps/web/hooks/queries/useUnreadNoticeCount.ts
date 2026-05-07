'use client';

import { useEffect, useState } from 'react';

import { useNotices } from './useNotices';

const NOTICE_LAST_SEEN_KEY = 'pangchelin-notice-last-seen';

/**
 * 메뉴 배지용 — 사용자가 마지막으로 /notice 페이지를 열어본 시각 이후에
 * 게시된 공지의 수를 세어 반환. localStorage 미접근 시 (SSR/첫 렌더) 0 반환.
 */
export function useUnreadNoticeCount(): number {
  const { data } = useNotices({ limit: 100 });
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(NOTICE_LAST_SEEN_KEY);
    setLastSeen(stored ? new Date(stored) : null);
    setHydrated(true);
  }, []);

  if (!hydrated || !data) return 0;

  if (!lastSeen) {
    // 한 번도 본 적 없음 → 모두 미확인
    return data.items.length;
  }

  return data.items.filter((n) => new Date(n.publishedAt) > lastSeen).length;
}
