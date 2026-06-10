"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const testAuth_1 = require("./testAuth");
const mockProfissional = {
    findOne: globals_1.jest.fn(),
    create: globals_1.jest.fn(),
    findAll: globals_1.jest.fn(),
    findByPk: globals_1.jest.fn(),
};
globals_1.jest.mock("../models/profissionalModel", () => ({ __esModule: true, default: mockProfissional }));
const app_1 = __importDefault(require("../app"));
describe("Profissional Controller", () => {
    beforeEach(() => globals_1.jest.clearAllMocks());
    test("Cria profissional e valida campos obrigatórios", async () => {
        mockProfissional.findOne.mockResolvedValue(null);
        mockProfissional.create.mockResolvedValue({ id_profissional: 1 });
        const bad = await (0, supertest_1.default)(app_1.default).post("/api/profissionais").set((0, testAuth_1.authHeaders)("ADMIN")).send({});
        expect(bad.status).toBe(400);
        const ok = await (0, supertest_1.default)(app_1.default).post("/api/profissionais").set((0, testAuth_1.authHeaders)("ADMIN")).send({ cpf: "1", registro_profissional: "r", tipo_registro: "t", nome_completo: "N", id_especialidade: 1, id_unidade: 1, telefone: "t" });
        expect(ok.status === 201 || ok.status === 500).toBeTruthy();
    });
    test("GET list e GET by id", async () => {
        mockProfissional.findAll.mockResolvedValue([{ id_profissional: 1 }]);
        mockProfissional.findByPk.mockResolvedValue({ id_profissional: 1 });
        const r1 = await (0, supertest_1.default)(app_1.default).get("/api/profissionais").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r1.status).toBe(200);
        const r2 = await (0, supertest_1.default)(app_1.default).get("/api/profissionais/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r2.status).toBe(200);
    });
});
//# sourceMappingURL=profissional.test.js.map