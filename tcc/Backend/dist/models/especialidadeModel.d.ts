import { Model } from "sequelize";
export interface IEspecialidade {
    id_especialidade?: number;
    nome_especialidade: string;
    ativo: boolean;
    created_at?: Date;
}
declare class Especialidade extends Model<IEspecialidade> implements IEspecialidade {
    id_especialidade: number;
    nome_especialidade: string;
    ativo: boolean;
    created_at: Date;
}
export default Especialidade;
