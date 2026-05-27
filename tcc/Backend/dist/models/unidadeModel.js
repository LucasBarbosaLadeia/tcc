"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../Config/database"));
class Unidade extends sequelize_1.Model {
}
Unidade.init({
    id_unidade: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_unidade"
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "nome_unidade"
    },
    tipo: {
        type: sequelize_1.DataTypes.ENUM("UBS", "UPA", "Posto", "CAPS"),
        allowNull: false,
        field: "tipo_unidade"
    },
    telefone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        field: "telefone_unidade"
    },
    logradouro: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "logradouro_unidade"
    },
    numero: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        field: "numero_unidade"
    },
    bairro: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "bairro_unidade"
    },
    ativo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "ativo_unidade"
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "created_at"
    }
}, {
    sequelize: database_1.default,
    modelName: "Unidade",
    tableName: "Unidades",
    timestamps: true,
});
exports.default = Unidade;
//# sourceMappingURL=unidadeModel.js.map