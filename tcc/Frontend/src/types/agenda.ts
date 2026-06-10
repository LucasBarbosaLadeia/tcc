export interface Agenda {
  id: number | string;
  profissionalId: number | string;
  unidadeId?: number | string;
  diaSemana: number;
  horarioInicio: string;
  horarioFim: string;
  ativo?: boolean;
}
