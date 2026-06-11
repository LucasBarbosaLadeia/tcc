"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Profissional extends sequelize_1.Model {
}
Profissional.init({
    id_profissional: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id_profissional",
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING(14),
        allowNull: false,
        field: "cpf",
    },
    registro_profissional: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "registro_profissional",
    },
    tipo_registro: {
        type: sequelize_1.DataTypes.ENUM("CRM", "COREN", "CRP"),
        allowNull: false,
        field: "tipo_registro",
    },
    nome_completo: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
        field: "nome_completo",
    },
    id_especialidade: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "id_especialidade",
        references: {
            model: "Especialidades",
            key: "id_especialidade",
        },
    },
    id_unidade: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "id_unidade",
        references: {
            model: "Unidades",
            key: "id_unidade",
        },
    },
    telefone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        field: "telefone",
    },
    ativo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "ativo",
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "created_at",
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "updated_at",
    },
}, {
    sequelize: database_1.default,
    modelName: "Profissional",
    tableName: "Profissionais",
    timestamps: true,
    underscored: true,
});
exports.default = Profissional;
//# sourceMappingURL=profissionalModel.js.map