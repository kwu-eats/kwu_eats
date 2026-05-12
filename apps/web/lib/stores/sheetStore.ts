import { create } from 'zustand';

export type SheetSnap = 'peek' | 'half' | 'full';

interface SheetStore {
  snap: SheetSnap;
  setSnap: (snap: SheetSnap) => void;
}

export const useSheetStore = create<SheetStore>((set) => ({
  // 첫 진입 시 환영 + 카테고리 + 식당 리스트 미리보기가 보이도록 half 기본.
  // 사용자가 지도 더 보고 싶으면 드래그 다운으로 peek 까지 내릴 수 있음.
  snap: 'half',
  setSnap: (snap) => set({ snap }),
}));
