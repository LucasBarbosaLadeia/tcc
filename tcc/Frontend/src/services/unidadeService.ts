import { api } from './api';

export interface Unidade {
  id_unidade: number;
  nome: string;
  tipo?: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  ativo?: boolean;
}

export interface CreateUnidadeInput {
  nome: string;
  tipo: string;
  telefone: string;
  logradouro: string;
  numero: string;
  bairro: string;
}

export async function getUnidades(): Promise<Unidade[]> {
  const { data } = await api.get<Unidade[]>('/unidades');
  return data;
}

export async function createUnidade(input: CreateUnidadeInput): Promise<Unidade> {
  const { data } = await api.post<Unidade>('/unidades', input);
  return data;
}

export async function deleteUnidade(id: number): Promise<void> {
  await api.delete(`/unidades/${id}`);
}
