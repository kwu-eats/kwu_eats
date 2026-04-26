import { useQuery } from '@tanstack/react-query';

import type { AdminReportListParams } from '../../lib/api/reports';
import { getAdminReport, getAdminReports, getAdminReportStats } from '../../lib/api/reports';
import { useAuthStore } from '../../lib/stores/authStore';

export function useAdminReports(params: AdminReportListParams = {}) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['admin', 'reports', params],
    queryFn: () => getAdminReports(params, token!),
    enabled: !!token,
  });
}

export function useAdminReport(id: string) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['admin', 'reports', id],
    queryFn: () => getAdminReport(id, token!),
    enabled: !!token && !!id,
  });
}

export function useAdminReportStats() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['admin', 'reports', 'stats'],
    queryFn: () => getAdminReportStats(token!),
    enabled: !!token,
  });
}
