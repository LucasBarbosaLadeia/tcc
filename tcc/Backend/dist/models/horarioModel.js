"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../Config/database"));
class Horario extends sequelize_1.Model {
}
Horario.init({
    id_horario: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id_horario"
    },
    id_agenda: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "id_agenda",
        references: {
            model: "Agendas",
            key: "id_agenda"
        }
    },
    data_hora_inicio: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "data_hora_inicio"
    },
    data_hora_fim: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "data_hora_fim"
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("Disponível", "Indisponível"),
        allowNull: false,
        field: "status"
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "created_at"
    }
}, {
    sequelize: database_1.default,
    modelName: "Horario",
    tableName: "Horarios",
    timestamps: true,
});
exports.default = Horario;
//# sourceMappingURL=horarioModel.js.map