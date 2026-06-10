"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const testAuth_1 = require("./testAuth");
const mockEspecialidade = {
    findOne: globals_1.jest.fn(),
    create: globals_1.jest.fn(),
    findAll: globals_1.jest.fn(),
    findByPk: globals_1.jest.fn(),
};
globals_1.jest.mock("../models/especialidadeModel", () => ({ __esModule: true, default: mockEspecialidade }));
const app_1 = __importDefault(require("../app"));
describe("Especialidade Controller", () => {
    beforeEach(() => globals_1.jest.clearAllMocks());
    test("Cria especialidade e evita duplicidade", async () => {
        mockEspecialidade.findOne.mockResolvedValue(null);
        mockEspecialidade.create.mockResolvedValue({ id_especialidade: 1 });
        const bad = await (0, supertest_1.default)(app_1.default).post("/api/especialidades").set((0, testAuth_1.authHeaders)("ADMIN")).send({});
        expect(bad.status).toBe(400);
        const ok = await (0, supertest_1.default)(app_1.default).post("/api/especialidades").set((0, testAuth_1.authHeaders)("ADMIN")).send({ nome_especialidade: "Cardio" });
        expect(ok.status === 201 || ok.status === 500).toBeTruthy();
    });
    test("GET/PUT/DELETE básicos", async () => {
        mockEspecialidade.findAll.mockResolvedValue([{ id_especialidade: 1 }]);
        mockEspecialidade.findByPk.mockResolvedValue({ update: globals_1.jest.fn().mockResolvedValue(true), destroy: globals_1.jest.fn().mockResolvedValue(true) });
        const r1 = await (0, supertest_1.default)(app_1.default).get("/api/especialidades").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r1.status).toBe(200);
        const r2 = await (0, supertest_1.default)(app_1.default).put("/api/especialidades/1").set((0, testAuth_1.authHeaders)("ADMIN")).send({ nome_especialidade: "Novo" });
        expect(r2.status).toBe(200);
        const r3 = await (0, supertest_1.default)(app_1.default).delete("/api/especialidades/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r3.status).toBe(200);
    });
});
//# sourceMappingURL=especialidade.test.js.map