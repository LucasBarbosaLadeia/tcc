import { Navigate } from "react-router-dom";
import { getDefaultRouteByPerfil } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";

export function HomeRedirect() {
  const perfil = useAuthStore((state) => state.perfil);

  return <Navigate to={getDefaultRouteByPerfil(perfil)} replace />;
}
