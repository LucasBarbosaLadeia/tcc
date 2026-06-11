import { useState } from 'react';
import { Building2, Plus, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUnidades, useCreateUnidade } from '@/hooks/useUnidades';

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400';

const TIPOS = ['UBS', 'UPA', 'Posto', 'CAPS'];

const TIPO_BADGE: Record<string, string> = {
  UBS:      'bg-teal-50 text-teal-700',
  UPA:      'bg-red-50 text-red-700',
  Posto:    'bg-blue-50 text-blue-700',
  CAPS:     'bg-purple-50 text-purple-700',
};

export function UnidadesPage() {
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nome: '', tipo: 'UBS', telefone: '', logradouro: '', numero: '', bairro: '',
  });

  const { data: unidades, isLoading, error } = useUnidades();
  const createMutation = useCreateUnidade();

  const filtered = (unidades ?? []).filter((u) => {
    const matchTipo = tipoFilter === 'Todos' || u.tipo === tipoFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.nome.toLowerCase().includes(q) || (u.bairro ?? '').toLowerCase().includes(q);
    return matchTipo && matchSearch;
  });

  const setField = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.nome || !form.tipo || !form.telefone || !form.logradouro || !form.numero || !form.bairro) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await createMutation.mutateAsync({ ...form });
      toast.success('Unidade cadastrada com sucesso!');
      setShowModal(false);
      setForm({ nome: '', tipo: 'UBS', telefone: '', logradouro: '', numero: '', bairro: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao cadastrar unidade.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Unidades de Saúde"
        description="UBS, UPAs, postos e centros de atenção cadastrados."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Nova Unidade
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
            placeholder="Buscar por nome ou bairro…"
            className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="bg-white rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-700 shadow-sm"
        >
          <option value="Todos">Todos os tipos</option>
          {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-center py-10 text-sm text-gray-400">Carregando…</p>
        ) : error ? (
          <p className="text-center py-10 text-sm text-red-400">Erro ao carregar unidades.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Telefone</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Bairro</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!filtered.length ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={Building2}
                      title="Nenhuma unidade cadastrada"
                      description="Clique em 'Nova Unidade' para adicionar a primeira unidade de saúde."
                    />
                  </td>
                </tr>
              ) : filtered.map((u) => (
                <tr key={u.id_unidade} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{u.nome}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TIPO_BADGE[u.tipo ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
                      {u.tipo ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{u.telefone || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{u.bairro || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.ativo !== false ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.ativo !== false ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Nova Unidade</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <input className={inputCls} placeholder="Nome da unidade *" value={form.nome} onChange={setField('nome')} />
              <div className="grid grid-cols-2 gap-3">
                <select className={inputCls} value={form.tipo} onChange={setField('tipo')}>
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input className={inputCls} placeholder="Telefone *" value={form.telefone} onChange={setField('telefone')} />
              </div>
              <input className={inputCls} placeholder="Logradouro *" value={form.logradouro} onChange={setField('logradouro')} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Número *" value={form.numero} onChange={setField('numero')} />
                <input className={inputCls} placeholder="Bairro *" value={form.bairro} onChange={setField('bairro')} />
              </div>
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
