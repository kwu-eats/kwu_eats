import type { CreateReportRequest, CreateReportResponse, Report } from '@pangchelin/types';

import { apiFetch } from './client';

export function submitReport(data: CreateReportRequest): Promise<CreateReportResponse> {
  return apiFetch('/reports', { method: 'POST', body: JSON.stringify(data) });
}

// --- Admin ---

export interface AdminReportListParams {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedReports {
  items: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminReportStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  applied: number;
  thisWeek: { reports: number; approved: number };
  thisMonth: { reports: number; approved: number };
}

export type ReportWithCurrentData = Report & {
  currentData: Record<string, unknown> | null;
};

function toQueryString(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) q.set(key, String(value));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export function getAdminReports(
  params: AdminReportListParams,
  token: string,
): Promise<PaginatedReports> {
  return apiFetch(`/admin/reports${toQueryString(params as Record<string, unknown>)}`, { token });
}

export function getAdminReport(id: string, token: string): Promise<ReportWithCurrentData> {
  return apiFetch(`/admin/reports/${id}`, { token });
}

export function getAdminReportStats(token: string): Promise<AdminReportStats> {
  return apiFetch('/admin/reports/stats', { token });
}

export function approveReport(
  id: string,
  data: { applyNow?: boolean; editedData?: Record<string, unknown> },
  token: string,
): Promise<Report> {
  return apiFetch(`/admin/reports/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export function rejectReport(id: string, reason: string, token: string): Promise<Report> {
  return apiFetch(`/admin/reports/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
    token,
  });
}
