import { create } from 'zustand';

export type Zone =
  | 'KWANGWOON_STATION'
  | 'FRONT_GATE'
  | 'BACK_GATE'
  | 'UICHEON';

interface FilterStore {
  zones: Zone[];
  categoryIds: string[];
  maxPrice: number | null;
  isOpen: boolean;
  toggleZone: (zone: Zone) => void;
  clearZones: () => void;
  toggleCategoryId: (id: string) => void;
  clearCategoryIds: () => void;
  setMaxPrice: (price: number | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  zones: [],
  categoryIds: [],
  maxPrice: null,
  isOpen: false,
  toggleZone: (zone) =>
    set((state) => ({
      zones: state.zones.includes(zone)
        ? state.zones.filter((z) => z !== zone)
        : [...state.zones, zone],
    })),
  clearZones: () => set({ zones: [] }),
  toggleCategoryId: (id) =>
    set((state) => ({
      categoryIds: state.categoryIds.includes(id)
        ? state.categoryIds.filter((c) => c !== id)
        : [...state.categoryIds, id],
    })),
  clearCategoryIds: () => set({ categoryIds: [] }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setIsOpen: (isOpen) => set({ isOpen }),
  reset: () =>
    set({ zones: [], categoryIds: [], maxPrice: null, isOpen: false }),
}));
