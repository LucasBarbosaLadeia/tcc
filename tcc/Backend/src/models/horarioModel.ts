import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IHorario {
    id_horario?: number;
    id_agenda: number;
    data_hora_inicio: Date;
    data_hora_fim: Date;
    status: "Disponível" | "Indisponível";
    created_at?: Date;

}

class Horario extends Model<IHorario> implements IHorario {
public id_horario!: number;
public id_agenda!: number;
public data_hora_inicio!: Date;
public data_hora_fim!: Date;
public status!: "Disponível" | "Indisponível";
public created_at!: Date;
}

Horario.init(
    {
id_horario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_horario"
},
id_agenda: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "id_agenda",
    references: {
        model: "Agendas",
        key: "id_agenda"
    }
},
data_hora_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "data_hora_inicio"
},
data_hora_fim: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "data_hora_fim"
},
status: {
    type: DataTypes.ENUM("Disponível", "Indisponível"),
    allowNull: false,
    field: "status"
},
created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    field: "created_at"
}

}, {
    sequelize,
    modelName: "Horario",
    tableName: "Horarios",
    timestamps: true,
});

export default Horario;