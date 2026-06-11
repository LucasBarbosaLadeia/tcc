import { api } from './api';

export interface UsuarioAPI {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
  perfil: 'ADMIN' | 'RECEPCIONISTA' | 'PACIENTE';
  ativo: boolean;
  created_at?: string;
}

export interface CreateUsuarioInput {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  perfil?: 'ADMIN' | 'RECEPCIONISTA' | 'PACIENTE';
}

export interface UpdateUsuarioInput {
  nome?: string;
  email?: string;
  perfil?: 'ADMIN' | 'RECEPCIONISTA' | 'PACIENTE';
  ativo?: boolean;
}

export async function getUsuarios(): Promise<UsuarioAPI[]> {
  const { data } = await api.get<UsuarioAPI[]>('/usuarios');
  return data;
}

export async function createUsuario(input: CreateUsuarioInput): Promise<UsuarioAPI> {
  const { data } = await api.post<UsuarioAPI>('/usuarios', input);
  return data;
}

export async function updateUsuario(id: number, input: UpdateUsuarioInput): Promise<UsuarioAPI> {
  const { data } = await api.put<UsuarioAPI>(`/usuarios/${id}`, input);
  return data;
}

export async function deleteUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}
