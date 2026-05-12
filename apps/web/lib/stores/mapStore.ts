import { create } from 'zustand';

/**
 * 지도 뷰포트(중심 좌표 + 줌 레벨)를 보관.
 * 메뉴 상세 → 뒤로 가기 시 직전에 보던 위치/줌 으로 복원하기 위함.
 *
 * - in-memory: 새로고침 시 초기화 (KWU_CENTER level 5 로 다시 시작)
 * - SPA 네비게이션 (push/back) 사이엔 유지
 */
interface MapStore {
  center: { lat: number; lng: number } | null;
  level: number | null;
  setView: (center: { lat: number; lng: number }, level: number) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  center: null,
  level: null,
  setView: (center, level) => set({ center, level }),
}));
