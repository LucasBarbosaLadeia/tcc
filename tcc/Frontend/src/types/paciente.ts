export interface Paciente {
  id: number | string;
  usuarioId?: number | string;
  nome: string;
  cpf?: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}
