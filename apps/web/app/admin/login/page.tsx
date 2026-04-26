'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useAdminLogin } from '@/hooks/mutations/useAdminLogin';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useAdminLogin();

  const inputBase =
    'h-12 w-full rounded-lg border border-border bg-surface px-3 text-base font-body text-ink-primary placeholder:text-ink-subtle focus:border-primary-500 focus:outline-none';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했어요';
      toast.error(message);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-display text-primary-500">팡슐랭</h1>
          <p className="text-sm font-body text-ink-muted">관리자 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-body font-medium text-ink-body">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pangchelin.dev"
              autoComplete="email"
              className={inputBase}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-body font-medium text-ink-body">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className={inputBase}
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="flex w-full items-center justify-center h-12 rounded-lg bg-primary-500 text-surface text-sm font-body font-medium disabled:opacity-50"
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
