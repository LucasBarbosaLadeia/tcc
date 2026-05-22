import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IAgenda{
id_agenda?: number;
id_profissional: number;
id_unidade: number;
id_agendamento?: number;
dia_semana: "Segunda-feira" | "Terça-feira" | "Quarta-feira" | "Quinta-feira" | "Sexta-feira" | "Sábado" | "Domingo";
horario_inicio: Date;
horario_fim: Date;
duracao_consulta: number;
vagas_disponiveis: number;
ativo: boolean;
created_at?: Date;
}

class Agenda extends Model<IAgenda> implements IAgenda {
public id_agenda!: number;
public id_profissional!: number;
public id_agendamento!: number;
public id_unidade!: number;
public dia_semana!: "Segunda-feira" | "Terça-feira" | "Quarta-feira" | "Quinta-feira" | "Sexta-feira" | "Sábado" | "Domingo";
public horario_inicio!: Date;
public horario_fim!: Date;
public duracao_consulta!: number;
public vagas_disponiveis!: number;
public ativo!: boolean;
public created_at!: Date;
}

Agenda.init(
    {
id_agenda: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_agenda"
},
id_profissional: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "id_profissional",
    references: {
        model: "Profissionais",
        key: "id_profissional"
    }
},
id_agendamento: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "id_agendamento",
    references: {
        model: "Agendamentos",
        key: "id_agendamento"
    }
},
id_unidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "id_unidade",
    references: {
        model: "Unidades",
        key: "id_unidade"
    }
},
dia_semana: {
    type: DataTypes.ENUM("Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"),
    allowNull: false,
    field: "dia_semana"
},
horario_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "horario_inicio"
},
horario_fim: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "horario_fim"
},
duracao_consulta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "duracao_consulta"
},
vagas_disponiveis: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "vagas_disponiveis"
},
ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: "ativo"
},
created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "created_at"
}
}, {
    sequelize,
    modelName: "Agenda",
    tableName: "Agendas",
    timestamps: true
});

export default Agenda;