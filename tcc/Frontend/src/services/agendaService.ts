import { api } from './api';
import type { Agenda } from '@/types/agenda';

export interface CreateAgendaInput {
  id_profissional: number;
  id_unidade: number;
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
  duracao_consulta: number;
  vagas_disponiveis: number;
}

export async function getAgendas(): Promise<Agenda[]> {
  const { data } = await api.get<Agenda[]>('/agendas');
  return data;
}

export async function createAgenda(input: CreateAgendaInput): Promise<Agenda> {
  const { data } = await api.post<Agenda>('/agendas', input);
  return data;
}

export async function updateAgenda(id: number, input: Partial<CreateAgendaInput> & { ativo?: boolean }): Promise<Agenda> {
  const { data } = await api.put<Agenda>(`/agendas/${id}`, input);
  return data;
}

export async function deleteAgenda(id: number): Promise<void> {
  await api.delete(`/agendas/${id}`);
}
