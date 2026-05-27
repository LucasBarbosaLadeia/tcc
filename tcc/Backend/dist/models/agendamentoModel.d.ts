import { Model } from "sequelize";
export interface IAgendamento {
    id_agendamento?: number;
    codigo_agendamento: string;
    id_paciente: number;
    id_horario: number;
    status: "Agendado" | "Cancelado" | "Concluído" | "Falta" | "Realizada";
    observacoes?: string;
    motivo_cancelamento?: string;
    created_at?: Date;
    updated_at?: Date;
}
declare class Agendamento extends Model<IAgendamento> implements IAgendamento {
    id_agendamento: number;
    codigo_agendamento: string;
    id_paciente: number;
    id_horario: number;
    status: "Agendado" | "Cancelado" | "Concluído" | "Falta" | "Realizada";
    observacoes: string;
    motivo_cancelamento: string;
    created_at: Date;
    updated_at: Date;
}
export default Agendamento;
