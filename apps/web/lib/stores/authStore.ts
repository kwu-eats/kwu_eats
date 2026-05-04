import type { Admin } from '@pangchelin/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  admin: Admin | null;
  setAuth: (token: string, admin: Admin) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      setAuth: (token, admin) => set({ token, admin }),
      clearAuth: () => set({ token: null, admin: null }),
    }),
    { name: 'pangchelin-auth' },
  ),
);
