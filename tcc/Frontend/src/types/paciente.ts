export interface Paciente {
  id_paciente: number;
  id_usuario: number;
  cpf: string;
  nome_completo: string;
  data_nascimento: string;
  sexo: 'M' | 'F' | 'Outro';
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  contador_faltas: number;
}
