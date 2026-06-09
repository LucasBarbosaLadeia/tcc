"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const usuarioModel_1 = __importDefault(require("../models/usuarioModel"));
const password_1 = require("../utils/password");
const authenticateLogin = async (identificador, senha) => {
    const usuario = await usuarioModel_1.default.findOne({
        where: {
            [sequelize_1.Op.or]: [{ cpf: identificador }, { email: identificador }],
        },
        attributes: { include: ["senha"] },
    });
    if (!usuario) {
        return null;
    }
    const senhaValida = await (0, password_1.comparePassword)(senha, usuario.get("senha"));
    if (!senhaValida) {
        return null;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET nao configurado");
    }
    const signOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || "1d"),
    };
    const token = jsonwebtoken_1.default.sign({ id_usuario: usuario.get("id_usuario"), perfil: usuario.get("perfil") }, secret, signOptions);
    const { senha: _senha, ...usuarioSemSenha } = usuario.toJSON();
    return { token, usuario: usuarioSemSenha };
};
exports.authenticateLogin = authenticateLogin;
//# sourceMappingURL=authService.js.map