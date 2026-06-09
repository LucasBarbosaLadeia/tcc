"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...perfisPermitidos) => {
    return (req, res, next) => {
        const perfil = req.user?.perfil;
        if (!perfil || !perfisPermitidos.includes(perfil)) {
            return res.status(403).json({ error: "Acesso nao autorizado" });
        }
        return next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map