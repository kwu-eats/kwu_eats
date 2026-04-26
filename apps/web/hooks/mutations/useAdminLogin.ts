'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';

export function useAdminLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.admin);
      router.push('/admin/reports');
    },
  });
}
