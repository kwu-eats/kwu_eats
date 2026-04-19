export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  isSignature: boolean;
  createdAt: string;
  updatedAt: string;
}
