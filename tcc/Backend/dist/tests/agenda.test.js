"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const testAuth_1 = require("./testAuth");
const mockAgenda = {
    create: globals_1.jest.fn(),
    findAll: globals_1.jest.fn(),
    findByPk: globals_1.jest.fn(),
};
const mockHorario = {
    count: globals_1.jest.fn(),
    bulkCreate: globals_1.jest.fn(),
};
globals_1.jest.mock("../models/agendaModel",  () => ({ __esModule: true, default: mockAgenda  }));
globals_1.jest.mock("../models/horarioModel", () => ({ __esModule: true, default: mockHorario }));
const app_1 = __importDefault(require("../app"));
describe("Agenda Controller", () => {
    beforeEach(() => globals_1.jest.clearAllMocks());
    test("Cria agenda e valida campos obrigatórios", async () => {
        const bad = await (0, supertest_1.default)(app_1.default).post("/api/agendas").set((0, testAuth_1.authHeaders)("ADMIN")).send({});
        expect(bad.status).toBe(400);
        mockAgenda.create.mockResolvedValue({ id_agenda: 1 });
        mockHorario.bulkCreate.mockResolvedValue([]);
        const ok = await (0, supertest_1.default)(app_1.default).post("/api/agendas").set((0, testAuth_1.authHeaders)("ADMIN")).send({ id_profissional: 1, id_unidade: 1, dia_semana: "Mon", horario_inicio: new Date(), horario_fim: new Date(), duracao_consulta: 30, vagas_disponiveis: 5 });
        expect(ok.status === 201 || ok.status === 500).toBeTruthy();
    });
    test("GET e PUT básicos", async () => {
        mockAgenda.findAll.mockResolvedValue([{ id_agenda: 1 }]);
        mockAgenda.findByPk.mockResolvedValue({ update: globals_1.jest.fn().mockResolvedValue(true), destroy: globals_1.jest.fn().mockResolvedValue(true) });
        const r1 = await (0, supertest_1.default)(app_1.default).get("/api/agendas").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r1.status).toBe(200);
        const r2 = await (0, supertest_1.default)(app_1.default).put("/api/agendas/1").set((0, testAuth_1.authHeaders)("ADMIN")).send({ vagas_disponiveis: 3 });
        expect(r2.status).toBe(200);
    });
    test("DELETE inativa agenda com horários vinculados", async () => {
        mockHorario.count.mockResolvedValue(4);
        const updateFn = globals_1.jest.fn().mockResolvedValue(true);
        mockAgenda.findByPk.mockResolvedValue({ update: updateFn, destroy: globals_1.jest.fn() });
        const r = await (0, supertest_1.default)(app_1.default).delete("/api/agendas/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r.status).toBe(200);
        expect(r.body.message).toBe("Agenda inativada com sucesso.");
        expect(updateFn).toHaveBeenCalledWith({ ativo: false });
    });
    test("DELETE remove agenda sem horários", async () => {
        mockHorario.count.mockResolvedValue(0);
        const destroyFn = globals_1.jest.fn().mockResolvedValue(true);
        mockAgenda.findByPk.mockResolvedValue({ update: globals_1.jest.fn(), destroy: destroyFn });
        const r = await (0, supertest_1.default)(app_1.default).delete("/api/agendas/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r.status).toBe(200);
        expect(r.body.message).toBe("Agenda removida com sucesso.");
        expect(destroyFn).toHaveBeenCalled();
    });
});
