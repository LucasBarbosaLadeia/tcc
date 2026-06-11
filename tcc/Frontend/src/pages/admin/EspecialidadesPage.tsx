import { useState } from 'react';
import { Award, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  useEspecialidades,
  useCreateEspecialidade,
  useUpdateEspecialidade,
  useDeleteEspecialidade,
} from '@/hooks/useEspecialidades';
import type { Especialidade } from '@/types/especialidade';

export function EspecialidadesPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [editing, setEditing] = useState<Especialidade | null>(null);
  const [editNome, setEditNome] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Especialidade | null>(null);

  const { data: especialidades, isLoading, error } = useEspecialidades();
  const createMutation = useCreateEspecialidade();
  const updateMutation = useUpdateEspecialidade();
  const deleteMutation = useDeleteEspecialidade();

  const filtered = (especialidades ?? []).filter((e) =>
    !search || e.nome_especialidade.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async () => {
    if (!novoNome.trim()) return;
    try {
      await createMutation.mutateAsync(novoNome.trim());
      toast.success('Especialidade criada!');
      setShowCreate(false);
      setNovoNome('');
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao criar especialidade.');
    }
  };

  const handleUpdate = async () => {
    if (!editing || !editNome.trim()) return;
    try {
      await updateMutation.mutateAsync({ id: editing.id_especialidade, nome: editNome.trim() });
      toast.success('Especialidade atualizada!');
      setEditing(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao atualizar especialidade.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id_especialidade);
      toast.success('Especialidade removida.');
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao remover especialidade.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Especialidades"
        description="Áreas médicas e de saúde disponíveis no sistema."
        action={
          <button
            onClick={() => { setShowCreate(true); setNovoNome(''); }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Nova Especialidade
          </button>
        }
      />

      <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm mb-4">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar especialidade…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-center py-10 text-sm text-gray-400">Carregando especialidades…</p>
        ) : error ? (
          <p className="text-center py-10 text-sm text-red-400">Erro ao carregar especialidades.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome da Especialidade</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!filtered.length ? (
                <tr>
                  <td colSpan={3}>
                    <EmptyState
                      icon={Award}
                      title="Nenhuma especialidade cadastrada"
                      description="Clique em 'Nova Especialidade' para adicionar a primeira."
                    />
                  </td>
                </tr>
              ) : filtered.map((esp) => (
                <tr key={esp.id_especialidade} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{esp.nome_especialidade}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${esp.ativo !== false ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {esp.ativo !== false ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => { setEditing(esp); setEditNome(esp.nome_especialidade); }}
                        className="text-gray-400 hover:text-teal-600 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(esp)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Nova Especialidade</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <input
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400 mb-4"
              placeholder="Nome da especialidade *"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">Cancelar</button>
              <button onClick={handleCreate} disabled={!novoNome.trim() || createMutation.isPending} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60">
                {createMutation.isPending ? 'Criando…' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Editar Especialidade</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <input
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400 mb-4"
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
            />
            <div className="flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">Cancelar</button>
              <button onClick={handleUpdate} disabled={!editNome.trim() || updateMutation.isPending} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60">
                {updateMutation.isPending ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Remover Especialidade</h3>
            <p className="text-sm text-gray-500 mb-5">
              Deseja remover <span className="font-semibold text-gray-700">"{deleteTarget.nome_especialidade}"</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">Cancelar</button>
              <button onClick={handleDelete} disabled={deleteMutation.isPending} className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 disabled:opacity-60">
                {deleteMutation.isPending ? 'Removendo…' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
