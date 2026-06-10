import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface IEspecialidade {
  id_especialidade?: number;
  nome_especialidade: string;
  ativo: boolean;
  created_at?: Date;
}

class Especialidade extends Model<IEspecialidade> implements IEspecialidade {
  public id_especialidade!: number;
  public nome_especialidade!: string;
  public ativo!: boolean;
  public created_at!: Date;
}

Especialidade.init(
  {
    id_especialidade: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome_especialidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Especialidades",
    timestamps: true,
  },
);

export default Especialidade;
