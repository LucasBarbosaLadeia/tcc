import { useState } from 'react';
import { Plus, Search, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAllPacientes, useCreatePaciente } from '@/hooks/usePaciente';
import { useCreateUsuario } from '@/hooks/useUsuarios';

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR');
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400';

export function PacientesPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', senha: '',
    data_nascimento: '', sexo: 'M' as 'M' | 'F' | 'Outro', telefone: '',
  });

  const { data: pacientes, isLoading, error } = useAllPacientes();
  const createUsuario = useCreateUsuario();
  const createPaciente = useCreatePaciente();

  const filtered = (pacientes ?? []).filter((p) => {
    const q = search.toLowerCase();
    return !q || p.nome_completo.toLowerCase().includes(q) || p.cpf.includes(q);
  });

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.cpf || !form.senha || !form.data_nascimento || !form.sexo) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const usuario = await createUsuario.mutateAsync({
        nome: form.nome, email: form.email,
        cpf: form.cpf.replace(/\D/g, ''), senha: form.senha, perfil: 'PACIENTE',
      });
      await createPaciente.mutateAsync({
        id_usuario: usuario.id_usuario,
        cpf: form.cpf.replace(/\D/g, ''),
        nome_completo: form.nome,
        data_nascimento: form.data_nascimento,
        sexo: form.sexo,
        telefone: form.telefone || '',
        cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '',
      });
      toast.success('Paciente cadastrado com sucesso!');
      setShowModal(false);
      setForm({ nome: '', email: '', cpf: '', senha: '', data_nascimento: '', sexo: 'M', telefone: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao cadastrar paciente.');
    }
  };

  const isPending = createUsuario.isPending || createPaciente.isPending;

  return (
    <div>
      <PageHeader
        title="Pacientes"
        description="Consulte e cadastre pacientes da unidade."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Novo Paciente
          </button>
        }
      />

      <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm mb-4">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou CPF…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-center py-10 text-sm text-gray-400">Carregando pacientes…</p>
        ) : error ? (
          <p className="text-center py-10 text-sm text-red-400">Erro ao carregar pacientes.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">CPF</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Telefone</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Nascimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!filtered.length ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={Users}
                      title="Nenhum paciente encontrado"
                      description="Clique em 'Novo Paciente' para realizar o primeiro cadastro."
                    />
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id_paciente} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{p.nome_completo}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell font-mono text-xs">{p.cpf}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{p.telefone || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{formatDate(p.data_nascimento)}</td>
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
              <h3 className="text-base font-bold text-gray-900">Novo Paciente</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dados de Acesso</p>
              <input className={inputCls} placeholder="Nome completo *" value={form.nome} onChange={setField('nome')} />
              <input className={inputCls} placeholder="E-mail *" type="email" value={form.email} onChange={setField('email')} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="CPF (só números) *" value={form.cpf} onChange={setField('cpf')} maxLength={14} />
                <input className={inputCls} placeholder="Senha *" type="password" value={form.senha} onChange={setField('senha')} />
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2">Dados Pessoais</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Data de Nascimento *</label>
                  <input className={inputCls} type="date" value={form.data_nascimento} onChange={setField('data_nascimento')} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sexo *</label>
                  <select className={inputCls} value={form.sexo} onChange={setField('sexo')}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>
              <input className={inputCls} placeholder="Telefone" value={form.telefone} onChange={setField('telefone')} />
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60"
              >
                {isPending ? 'Cadastrando…' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
