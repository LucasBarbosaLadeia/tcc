import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IData {
    id_data?: number;
    horario: Date;
}

class Data extends Model<IData> implements IData {
public id_data!: number;
public horario!: Date;
}

Data.init(
    {
id_data: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_data"
},
    horario: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "horario"
    }
}, {
    sequelize,
    modelName: "Data",
    tableName: "Datas"
});

export default Data;