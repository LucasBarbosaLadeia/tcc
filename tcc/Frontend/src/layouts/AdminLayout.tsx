import { Award, Building2, CalendarDays, LayoutDashboard, Stethoscope, Users } from 'lucide-react';
import { AppLayout, type NavItem } from '@/components/layout/AppLayout';

const navItems: NavItem[] = [
  { path: '/admin/dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/admin/usuarios',       label: 'Usuários',       icon: Users },
  { path: '/admin/profissionais',  label: 'Profissionais',  icon: Stethoscope },
  { path: '/admin/unidades',       label: 'Unidades',       icon: Building2 },
  { path: '/admin/especialidades', label: 'Especialidades', icon: Award },
  { path: '/admin/agendas',        label: 'Agendas',        icon: CalendarDays },
];

export function AdminLayout() {
  return <AppLayout navItems={navItems} />;
}
