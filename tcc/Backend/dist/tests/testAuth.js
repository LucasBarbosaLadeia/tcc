"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHeaders = exports.buildAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "test-secret";
process.env.JWT_SECRET = secret;
const buildAuthToken = (perfil, id_usuario = 1, id_paciente) => {
    return jsonwebtoken_1.default.sign({ id_usuario, perfil, ...(typeof id_paciente === "number" ? { id_paciente } : {}) }, secret, { expiresIn: "1h" });
};
exports.buildAuthToken = buildAuthToken;
const authHeaders = (perfil, id_usuario = 1, id_paciente) => ({
    Authorization: `Bearer ${(0, exports.buildAuthToken)(perfil, id_usuario, id_paciente)}`,
});
exports.authHeaders = authHeaders;
//# sourceMappingURL=testAuth.js.map