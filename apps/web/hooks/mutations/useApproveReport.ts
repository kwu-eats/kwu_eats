import { useMutation, useQueryClient } from '@tanstack/react-query';

import { approveReport } from '@/lib/api/reports';
import { useAuthStore } from '@/lib/stores/authStore';

export function useApproveReport(id: string) {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: { applyNow?: boolean; editedData?: Record<string, unknown> }) =>
      approveReport(id, data, token!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}
