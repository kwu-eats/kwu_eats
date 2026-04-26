import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rejectReport } from '@/lib/api/reports';
import { useAuthStore } from '@/lib/stores/authStore';

export function useRejectReport(id: string) {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => rejectReport(id, reason, token!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}
