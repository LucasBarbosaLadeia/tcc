import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IUnidade {
    id_unidade?: number;
    id_endereco: number;
    nome: string;

}

class Unidade extends Model<IUnidade> implements IUnidade {
public id_unidade!: number;
public id_endereco!: number;
public nome!: string;
}

Unidade.init(
    {
id_unidade: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id_unidade"
},
id_endereco: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: "Endereco",
        key: "id_endereco"
    }
},
nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "nome_unidade"
}
    }, {
    sequelize,
    modelName: "Unidade"
});