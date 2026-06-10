export interface Agendamento {
  id: number | string;
  pacienteId: number | string;
  agendaId?: number | string;
  profissionalId?: number | string;
  unidadeId?: number | string;
  status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';
  dataHora: string;
  observacao?: string;
}
