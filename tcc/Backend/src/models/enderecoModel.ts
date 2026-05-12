import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IEndereco {
    id_endereco?: number;
    estado: string;
    cidade: string;
}

class Endereco extends Model<IEndereco> implements IEndereco {
public id_endereco!: number;
public estado!: string;
public cidade!: string;
}

Endereco.init(
    {
id_endereco: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_endereco",
},
estado: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "estado",
},
cidade: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "cidade",
}
},
{
        sequelize,
        modelName: "Endereco",
        tableName: "Enderecos",
        timestamps: true,
        underscored: true,
    }
)

export default Endereco;