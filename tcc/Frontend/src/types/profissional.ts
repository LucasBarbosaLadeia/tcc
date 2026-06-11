export interface Profissional {
  id_profissional: number;
  nome_completo: string;
  registro_profissional: string;
  tipo_registro?: string;
  id_especialidade: number;
  id_unidade: number;
  telefone?: string;
  ativo?: boolean;
}
