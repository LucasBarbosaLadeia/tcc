import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      token: state.token,
      user: state.user,
      perfil: state.perfil,
      isAuthenticated: state.isAuthenticated,
      login: state.login,
      logout: state.logout,
    })),
  );
}
