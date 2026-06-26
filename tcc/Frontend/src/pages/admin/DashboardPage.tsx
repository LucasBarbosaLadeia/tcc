import { Link } from 'react-router-dom';
import { Award, Building2, CalendarDays, ChevronRight, Stethoscope, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/ui/StatCard';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useProfissionais } from '@/hooks/useProfissionais';
import { useUnidades } from '@/hooks/useUnidades';
import { useEspecialidades } from '@/hooks/useEspecialidades';
import { ConsultasChart } from '@/components/charts/ConsultasChart';

const modules = [
  { to: '/admin/usuarios',       label: 'Usuários',       desc: 'Gerenciar contas',             icon: Users,       color: 'bg-blue-50 text-blue-600'   },
  { to: '/admin/profissionais',  label: 'Profissionais',  desc: 'Médicos e enfermeiros',         icon: Stethoscope, color: 'bg-teal-50 text-teal-600'   },
  { to: '/admin/unidades',       label: 'Unidades',       desc: 'UBS, UPA e postos',            icon: Building2,   color: 'bg-purple-50 text-purple-600'},
  { to: '/admin/especialidades', label: 'Especialidades', desc: 'Áreas de atuação',             icon: Award,       color: 'bg-orange-50 text-orange-600'},
  { to: '/admin/agendas',        label: 'Agendas',        desc: 'Horários por profissional',    icon: CalendarDays,color: 'bg-green-50 text-green-600'  },
];

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.nome?.split(' ')[0] ?? 'Admin';
  const { data: usuarios } = useUsuarios();
  const { data: profissionais } = useProfissionais();
  const { data: unidades } = useUnidades();
  const { data: especialidades } = useEspecialidades();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 p-6 text-white">
        <p className="text-sm font-medium opacity-70 mb-1">Painel Administrativo</p>
        <h2 className="text-2xl font-bold">Olá, {firstName}!</h2>
        <p className="text-sm opacity-60 mt-1">Visão geral do sistema Saúde na Mão.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Usuários cadastrados" value={usuarios?.length ?? 0}      icon={Users}       color="blue"   />
        <StatCard label="Profissionais ativos"  value={profissionais?.length ?? 0} icon={Stethoscope} color="teal"   />
        <StatCard label="Unidades de saúde"     value={unidades?.length ?? 0}      icon={Building2}   color="purple" />
        <StatCard label="Especialidades"        value={especialidades?.length ?? 0} icon={Award}       color="orange" />
      </div>

      {/* Quick access */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Acesso Rápido</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map(({ to, label, desc, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 truncate">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Charts */}
      <ConsultasChart />
    </div>
  );
}
