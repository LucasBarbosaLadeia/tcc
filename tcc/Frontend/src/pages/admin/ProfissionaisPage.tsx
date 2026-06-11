import { useState } from 'react';
import { Plus, Search, Stethoscope, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useProfissionais, useCreateProfissional, useDeleteProfissional } from '@/hooks/useProfissionais';
import { useEspecialidades } from '@/hooks/useEspecialidades';
import { useUnidades } from '@/hooks/useUnidades';

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400';

const TIPO_REGISTRO = ['CRM', 'COREN', 'CRP'];

export function ProfissionaisPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nome_completo: '', cpf: '', registro_profissional: '',
    tipo_registro: 'CRM', id_especialidade: 0, id_unidade: 0, telefone: '',
  });

  const { data: profissionais, isLoading, error } = useProfissionais();
  const { data: especialidades } = useEspecialidades();
  const { data: unidades } = useUnidades();
  const createMutation = useCreateProfissional();
  const deleteMutation = useDeleteProfissional();

  const filtered = (profissionais ?? []).filter((p) => {
    const q = search.toLowerCase();
    return !q || p.nome_completo.toLowerCase().includes(q) || p.registro_profissional.toLowerCase().includes(q);
  });

  const setField = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: k === 'id_especialidade' || k === 'id_unidade' ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async () => {
    if (!form.nome_completo || !form.cpf || !form.registro_profissional || !form.tipo_registro || !form.id_especialidade || !form.id_unidade || !form.telefone) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        nome_completo: form.nome_completo,
        cpf: form.cpf.replace(/\D/g, ''),
        registro_profissional: form.registro_profissional,
        tipo_registro: form.tipo_registro,
        id_especialidade: form.id_especialidade,
        id_unidade: form.id_unidade,
        telefone: form.telefone,
      });
      toast.success('Profissional cadastrado com sucesso!');
      setShowModal(false);
      setForm({ nome_completo: '', cpf: '', registro_profissional: '', tipo_registro: 'CRM', id_especialidade: 0, id_unidade: 0, telefone: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao cadastrar profissional.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Profissionais"
        description="Médicos, enfermeiros e demais profissionais de saúde."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Novo Profissional
          </button>
        }
      />

      <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm mb-4">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou registro…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-center py-10 text-sm text-gray-400">Carregando…</p>
        ) : error ? (
          <p className="text-center py-10 text-sm text-red-400">Erro ao carregar profissionais.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Registro</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Telefone</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!filtered.length ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={Stethoscope}
                      title="Nenhum profissional cadastrado"
                      description="Clique em 'Novo Profissional' para adicionar o primeiro registro."
                    />
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id_profissional} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{p.nome_completo}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell font-mono text-xs">{p.registro_profissional}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{p.telefone || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.ativo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDeleteId(p.id_profissional)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Excluir profissional"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Excluir Profissional</h3>
            <p className="text-sm text-gray-500 mb-5">Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteMutation.mutateAsync(deleteId);
                    toast.success('Profissional excluído.');
                    setDeleteId(null);
                  } catch {
                    toast.error('Erro ao excluir profissional.');
                  }
                }}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 disabled:opacity-60"
              >
                {deleteMutation.isPending ? 'Excluindo…' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Novo Profissional</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <input className={inputCls} placeholder="Nome completo *" value={form.nome_completo} onChange={setField('nome_completo')} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="CPF (só números) *" value={form.cpf} onChange={setField('cpf')} maxLength={14} />
                <input className={inputCls} placeholder="Telefone *" value={form.telefone} onChange={setField('telefone')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select className={inputCls} value={form.tipo_registro} onChange={setField('tipo_registro')}>
                  {TIPO_REGISTRO.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input className={inputCls} placeholder="Nº Registro *" value={form.registro_profissional} onChange={setField('registro_profissional')} />
              </div>
              <select className={inputCls} value={form.id_especialidade} onChange={setField('id_especialidade')}>
                <option value={0}>Selecione a especialidade *</option>
                {(especialidades ?? []).map((e) => (
                  <option key={e.id_especialidade} value={e.id_especialidade}>{e.nome_especialidade}</option>
                ))}
              </select>
              <select className={inputCls} value={form.id_unidade} onChange={setField('id_unidade')}>
                <option value={0}>Selecione a unidade *</option>
                {(unidades ?? []).map((u) => (
                  <option key={u.id_unidade} value={u.id_unidade}>{u.nome}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60"
              >
                {createMutation.isPending ? 'Cadastrando…' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
