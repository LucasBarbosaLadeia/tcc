"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const testAuth_1 = require("./testAuth");
const mockPaciente = {
    findOne: globals_1.jest.fn(),
    create: globals_1.jest.fn(),
    findAll: globals_1.jest.fn(),
    findByPk: globals_1.jest.fn(),
};
globals_1.jest.mock("../models/pacienteModel", () => ({ __esModule: true, default: mockPaciente }));
const app_1 = __importDefault(require("../app"));
describe("Paciente Controller", () => {
    beforeEach(() => globals_1.jest.clearAllMocks());
    test("Cria paciente com sucesso e valida campos obrigatórios", async () => {
        mockPaciente.findOne.mockResolvedValue(null);
        mockPaciente.create.mockImplementation(async (d) => ({ id_paciente: 1, ...d }));
        const respBad = await (0, supertest_1.default)(app_1.default).post("/api/pacientes").set((0, testAuth_1.authHeaders)("RECEPCIONISTA")).send({});
        expect(respBad.status).toBe(400);
        const resp = await (0, supertest_1.default)(app_1.default).post("/api/pacientes").set((0, testAuth_1.authHeaders)("RECEPCIONISTA")).send({ id_usuario: 1, cpf: "123", nome_completo: "X", data_nascimento: "2000-01-01", sexo: "M" });
        expect(resp.status).toBe(201);
    });
    test("GET/PUT/DELETE básica", async () => {
        mockPaciente.findAll.mockResolvedValue([{ id_paciente: 1 }]);
        mockPaciente.findByPk.mockResolvedValue({ id_paciente: 1, update: globals_1.jest.fn().mockResolvedValue(true), destroy: globals_1.jest.fn().mockResolvedValue(true), get: () => 1 });
        const r1 = await (0, supertest_1.default)(app_1.default).get("/api/pacientes").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r1.status).toBe(200);
        const r2 = await (0, supertest_1.default)(app_1.default).put("/api/pacientes/1").set((0, testAuth_1.authHeaders)("ADMIN")).send({ nome_completo: "Y" });
        expect(r2.status).toBe(200);
        const r3 = await (0, supertest_1.default)(app_1.default).delete("/api/pacientes/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r3.status).toBe(200);
    });
});
//# sourceMappingURL=paciente.test.js.map