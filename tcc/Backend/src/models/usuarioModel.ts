import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IUsuario {
    id_usuario?: number;
    id_endereco: number;
    nome: string;
    cpf: string;
    senha: string;

}

class Usuario extends Model<IUsuario> implements IUsuario {
public id_usuario!: number;
public id_endereco!: number;
public nome!: string;
public cpf!: string;
public senha!: string;
}

Usuario.init(
    {
id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_usuario"
    },
    id_endereco: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Enderecos",
            key: "id_endereco"
        }
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "nome"
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
    }
}, {
    sequelize,
    modelName: "Usuario",
    tableName: "Usuarios",
});

export default Usuario;