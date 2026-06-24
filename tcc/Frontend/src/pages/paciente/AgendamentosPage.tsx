import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Stethoscope, X, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAgendamentos, useCancelAgendamento } from '@/hooks/useAgendamentos';
import type { Agendamento, AgendamentoStatus } from '@/types/agendamento';

const STATUS_BADGE: Record<AgendamentoStatus, string> = {
  Agendado:   'bg-blue-50 text-blue-700',
  Cancelado:  'bg-red-50 text-red-700',
  'Concluído':'bg-green-50 text-green-700',
  Falta:      'bg-orange-50 text-orange-700',
  Realizada:  'bg-green-50 text-green-700',
};

const STATUS_OPTIONS: AgendamentoStatus[] = ['Agendado', 'Realizada', 'Concluído', 'Cancelado', 'Falta'];

function formatDataHora(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AgendamentosPage() {
  const [statusFilter, setStatusFilter] = useState<AgendamentoStatus | 'Todos'>('Todos');
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  const [detailModal, setDetailModal] = useState<Agendamento | null>(null);

  const { data: agendamentos, isLoading, error } = useAgendamentos();
  const cancelMutation = useCancelAgendamento();

  const filtered = (agendamentos ?? []).filter(
    (a) => statusFilter === 'Todos' || a.status === statusFilter,
  );

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

  return (
    <div>
      <PageHeader
        title="Meus Agendamentos"
        description="Histórico e próximas consultas agendadas."
        action={
          <Link
            to="/paciente/agendamentos/novo"
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Nova Consulta
          </Link>
        }
      />

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AgendamentoStatus | 'Todos')}
          className="bg-white rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-700 shadow-sm"
        >
          <option value="Todos">Todos os status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
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
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Código
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell whitespace-nowrap">
                  Data / Hora
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!filtered.length ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={Calendar}
                      title="Nenhum agendamento encontrado"
                      description="Suas consultas agendadas aparecerão aqui."
                      action={
                        <Link
                          to="/paciente/agendamentos/novo"
                          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          <Plus size={15} />
                          Agendar Consulta
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((agd) => (
                  <tr key={agd.id_agendamento} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setDetailModal(agd)}
                        className="font-mono text-xs text-teal-600 hover:text-teal-800 hover:underline transition-colors text-left"
                      >
                        {agd.codigo_agendamento}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-gray-600 whitespace-nowrap">
                      {formatDataHora(agd.horario?.data_hora_inicio)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[agd.status]}`}
                      >
                        {agd.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {agd.status === 'Agendado' && (
                        <button
                          onClick={() => {
                            setCancelId(agd.id_agendamento);
                            setMotivo('');
                          }}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors ml-auto"
                        >
                          <XCircle size={14} />
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-2 mt-4">
        {(Object.entries(STATUS_BADGE) as [AgendamentoStatus, string][]).map(([status, cls]) => (
          <span key={status} className={`px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
            {status}
          </span>
        ))}
      </div>

      {/* Modal: Detalhes da Consulta */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <Stethoscope size={18} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Detalhes da Consulta</h3>
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
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      ({detailModal.horario.profissional.tipo_registro})
                    </span>
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
            <button
              onClick={() => setDetailModal(null)}
              className="w-full mt-5 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Cancel modal */}
      {cancelId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Cancelar Agendamento</h3>
            <p className="text-sm text-gray-500 mb-4">Informe o motivo para o cancelamento.</p>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              placeholder="Motivo do cancelamento…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleCancel}
                disabled={!motivo.trim() || cancelMutation.isPending}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
