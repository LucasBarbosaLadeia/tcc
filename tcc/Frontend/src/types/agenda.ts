export interface Agenda {
  id_agenda: number;
  id_profissional: number;
  id_unidade: number;
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
  duracao_consulta: number;
  vagas_disponiveis: number;
  ativo?: boolean;
}
