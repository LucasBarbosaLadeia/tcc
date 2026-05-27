import { Model } from "sequelize";
export interface IProfissional {
    id_profissional?: number;
    cpf: string;
    registro_profissional: string;
    tipo_registro: "CRM" | "COREN" | "CRP";
    nome_completo: string;
    id_especialidade: number;
    id_unidade: number;
    telefone: string;
    ativo: boolean;
    created_at?: Date;
    updated_at?: Date;
}
declare class Profissional extends Model<IProfissional> implements IProfissional {
    id_profissional: number;
    cpf: string;
    registro_profissional: string;
    tipo_registro: "CRM" | "COREN" | "CRP";
    nome_completo: string;
    id_especialidade: number;
    id_unidade: number;
    telefone: string;
    ativo: boolean;
    created_at: Date;
    updated_at: Date;
}
export default Profissional;
