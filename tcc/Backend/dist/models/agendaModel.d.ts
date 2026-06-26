import { Model } from "sequelize";
export interface IAgenda {
    id_agenda?: number;
    id_profissional: number;
    id_unidade: number;
    id_agendamento?: number;
    data: string;
    horario_inicio: Date;
    horario_fim: Date;
    horario_almoco_inicio?: Date | null;
    horario_almoco_fim?: Date | null;
    duracao_consulta: number;
    vagas_disponiveis: number;
    ativo: boolean;
    created_at?: Date;
}
declare class Agenda extends Model<IAgenda> implements IAgenda {
    id_agenda: number;
    id_profissional: number;
    id_agendamento: number;
    id_unidade: number;
    data: string;
    horario_inicio: Date;
    horario_fim: Date;
    horario_almoco_inicio: Date | null;
    horario_almoco_fim: Date | null;
    duracao_consulta: number;
    vagas_disponiveis: number;
    ativo: boolean;
    created_at: Date;
}
export default Agenda;
