import { Model } from "sequelize";
export interface IAgenda {
    id_agenda?: number;
    id_profissional: number;
    id_unidade: number;
    id_agendamento?: number;
    dia_semana: "Segunda-feira" | "Terça-feira" | "Quarta-feira" | "Quinta-feira" | "Sexta-feira" | "Sábado" | "Domingo";
    horario_inicio: Date;
    horario_fim: Date;
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
    dia_semana: "Segunda-feira" | "Terça-feira" | "Quarta-feira" | "Quinta-feira" | "Sexta-feira" | "Sábado" | "Domingo";
    horario_inicio: Date;
    horario_fim: Date;
    duracao_consulta: number;
    vagas_disponiveis: number;
    ativo: boolean;
    created_at: Date;
}
export default Agenda;
