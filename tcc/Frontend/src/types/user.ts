import type { Perfil } from '@/constants/perfis';

export interface User {
  id: number | string;
  nome: string;
  email: string;
  perfil: Perfil;
  cpf?: string;
  telefone?: string;
  ativo?: boolean;
  id_paciente?: number;
}
