"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../Config/database"));
class Paciente extends sequelize_1.Model {
}
Paciente.init({
    id_paciente: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id_paciente"
    },
    id_usuario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: "id_usuario",
        references: {
            model: "Usuarios",
            key: "id_usuario"
        }
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING(14),
        allowNull: false,
        unique: true,
        field: "cpf"
    },
    nome_completo: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "nome_completo"
    },
    data_nascimento: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        field: "data_nascimento"
    },
    sexo: {
        type: sequelize_1.DataTypes.ENUM("M", "F", "Outro"),
        allowNull: false,
        field: "sexo"
    },
    telefone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        field: "telefone"
    },
    cep: {
        type: sequelize_1.DataTypes.STRING(8),
        allowNull: false,
        field: "cep"
    },
    logradouro: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "logradouro"
    },
    numero: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        field: "numero"
    },
    bairro: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "bairro"
    },
    cidade: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "cidade"
    },
    estado: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false,
        field: "estado"
    },
    contador_faltas: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "contador_faltas"
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "created_at"
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "updated_at"
    }
}, {
    sequelize: database_1.default,
    modelName: "Paciente",
    tableName: "Pacientes",
    timestamps: true,
});
exports.default = Paciente;
//# sourceMappingURL=pacienteModel.js.map