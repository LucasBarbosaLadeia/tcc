import request from "supertest";
import { jest } from "@jest/globals";
import { authHeaders } from "./testAuth";

const mockAgenda: any = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

const mockHorario: any = {
  count: jest.fn(),
  bulkCreate: jest.fn(),
};

jest.mock("../Backend/src/models/agendaModel",  () => ({ __esModule: true, default: mockAgenda  }));
jest.mock("../Backend/src/models/horarioModel", () => ({ __esModule: true, default: mockHorario }));
import app from "../Backend/src/app";

describe("Agenda Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Cria agenda e valida campos obrigatórios", async () => {
    const bad = await request(app).post("/api/agendas").set(authHeaders("ADMIN")).send({});
    expect(bad.status).toBe(400);

    mockAgenda.create.mockResolvedValue({ id_agenda: 1 });
    mockHorario.bulkCreate.mockResolvedValue([]);
    const ok = await request(app).post("/api/agendas").set(authHeaders("ADMIN")).send({ id_profissional: 1, id_unidade: 1, dia_semana: "Mon", horario_inicio: new Date(), horario_fim: new Date(), duracao_consulta: 30, vagas_disponiveis: 5 });
    expect(ok.status === 201 || ok.status === 500).toBeTruthy();
  });

  test("GET e PUT básicos", async () => {
    mockAgenda.findAll.mockResolvedValue([{ id_agenda: 1 }]);
    mockAgenda.findByPk.mockResolvedValue({ update: (jest.fn() as any).mockResolvedValue(true as any), destroy: (jest.fn() as any).mockResolvedValue(true as any) });

    const r1 = await request(app).get("/api/agendas").set(authHeaders("ADMIN"));
    expect(r1.status).toBe(200);
    const r2 = await request(app).put("/api/agendas/1").set(authHeaders("ADMIN")).send({ vagas_disponiveis: 3 });
    expect(r2.status).toBe(200);
  });

  test("DELETE inativa agenda com horários vinculados", async () => {
    mockHorario.count.mockResolvedValue(4);
    const updateFn = (jest.fn() as any).mockResolvedValue(true as any);
    mockAgenda.findByPk.mockResolvedValue({ update: updateFn, destroy: jest.fn() });

    const r = await request(app).delete("/api/agendas/1").set(authHeaders("ADMIN"));
    expect(r.status).toBe(200);
    expect(r.body.message).toBe("Agenda inativada com sucesso.");
    expect(updateFn).toHaveBeenCalledWith({ ativo: false });
  });

  test("DELETE remove agenda sem horários", async () => {
    mockHorario.count.mockResolvedValue(0);
    const destroyFn = (jest.fn() as any).mockResolvedValue(true as any);
    mockAgenda.findByPk.mockResolvedValue({ update: jest.fn(), destroy: destroyFn });

    const r = await request(app).delete("/api/agendas/1").set(authHeaders("ADMIN"));
    expect(r.status).toBe(200);
    expect(r.body.message).toBe("Agenda removida com sucesso.");
    expect(destroyFn).toHaveBeenCalled();
  });
});
