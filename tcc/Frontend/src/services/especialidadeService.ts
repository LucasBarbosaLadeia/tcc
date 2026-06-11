import { api } from './api';
import type { Especialidade } from '@/types/especialidade';

export async function getEspecialidades(): Promise<Especialidade[]> {
  const { data } = await api.get<Especialidade[]>('/especialidades');
  return data;
}

export async function createEspecialidade(nome_especialidade: string): Promise<Especialidade> {
  const { data } = await api.post<Especialidade>('/especialidades', { nome_especialidade, ativo: true });
  return data;
}

export async function updateEspecialidade(id: number, nome_especialidade: string): Promise<Especialidade> {
  const { data } = await api.put<Especialidade>(`/especialidades/${id}`, { nome_especialidade });
  return data;
}

export async function deleteEspecialidade(id: number): Promise<void> {
  await api.delete(`/especialidades/${id}`);
}
