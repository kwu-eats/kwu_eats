export type Zone = 'KWANGWOON_STATION' | 'FRONT_GATE' | 'BACK_GATE';

export interface BusinessHours {
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface BusinessHoursMap {
  mon?: BusinessHours;
  tue?: BusinessHours;
  wed?: BusinessHours;
  thu?: BusinessHours;
  fri?: BusinessHours;
  sat?: BusinessHours;
  sun?: BusinessHours;
}

export interface Restaurant {
  id: string;
  name: string;
  zone: Zone;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string | null;
  businessHours: BusinessHoursMap;
  isPartner: boolean;
  partnerInfo?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantListItem extends Restaurant {
  isOpen: boolean;
  categories: import('./category').Category[];
  featuredMenu?: import('./menu').Menu | null;
}

export interface RestaurantWithRelations extends Restaurant {
  isOpen: boolean;
  categories: import('./category').Category[];
  menus: import('./menu').Menu[];
}

export interface CreateRestaurantRequest {
  name: string;
  zone: Zone;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  businessHours: BusinessHoursMap;
  isPartner?: boolean;
  partnerInfo?: Record<string, unknown>;
  categoryIds?: string[];
}

export type UpdateRestaurantRequest = Partial<CreateRestaurantRequest>;

export interface RestaurantQueryParams {
  zone?: Zone;
  categoryId?: string;
  maxPrice?: number;
  isPartner?: boolean;
  isOpen?: boolean;
}
