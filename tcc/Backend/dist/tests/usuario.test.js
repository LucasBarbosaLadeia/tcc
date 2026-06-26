"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const testAuth_1 = require("./testAuth");
const mockUsuario = {
    findOne: globals_1.jest.fn(),
    create: globals_1.jest.fn(),
    findAll: globals_1.jest.fn(),
    findByPk: globals_1.jest.fn(),
};
const mockPaciente = {
    findOne: globals_1.jest.fn(),
};
globals_1.jest.mock("../models/usuarioModel", () => ({ __esModule: true, default: mockUsuario }));
globals_1.jest.mock("../models/pacienteModel", () => ({ __esModule: true, default: mockPaciente }));
const app_1 = __importDefault(require("../app"));
describe("Usuario Controller", () => {
    beforeEach(() => globals_1.jest.clearAllMocks());
    test("Cria usuário com sucesso", async () => {
        mockUsuario.findOne.mockResolvedValue(null);
        mockUsuario.create.mockImplementation(async (d) => ({
            toJSON: () => ({ id_usuario: 1, ...d }),
        }));
        const resp = await (0, supertest_1.default)(app_1.default).post("/api/usuarios").set((0, testAuth_1.authHeaders)("ADMIN")).send({ nome: "A", email: "a@b.com", cpf: "123", senha: "x", perfil: "user" });
        expect(resp.status).toBe(201);
        expect(resp.body.id_usuario).toBe(1);
    });
    test("Não cria usuário com CPF duplicado", async () => {
        mockUsuario.findOne.mockResolvedValue({ id_usuario: 1 });
        const resp = await (0, supertest_1.default)(app_1.default).post("/api/usuarios").set((0, testAuth_1.authHeaders)("ADMIN")).send({ nome: "A", email: "a@b.com", cpf: "123", senha: "x", perfil: "user" });
        expect(resp.status).toBe(400);
    });
    test("GET all e GET by id", async () => {
        mockUsuario.findAll.mockResolvedValue([{ id_usuario: 1 }]);
        mockUsuario.findByPk.mockResolvedValue({ id_usuario: 1 });
        const r1 = await (0, supertest_1.default)(app_1.default).get("/api/usuarios").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r1.status).toBe(200);
        const r2 = await (0, supertest_1.default)(app_1.default).get("/api/usuarios/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r2.status).toBe(200);
    });
    test("PUT atualiza e valida CPF único", async () => {
        mockUsuario.findByPk.mockResolvedValue({
            get: () => 1,
            update: globals_1.jest.fn().mockResolvedValue({
                toJSON: () => ({ id_usuario: 1, nome: "B" }),
            }),
        });
        mockUsuario.findOne.mockResolvedValue({ get: () => 2 });
        const rBad = await (0, supertest_1.default)(app_1.default).put("/api/usuarios/1").set((0, testAuth_1.authHeaders)("ADMIN")).send({ cpf: "dup" });
        expect(rBad.status).toBe(400);
        mockUsuario.findOne.mockResolvedValue(null);
        const r = await (0, supertest_1.default)(app_1.default).put("/api/usuarios/1").set((0, testAuth_1.authHeaders)("ADMIN")).send({ nome: "B" });
        expect(r.status).toBe(200);
    });
    test("DELETE usuário", async () => {
        mockUsuario.findByPk.mockResolvedValue({ destroy: globals_1.jest.fn().mockResolvedValue(true) });
        mockPaciente.findOne.mockResolvedValue(null);
        const r = await (0, supertest_1.default)(app_1.default).delete("/api/usuarios/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r.status).toBe(200);
    });
});
//# sourceMappingURL=usuario.test.js.map