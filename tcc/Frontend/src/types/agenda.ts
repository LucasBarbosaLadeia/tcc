export interface Agenda {
  id_agenda: number;
  id_profissional: number;
  id_unidade: number;
  data: string;               // DATEONLY: "2025-03-10"
  horario_inicio: string;
  horario_fim: string;
  horario_almoco_inicio?: string | null;
  horario_almoco_fim?: string | null;
  duracao_consulta: number;
  vagas_disponiveis: number;
  ativo?: boolean;
}
