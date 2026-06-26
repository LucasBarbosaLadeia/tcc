"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const authService_1 = require("../services/authService");
const login = async (req, res) => {
    try {
        const { cpf, email, senha } = req.body;
        if (!senha || (!cpf && !email)) {
            return res.status(400).json({ error: "Credenciais invalidas" });
        }
        const identificador = cpf ? cpf.trim() : (email || '').trim().toLowerCase();
        const result = await (0, authService_1.authenticateLogin)(identificador, senha);
        if (!result) {
            return res.status(401).json({ error: "Credenciais invalidas" });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Erro ao autenticar", details: error });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map