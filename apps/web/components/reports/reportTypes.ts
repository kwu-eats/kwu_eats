import type { ReportType } from '@pangchelin/types';

// 통합 폼 상태 — 모든 type의 suggestedData 필드를 union해서 보관
export interface ReportFormState {
  type: ReportType | null;
  restaurantId: string | null;
  restaurantName: string | null;
  menuId: string | null;
  suggestedData: {
    // RESTAURANT_INFO
    phone?: string;
    address?: string;
    businessHoursNote?: string;
    otherNote?: string;
    // MENU_CHANGE
    menuName?: string;
    action?: 'UPDATE' | 'ADD' | 'DELETE';
    oldPrice?: number;
    newPrice?: number;
    // NEW_RESTAURANT
    name?: string;
    latitude?: number;
    longitude?: number;
    menus?: Array<{ name: string; price: number }>;
    // CLOSED
    reason?: string;
  };
  imageUrls: string[];
  reporterName: string;
  reporterContact: string;
  content: string;
}

export const initialFormState: ReportFormState = {
  type: null,
  restaurantId: null,
  restaurantName: null,
  menuId: null,
  suggestedData: {},
  imageUrls: [],
  reporterName: '',
  reporterContact: '',
  content: '',
};
