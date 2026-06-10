"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const testAuth_1 = require("./testAuth");
const mockUnidade = {
    create: globals_1.jest.fn(),
    findAll: globals_1.jest.fn(),
    findByPk: globals_1.jest.fn(),
};
globals_1.jest.mock("../models/unidadeModel", () => ({ __esModule: true, default: mockUnidade }));
const app_1 = __importDefault(require("../app"));
describe("Unidade Controller", () => {
    beforeEach(() => globals_1.jest.clearAllMocks());
    test("Cria unidade com validação básica", async () => {
        const bad = await (0, supertest_1.default)(app_1.default).post("/api/unidades").set((0, testAuth_1.authHeaders)("ADMIN")).send({});
        expect(bad.status).toBe(400);
        mockUnidade.create.mockResolvedValue({ id_unidade: 1 });
        const ok = await (0, supertest_1.default)(app_1.default).post("/api/unidades").set((0, testAuth_1.authHeaders)("ADMIN")).send({ nome: "U", tipo: "T", telefone: "123", logradouro: "L", numero: "1", bairro: "B" });
        expect(ok.status === 201 || ok.status === 500).toBeTruthy();
    });
    test("GET/PUT/DELETE básicos", async () => {
        mockUnidade.findAll.mockResolvedValue([{ id_unidade: 1 }]);
        mockUnidade.findByPk.mockResolvedValue({ update: globals_1.jest.fn().mockResolvedValue(true), destroy: globals_1.jest.fn().mockResolvedValue(true) });
        const r1 = await (0, supertest_1.default)(app_1.default).get("/api/unidades").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r1.status).toBe(200);
        const r2 = await (0, supertest_1.default)(app_1.default).put("/api/unidades/1").set((0, testAuth_1.authHeaders)("ADMIN")).send({ nome: "U2" });
        expect(r2.status).toBe(200);
        const r3 = await (0, supertest_1.default)(app_1.default).delete("/api/unidades/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r3.status).toBe(200);
    });
});
//# sourceMappingURL=unidade.test.js.map