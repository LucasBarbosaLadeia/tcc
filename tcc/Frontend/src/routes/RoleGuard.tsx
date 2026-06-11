import { Navigate, Outlet } from "react-router-dom";
import { getDefaultRouteByPerfil } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";
import type { Perfil } from "@/constants/perfis";

interface RoleGuardProps {
  allowedRoles: ReadonlyArray<Perfil>;
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const token = useAuthStore((state) => state.token);
  const perfil = useAuthStore((state) => state.perfil);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!perfil || !allowedRoles.includes(perfil)) {
    return <Navigate to={getDefaultRouteByPerfil(perfil)} replace />;
  }

  return <Outlet />;
}
