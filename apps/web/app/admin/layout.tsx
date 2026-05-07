'use client';

import { ClipboardList, LogOut, Map, Megaphone, Store, Tag } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/lib/stores/authStore';

const NAV_ITEMS = [
  { href: '/admin/reports', label: '제보 관리', icon: ClipboardList },
  { href: '/admin/restaurants', label: '식당 관리', icon: Store },
  { href: '/admin/categories', label: '카테고리 관리', icon: Tag },
  { href: '/admin/notices', label: '공지 관리', icon: Megaphone },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const admin = useAuthStore((s) => s.admin);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [token, pathname, router]);

  if (!token) {
    // 로그인 페이지는 사이드바 없이 렌더링
    if (pathname === '/admin/login') return <>{children}</>;
    return null; // useEffect에서 /admin/login으로 리다이렉트
  }

  function handleLogout() {
    clearAuth();
    router.replace('/admin/login');
  }

  return (
    <div className="flex min-h-dvh bg-canvas">
      {/* 사이드바 */}
      <aside className="w-56 shrink-0 flex flex-col bg-surface border-r border-border">
        <div className="h-14 flex items-center px-5 border-b border-border">
          <span className="font-display text-lg text-primary-500">팡슐랭</span>
          <span className="ml-1.5 text-xs font-body text-ink-muted">관리자</span>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-body transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-ink-body hover:bg-muted'
                }`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 w-full h-9 rounded-lg border border-border px-3 text-xs font-body text-ink-body hover:bg-muted transition-colors"
          >
            <Map size={14} strokeWidth={1.75} />
            지도로 이동
          </Link>

          <div className="space-y-1">
            <p className="text-xs font-body text-ink-muted truncate">{admin?.name}</p>
            <p className="text-xs font-body text-ink-subtle truncate">{admin?.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex items-center gap-2 text-xs font-body text-ink-muted hover:text-ink-primary transition-colors"
            >
              <LogOut size={14} strokeWidth={1.75} />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* 본문 */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
