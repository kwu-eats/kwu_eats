import { create } from 'zustand';

export type SheetSnap = 'peek' | 'half' | 'full';

interface SheetStore {
  snap: SheetSnap;
  setSnap: (snap: SheetSnap) => void;
}

export const useSheetStore = create<SheetStore>((set) => ({
  snap: 'peek',
  setSnap: (snap) => set({ snap }),
}));
