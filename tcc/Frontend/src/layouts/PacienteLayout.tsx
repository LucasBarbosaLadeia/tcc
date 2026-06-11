import { Calendar, LayoutDashboard, User } from 'lucide-react';
import { AppLayout, type NavItem } from '@/components/layout/AppLayout';

const navItems: NavItem[] = [
  { path: '/paciente/dashboard', label: 'Dashboard',          icon: LayoutDashboard },
  { path: '/paciente/agendamentos', label: 'Meus Agendamentos', icon: Calendar },
  { path: '/paciente/perfil',       label: 'Meu Perfil',        icon: User },
];

export function PacienteLayout() {
  return <AppLayout navItems={navItems} />;
}
