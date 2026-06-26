import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface IAgenda {
  id_agenda?: number;
  id_profissional: number;
  id_unidade: number;
  id_agendamento?: number;
  data: string;               // Data específica da agenda (DATEONLY: "2025-03-10")
  horario_inicio: Date;
  horario_fim: Date;
  horario_almoco_inicio?: Date | null;
  horario_almoco_fim?: Date | null;
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
  public data!: string;
  public horario_inicio!: Date;
  public horario_fim!: Date;
  public horario_almoco_inicio!: Date | null;
  public horario_almoco_fim!: Date | null;
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
      field: "id_agenda",
    },
    id_profissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_profissional",
      references: {
        model: "Profissionais",
        key: "id_profissional",
      },
    },
    id_agendamento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "id_agendamento",
      references: {
        model: "Agendamentos",
        key: "id_agendamento",
      },
    },
    id_unidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_unidade",
      references: {
        model: "Unidades",
        key: "id_unidade",
      },
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "data",
    },
    horario_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "horario_inicio",
    },
    horario_fim: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "horario_fim",
    },
    horario_almoco_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "horario_almoco_inicio",
    },
    horario_almoco_fim: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "horario_almoco_fim",
    },
    duracao_consulta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "duracao_consulta",
    },
    vagas_disponiveis: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "vagas_disponiveis",
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "ativo",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    modelName: "Agenda",
    tableName: "Agendas",
    timestamps: true,
  },
);

export default Agenda;
