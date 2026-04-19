export type Zone = 'GWANGWOON_STATION' | 'FRONT_GATE' | 'BACK_GATE';

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

export interface RestaurantWithRelations extends Restaurant {
  categories: import('./category').Category[];
  menus: import('./menu').Menu[];
}

export interface RestaurantListItem extends Restaurant {
  categories: import('./category').Category[];
  representativeMenu?: import('./menu').Menu | null;
}
