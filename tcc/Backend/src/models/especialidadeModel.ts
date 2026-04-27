import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IEspecialidade {
    id_especialidade?: number;
    nome: string;
}

class Especialidade extends Model<IEspecialidade> implements IEspecialidade {
public id_especialidade!: number;
public nome!: string;
}

Especialidade.init(
    {
        id_especialidade: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        tableName: "especialidades"
    }
)

export default Especialidade;   