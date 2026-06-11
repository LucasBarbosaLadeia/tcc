import { useState } from 'react';
import { Calendar, Plus, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAgendamentos, useCancelAgendamento, useConfirmarPresenca, useCreateAgendamento } from '@/hooks/useAgendamentos';
import { useAllPacientes } from '@/hooks/usePaciente';
import { useHorarios } from '@/hooks/useHorarios';
import type { AgendamentoStatus } from '@/types/agendamento';

const STATUS_BADGE: Record<AgendamentoStatus, string> = {
  Agendado:    'bg-blue-50 text-blue-700',
  Cancelado:   'bg-red-50 text-red-700',
  'Concluído': 'bg-green-50 text-green-700',
  Falta:       'bg-orange-50 text-orange-700',
  Realizada:   'bg-green-50 text-green-700',
};

const STATUS_OPTIONS: AgendamentoStatus[] = ['Agendado', 'Realizada', 'Concluído', 'Cancelado', 'Falta'];

const selectCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400';

function formatDataHora(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function AgendamentosPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgendamentoStatus | 'Todos'>('Todos');
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  const [showNovoModal, setShowNovoModal] = useState(false);
  const [novoForm, setNovoForm] = useState({ id_paciente: 0, id_horario: 0 });
  const [pacienteSearch, setPacienteSearch] = useState('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<{ id: number; nome: string } | null>(null);

  const { data: agendamentos, isLoading, error } = useAgendamentos();
  const cancelMutation = useCancelAgendamento();
  const confirmarMutation = useConfirmarPresenca();
  const createMutation = useCreateAgendamento();
  const { data: pacientes } = useAllPacientes();
  const { data: horarios } = useHorarios();

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
    } catch {
      toast.error('Erro ao cancelar agendamento.');
    }
  };

  const handleNovoAgendamento = async () => {
    if (!novoForm.id_paciente || !novoForm.id_horario) {
      toast.error('Selecione o paciente e o horário.');
      return;
    }
    try {
      await createMutation.mutateAsync({ id_paciente: novoForm.id_paciente, id_horario: novoForm.id_horario });
      toast.success('Agendamento criado com sucesso!');
      setShowNovoModal(false);
      setNovoForm({ id_paciente: 0, id_horario: 0 });
      setPacienteSearch('');
      setPacienteSelecionado(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao criar agendamento.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Agendamentos"
        description="Gerencie os agendamentos de consultas."
        action={
          <button
            onClick={() => setShowNovoModal(true)}
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
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Paciente (ID)</th>
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
                    <span className="font-mono text-xs text-gray-600">{agd.codigo_agendamento}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell text-gray-500 text-xs">
                    #{agd.id_paciente}
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
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={async () => {
                            try {
                              await confirmarMutation.mutateAsync(agd.id_agendamento);
                              toast.success('Presença confirmada!');
                            } catch {
                              toast.error('Erro ao confirmar presença.');
                            }
                          }}
                          disabled={confirmarMutation.isPending}
                          className="text-xs text-teal-600 hover:text-teal-800 font-medium transition-colors disabled:opacity-50"
                        >
                          Confirmar presença
                        </button>
                        <button
                          onClick={() => { setCancelId(agd.id_agendamento); setMotivo(''); }}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
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

      {/* Modal: Novo Agendamento */}
      {showNovoModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Novo Agendamento</h3>
              <button onClick={() => { setShowNovoModal(false); setPacienteSearch(''); setPacienteSelecionado(null); setNovoForm({ id_paciente: 0, id_horario: 0 }); }} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1">Paciente *</label>
                {pacienteSelecionado ? (
                  <div className="flex items-center justify-between w-full border border-teal-400 rounded-lg px-3 py-2 text-sm bg-teal-50">
                    <span className="text-gray-800 font-medium">{pacienteSelecionado.nome}</span>
                    <button
                      type="button"
                      onClick={() => { setPacienteSelecionado(null); setPacienteSearch(''); setNovoForm((f) => ({ ...f, id_paciente: 0 })); }}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={pacienteSearch}
                      onChange={(e) => setPacienteSearch(e.target.value)}
                      placeholder="Buscar por nome ou CPF…"
                      className={selectCls}
                      autoComplete="off"
                    />
                    {pacienteSearch.trim() && (
                      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                        {(pacientes ?? [])
                          .filter((p) => {
                            const q = pacienteSearch.toLowerCase();
                            return p.nome_completo.toLowerCase().includes(q) || p.cpf.includes(q);
                          })
                          .map((p) => (
                            <button
                              key={p.id_paciente}
                              type="button"
                              onClick={() => {
                                setPacienteSelecionado({ id: p.id_paciente, nome: p.nome_completo });
                                setNovoForm((f) => ({ ...f, id_paciente: p.id_paciente }));
                                setPacienteSearch('');
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-teal-50 text-gray-700"
                            >
                              <span className="font-medium">{p.nome_completo}</span>
                              <span className="text-gray-400 ml-2 text-xs">{p.cpf}</span>
                            </button>
                          ))}
                        {(pacientes ?? []).filter((p) => {
                          const q = pacienteSearch.toLowerCase();
                          return p.nome_completo.toLowerCase().includes(q) || p.cpf.includes(q);
                        }).length === 0 && (
                          <p className="px-3 py-2 text-sm text-gray-400">Nenhum paciente encontrado.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Horário disponível *</label>
                <select
                  className={selectCls}
                  value={novoForm.id_horario}
                  onChange={(e) => setNovoForm((f) => ({ ...f, id_horario: Number(e.target.value) }))}
                >
                  <option value={0}>Selecione o horário</option>
                  {(horarios ?? []).map((h) => (
                    <option key={h.id_horario} value={h.id_horario}>
                      {new Date(h.data_hora_inicio).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowNovoModal(false); setPacienteSearch(''); setPacienteSelecionado(null); setNovoForm({ id_paciente: 0, id_horario: 0 }); }} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={handleNovoAgendamento}
                disabled={createMutation.isPending}
                className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60"
              >
                {createMutation.isPending ? 'Agendando…' : 'Agendar'}
              </button>
            </div>
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
