import type { Perfil } from './perfis';

export const DEFAULT_ROUTE_BY_PERFIL: Record<Perfil, string> = {
  PACIENTE: '/paciente/dashboard',
  RECEPCIONISTA: '/recepcionista/dashboard',
  ADMIN: '/admin/dashboard',
};

export function getDefaultRouteByPerfil(perfil?: Perfil | null) {
  if (!perfil) {
    return '/login';
  }

  return DEFAULT_ROUTE_BY_PERFIL[perfil];
}
