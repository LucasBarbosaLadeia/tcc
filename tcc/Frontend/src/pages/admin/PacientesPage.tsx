import { Search, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export function PacientesPage() {
  return (
    <div>
      <PageHeader
        title="Pacientes"
        description="Lista geral de pacientes cadastrados no sistema."
      />

      <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm mb-4">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar por nome ou CPF…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
          disabled
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">CPF</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Telefone</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Cidade / UF</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Faltas</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>
                <EmptyState
                  icon={Users}
                  title="Nenhum paciente cadastrado"
                  description="Os pacientes cadastrados no sistema aparecerão aqui."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
