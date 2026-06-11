import { api } from './api';
import type { Agendamento } from '@/types/agendamento';

export interface CreateAgendamentoInput {
  id_paciente: number;
  id_horario: number;
  observacoes?: string;
}

export async function getAgendamentos(): Promise<Agendamento[]> {
  const { data } = await api.get<Agendamento[]>('/agendamentos');
  return data;
}

export async function createAgendamento(input: CreateAgendamentoInput): Promise<Agendamento> {
  const { data } = await api.post<Agendamento>('/agendamentos', input);
  return data;
}

export async function cancelAgendamento(
  id: number,
  motivo_cancelamento: string,
): Promise<Agendamento> {
  const { data } = await api.put<Agendamento>(`/agendamentos/${id}`, {
    status: 'Cancelado',
    motivo_cancelamento,
  });
  return data;
}
