import { Calendar, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

const STATUS_BADGE: Record<string, string> = {
  Agendado:   'bg-blue-50 text-blue-700',
  Cancelado:  'bg-red-50 text-red-700',
  'Concluído':'bg-green-50 text-green-700',
  Falta:      'bg-orange-50 text-orange-700',
  Realizada:  'bg-green-50 text-green-700',
};

export function AgendamentosPage() {
  return (
    <div>
      <PageHeader
        title="Agendamentos"
        description="Visão geral de todos os agendamentos do sistema."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por código ou paciente…"
            className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
            disabled
          />
        </div>
        <select
          disabled
          className="bg-white rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-500 shadow-sm cursor-not-allowed"
        >
          <option>Todos os status</option>
          {Object.keys(STATUS_BADGE).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Código</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Paciente</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell whitespace-nowrap">Data / Hora</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Profissional</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>
                <EmptyState
                  icon={Calendar}
                  title="Nenhum agendamento encontrado"
                  description="Os agendamentos criados no sistema aparecerão aqui."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
