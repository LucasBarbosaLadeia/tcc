export interface Horario {
  id_horario: number;
  id_agenda: number;
  data_hora_inicio: string;
  data_hora_fim: string;
  status: 'Disponível' | 'Indisponível';
  profissional?: { nome_completo: string; tipo_registro?: string } | null;
}
