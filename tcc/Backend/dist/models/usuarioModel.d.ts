import { Model } from "sequelize";
export type PerfilUsuario = "PACIENTE" | "RECEPCIONISTA" | "ADMIN";
export interface IUsuario {
    id_usuario?: number;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    perfil: PerfilUsuario;
    ativo: boolean;
    token_reset?: string | null;
    token_expiracao?: Date | null;
    created_at?: Date;
    updated_at?: Date;
}
declare class Usuario extends Model<IUsuario> implements IUsuario {
    id_usuario: number;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    perfil: PerfilUsuario;
    ativo: boolean;
    token_reset: string | null;
    token_expiracao: Date | null;
    created_at: Date;
    updated_at: Date;
}
export default Usuario;
