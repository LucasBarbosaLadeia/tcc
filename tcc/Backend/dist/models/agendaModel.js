"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Agenda extends sequelize_1.Model {
}
Agenda.init({
    id_agenda: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id_agenda",
    },
    id_profissional: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "id_profissional",
        references: {
            model: "Profissionais",
            key: "id_profissional",
        },
    },
    id_agendamento: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: "id_agendamento",
        references: {
            model: "Agendamentos",
            key: "id_agendamento",
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
    data: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        field: "data",
    },
    horario_inicio: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "horario_inicio",
    },
    horario_fim: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "horario_fim",
    },
    horario_almoco_inicio: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "horario_almoco_inicio",
    },
    horario_almoco_fim: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "horario_almoco_fim",
    },
    duracao_consulta: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "duracao_consulta",
    },
    vagas_disponiveis: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "vagas_disponiveis",
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
}, {
    sequelize: database_1.default,
    modelName: "Agenda",
    tableName: "Agendas",
    timestamps: true,
});
exports.default = Agenda;
//# sourceMappingURL=agendaModel.js.map