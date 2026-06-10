"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
class Usuario extends sequelize_1.Model {
}
const isBcryptHash = (value) => {
    return /^\$2[aby]\$/.test(value);
};
Usuario.init({
    id_usuario: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_usuario",
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: "nome",
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: "email",
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING(11),
        allowNull: false,
        unique: true,
        field: "cpf",
    },
    senha: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: "senha",
    },
    perfil: {
        type: sequelize_1.DataTypes.ENUM("PACIENTE", "RECEPCIONISTA", "ADMIN"),
        allowNull: false,
        field: "perfil",
    },
    ativo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "ativo",
    },
    token_reset: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: "token_reset",
    },
    token_expiracao: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "token_expiracao",
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
    modelName: "Usuario",
    tableName: "Usuarios",
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ["senha"] },
    },
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.senha && !isBcryptHash(usuario.senha)) {
                usuario.senha = await (0, password_1.hashPassword)(usuario.senha);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed("senha") && usuario.senha) {
                if (!isBcryptHash(usuario.senha)) {
                    usuario.senha = await (0, password_1.hashPassword)(usuario.senha);
                }
            }
        },
    },
});
exports.default = Usuario;
//# sourceMappingURL=usuarioModel.js.map