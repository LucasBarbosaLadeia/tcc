import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Award, Calendar, ChevronLeft, Clock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEspecialidades } from '@/hooks/useEspecialidades';
import { useProfissionais } from '@/hooks/useProfissionais';
import { useAgendas } from '@/hooks/useAgendas';
import { useHorarios } from '@/hooks/useHorarios';
import { useCreateAgendamento } from '@/hooks/useAgendamentos';
import { PageHeader } from '@/components/ui/PageHeader';
import type { Especialidade } from '@/types/especialidade';
import type { Profissional } from '@/types/profissional';
import type { Horario } from '@/types/horario';

const STEPS = ['Especialidade', 'Profissional', 'Horário', 'Confirmar'];

function StepDot({ index, current }: { index: number; current: number }) {
  const done = index < current;
  const active = index === current;
  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
        ${done || active ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-400'}`}
    >
      {done ? '✓' : index + 1}
    </div>
  );
}

export function NovoAgendamentoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [especialidade, setEspecialidade] = useState<Especialidade | null>(null);
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [horario, setHorario] = useState<Horario | null>(null);
  const [observacoes, setObservacoes] = useState('');

  const { data: especialidades, isLoading: loadingEsp } = useEspecialidades();
  const { data: profissionais, isLoading: loadingProf } = useProfissionais();
  const { data: agendas } = useAgendas();
  const { data: horarios, isLoading: loadingHor } = useHorarios();
  const createMutation = useCreateAgendamento();

  const profissionaisFiltrados = (profissionais ?? []).filter(
    (p) => p.id_especialidade === especialidade?.id_especialidade,
  );

  const agendaIds = (agendas ?? [])
    .filter((a) => a.id_profissional === profissional?.id_profissional)
    .map((a) => a.id_agenda);

  const horariosFiltrados = (horarios ?? [])
    .filter((h) => agendaIds.includes(h.id_agenda))
    .sort(
      (a, b) =>
        new Date(a.data_hora_inicio).getTime() - new Date(b.data_hora_inicio).getTime(),
    );

  const handleConfirm = async () => {
    if (!horario || !user?.id_paciente) {
      toast.error('Dados incompletos. Verifique se seu perfil está vinculado a um paciente.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        id_paciente: user.id_paciente,
        id_horario: horario.id_horario,
        observacoes: observacoes.trim() || undefined,
      });
      toast.success('Consulta agendada com sucesso!');
      navigate('/paciente/agendamentos');
    } catch {
      toast.error('Erro ao criar agendamento. Tente novamente.');
    }
  };

  const back = () =>
    step > 0 ? setStep((s) => s - 1) : navigate('/paciente/agendamentos');

  return (
    <div className="max-w-2xl">
      <button
        onClick={back}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
      >
        <ChevronLeft size={16} />
        Voltar
      </button>

      <PageHeader title="Novo Agendamento" description="Agende sua consulta em poucos passos." />

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <StepDot index={i} current={step} />
              <span
                className={`text-xs font-medium hidden sm:block ${
                  i === step ? 'text-teal-700' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-teal-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Especialidade */}
      {step === 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">Selecione a especialidade desejada:</p>
          {loadingEsp ? (
            <p className="text-center py-10 text-sm text-gray-400">Carregando especialidades…</p>
          ) : !especialidades?.length ? (
            <p className="text-center py-10 text-sm text-gray-400">
              Nenhuma especialidade disponível no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {especialidades.map((esp) => (
                <button
                  key={esp.id_especialidade}
                  onClick={() => {
                    setEspecialidade(esp);
                    setProfissional(null);
                    setHorario(null);
                    setStep(1);
                  }}
                  className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                      <Award size={18} className="text-teal-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {esp.nome_especialidade}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 1 — Profissional */}
      {step === 1 && (
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Especialidade:{' '}
            <span className="font-semibold text-teal-700">{especialidade?.nome_especialidade}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">Selecione o profissional:</p>
          {loadingProf ? (
            <p className="text-center py-10 text-sm text-gray-400">Carregando profissionais…</p>
          ) : !profissionaisFiltrados.length ? (
            <p className="text-center py-10 text-sm text-gray-400">
              Nenhum profissional disponível para esta especialidade.
            </p>
          ) : (
            <div className="space-y-3">
              {profissionaisFiltrados.map((prof) => (
                <button
                  key={prof.id_profissional}
                  onClick={() => {
                    setProfissional(prof);
                    setHorario(null);
                    setStep(2);
                  }}
                  className="w-full p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{prof.nome_completo}</p>
                      {prof.tipo_registro && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {prof.tipo_registro} {prof.registro_profissional}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Horário */}
      {step === 2 && (
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Profissional:{' '}
            <span className="font-semibold text-teal-700">{profissional?.nome_completo}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">Selecione um horário disponível:</p>
          {loadingHor ? (
            <p className="text-center py-10 text-sm text-gray-400">Carregando horários…</p>
          ) : !horariosFiltrados.length ? (
            <p className="text-center py-10 text-sm text-gray-400">
              Nenhum horário disponível para este profissional no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {horariosFiltrados.map((h) => {
                const inicio = new Date(h.data_hora_inicio);
                return (
                  <button
                    key={h.id_horario}
                    onClick={() => {
                      setHorario(h);
                      setStep(3);
                    }}
                    className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                        <Clock size={18} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {inicio.toLocaleDateString('pt-BR', {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {inicio.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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

      {/* Step 3 — Confirmar */}
      {step === 3 && horario && (
        <div>
          <p className="text-sm text-gray-600 mb-4">Revise os detalhes antes de confirmar:</p>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4 mb-5">
            <div className="flex items-start gap-3">
              <Award size={16} className="text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Especialidade</p>
                <p className="text-sm font-semibold text-gray-800">
                  {especialidade?.nome_especialidade}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Profissional</p>
                <p className="text-sm font-semibold text-gray-800">{profissional?.nome_completo}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Data e Hora</p>
                <p className="text-sm font-semibold text-gray-800">
                  {new Date(horario.data_hora_inicio).toLocaleString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Observações (opcional)
            </label>
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
            className="w-full py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {createMutation.isPending ? 'Agendando…' : 'Confirmar Agendamento'}
          </button>
        </div>
      )}
    </div>
  );
}
