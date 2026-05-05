import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IAgendamento {
    id_agendamento?: number;
    id_unidade: number;
    id_especialidade: number;
    id_data: number;
    id_usuario: number;
}

class Agendamento extends Model<IAgendamento> implements IAgendamento {
public id_agendamento!: number;
public id_unidade!: number;
public id_especialidade!: number;
public id_data!: number;
public id_usuario!: number;
}

Agendamento.init(
    {
id_agendamento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_agendamento"
},
id_unidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: "Unidades",
        key: "id_unidade"
    }
},
id_especialidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: "Especialidades",
        key: "id_especialidade"
    }
},
id_data: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: "Datas",
        key: "id_data"
    }
},
id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: "Usuarios",
        key: "id_usuario"
    }
},
    }, {
    sequelize,
    modelName: "Agendamento",
    tableName: "Agendamentos"
});

export default Agendamento;