"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const testAuth_1 = require("./testAuth");
const mockAgendamento = {
    findOne: globals_1.jest.fn(),
    create: globals_1.jest.fn(),
    findAll: globals_1.jest.fn(),
    findByPk: globals_1.jest.fn(),
};
const mockHorario = {
    findByPk: globals_1.jest.fn(),
};
const mockPaciente = {
    findOne: globals_1.jest.fn(),
    findByPk: globals_1.jest.fn(),
};
globals_1.jest.mock("../models/agendamentoModel", () => ({ __esModule: true, default: mockAgendamento }));
globals_1.jest.mock("../models/horarioModel", () => ({ __esModule: true, default: mockHorario }));
globals_1.jest.mock("../models/pacienteModel", () => ({ __esModule: true, default: mockPaciente }));
// mocks must be set before importing app so controllers pick them up
const app_1 = __importDefault(require("../app"));
describe("Agendamento Controller", () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    test("Paciente não pode criar agendamento para outro paciente (403)", async () => {
        mockPaciente.findOne.mockResolvedValue({ get: (k) => (k === "id_paciente" ? 1 : undefined) });
        const resp = await (0, supertest_1.default)(app_1.default)
            .post("/api/agendamentos")
            .set((0, testAuth_1.authHeaders)("PACIENTE", 10))
            .send({ id_paciente: 2, id_horario: 10 });
        expect(resp.status).toBe(403);
        expect(resp.body.error).toMatch(/Paciente so pode criar agendamento para si mesmo/);
    });
    test("Cria agendamento com sucesso e marca horário indisponível", async () => {
        mockPaciente.findOne.mockResolvedValue({ get: (k) => (k === "id_paciente" ? 1 : undefined) });
        // horario disponível no futuro
        mockHorario.findByPk.mockResolvedValue({
            get: (k) => (k === "status" ? "Disponível" : new Date(Date.now() + 3600 * 1000).toISOString()),
            update: globals_1.jest.fn().mockResolvedValue(true),
        });
        mockAgendamento.findOne.mockResolvedValue(null);
        mockAgendamento.create.mockImplementation(async (data) => ({ id_agendamento: 1, ...data }));
        const resp = await (0, supertest_1.default)(app_1.default).post("/api/agendamentos").set((0, testAuth_1.authHeaders)("PACIENTE", 10)).send({ id_paciente: 1, id_horario: 1 });
        expect(resp.status).toBe(201);
        expect(resp.body.id_agendamento).toBe(1);
        expect(mockHorario.findByPk).toHaveBeenCalledWith(1);
    });
    test("GET listagem retorna 200", async () => {
        mockAgendamento.findAll.mockResolvedValue([{ id_agendamento: 1 }]);
        mockPaciente.findOne.mockResolvedValue({ get: (k) => (k === "id_paciente" ? 1 : undefined) });
        const resp = await (0, supertest_1.default)(app_1.default).get("/api/agendamentos").set((0, testAuth_1.authHeaders)("PACIENTE", 10));
        expect(resp.status).toBe(200);
        expect(Array.isArray(resp.body)).toBe(true);
    });
    test("PUT atualiza e requer motivo quando cancelar", async () => {
        mockPaciente.findOne.mockResolvedValue({ get: (k) => (k === "id_paciente" ? 1 : undefined) });
        mockAgendamento.findByPk.mockResolvedValue({
            get: (k) => (k === "id_paciente" ? 1 : k === "id_horario" ? 2 : undefined),
            update: globals_1.jest.fn().mockResolvedValue(true),
            destroy: globals_1.jest.fn().mockResolvedValue(true),
        });
        mockHorario.findByPk.mockResolvedValue({ update: globals_1.jest.fn().mockResolvedValue(true) });
        const respBad = await (0, supertest_1.default)(app_1.default).put("/api/agendamentos/1").set((0, testAuth_1.authHeaders)("PACIENTE", 10)).send({ status: "Cancelado" });
        expect(respBad.status).toBe(400);
        const resp = await (0, supertest_1.default)(app_1.default).put("/api/agendamentos/1").set((0, testAuth_1.authHeaders)("PACIENTE", 10)).send({ status: "Cancelado", motivo_cancelamento: "Motivo" });
        expect(resp.status).toBe(200);
    });
    test("DELETE agendamento", async () => {
        mockAgendamento.findByPk.mockResolvedValue({ destroy: globals_1.jest.fn().mockResolvedValue(true) });
        const resp = await (0, supertest_1.default)(app_1.default).delete("/api/agendamentos/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(resp.status).toBe(200);
        expect(resp.body.message).toMatch(/deletado/);
    });
});
//# sourceMappingURL=agendamento.test.js.map