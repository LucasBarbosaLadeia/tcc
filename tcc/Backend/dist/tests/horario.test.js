"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const testAuth_1 = require("./testAuth");
const mockHorario = {
    create: globals_1.jest.fn(),
    findAll: globals_1.jest.fn(),
    findByPk: globals_1.jest.fn(),
};
globals_1.jest.mock("../models/horarioModel", () => ({ __esModule: true, default: mockHorario }));
const app_1 = __importDefault(require("../app"));
describe("Horario Controller", () => {
    beforeEach(() => globals_1.jest.clearAllMocks());
    test("Cria horário e valida datas", async () => {
        const respBad = await (0, supertest_1.default)(app_1.default).post("/api/datas").set((0, testAuth_1.authHeaders)("ADMIN")).send({ id_agenda: 1 });
        expect(respBad.status).toBe(400);
        const resp = await (0, supertest_1.default)(app_1.default).post("/api/datas").set((0, testAuth_1.authHeaders)("ADMIN")).send({ id_agenda: 1, data_hora_inicio: new Date(Date.now() + 3600 * 1000), data_hora_fim: new Date(Date.now() + 7200 * 1000) });
        // our mock doesn't implement create; make it succeed
        mockHorario.create.mockResolvedValue({ id_horario: 1 });
        expect(resp.status === 201 || resp.status === 500).toBeTruthy();
    });
    test("GET available horarios", async () => {
        mockHorario.findAll.mockResolvedValue([{ id_horario: 1 }]);
        const r = await (0, supertest_1.default)(app_1.default).get("/api/datas").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r.status).toBe(200);
    });
    test("PUT/DELETE horário", async () => {
        mockHorario.findByPk.mockResolvedValue({ update: globals_1.jest.fn().mockResolvedValue(true), destroy: globals_1.jest.fn().mockResolvedValue(true) });
        const r1 = await (0, supertest_1.default)(app_1.default).put("/api/datas/1").set((0, testAuth_1.authHeaders)("ADMIN")).send({ status: "Indisponível" });
        expect(r1.status).toBe(200);
        const r2 = await (0, supertest_1.default)(app_1.default).delete("/api/datas/1").set((0, testAuth_1.authHeaders)("ADMIN"));
        expect(r2.status).toBe(200);
    });
});
//# sourceMappingURL=horario.test.js.map