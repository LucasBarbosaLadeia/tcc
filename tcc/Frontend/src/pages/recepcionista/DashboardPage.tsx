import { Link } from 'react-router-dom';
import { Calendar, CalendarCheck, Clock, UserPlus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAgendamentos, useConfirmarPresenca } from '@/hooks/useAgendamentos';
import { useAllPacientes } from '@/hooks/usePaciente';
import { useHorarios } from '@/hooks/useHorarios';

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.nome?.split(' ')[0] ?? 'Usuário';
  const { data: agendamentos } = useAgendamentos();
  const { data: pacientes } = useAllPacientes();
  const { data: horarios } = useHorarios();
  const confirmarMutation = useConfirmarPresenca();

  const hoje = new Date().toDateString();
  const agendamentosHoje = (agendamentos ?? []).filter(
    (a) => a.horario?.data_hora_inicio && new Date(a.horario.data_hora_inicio).toDateString() === hoje
  );
  const aguardando = agendamentosHoje.filter((a) => a.status === 'Agendado');

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
        <p className="text-sm font-medium opacity-80 mb-1">Painel de Recepção</p>
        <h2 className="text-2xl font-bold">Olá, {firstName}!</h2>
        <p className="text-sm opacity-75 mt-1">Gerencie os agendamentos e pacientes da unidade.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Agendamentos hoje"         value={agendamentosHoje.length}   icon={CalendarCheck} color="teal"   />
        <StatCard label="Aguardando atendimento"    value={aguardando.length}         icon={Clock}         color="orange" />
        <StatCard label="Pacientes cadastrados"     value={pacientes?.length ?? 0}    icon={Users}         color="blue"   />
        <StatCard label="Horários disponíveis"      value={horarios?.length ?? 0}     icon={Calendar}      color="green"  />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/recepcionista/agendamentos"
          className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-teal-200 hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
            <CalendarCheck size={20} className="text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Novo Agendamento</p>
            <p className="text-xs text-gray-400 mt-0.5">Agendar consulta para um paciente</p>
          </div>
        </Link>

        <Link
          to="/recepcionista/pacientes"
          className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
            <UserPlus size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Buscar Paciente</p>
            <p className="text-xs text-gray-400 mt-0.5">Localizar ou cadastrar paciente</p>
          </div>
        </Link>
      </div>

      {/* Today's schedule */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Agenda de Hoje</h3>
        </div>
        {agendamentosHoje.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Nenhum agendamento para hoje"
            description="Os agendamentos do dia aparecerão aqui assim que forem criados."
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Horário</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {agendamentosHoje.map((a) => (
                <tr key={a.id_agendamento} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">{a.codigo_agendamento}</td>
                  <td className="px-5 py-3 text-gray-600 hidden sm:table-cell">
                    {a.horario?.data_hora_inicio
                      ? new Date(a.horario.data_hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      a.status === 'Agendado'   ? 'bg-blue-50 text-blue-700'  :
                      a.status === 'Cancelado'  ? 'bg-red-50 text-red-700'   :
                      'bg-green-50 text-green-700'
                    }`}>{a.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {a.status === 'Agendado' && (
                      <button
                        onClick={async () => {
                          try {
                            await confirmarMutation.mutateAsync(a.id_agendamento);
                            toast.success('Presença confirmada!');
                          } catch (err) {
                            const reason = (err as any)?.response?.data?.error;
                            toast.error(reason ? `Erro ao confirmar presença: ${reason}` : 'Erro ao confirmar presença.');
                          }
                        }}
                        disabled={confirmarMutation.isPending}
                        className="text-xs text-teal-600 hover:text-teal-800 font-medium transition-colors disabled:opacity-50"
                      >
                        Confirmar presença
                      </button>
                    )}
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
