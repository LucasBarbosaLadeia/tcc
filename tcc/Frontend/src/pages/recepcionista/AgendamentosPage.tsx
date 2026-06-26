import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Search, Stethoscope, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAgendamentos, useCancelAgendamento, useConfirmarPresenca, useRegistrarFalta } from '@/hooks/useAgendamentos';
import { useAllPacientes } from '@/hooks/usePaciente';
import type { Agendamento, AgendamentoStatus } from '@/types/agendamento';
import type { Paciente } from '@/types/paciente';
import { formatCPF, formatPhone } from '@/utils/cpf';

const STATUS_BADGE: Record<AgendamentoStatus, string> = {
  Agendado:    'bg-blue-50 text-blue-700',
  Cancelado:   'bg-red-50 text-red-700',
  'Concluído': 'bg-green-50 text-green-700',
  Falta:       'bg-orange-50 text-orange-700',
  Realizada:   'bg-green-50 text-green-700',
};

const STATUS_OPTIONS: AgendamentoStatus[] = ['Agendado', 'Realizada', 'Concluído', 'Cancelado', 'Falta'];

function formatDataHora(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function AgendamentosPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgendamentoStatus | 'Todos'>('Todos');
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  const [pacienteModal, setPacienteModal] = useState<Paciente | null>(null);
  const [detailModal, setDetailModal] = useState<Agendamento | null>(null);

  const { data: agendamentos, isLoading, error } = useAgendamentos();
  const cancelMutation = useCancelAgendamento();
  const confirmarMutation = useConfirmarPresenca();
  const faltaMutation = useRegistrarFalta();
  const { data: pacientes } = useAllPacientes();

  const filtered = (agendamentos ?? []).filter((a) => {
    const matchStatus = statusFilter === 'Todos' || a.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || a.codigo_agendamento.toLowerCase().includes(q) ||
      String(a.id_paciente).includes(q);
    return matchStatus && matchSearch;
  });

  const handleCancel = async () => {
    if (cancelId === null || !motivo.trim()) return;
    try {
      await cancelMutation.mutateAsync({ id: cancelId, motivo: motivo.trim() });
      toast.success('Agendamento cancelado.');
      setCancelId(null);
      setMotivo('');
    } catch (err) {
      const reason = (err as any)?.response?.data?.error;
      toast.error(reason ? `Erro ao cancelar agendamento: ${reason}` : 'Erro ao cancelar agendamento.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Agendamentos"
        description="Gerencie os agendamentos de consultas."
        action={
          <button
            onClick={() => navigate('/recepcionista/agendamentos/novo')}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Novo Agendamento
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código ou paciente…"
            className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AgendamentoStatus | 'Todos')}
          className="bg-white rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-700 shadow-sm"
        >
          <option value="Todos">Todos os status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-center py-10 text-sm text-gray-400">Carregando agendamentos…</p>
        ) : error ? (
          <p className="text-center py-10 text-sm text-red-400">Erro ao carregar agendamentos.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Código</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Paciente</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell whitespace-nowrap">Data / Hora</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!filtered.length ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={Calendar}
                      title="Nenhum agendamento encontrado"
                      description="Clique em 'Novo Agendamento' para criar o primeiro."
                    />
                  </td>
                </tr>
              ) : filtered.map((agd) => (
                <tr key={agd.id_agendamento} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setDetailModal(agd)}
                      className="font-mono text-xs text-teal-600 hover:text-teal-800 hover:underline transition-colors text-left"
                    >
                      {agd.codigo_agendamento}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    {(() => {
                      const p = pacientes?.find(p => p.id_paciente === agd.id_paciente);
                      return p ? (
                        <button
                          onClick={() => setPacienteModal(p)}
                          className="text-teal-600 hover:text-teal-800 font-medium text-sm hover:underline text-left"
                        >
                          {p.nome_completo}
                        </button>
                      ) : '—';
                    })()}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-gray-600 whitespace-nowrap">
                    {formatDataHora(agd.horario?.data_hora_inicio)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[agd.status]}`}>
                      {agd.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {agd.status === 'Agendado' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await confirmarMutation.mutateAsync(agd.id_agendamento);
                              toast.success('Presença confirmada!');
                            } catch (err) {
                              const reason = (err as any)?.response?.data?.error;
                              toast.error(reason ? `Erro ao confirmar presença: ${reason}` : 'Erro ao confirmar presença.');
                            }
                          }}
                          disabled={confirmarMutation.isPending}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await faltaMutation.mutateAsync(agd.id_agendamento);
                              toast.success('Falta registrada.');
                            } catch (err) {
                              const reason = (err as any)?.response?.data?.error;
                              toast.error(reason ? `Erro ao registrar falta: ${reason}` : 'Erro ao registrar falta.');
                            }
                          }}
                          disabled={faltaMutation.isPending}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                          Falta
                        </button>
                        <button
                          onClick={() => { setCancelId(agd.id_agendamento); setMotivo(''); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Ficha do Paciente */}
      {pacienteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <User size={18} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{pacienteModal.nome_completo}</h3>
                  <p className="text-xs text-gray-400">Ficha do paciente</p>
                </div>
              </div>
              <button onClick={() => setPacienteModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">CPF</p>
                  <p className="font-mono text-gray-700">{formatCPF(pacienteModal.cpf)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Telefone</p>
                  <p className="text-gray-700">{pacienteModal.telefone ? formatPhone(pacienteModal.telefone) : '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Nascimento</p>
                  <p className="text-gray-700">
                    {pacienteModal.data_nascimento
                      ? new Date(pacienteModal.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR')
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Sexo</p>
                  <p className="text-gray-700">
                    {pacienteModal.sexo === 'M' ? 'Masculino' : pacienteModal.sexo === 'F' ? 'Feminino' : 'Outro'}
                  </p>
                </div>
              </div>
              {(pacienteModal.logradouro || pacienteModal.bairro) && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Endereço</p>
                  <p className="text-gray-700">
                    {[pacienteModal.logradouro, pacienteModal.numero, pacienteModal.bairro, pacienteModal.cidade, pacienteModal.estado].filter(Boolean).join(', ')}
                    {pacienteModal.cep ? ` — CEP ${pacienteModal.cep}` : ''}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Faltas registradas</p>
                <p className={`font-semibold ${pacienteModal.contador_faltas > 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {pacienteModal.contador_faltas}
                </p>
              </div>
            </div>
            <button onClick={() => setPacienteModal(null)} className="w-full mt-5 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do Agendamento */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <Stethoscope size={18} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Detalhes do Agendamento</h3>
                  <p className="font-mono text-xs text-gray-400">{detailModal.codigo_agendamento}</p>
                </div>
              </div>
              <button onClick={() => setDetailModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Médico(a)</p>
                <p className="font-medium text-gray-800">
                  {detailModal.horario?.profissional?.nome_completo ?? '—'}
                  {detailModal.horario?.profissional?.tipo_registro && (
                    <span className="ml-2 text-xs text-gray-400 font-normal">({detailModal.horario.profissional.tipo_registro})</span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Data / Hora</p>
                  <p className="text-gray-700">{formatDataHora(detailModal.horario?.data_hora_inicio)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Status</p>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[detailModal.status]}`}>
                    {detailModal.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Paciente</p>
                <p className="text-gray-700">
                  {pacientes?.find(p => p.id_paciente === detailModal.id_paciente)?.nome_completo ?? `#${detailModal.id_paciente}`}
                </p>
              </div>
              {detailModal.observacoes && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Observações</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{detailModal.observacoes}</p>
                </div>
              )}
              {detailModal.motivo_cancelamento && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Motivo do cancelamento</p>
                  <p className="text-gray-700 bg-red-50 rounded-lg px-3 py-2">{detailModal.motivo_cancelamento}</p>
                </div>
              )}
            </div>
            <button onClick={() => setDetailModal(null)} className="w-full mt-5 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal: Cancelar Agendamento */}
      {cancelId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Cancelar Agendamento</h3>
            <p className="text-sm text-gray-500 mb-4">Informe o motivo do cancelamento.</p>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              placeholder="Motivo…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">Voltar</button>
              <button
                onClick={handleCancel}
                disabled={!motivo.trim() || cancelMutation.isPending}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 disabled:opacity-60"
              >
                {cancelMutation.isPending ? 'Cancelando…' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
