export type Zone = 'KWANGWOON_STATION' | 'FRONT_GATE' | 'BACK_GATE' | 'UICHEON';

export type College =
  | 'AI_CONVERGENCE'
  | 'ENGINEERING'
  | 'NATURAL_SCIENCE'
  | 'BUSINESS'
  | 'ELECTRONICS_INFO'
  | 'HUMANITIES_SOCIAL'
  | 'POLICY_LAW'
  | 'FREE_MAJOR';

// 단과대학 표시명 (UI 노출용). 백엔드 enum 키 ↔ 한글명 매핑.
export const COLLEGE_LABELS: Record<College, string> = {
  AI_CONVERGENCE: '인공지능융합대학',
  ENGINEERING: '공과대학',
  NATURAL_SCIENCE: '자연과학대학',
  BUSINESS: '경영대학',
  ELECTRONICS_INFO: '전자정보공과대학',
  HUMANITIES_SOCIAL: '인문사회과학대학',
  POLICY_LAW: '정책법학대학',
  FREE_MAJOR: '자유전공학부',
};

export const COLLEGE_VALUES: College[] = [
  'AI_CONVERGENCE',
  'ENGINEERING',
  'NATURAL_SCIENCE',
  'BUSINESS',
  'ELECTRONICS_INFO',
  'HUMANITIES_SOCIAL',
  'POLICY_LAW',
  'FREE_MAJOR',
];

export interface RestaurantPartnership {
  id: string;
  college: College;
  instagramUrl: string;
}

export interface BusinessHours {
  open?: string;
  close?: string;
  closed?: boolean;
  /** 점심 등 브레이크 시작 (HH:MM) */
  breakStart?: string;
  /** 점심 등 브레이크 종료 (HH:MM) */
  breakEnd?: string;
}

export interface BusinessHoursMap {
  mon?: BusinessHours;
  tue?: BusinessHours;
  wed?: BusinessHours;
  thu?: BusinessHours;
  fri?: BusinessHours;
  sat?: BusinessHours;
  sun?: BusinessHours;
  /** 격주 휴무 등 정형 표현이 어려운 자유 텍스트 비고. 예: "둘째/넷째 토요일 휴무" */
  note?: string;
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
  /** 식당 대표 사진 URL (S3) */
  coverImageUrl?: string | null;
  /** 체인점 등 공식 메뉴 페이지 URL. 있으면 상세 페이지에서 "공식 메뉴 보기" 버튼 노출. */
  externalMenuUrl?: string | null;
  partnerships?: RestaurantPartnership[];
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantListItem extends Restaurant {
  isOpen: boolean;
  /** 마감 상태일 때 다음 영업 시작 시각 (ISO datetime, UTC). 영업 중이면 null. */
  nextOpenAt: string | null;
  categories: import('./category').Category[];
  featuredMenu?: import('./menu').Menu | null;
}

export interface RestaurantWithRelations extends Restaurant {
  isOpen: boolean;
  /** 마감 상태일 때 다음 영업 시작 시각 (ISO datetime, UTC). 영업 중이면 null. */
  nextOpenAt: string | null;
  categories: import('./category').Category[];
  menus: import('./menu').Menu[];
  partnerships: RestaurantPartnership[];
}

export interface PartnershipInput {
  college: College;
  instagramUrl: string;
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
  coverImageUrl?: string;
  externalMenuUrl?: string;
  partnerships?: PartnershipInput[];
  categoryIds?: string[];
}

export type UpdateRestaurantRequest = Partial<CreateRestaurantRequest>;

export interface RestaurantQueryParams {
  zones?: Zone[];
  categoryIds?: string[];
  maxPrice?: number;
  isPartner?: boolean;
  isOpen?: boolean;
}
