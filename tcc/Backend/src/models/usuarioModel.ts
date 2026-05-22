import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IUsuario {
    id_usuario?: number;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    perfil: "paciente" | "recepcionista" | "admin";
    ativo: boolean;
    token_reset?: string | null;
    token_expiracao?: Date | null;
    created_at?: Date;
    updated_at?: Date;

}

class Usuario extends Model<IUsuario> implements IUsuario {
public id_usuario!: number;
public nome!: string;
public email!: string;
public cpf!: string;
public senha!: string;
public perfil!: "paciente" | "recepcionista" | "admin";
public ativo!: boolean;
public token_reset!: string | null;
public token_expiracao!: Date | null;
public created_at!: Date;
public updated_at!: Date;
}

Usuario.init(
    {
id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_usuario"
    },

nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "nome"
    },
email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "email"
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
        field: "cpf"
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "senha"
    },
    perfil: {
        type: DataTypes.ENUM("paciente", "recepcionista", "admin"),
        allowNull: false,
        field: "perfil"
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "ativo"
    },
    token_reset: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "token_reset"
    },
    token_expiracao: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "token_expiracao"
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at"
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at"
    }

}, {
    sequelize,
    modelName: "Usuario",
    tableName: "Usuarios",
    timestamps: true,
});

export default Usuario;