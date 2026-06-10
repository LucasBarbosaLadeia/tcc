import { Model } from "sequelize";
export interface IHorario {
    id_horario?: number;
    id_agenda: number;
    data_hora_inicio: Date;
    data_hora_fim: Date;
    status: "Disponível" | "Indisponível";
    created_at?: Date;
}
declare class Horario extends Model<IHorario> implements IHorario {
    id_horario: number;
    id_agenda: number;
    data_hora_inicio: Date;
    data_hora_fim: Date;
    status: "Disponível" | "Indisponível";
    created_at: Date;
}
export default Horario;
