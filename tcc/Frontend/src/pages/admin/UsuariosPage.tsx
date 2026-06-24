import { useState } from 'react';
import { Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUsuarios, useCreateUsuario, useUpdateUsuario, useDeleteUsuario, type UsuarioAPI } from '@/hooks/useUsuarios';
import { isValidCPF, formatCPF } from '@/utils/cpf';

const PERFIL_BADGE: Record<string, string> = {
  ADMIN:         'bg-purple-50 text-purple-700',
  RECEPCIONISTA: 'bg-blue-50 text-blue-700',
  PACIENTE:      'bg-teal-50 text-teal-700',
};

const PERFIS = ['ADMIN', 'RECEPCIONISTA', 'PACIENTE'] as const;
type Perfil = typeof PERFIS[number];

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400';

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function UsuariosPage() {
  const [search, setSearch] = useState('');
  const [perfilFilter, setPerfilFilter] = useState<Perfil | 'Todos'>('Todos');
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<UsuarioAPI | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UsuarioAPI | null>(null);

  const [createForm, setCreateForm] = useState({ nome: '', email: '', cpf: '', senha: '', perfil: 'PACIENTE' as Perfil });
  const [editForm, setEditForm] = useState({ nome: '', email: '', perfil: 'PACIENTE' as Perfil, ativo: true });

  const { data: usuarios, isLoading, error } = useUsuarios();
  const createMutation = useCreateUsuario();
  const updateMutation = useUpdateUsuario();
  const deleteMutation = useDeleteUsuario();

  const filtered = (usuarios ?? []).filter((u) => {
    const matchPerfil = perfilFilter === 'Todos' || u.perfil === perfilFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.cpf.includes(q);
    return matchPerfil && matchSearch;
  });

  const setCF = (k: keyof typeof createForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCreateForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCreateCpfChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCreateForm((f) => ({ ...f, cpf: formatCPF(e.target.value) }));

  const setEF = (k: keyof typeof editForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEditForm((f) => ({ ...f, [k]: k === 'ativo' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const handleCreate = async () => {
    if (!createForm.nome || !createForm.email || !createForm.cpf || !createForm.senha) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!isValidEmail(createForm.email)) {
      toast.error('Informe um e-mail válido.');
      return;
    }
    if (!isValidCPF(createForm.cpf)) {
      toast.error('CPF inválido.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        nome: createForm.nome,
        email: createForm.email,
        cpf: createForm.cpf.replace(/\D/g, ''),
        senha: createForm.senha,
        perfil: createForm.perfil,
      });
      toast.success('Usuário criado com sucesso!');
      setShowCreate(false);
      setCreateForm({ nome: '', email: '', cpf: '', senha: '', perfil: 'PACIENTE' });
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao criar usuário.');
    }
  };

  const openEdit = (u: UsuarioAPI) => {
    setEditTarget(u);
    setEditForm({ nome: u.nome, email: u.email, perfil: u.perfil, ativo: u.ativo });
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    if (!isValidEmail(editForm.email)) {
      toast.error('Informe um e-mail válido.');
      return;
    }
    try {
      await updateMutation.mutateAsync({ id: editTarget.id_usuario, input: editForm });
      toast.success('Usuário atualizado!');
      setEditTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao atualizar usuário.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const result = await deleteMutation.mutateAsync(deleteTarget.id_usuario);
      toast.success(result.message);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao remover usuário.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie as contas de acesso ao sistema."
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Novo Usuário
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
            placeholder="Buscar por nome, e-mail ou CPF…"
            className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <select
          value={perfilFilter}
          onChange={(e) => setPerfilFilter(e.target.value as Perfil | 'Todos')}
          className="bg-white rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-700 shadow-sm"
        >
          <option value="Todos">Todos os perfis</option>
          {PERFIS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-center py-10 text-sm text-gray-400">Carregando usuários…</p>
        ) : error ? (
          <p className="text-center py-10 text-sm text-red-400">Erro ao carregar usuários.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">E-mail</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">CPF</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Perfil</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!filtered.length ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={Users}
                      title="Nenhum usuário encontrado"
                      description="Clique em 'Novo Usuário' para adicionar o primeiro acesso."
                    />
                  </td>
                </tr>
              ) : filtered.map((u) => (
                <tr key={u.id_usuario} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{u.nome}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell text-xs">{u.email}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell font-mono text-xs">{formatCPF(u.cpf)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PERFIL_BADGE[u.perfil] ?? 'bg-gray-100 text-gray-600'}`}>
                      {u.perfil}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.ativo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => openEdit(u)} className="text-gray-400 hover:text-teal-600 transition-colors" title="Editar">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(u)} className="text-gray-400 hover:text-red-500 transition-colors" title="Excluir">
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
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Novo Usuário</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <input className={inputCls} placeholder="Nome completo *" value={createForm.nome} onChange={setCF('nome')} />
              <input className={inputCls} placeholder="E-mail *" type="email" value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value.replace(/\s+/g, '').toLowerCase() }))} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="CPF *" value={createForm.cpf} onChange={handleCreateCpfChange} maxLength={14} />
                <input className={inputCls} placeholder="Senha *" type="password" value={createForm.senha} onChange={setCF('senha')} />
              </div>
              <select className={inputCls} value={createForm.perfil} onChange={setCF('perfil')}>
                {PERFIS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">Cancelar</button>
              <button onClick={handleCreate} disabled={createMutation.isPending} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60">
                {createMutation.isPending ? 'Criando…' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Editar Usuário</h3>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <input className={inputCls} placeholder="Nome completo" value={editForm.nome} onChange={setEF('nome')} />
              <input className={inputCls} placeholder="E-mail" type="email" value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value.replace(/\s+/g, '').toLowerCase() }))} />
              <select className={inputCls} value={editForm.perfil} onChange={setEF('perfil')}>
                {PERFIS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editForm.ativo} onChange={setEF('ativo')} className="w-4 h-4 accent-teal-600" />
                <span className="text-sm text-gray-700">Usuário ativo</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditTarget(null)} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">Cancelar</button>
              <button onClick={handleUpdate} disabled={updateMutation.isPending} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60">
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
            <h3 className="text-base font-bold text-gray-900 mb-1">Remover Usuário</h3>
            <p className="text-sm text-gray-500 mb-5">
              Deseja remover <span className="font-semibold text-gray-700">"{deleteTarget.nome}"</span>? Esta ação não pode ser desfeita.
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
