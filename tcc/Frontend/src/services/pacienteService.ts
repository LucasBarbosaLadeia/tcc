import { api } from './api';
import type { Paciente } from '@/types/paciente';

export interface UpdatePacienteInput {
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface CreatePacienteInput {
  id_usuario: number;
  cpf: string;
  nome_completo: string;
  data_nascimento: string;
  sexo: 'M' | 'F' | 'Outro';
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export async function getAllPacientes(): Promise<Paciente[]> {
  const { data } = await api.get<Paciente[]>('/pacientes');
  return data;
}

export async function getPaciente(id: number): Promise<Paciente> {
  const { data } = await api.get<Paciente>(`/pacientes/${id}`);
  return data;
}

export async function createPaciente(input: CreatePacienteInput): Promise<Paciente> {
  const { data } = await api.post<Paciente>('/pacientes', input);
  return data;
}

export async function updatePaciente(id: number, input: UpdatePacienteInput): Promise<Paciente> {
  const { data } = await api.put<Paciente>(`/pacientes/${id}`, input);
  return data;
}
