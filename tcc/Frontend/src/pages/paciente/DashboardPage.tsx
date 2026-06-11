import { Link } from 'react-router-dom';
import { AlertCircle, Calendar, CheckCircle2, Plus, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.nome?.split(' ')[0] ?? 'Usuário';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white">
        <p className="text-sm font-medium opacity-80 mb-1">Bem-vindo de volta,</p>
        <h2 className="text-2xl font-bold">{firstName}!</h2>
        <p className="text-sm opacity-75 mt-1">Acompanhe suas consultas e informações de saúde.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Próximas consultas"   value={0} icon={Calendar}      color="teal"   />
        <StatCard label="Consultas realizadas" value={0} icon={CheckCircle2}  color="green"  />
        <StatCard label="Consultas canceladas" value={0} icon={XCircle}       color="orange" />
        <StatCard label="Faltas registradas"   value={0} icon={AlertCircle}   color="red"    />
      </div>

      {/* Next appointment */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Próxima Consulta</h3>
          <Link
            to="/paciente/agendamentos"
            className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
          >
            <Plus size={14} />
            Agendar
          </Link>
        </div>
        <EmptyState
          icon={Calendar}
          title="Nenhuma consulta agendada"
          description="Você não possui consultas próximas. Agende uma para começar."
          action={
            <Link
              to="/paciente/agendamentos"
              className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Agendar consulta
            </Link>
          }
        />
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Histórico Recente</h3>
        </div>
        <EmptyState
          icon={CheckCircle2}
          title="Nenhum histórico ainda"
          description="Suas consultas realizadas aparecerão aqui."
        />
      </div>
    </div>
  );
}
