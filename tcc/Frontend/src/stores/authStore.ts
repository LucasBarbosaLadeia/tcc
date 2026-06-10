import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Perfil } from '@/constants/perfis';
import type { User } from '@/types/user';

interface AuthState {
  token: string | null;
  user: User | null;
  perfil: Perfil | null;
  isAuthenticated: boolean;
  login: (payload: { token: string; user: User; perfil?: Perfil }) => void;
  logout: () => void;
}

const initialState = {
  token: null,
  user: null,
  perfil: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      login: ({ token, user, perfil }) =>
        set({
          token,
          user,
          perfil: perfil ?? user.perfil,
          isAuthenticated: true,
        }),
      logout: () => set({ ...initialState }),
    }),
    {
      name: 'saude-na-mao-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        perfil: state.perfil,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
