export interface Restaurant {
  id: number;
  name: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  price: number;
  menuName: string;
  category: string;
  imageUrl: string | null;
  viewCount: number;
  likeCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
