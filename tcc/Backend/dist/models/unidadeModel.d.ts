import { Model } from "sequelize";
export interface IUnidade {
    id_unidade?: number;
    nome: string;
    tipo: "UBS" | "UPA" | "Posto" | "CAPS";
    telefone: string;
    logradouro: string;
    numero: string;
    bairro: string;
    ativo: boolean;
    created_at?: Date;
}
declare class Unidade extends Model<IUnidade> implements IUnidade {
    id_unidade: number;
    nome: string;
    tipo: "UBS" | "UPA" | "Posto" | "CAPS";
    telefone: string;
    logradouro: string;
    numero: string;
    bairro: string;
    ativo: boolean;
    created_at: Date;
}
export default Unidade;
