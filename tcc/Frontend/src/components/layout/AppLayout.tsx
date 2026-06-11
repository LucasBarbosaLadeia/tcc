import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HeartPulse, Menu, X, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const PERFIL_PT: Record<string, string> = {
  PACIENTE: 'Paciente',
  RECEPCIONISTA: 'Recepcionista',
  ADMIN: 'Administrador',
};

export function AppLayout({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const initials = user?.nome
    ? user.nome.trim().split(/\s+/).slice(0, 2).map((n) => n[0].toUpperCase()).join('')
    : 'U';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-white border-r border-gray-100',
          'transition-transform duration-200 ease-in-out',
          'md:relative md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
            <HeartPulse size={18} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 leading-none">Saúde na Mão</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Sistema Municipal</p>
          </div>
          <button
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 md:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
                ].join(' ')}
              >
                <Icon size={18} className={active ? 'text-teal-600' : 'text-gray-400'} />
                <span className="flex-1">{label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-3 border-t border-gray-100 space-y-1 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-teal-700">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.nome ?? 'Usuário'}</p>
              <p className="text-[11px] text-gray-400 truncate">
                {PERFIL_PT[user?.perfil ?? ''] ?? user?.perfil ?? ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={17} />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center h-16 px-4 gap-3 bg-white border-b border-gray-100 shrink-0">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
            className="p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
              <span className="text-xs font-bold text-teal-700">{initials}</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user?.nome ?? 'Usuário'}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
