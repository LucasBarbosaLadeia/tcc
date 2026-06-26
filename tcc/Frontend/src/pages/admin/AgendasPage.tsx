import { useState } from 'react';
import { CalendarDays, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAgendas, useCreateAgenda, useUpdateAgenda, useDeleteAgenda } from '@/hooks/useAgendas';
import { useProfissionais } from '@/hooks/useProfissionais';
import { useUnidades } from '@/hooks/useUnidades';
import type { Agenda } from '@/types/agenda';

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400';

function toTime(isoStr?: string | null): string {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function toDatetimeStr(timeStr: string): string {
  return `1970-01-01T${timeStr}:00.000-03:00`;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
}

function getDayName(dateStr?: string | null): string {
  if (!dateStr) return '';
  // Use noon UTC to avoid timezone date shifts
  const d = new Date(`${dateStr.split('T')[0]}T12:00:00Z`);
  return d.toLocaleDateString('pt-BR', { weekday: 'long' });
}

function calcHorarios(a: Agenda): number {
  const s = new Date(a.horario_inicio);
  const e = new Date(a.horario_fim);
  const totalMin =
    (e.getUTCHours() * 60 + e.getUTCMinutes()) -
    (s.getUTCHours() * 60 + s.getUTCMinutes());

  let almocoMin = 0;
  if (a.horario_almoco_inicio && a.horario_almoco_fim) {
    const as2 = new Date(a.horario_almoco_inicio);
    const ae2 = new Date(a.horario_almoco_fim);
    almocoMin = (ae2.getUTCHours() * 60 + ae2.getUTCMinutes()) - (as2.getUTCHours() * 60 + as2.getUTCMinutes());
  }

  return totalMin > 0 && a.duracao_consulta > 0
    ? Math.floor((totalMin - almocoMin) / a.duracao_consulta)
    : (a.vagas_disponiveis ?? 0);
}

const emptyForm = {
  id_profissional: 0,
  id_unidade: 0,
  data: '',
  horario_inicio: '08:00',
  horario_fim: '17:00',
  horario_almoco_inicio: '12:00',
  horario_almoco_fim: '13:00',
  duracao_consulta: 30,
};

export function AgendasPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Agenda | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Agenda | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editForm, setEditForm] = useState({ ...emptyForm, ativo: true });

  const { data: agendas, isLoading, error } = useAgendas();
  const { data: profissionais = [] } = useProfissionais();
  const { data: unidades = [] } = useUnidades();
  const createMutation = useCreateAgenda();
  const updateMutation = useUpdateAgenda();
  const deleteMutation = useDeleteAgenda();

  const profMap = Object.fromEntries(profissionais.map((p) => [p.id_profissional, p.nome_completo]));
  const unidMap = Object.fromEntries(unidades.map((u) => [u.id_unidade, u.nome]));

  const filtered = (agendas ?? []).filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (profMap[a.id_profissional] ?? '').toLowerCase().includes(q) ||
      formatDate(a.data).includes(q) ||
      getDayName(a.data).toLowerCase().includes(q) ||
      (unidMap[a.id_unidade] ?? '').toLowerCase().includes(q)
    );
  });

  const numericKeys = ['id_profissional', 'id_unidade', 'duracao_consulta'];

  const setF = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: numericKeys.includes(k) ? Number(e.target.value) : e.target.value }));

  const setEF = (k: keyof typeof editForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEditForm((f) => ({
      ...f,
      [k]: k === 'ativo'
        ? (e.target as HTMLInputElement).checked
        : numericKeys.includes(k)
          ? Number(e.target.value)
          : e.target.value,
    }));

  const handleCreate = async () => {
    if (!form.id_profissional || !form.id_unidade || !form.data || !form.horario_inicio || !form.horario_fim) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const payload: Parameters<typeof createMutation.mutateAsync>[0] = {
        id_profissional: form.id_profissional,
        id_unidade: form.id_unidade,
        data: form.data,
        horario_inicio: toDatetimeStr(form.horario_inicio),
        horario_fim: toDatetimeStr(form.horario_fim),
        duracao_consulta: form.duracao_consulta,
      };
      if (form.horario_almoco_inicio && form.horario_almoco_fim) {
        payload.horario_almoco_inicio = toDatetimeStr(form.horario_almoco_inicio);
        payload.horario_almoco_fim    = toDatetimeStr(form.horario_almoco_fim);
      }
      const result = await createMutation.mutateAsync(payload);
      const count = result.horariosGerados ?? 0;
      toast.success(
        count > 0
          ? `Agenda criada! ${count} horários foram criados automaticamente.`
          : 'Agenda criada!',
      );
      setShowCreate(false);
      setForm({ ...emptyForm });
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao criar agenda.');
    }
  };

  const openEdit = (a: Agenda) => {
    setEditTarget(a);
    setEditForm({
      id_profissional: a.id_profissional,
      id_unidade: a.id_unidade,
      data: a.data ? a.data.split('T')[0] : '',
      horario_inicio: toTime(a.horario_inicio),
      horario_fim: toTime(a.horario_fim),
      horario_almoco_inicio: toTime(a.horario_almoco_inicio),
      horario_almoco_fim: toTime(a.horario_almoco_fim),
      duracao_consulta: a.duracao_consulta,
      ativo: a.ativo !== false,
    });
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    try {
      const input: Parameters<typeof updateMutation.mutateAsync>[0]['input'] = {
        id_profissional: editForm.id_profissional,
        id_unidade: editForm.id_unidade,
        data: editForm.data,
        horario_inicio: toDatetimeStr(editForm.horario_inicio),
        horario_fim: toDatetimeStr(editForm.horario_fim),
        duracao_consulta: editForm.duracao_consulta,
        ativo: editForm.ativo,
      };
      if (editForm.horario_almoco_inicio && editForm.horario_almoco_fim) {
        input.horario_almoco_inicio = toDatetimeStr(editForm.horario_almoco_inicio);
        input.horario_almoco_fim    = toDatetimeStr(editForm.horario_almoco_fim);
      }
      await updateMutation.mutateAsync({ id: editTarget.id_agenda, input });
      toast.success('Agenda atualizada!');
      setEditTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao atualizar agenda.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const result = await deleteMutation.mutateAsync(deleteTarget.id_agenda);
      toast.success(result.message);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erro ao remover agenda.');
    }
  };

  const AgendaForm = ({ values, onChange }: { values: typeof editForm; onChange: (k: any) => (e: any) => void }) => {
    const [sh, sm] = values.horario_inicio ? values.horario_inicio.split(':').map(Number) : [0, 0];
    const [eh, em] = values.horario_fim ? values.horario_fim.split(':').map(Number) : [0, 0];
    const [alh, alm] = values.horario_almoco_inicio ? values.horario_almoco_inicio.split(':').map(Number) : [0, 0];
    const [afh, afm] = values.horario_almoco_fim ? values.horario_almoco_fim.split(':').map(Number) : [0, 0];

    const totalMin = (eh * 60 + em) - (sh * 60 + sm);
    const almocoMin = (values.horario_almoco_inicio && values.horario_almoco_fim)
      ? (afh * 60 + afm) - (alh * 60 + alm)
      : 0;
    const workMin = totalMin - (almocoMin > 0 ? almocoMin : 0);
    const count = workMin > 0 && values.duracao_consulta > 0 ? Math.floor(workMin / values.duracao_consulta) : 0;

    return (
      <div className="space-y-3">
        <select className={inputCls} value={values.id_profissional} onChange={onChange('id_profissional')}>
          <option value={0} disabled>Selecione o profissional *</option>
          {profissionais.map((p) => (
            <option key={p.id_profissional} value={p.id_profissional}>{p.nome_completo}</option>
          ))}
        </select>
        <select className={inputCls} value={values.id_unidade} onChange={onChange('id_unidade')}>
          <option value={0} disabled>Selecione a unidade *</option>
          {unidades.map((u) => (
            <option key={u.id_unidade} value={u.id_unidade}>{u.nome}</option>
          ))}
        </select>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Data da agenda *</label>
          <input
            className={inputCls}
            type="date"
            value={values.data}
            min={new Date().toISOString().split('T')[0]}
            onChange={onChange('data')}
          />
          {values.data && (
            <p className="text-xs text-gray-400 mt-1 capitalize">{getDayName(values.data)}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Horário início *</label>
            <input className={inputCls} type="time" value={values.horario_inicio} onChange={onChange('horario_inicio')} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Horário fim *</label>
            <input className={inputCls} type="time" value={values.horario_fim} onChange={onChange('horario_fim')} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Intervalo de almoço (opcional)</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Início</label>
              <input className={inputCls} type="time" value={values.horario_almoco_inicio} onChange={onChange('horario_almoco_inicio')} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Fim</label>
              <input className={inputCls} type="time" value={values.horario_almoco_fim} onChange={onChange('horario_almoco_fim')} />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Duração da consulta (min) *</label>
          <input className={inputCls} type="number" min={5} step={5} value={values.duracao_consulta} onChange={onChange('duracao_consulta')} />
        </div>
        {count > 0 && (
          <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-2">
            {count} horário{count !== 1 ? 's' : ''} serão criados automaticamente.
            {almocoMin > 0 && ` (${almocoMin} min de almoço descontados)`}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Agendas"
        description="Grades de horários por profissional e unidade."
        action={
          <button
            onClick={() => { setShowCreate(true); setForm({ ...emptyForm }); }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Nova Agenda
          </button>
        }
      />

      <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm mb-4">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por profissional, data ou dia da semana…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-center py-10 text-sm text-gray-400">Carregando agendas…</p>
        ) : error ? (
          <p className="text-center py-10 text-sm text-red-400">Erro ao carregar agendas.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Profissional</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Data</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Horário</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Duração</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Horários</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!filtered.length ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={CalendarDays}
                      title="Nenhuma agenda cadastrada"
                      description="Clique em 'Nova Agenda' para configurar a grade de um profissional."
                    />
                  </td>
                </tr>
              ) : filtered.map((a) => (
                <tr key={a.id_agenda} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{profMap[a.id_profissional] ?? `#${a.id_profissional}`}</td>
                  <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">
                    <div>{formatDate(a.data)}</div>
                    <div className="text-xs text-gray-400 capitalize">{getDayName(a.data)}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell font-mono text-xs">
                    {toTime(a.horario_inicio)} – {toTime(a.horario_fim)}
                    {a.horario_almoco_inicio && a.horario_almoco_fim && (
                      <div className="text-gray-400 normal-case font-sans">
                        almoço {toTime(a.horario_almoco_inicio)}–{toTime(a.horario_almoco_fim)}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">{a.duracao_consulta} min</td>
                  <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1 text-teal-700 font-medium">
                      {calcHorarios(a)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.ativo !== false ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.ativo !== false ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-teal-600 transition-colors" title="Editar">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(a)} className="text-gray-400 hover:text-red-500 transition-colors" title="Excluir">
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
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Nova Agenda</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <AgendaForm values={form as any} onChange={setF} />
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
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Editar Agenda</h3>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <AgendaForm values={editForm} onChange={setEF} />
            <label className="flex items-center gap-2 cursor-pointer mt-3">
              <input type="checkbox" checked={editForm.ativo} onChange={setEF('ativo')} className="w-4 h-4 accent-teal-600" />
              <span className="text-sm text-gray-700">Agenda ativa</span>
            </label>
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
            <h3 className="text-base font-bold text-gray-900 mb-1">Remover Agenda</h3>
            <p className="text-sm text-gray-500 mb-5">
              Deseja remover a agenda de <span className="font-semibold text-gray-700">
                {profMap[deleteTarget.id_profissional] ?? `#${deleteTarget.id_profissional}`}
              </span> ({formatDate(deleteTarget.data)})?
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
