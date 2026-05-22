import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IProfissional {
    id_profissional?: number;
    cpf: string;
    registro_profissional: string;
    tipo_registro: "CRM" | "COREN" | "CRP";
    nome_completo: string;
    id_especialidade: number;
    id_unidade: number;
    telefone: string;
    ativo: boolean;
    created_at?: Date;
    updated_at?: Date;
    
}

class Profissional extends Model<IProfissional> implements IProfissional {
public id_profissional!: number;
public cpf!: string;
public registro_profissional!: string;
public tipo_registro!: "CRM" | "COREN" | "CRP";
public nome_completo!: string;
public id_especialidade!: number;
public id_unidade!: number;
public telefone!: string;
public ativo!: boolean;
public created_at!: Date;
public updated_at!: Date;
}

Profissional.init(
    {
id_profissional: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_profissional",
},
cpf: {
    type: DataTypes.STRING(14),
    allowNull: false,
    field: "cpf",
},
registro_profissional: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "registro_profissional",
},
tipo_registro: {
    type: DataTypes.ENUM("CRM", "COREN", "CRP"),
    allowNull: false,
    field: "tipo_registro",
},
nome_completo: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: "nome_completo",
},
id_especialidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "id_especialidade",
    references: {
        model: "Especialidades",
        key: "id_especialidade"
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
telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "telefone",
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
updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "updated_at",
},
    },
{
        sequelize,
        modelName: "Profissional",
        tableName: "Profissionais",
        timestamps: true,
        underscored: true,
    }
);

export default Profissional;