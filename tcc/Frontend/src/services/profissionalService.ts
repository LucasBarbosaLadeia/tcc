import { api } from './api';
import type { Profissional } from '@/types/profissional';

export interface CreateProfissionalInput {
  cpf: string;
  registro_profissional: string;
  tipo_registro: string;
  nome_completo: string;
  id_especialidade: number;
  id_unidade: number;
  telefone: string;
}

export async function getProfissionais(): Promise<Profissional[]> {
  const { data } = await api.get<Profissional[]>('/profissionais');
  return data;
}

export async function createProfissional(input: CreateProfissionalInput): Promise<Profissional> {
  const { data } = await api.post<Profissional>('/profissionais', input);
  return data;
}
