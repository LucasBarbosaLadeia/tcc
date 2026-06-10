import {
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  AdminLayout,
  AuthLayout,
  PacienteLayout,
  RecepcionistaLayout,
} from "@/layouts";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";
import { HomeRedirect } from "./HomeRedirect";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage as PacienteDashboardPage } from "@/pages/paciente/DashboardPage";
import { PerfilPage } from "@/pages/paciente/PerfilPage";
import { AgendamentosPage as PacienteAgendamentosPage } from "@/pages/paciente/AgendamentosPage";
import { DashboardPage as RecepcionistaDashboardPage } from "@/pages/recepcionista/DashboardPage";
import { PacientesPage as RecepcionistaPacientesPage } from "@/pages/recepcionista/PacientesPage";
import { AgendamentosPage as RecepcionistaAgendamentosPage } from "@/pages/recepcionista/AgendamentosPage";
import { DashboardPage as AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { UsuariosPage } from "@/pages/admin/UsuariosPage";
import { PacientesPage as AdminPacientesPage } from "@/pages/admin/PacientesPage";
import { AgendamentosPage as AdminAgendamentosPage } from "@/pages/admin/AgendamentosPage";
import { ProfissionaisPage } from "@/pages/admin/ProfissionaisPage";
import { UnidadesPage } from "@/pages/admin/UnidadesPage";
import { EspecialidadesPage } from "@/pages/admin/EspecialidadesPage";
import { AgendasPage } from "@/pages/admin/AgendasPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<AuthLayout />}>
        <Route index element={<LoginPage />} />
      </Route>

      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<HomeRedirect />} />

        <Route element={<RoleGuard allowedRoles={["PACIENTE"]} />}>
          <Route path="paciente" element={<PacienteLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PacienteDashboardPage />} />
            <Route path="perfil" element={<PerfilPage />} />
            <Route path="agendamentos" element={<PacienteAgendamentosPage />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={["RECEPCIONISTA"]} />}>
          <Route path="recepcionista" element={<RecepcionistaLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RecepcionistaDashboardPage />} />
            <Route path="pacientes" element={<RecepcionistaPacientesPage />} />
            <Route
              path="agendamentos"
              element={<RecepcionistaAgendamentosPage />}
            />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="pacientes" element={<AdminPacientesPage />} />
            <Route path="agendamentos" element={<AdminAgendamentosPage />} />
            <Route path="profissionais" element={<ProfissionaisPage />} />
            <Route path="unidades" element={<UnidadesPage />} />
            <Route path="especialidades" element={<EspecialidadesPage />} />
            <Route path="agendas" element={<AgendasPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>,
  ),
);
