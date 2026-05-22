import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

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

class Unidade extends Model<IUnidade> implements IUnidade {
public id_unidade!: number;
public nome!: string;
public tipo!: "UBS" | "UPA" | "Posto" | "CAPS";
public telefone!: string;
public logradouro!: string;
public numero!: string;
public bairro!: string;
public ativo!: boolean;
public created_at!: Date;
}

Unidade.init(
    {
id_unidade: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id_unidade"
},

nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "nome_unidade"
},
tipo: {
    type: DataTypes.ENUM("UBS", "UPA", "Posto", "CAPS"),
    allowNull: false,
    field: "tipo_unidade"

    },
    telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "telefone_unidade"
},
    logradouro: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "logradouro_unidade"
},
    numero: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "numero_unidade"
},
    bairro: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "bairro_unidade"
},
    ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: "ativo_unidade"
},
    created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "created_at"
}
},
{
    sequelize,
    modelName: "Unidade",
    tableName: "Unidades",
    timestamps: true,
});

export default Unidade;