import type { ReactNode } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { MapPin, Pencil, Phone, Save, User, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePaciente, useUpdatePaciente } from '@/hooks/usePaciente';
import { PageHeader } from '@/components/ui/PageHeader';
import { pacienteSchema, type PacienteSchema } from '@/schemas/pacienteSchema';

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p
        className={`text-sm font-medium ${
          value != null ? 'text-gray-800' : 'text-gray-400 italic'
        }`}
      >
        {value != null ? String(value) : 'Não informado'}
      </p>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function PerfilPage() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);

  const { data: paciente, isLoading } = usePaciente(user?.id_paciente);
  const updateMutation = useUpdatePaciente(user?.id_paciente);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PacienteSchema>({
    resolver: zodResolver(pacienteSchema),
    values: paciente
      ? {
          telefone: paciente.telefone,
          cep: paciente.cep,
          logradouro: paciente.logradouro,
          numero: paciente.numero,
          bairro: paciente.bairro,
          cidade: paciente.cidade,
          estado: paciente.estado,
        }
      : undefined,
  });

  const onSubmit = async (data: PacienteSchema) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success('Perfil atualizado com sucesso!');
      setEditMode(false);
    } catch (err) {
      const reason = (err as any)?.response?.data?.error;
      toast.error(reason ? `Erro ao salvar alterações: ${reason}` : 'Erro ao salvar alterações.');
    }
  };

  const cancelEdit = () => {
    reset();
    setEditMode(false);
  };

  const initials = (paciente?.nome_completo ?? user?.nome ?? 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');

  if (!user?.id_paciente) {
    return (
      <div className="max-w-2xl">
        <PageHeader title="Meu Perfil" description="Suas informações de cadastro." />
        <p className="text-center py-10 text-sm text-gray-400">
          Nenhum registro de paciente vinculado à sua conta.
        </p>
      </div>
    );
  }

  if (isLoading && !paciente) {
    return (
      <div className="max-w-2xl">
        <PageHeader title="Meu Perfil" description="Suas informações de cadastro." />
        <p className="text-center py-10 text-sm text-gray-400">Carregando perfil…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Meu Perfil"
        description="Suas informações de cadastro."
        action={
          !editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Pencil size={14} />
              Editar
            </button>
          ) : null
        }
      />

      {/* Avatar card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-teal-700">{initials}</span>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">
            {paciente?.nome_completo ?? user?.nome ?? '—'}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">Paciente</p>
          {paciente && (
            <p className="text-xs text-gray-400 mt-0.5">
              {paciente.contador_faltas} falta
              {paciente.contador_faltas !== 1 ? 's' : ''} registrada
              {paciente.contador_faltas !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={16} className="text-teal-600" />
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Contato</p>
            </div>
            <FormField label="Telefone" error={errors.telefone?.message}>
              <input
                {...register('telefone')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                placeholder="(00) 00000-0000"
              />
            </FormField>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-teal-600" />
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Endereço</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="CEP" error={errors.cep?.message}>
                <input
                  {...register('cep')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                  placeholder="00000000"
                  maxLength={8}
                />
              </FormField>
              <FormField label="Número" error={errors.numero?.message}>
                <input
                  {...register('numero')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
              </FormField>
              <FormField label="Logradouro" error={errors.logradouro?.message}>
                <input
                  {...register('logradouro')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
              </FormField>
              <FormField label="Bairro" error={errors.bairro?.message}>
                <input
                  {...register('bairro')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
              </FormField>
              <FormField label="Cidade" error={errors.cidade?.message}>
                <input
                  {...register('cidade')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
              </FormField>
              <FormField label="Estado (UF)" error={errors.estado?.message}>
                <input
                  {...register('estado')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                  placeholder="SP"
                  maxLength={2}
                />
              </FormField>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <X size={14} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={14} />
              {updateMutation.isPending ? 'Salvando…' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-teal-600" />
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Dados Pessoais
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nome completo" value={paciente?.nome_completo} />
              <Field label="CPF" value={paciente?.cpf} />
              <Field
                label="Data de nascimento"
                value={
                  paciente?.data_nascimento
                    ? new Date(paciente.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR')
                    : undefined
                }
              />
              <Field
                label="Sexo"
                value={
                  paciente?.sexo === 'M'
                    ? 'Masculino'
                    : paciente?.sexo === 'F'
                      ? 'Feminino'
                      : paciente?.sexo
                }
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={16} className="text-teal-600" />
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Contato</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="E-mail" value={user?.email} />
              <Field label="Telefone" value={paciente?.telefone} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-teal-600" />
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Endereço</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="CEP" value={paciente?.cep} />
              <Field label="Logradouro" value={paciente?.logradouro} />
              <Field label="Número" value={paciente?.numero} />
              <Field label="Bairro" value={paciente?.bairro} />
              <Field label="Cidade" value={paciente?.cidade} />
              <Field label="Estado" value={paciente?.estado} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
