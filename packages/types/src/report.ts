export type ReportType =
  | 'RESTAURANT_INFO'
  | 'MENU_CHANGE'
  | 'NEW_RESTAURANT'
  | 'CLOSED';

export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'APPLIED';

export interface Report {
  id: string;
  type: ReportType;
  restaurantId?: string | null;
  menuId?: string | null;
  reporterName?: string | null;
  reporterContact?: string | null;
  content: string;
  suggestedData: Record<string, unknown>;
  imageUrls: string[];
  status: ReportStatus;
  adminNote?: string | null;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportDto {
  type: ReportType;
  restaurantId?: string;
  menuId?: string;
  reporterName?: string;
  reporterContact?: string;
  content: string;
  suggestedData: Record<string, unknown>;
  imageUrls?: string[];
}
