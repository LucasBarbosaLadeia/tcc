import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface IAgendamento {
  id_agendamento?: number;
  codigo_agendamento: string;
  id_paciente: number;
  id_horario: number;
  status: "Agendado" | "Cancelado" | "Concluído" | "Falta" | "Realizada";
  observacoes?: string;
  motivo_cancelamento?: string;
  created_at?: Date;
  updated_at?: Date;
}

class Agendamento extends Model<IAgendamento> implements IAgendamento {
  public id_agendamento!: number;
  public codigo_agendamento!: string;
  public id_paciente!: number;
  public id_horario!: number;
  public status!:
    | "Agendado"
    | "Cancelado"
    | "Concluído"
    | "Falta"
    | "Realizada";
  public observacoes!: string;
  public motivo_cancelamento!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Agendamento.init(
  {
    id_agendamento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_agendamento",
    },
    codigo_agendamento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "codigo_agendamento",
      unique: true,
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_paciente",
      references: {
        model: "Pacientes",
        key: "id_paciente",
      },
    },
    id_horario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_horario",
      references: {
        model: "Horarios",
        key: "id_horario",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "Agendado",
        "Cancelado",
        "Concluído",
        "Falta",
        "Realizada",
      ),
      allowNull: false,
      field: "status",
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "observacoes",
    },
    motivo_cancelamento: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "motivo_cancelamento",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "Agendamento",
    tableName: "Agendamentos",
  },
);

export default Agendamento;
