import {Model, DataTypes} from "sequelize";
import sequelize from "../Config/database";

export interface IPaciente {
    id_paciente?: number;
    id_usuario: number;
    cpf: string;
    nome_completo: string;
    data_nascimento: Date;
    sexo: "M" | "F" | "Outro";
    telefone: string;
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    contador_faltas?: number;
    created_at?: Date;
    updated_at?: Date;
}

class Paciente extends Model<IPaciente> implements IPaciente {
public id_paciente!: number;
public id_usuario!: number;
public cpf!: string;
public nome_completo!: string;
public data_nascimento!: Date;
public sexo!: "M" | "F" | "Outro";
public telefone!: string;
public cep!: string;
public logradouro!: string;
public numero!: string;
public bairro!: string;
public cidade!: string;
public estado!: string;
public contador_faltas!: number;
public created_at!: Date;
public updated_at!: Date;
}

Paciente.init(
    {
id_paciente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_paciente"
},
id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: "id_usuario",
    references: {
        model: "Usuarios",
        key: "id_usuario"
    }
},
cpf: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true,
    field: "cpf"
},
nome_completo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "nome_completo"
},
data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "data_nascimento"
},
sexo: {
    type: DataTypes.ENUM("M", "F", "Outro"),
    allowNull: false,
    field: "sexo"
},
telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "telefone"
},
cep: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "cep"
},
logradouro: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "logradouro"
},
numero: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "numero"
},
bairro: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "bairro"
},
cidade: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "cidade"
},
estado: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "estado"
},

contador_faltas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "contador_faltas"
},
created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "created_at"
},
updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "updated_at"
}
    }, {
    sequelize,
    modelName: "Paciente",
    tableName: "Pacientes",
    timestamps: true,
})

export default Paciente;