export type AgendamentoStatus = 'Agendado' | 'Cancelado' | 'Concluído' | 'Falta' | 'Realizada';

export interface Agendamento {
  id_agendamento: number;
  codigo_agendamento: string;
  id_paciente: number;
  id_horario: number;
  status: AgendamentoStatus;
  observacoes?: string;
  motivo_cancelamento?: string;
  created_at?: string;
  updated_at?: string;
  horario?: {
    data_hora_inicio: string;
    data_hora_fim: string;
    profissional?: { nome_completo: string; tipo_registro?: string } | null;
  } | null;
}
