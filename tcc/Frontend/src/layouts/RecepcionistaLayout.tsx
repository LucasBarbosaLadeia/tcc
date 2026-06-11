import { Calendar, CalendarDays, LayoutDashboard, Users } from 'lucide-react';
import { AppLayout, type NavItem } from '@/components/layout/AppLayout';

const navItems: NavItem[] = [
  { path: '/recepcionista/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/recepcionista/pacientes',    label: 'Pacientes',    icon: Users },
  { path: '/recepcionista/agendamentos', label: 'Agendamentos', icon: Calendar },
  { path: '/recepcionista/agendas',      label: 'Agendas',      icon: CalendarDays },
];

export function RecepcionistaLayout() {
  return <AppLayout navItems={navItems} />;
}
