export interface MenuPriceOption {
  /** 옵션 라벨 (예: "소", "중", "대", "1인", "2인분") */
  label: string;
  /** 해당 옵션 가격 (원) */
  price: number;
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  /** 사이즈/옵션별 가격이 여러 개일 때 배열로. 단일 가격이면 null. */
  priceOptions?: MenuPriceOption[] | null;
  /** 카테고리 라벨 (예: "찌개류", "커피"). 없으면 "기타" 그룹으로 표시. */
  category?: string | null;
  imageUrl?: string | null;
  isSignature: boolean;
  createdAt: string;
  updatedAt: string;
}
