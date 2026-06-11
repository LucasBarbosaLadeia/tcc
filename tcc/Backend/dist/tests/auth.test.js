"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mockUsuario = {
    findOne: globals_1.jest.fn(),
};
const mockComparePassword = globals_1.jest.fn();
globals_1.jest.mock("../models/usuarioModel", () => ({ __esModule: true, default: mockUsuario }));
globals_1.jest.mock("../utils/password", () => ({
    __esModule: true,
    comparePassword: mockComparePassword,
    hashPassword: globals_1.jest.fn(),
}));
const app_1 = __importDefault(require("../app"));
const secret = process.env.JWT_SECRET || "test-secret";
process.env.JWT_SECRET = secret;
const makeUsuario = (perfil, id_usuario) => ({
    get: (field) => {
        if (field === "senha")
            return "hashed-password";
        if (field === "id_usuario")
            return id_usuario;
        if (field === "perfil")
            return perfil;
        return undefined;
    },
    toJSON: () => ({
        id_usuario,
        nome: "Usuario",
        email: `${perfil.toLowerCase()}@teste.com`,
        cpf: `${id_usuario}`,
        perfil,
        ativo: true,
    }),
});
describe("Autenticacao e JWT", () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    test.each([
        ["ADMIN", "admin@teste.com", 1],
        ["RECEPCIONISTA", "recepcao@teste.com", 2],
        ["PACIENTE", "paciente@teste.com", 3],
    ])("Login de %s retorna JWT valido", async (perfil, email, id_usuario) => {
        mockUsuario.findOne.mockResolvedValue(makeUsuario(perfil, id_usuario));
        mockComparePassword.mockResolvedValue(true);
        const resp = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({ email, senha: "123" });
        expect(resp.status).toBe(200);
        expect(resp.body.token).toBeTruthy();
        expect(jsonwebtoken_1.default.verify(resp.body.token, secret)).toMatchObject({
            id_usuario,
            perfil,
        });
    });
    test("Sem token retorna 401", async () => {
        const resp = await (0, supertest_1.default)(app_1.default).get("/api/usuarios");
        expect(resp.status).toBe(401);
    });
    test("Token invalido retorna 401", async () => {
        const resp = await (0, supertest_1.default)(app_1.default)
            .get("/api/usuarios")
            .set("Authorization", "Bearer token-invalido");
        expect(resp.status).toBe(401);
    });
    test("Token expirado retorna 401", async () => {
        const expired = jsonwebtoken_1.default.sign({ id_usuario: 1, perfil: "ADMIN" }, secret, { expiresIn: "-1s" });
        const resp = await (0, supertest_1.default)(app_1.default)
            .get("/api/usuarios")
            .set("Authorization", `Bearer ${expired}`);
        expect(resp.status).toBe(401);
    });
    test("Perfil sem permissao retorna 403", async () => {
        const token = jsonwebtoken_1.default.sign({ id_usuario: 2, perfil: "RECEPCIONISTA" }, secret, { expiresIn: "1h" });
        const resp = await (0, supertest_1.default)(app_1.default)
            .post("/api/usuarios")
            .set("Authorization", `Bearer ${token}`)
            .send({ nome: "A", email: "a@b.com", cpf: "123", senha: "x", perfil: "ADMIN" });
        expect(resp.status).toBe(403);
    });
});
//# sourceMappingURL=auth.test.js.map