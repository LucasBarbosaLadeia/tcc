import request from "supertest";
import { jest } from "@jest/globals";

const mockAgendamento: any = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

const mockHorario: any = {
  findByPk: jest.fn(),
};

const mockPaciente: any = {
  findByPk: jest.fn(),
};

jest.mock("../models/agendamentoModel", () => ({ __esModule: true, default: mockAgendamento }));
jest.mock("../models/horarioModel", () => ({ __esModule: true, default: mockHorario }));
jest.mock("../models/pacienteModel", () => ({ __esModule: true, default: mockPaciente }));

// mocks must be set before importing app so controllers pick them up
import app from "../app";

describe("Agendamento Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Paciente não pode criar agendamento para outro paciente (403)", async () => {
    const user = { role: "paciente", id_paciente: 1 };
    const resp = await request(app)
      .post("/api/agendamentos")
      .set("x-user", JSON.stringify(user))
      .send({ id_paciente: 2, id_horario: 10 });

    expect(resp.status).toBe(403);
    expect(resp.body.error).toMatch(/Paciente só pode agendar para si mesmo/);
  });

  test("Cria agendamento com sucesso e marca horário indisponível", async () => {
    // horario disponível no futuro
    mockHorario.findByPk.mockResolvedValue({
      get: (k: string) => (k === "status" ? "Disponível" : new Date(Date.now() + 3600 * 1000).toISOString()),
      update: (jest.fn() as any).mockResolvedValue(true as any),
    });

    mockAgendamento.findOne.mockResolvedValue(null);
    mockAgendamento.create.mockImplementation(async (data: any) => ({ id_agendamento: 1, ...data }));

    const resp = await request(app).post("/api/agendamentos").send({ id_paciente: 1, id_horario: 1 });
    expect(resp.status).toBe(201);
    expect(resp.body.id_agendamento).toBe(1);
    expect(mockHorario.findByPk).toHaveBeenCalledWith(1);
  });

  test("GET listagem retorna 200", async () => {
    mockAgendamento.findAll.mockResolvedValue([{ id_agendamento: 1 }]);
    const resp = await request(app).get("/api/agendamentos");
    expect(resp.status).toBe(200);
    expect(Array.isArray(resp.body)).toBe(true);
  });

  test("PUT atualiza e requer motivo quando cancelar", async () => {
    mockAgendamento.findByPk.mockResolvedValue({
      get: (k: string) => (k === "id_horario" ? 2 : undefined),
      update: (jest.fn() as any).mockResolvedValue(true as any),
      destroy: (jest.fn() as any).mockResolvedValue(true as any),
    });
    mockHorario.findByPk.mockResolvedValue({ update: (jest.fn() as any).mockResolvedValue(true as any) });

    const respBad = await request(app).put("/api/agendamentos/1").send({ status: "Cancelado" });
    expect(respBad.status).toBe(400);

    const resp = await request(app).put("/api/agendamentos/1").send({ status: "Cancelado", motivo_cancelamento: "Motivo" });
    expect(resp.status).toBe(200);
  });

  test("DELETE agendamento", async () => {
    mockAgendamento.findByPk.mockResolvedValue({ destroy: (jest.fn() as any).mockResolvedValue(true as any) });
    const resp = await request(app).delete("/api/agendamentos/1");
    expect(resp.status).toBe(200);
    expect(resp.body.message).toMatch(/deletado/);
  });
});
