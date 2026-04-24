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

export interface RestaurantInfoSuggestedData {
  phone?: string;
  address?: string;
  businessHours?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MenuChangeSuggestedData {
  menuName: string;
  action: 'UPDATE' | 'ADD' | 'DELETE';
  oldPrice?: number;
  newPrice?: number;
}

export interface NewRestaurantSuggestedData {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  menus?: Array<{ name: string; price: number }>;
}

export interface ClosedSuggestedData {
  reason?: string;
}

export type SuggestedData =
  | RestaurantInfoSuggestedData
  | MenuChangeSuggestedData
  | NewRestaurantSuggestedData
  | ClosedSuggestedData;

export interface CreateReportRequest {
  type: ReportType;
  restaurantId?: string;
  menuId?: string;
  reporterName?: string;
  reporterContact?: string;
  content: string;
  suggestedData: SuggestedData;
  imageUrls?: string[];
}

export interface CreateReportResponse {
  id: string;
  status: ReportStatus;
  createdAt: string;
}
