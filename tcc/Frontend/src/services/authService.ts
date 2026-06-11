import { api } from './api';
import type { User } from '@/types/user';
import type { Perfil } from '@/constants/perfis';

interface LoginPayload {
  email?: string;
  cpf?: string;
  senha: string;
}

const isCpf = (value: string) => /^\d{11}$/.test(value.replace(/\D/g, ''));

interface BackendLoginResponse {
  token: string;
  usuario: {
    id_usuario: number;
    nome: string;
    email: string;
    cpf?: string;
    perfil: Perfil;
    ativo?: boolean;
    id_paciente?: number;
  };
}

export interface LoginResult {
  token: string;
  user: User;
  perfil: Perfil;
}

export async function loginRequest(identificador: string, senha: string): Promise<LoginResult> {
  const payload: LoginPayload = isCpf(identificador)
    ? { cpf: identificador.replace(/\D/g, ''), senha }
    : { email: identificador, senha };

  const { data } = await api.post<BackendLoginResponse>('/auth/login', payload);

  const user: User = {
    id: data.usuario.id_usuario,
    nome: data.usuario.nome,
    email: data.usuario.email,
    cpf: data.usuario.cpf,
    perfil: data.usuario.perfil,
    ativo: data.usuario.ativo,
    id_paciente: data.usuario.id_paciente,
  };

  return { token: data.token, user, perfil: data.usuario.perfil };
}
