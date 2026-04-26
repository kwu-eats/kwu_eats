import { useMutation } from '@tanstack/react-query';

import type { CreateReportRequest } from '@pangchelin/types';

import { submitReport } from '../../lib/api/reports';

export function useSubmitReport() {
  return useMutation({
    mutationFn: (data: CreateReportRequest) => submitReport(data),
  });
}
