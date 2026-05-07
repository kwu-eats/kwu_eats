import { create } from 'zustand';

export type Zone = 'KWANGWOON_STATION' | 'FRONT_GATE' | 'BACK_GATE' | 'UICHEON' | null;

interface FilterStore {
  zone: Zone;
  categoryId: string | null;
  maxPrice: number | null;
  isOpen: boolean;
  setZone: (zone: Zone) => void;
  setCategoryId: (id: string | null) => void;
  setMaxPrice: (price: number | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  zone: null,
  categoryId: null,
  maxPrice: null,
  isOpen: false,
  setZone: (zone) => set({ zone }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setIsOpen: (isOpen) => set({ isOpen }),
  reset: () => set({ zone: null, categoryId: null, maxPrice: null, isOpen: false }),
}));
