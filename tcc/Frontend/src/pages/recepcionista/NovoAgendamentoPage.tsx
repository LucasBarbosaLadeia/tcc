import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Award, Calendar, Check, ChevronLeft, Clock, Search, Stethoscope, User, X } from 'lucide-react';
import { useAllPacientes } from '@/hooks/usePaciente';
import { useEspecialidades } from '@/hooks/useEspecialidades';
import { useProfissionais } from '@/hooks/useProfissionais';
import { useAgendas } from '@/hooks/useAgendas';
import { useHorarios } from '@/hooks/useHorarios';
import { useCreateAgendamento } from '@/hooks/useAgendamentos';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatCPF } from '@/utils/cpf';
import type { Especialidade } from '@/types/especialidade';
import type { Profissional } from '@/types/profissional';
import type { Horario } from '@/types/horario';

const STEPS = [
  { label: 'Paciente',     icon: User },
  { label: 'Especialidade', icon: Award },
  { label: 'Profissional', icon: Stethoscope },
  { label: 'Horário',      icon: Clock },
  { label: 'Confirmar',    icon: Check },
];

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
      {STEPS.map(({ label, icon: Icon }, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div
            key={label}
            className={`flex-1 min-w-[90px] flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all
              ${done ? 'border-teal-400 bg-teal-50' : active ? 'border-teal-600 bg-teal-600 shadow-md' : 'border-gray-100 bg-white'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${done ? 'bg-teal-400 text-white' : active ? 'bg-white text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
              {done ? <Check size={14} /> : <Icon size={14} />}
            </div>
            <span className={`text-xs font-semibold text-center leading-tight
              ${active ? 'text-white' : done ? 'text-teal-700' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function NovoAgendamentoPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [pacienteSearch, setPacienteSearch] = useState('');
  const [pacienteSel, setPacienteSel] = useState<{ id: number; nome: string; cpf: string } | null>(null);
  const [especialidade, setEspecialidade] = useState<Especialidade | null>(null);
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [horario, setHorario] = useState<Horario | null>(null);
  const [observacoes, setObservacoes] = useState('');

  const { data: pacientes, isLoading: loadingPac } = useAllPacientes();
  const { data: especialidades, isLoading: loadingEsp } = useEspecialidades();
  const { data: profissionais, isLoading: loadingProf } = useProfissionais();
  const { data: agendas } = useAgendas();
  const { data: horarios, isLoading: loadingHor } = useHorarios();
  const createMutation = useCreateAgendamento();

  const pacientesFiltrados = pacienteSearch.trim()
    ? (pacientes ?? []).filter((p) => {
        const q = pacienteSearch.toLowerCase();
        return p.nome_completo.toLowerCase().includes(q) || p.cpf.includes(q);
      })
    : [];

  const especialidadesDisponiveis = (especialidades ?? []).filter((esp) =>
    (profissionais ?? []).some((p) => {
      if (p.id_especialidade !== esp.id_especialidade) return false;
      const ids = (agendas ?? []).filter((a) => a.id_profissional === p.id_profissional).map((a) => a.id_agenda);
      return (horarios ?? []).some((h) => ids.includes(h.id_agenda));
    }),
  );

  const profissionaisFiltrados = (profissionais ?? []).filter((p) => {
    if (p.id_especialidade !== especialidade?.id_especialidade) return false;
    const ids = (agendas ?? []).filter((a) => a.id_profissional === p.id_profissional).map((a) => a.id_agenda);
    return (horarios ?? []).some((h) => ids.includes(h.id_agenda));
  });

  const agendaIds = (agendas ?? [])
    .filter((a) => a.id_profissional === profissional?.id_profissional)
    .map((a) => a.id_agenda);

  const horariosFiltrados = (horarios ?? [])
    .filter((h) => agendaIds.includes(h.id_agenda))
    .sort((a, b) => new Date(a.data_hora_inicio).getTime() - new Date(b.data_hora_inicio).getTime());

  const handleConfirm = async () => {
    if (!pacienteSel || !horario) return;
    try {
      await createMutation.mutateAsync({
        id_paciente: pacienteSel.id,
        id_horario: horario.id_horario,
        observacoes: observacoes.trim() || undefined,
      });
      toast.success('Agendamento criado com sucesso!');
      navigate('/recepcionista/agendamentos');
    } catch {
      toast.error('Erro ao criar agendamento. Tente novamente.');
    }
  };

  const back = () => (step > 0 ? setStep((s) => s - 1) : navigate('/recepcionista/agendamentos'));

  return (
    <div className="max-w-2xl">
      <button
        onClick={back}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
      >
        <ChevronLeft size={16} />
        Voltar
      </button>

      <PageHeader title="Novo Agendamento" description="Crie uma consulta para o paciente em poucos passos." />

      <Stepper current={step} />

      {/* Step 0 — Paciente */}
      {step === 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">Busque o paciente por nome ou CPF:</p>
          {pacienteSel ? (
            <div className="flex items-center justify-between bg-white rounded-xl border border-teal-300 px-5 py-4 shadow-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <User size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{pacienteSel.nome}</p>
                  <p className="text-xs text-gray-400 font-mono">{formatCPF(pacienteSel.cpf)}</p>
                </div>
              </div>
              <button onClick={() => setPacienteSel(null)} className="text-gray-300 hover:text-gray-500">
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm mb-3 focus-within:border-teal-400 transition-colors">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={pacienteSearch}
                  onChange={(e) => setPacienteSearch(e.target.value)}
                  placeholder="Nome ou CPF do paciente…"
                  className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                  autoFocus
                />
              </div>
              {loadingPac && <p className="text-center py-6 text-sm text-gray-400">Carregando pacientes…</p>}
              {!loadingPac && pacienteSearch.trim() && (
                <div className="space-y-2">
                  {pacientesFiltrados.length === 0 ? (
                    <p className="text-center py-6 text-sm text-gray-400">Nenhum paciente encontrado.</p>
                  ) : (
                    pacientesFiltrados.map((p) => (
                      <button
                        key={p.id_paciente}
                        onClick={() => { setPacienteSel({ id: p.id_paciente, nome: p.nome_completo, cpf: p.cpf }); setPacienteSearch(''); }}
                        className="w-full p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{p.nome_completo}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{formatCPF(p.cpf)}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </>
          )}
          <button
            onClick={() => setStep(1)}
            disabled={!pacienteSel}
            className="w-full mt-4 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-40 transition-colors"
          >
            Próximo
          </button>
        </div>
      )}

      {/* Step 1 — Especialidade */}
      {step === 1 && (
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Paciente: <span className="font-semibold text-teal-700">{pacienteSel?.nome}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">Selecione a especialidade desejada:</p>
          {loadingEsp ? (
            <p className="text-center py-10 text-sm text-gray-400">Carregando especialidades…</p>
          ) : !especialidadesDisponiveis.length ? (
            <p className="text-center py-10 text-sm text-amber-600 bg-amber-50 rounded-xl">
              Nenhuma especialidade disponível no momento. Cadastre agendas com horários futuros.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {especialidadesDisponiveis.map((esp) => (
                <button
                  key={esp.id_especialidade}
                  onClick={() => { setEspecialidade(esp); setProfissional(null); setHorario(null); setStep(2); }}
                  className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                      <Award size={18} className="text-teal-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{esp.nome_especialidade}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Profissional */}
      {step === 2 && (
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Especialidade: <span className="font-semibold text-teal-700">{especialidade?.nome_especialidade}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">Selecione o profissional:</p>
          {loadingProf ? (
            <p className="text-center py-10 text-sm text-gray-400">Carregando profissionais…</p>
          ) : !profissionaisFiltrados.length ? (
            <p className="text-center py-10 text-sm text-gray-400">Nenhum profissional disponível para esta especialidade.</p>
          ) : (
            <div className="space-y-3">
              {profissionaisFiltrados.map((prof) => (
                <button
                  key={prof.id_profissional}
                  onClick={() => { setProfissional(prof); setHorario(null); setStep(3); }}
                  className="w-full p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{prof.nome_completo}</p>
                      {prof.tipo_registro && (
                        <p className="text-xs text-gray-500 mt-0.5">{prof.tipo_registro} {prof.registro_profissional}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Horário */}
      {step === 3 && (
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Profissional: <span className="font-semibold text-teal-700">{profissional?.nome_completo}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">Selecione um horário disponível:</p>
          {loadingHor ? (
            <p className="text-center py-10 text-sm text-gray-400">Carregando horários…</p>
          ) : !horariosFiltrados.length ? (
            <p className="text-center py-10 text-sm text-amber-600 bg-amber-50 rounded-xl">Nenhum horário disponível para este profissional.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {horariosFiltrados.map((h) => {
                const inicio = new Date(h.data_hora_inicio);
                return (
                  <button
                    key={h.id_horario}
                    onClick={() => { setHorario(h); setStep(4); }}
                    className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                        <Clock size={18} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {inicio.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 4 — Confirmar */}
      {step === 4 && horario && (
        <div>
          <p className="text-sm text-gray-600 mb-4">Revise os dados antes de confirmar:</p>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4 mb-5">
            <div className="flex items-start gap-3">
              <User size={16} className="text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Paciente</p>
                <p className="text-sm font-semibold text-gray-800">{pacienteSel?.nome}</p>
                <p className="text-xs text-gray-400 font-mono">{pacienteSel && formatCPF(pacienteSel.cpf)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Award size={16} className="text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Especialidade</p>
                <p className="text-sm font-semibold text-gray-800">{especialidade?.nome_especialidade}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Stethoscope size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Profissional</p>
                <p className="text-sm font-semibold text-gray-800">{profissional?.nome_completo}</p>
                {profissional?.tipo_registro && (
                  <p className="text-xs text-gray-400">{profissional.tipo_registro} {profissional.registro_profissional}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Data e Hora</p>
                <p className="text-sm font-semibold text-gray-800">
                  {new Date(horario.data_hora_inicio).toLocaleString('pt-BR', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Observações (opcional)</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              placeholder="Informações adicionais para o profissional…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <button
            onClick={handleConfirm}
            disabled={createMutation.isPending}
            className="w-full py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60 transition-colors"
          >
            {createMutation.isPending ? 'Agendando…' : 'Confirmar Agendamento'}
          </button>
        </div>
      )}
    </div>
  );
}
