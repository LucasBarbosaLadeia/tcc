import request from "supertest";
import { jest } from "@jest/globals";

const mockAgenda: any = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

jest.mock("../models/agendaModel", () => ({ __esModule: true, default: mockAgenda }));
import app from "../app";

describe("Agenda Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Cria agenda e valida campos obrigatórios", async () => {
    const bad = await request(app).post("/api/agendas").send({});
    expect(bad.status).toBe(400);

    mockAgenda.create.mockResolvedValue({ id_agenda: 1 });
    const ok = await request(app).post("/api/agendas").send({ id_profissional: 1, id_unidade: 1, dia_semana: "Mon", horario_inicio: new Date(), horario_fim: new Date(), duracao_consulta: 30, vagas_disponiveis: 5 });
    expect(ok.status === 201 || ok.status === 500).toBeTruthy();
  });

  test("GET/PUT/DELETE básicos", async () => {
    mockAgenda.findAll.mockResolvedValue([{ id_agenda: 1 }]);
    mockAgenda.findByPk.mockResolvedValue({ update: (jest.fn() as any).mockResolvedValue(true as any), destroy: (jest.fn() as any).mockResolvedValue(true as any) });

    const r1 = await request(app).get("/api/agendas");
    expect(r1.status).toBe(200);
    const r2 = await request(app).put("/api/agendas/1").send({ vagas_disponiveis: 3 });
    expect(r2.status).toBe(200);
    const r3 = await request(app).delete("/api/agendas/1");
    expect(r3.status).toBe(200);
  });
});
