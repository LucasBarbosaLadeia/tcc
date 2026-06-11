import { Link } from 'react-router-dom';
import { AlertCircle, Calendar, CheckCircle2, Plus, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAgendamentos } from '@/hooks/useAgendamentos';

const STATUS_BADGE: Record<string, string> = {
  Agendado:    'bg-blue-50 text-blue-700',
  Cancelado:   'bg-red-50 text-red-700',
  'Concluído': 'bg-green-50 text-green-700',
  Falta:       'bg-orange-50 text-orange-700',
  Realizada:   'bg-green-50 text-green-700',
};

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.nome?.split(' ')[0] ?? 'Usuário';
  const { data: agendamentos } = useAgendamentos();

  const lista = agendamentos ?? [];
  const proximas   = lista.filter((a) => a.status === 'Agendado');
  const realizadas = lista.filter((a) => a.status === 'Realizada' || a.status === 'Concluído');
  const canceladas = lista.filter((a) => a.status === 'Cancelado');
  const faltas     = lista.filter((a) => a.status === 'Falta');

  const proximaConsulta = proximas
    .filter((a) => a.horario?.data_hora_inicio)
    .sort((a, b) => new Date(a.horario!.data_hora_inicio).getTime() - new Date(b.horario!.data_hora_inicio).getTime())[0];

  const historico = [...realizadas, ...canceladas, ...faltas]
    .filter((a) => a.horario?.data_hora_inicio)
    .sort((a, b) => new Date(b.horario!.data_hora_inicio).getTime() - new Date(a.horario!.data_hora_inicio).getTime())
    .slice(0, 5);

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
        <StatCard label="Próximas consultas"   value={proximas.length}   icon={Calendar}      color="teal"   />
        <StatCard label="Consultas realizadas" value={realizadas.length} icon={CheckCircle2}  color="green"  />
        <StatCard label="Consultas canceladas" value={canceladas.length} icon={XCircle}       color="orange" />
        <StatCard label="Faltas registradas"   value={faltas.length}     icon={AlertCircle}   color="red"    />
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
        {!proximaConsulta ? (
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
        ) : (
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">{proximaConsulta.codigo_agendamento}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(proximaConsulta.horario!.data_hora_inicio).toLocaleString('pt-BR', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              Agendado
            </span>
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Histórico Recente</h3>
        </div>
        {historico.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Nenhum histórico ainda"
            description="Suas consultas realizadas aparecerão aqui."
          />
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-50">
              {historico.map((a) => (
                <tr key={a.id_agendamento} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">{a.codigo_agendamento}</td>
                  <td className="px-5 py-3 text-xs text-gray-500 hidden sm:table-cell">
                    {new Date(a.horario!.data_hora_inicio).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[a.status] ?? ''}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
