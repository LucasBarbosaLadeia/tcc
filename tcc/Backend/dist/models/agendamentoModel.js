"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Agendamento extends sequelize_1.Model {
}
Agendamento.init({
    id_agendamento: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id_agendamento",
    },
    codigo_agendamento: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        field: "codigo_agendamento",
        unique: true,
    },
    id_paciente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "id_paciente",
        references: {
            model: "Pacientes",
            key: "id_paciente",
        },
    },
    id_horario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "id_horario",
        references: {
            model: "Horarios",
            key: "id_horario",
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("Agendado", "Cancelado", "Concluído", "Falta", "Realizada"),
        allowNull: false,
        field: "status",
    },
    observacoes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: "observacoes",
    },
    motivo_cancelamento: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: "motivo_cancelamento",
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
    modelName: "Agendamento",
    tableName: "Agendamentos",
});
exports.default = Agendamento;
//# sourceMappingURL=agendamentoModel.js.map