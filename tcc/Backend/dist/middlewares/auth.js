"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pacienteModel_1 = __importDefault(require("../models/pacienteModel"));
const authMiddleware = async (req, res, next) => {
    const header = req.header("authorization");
    if (!header) {
        return res.status(401).json({ error: "Token nao informado" });
    }
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Token invalido" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ error: "JWT_SECRET nao configurado" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        const user = {
            id_usuario: payload.id_usuario,
            perfil: payload.perfil,
        };
        if (payload.perfil === "PACIENTE") {
            const paciente = await pacienteModel_1.default.findOne({
                where: { id_usuario: payload.id_usuario },
                attributes: ["id_paciente"],
            });
            if (paciente) {
                user.id_paciente = Number(paciente.get("id_paciente"));
            }
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: "Token invalido" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map