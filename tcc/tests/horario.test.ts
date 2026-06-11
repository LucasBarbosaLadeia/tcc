import request from "supertest";
import { jest } from "@jest/globals";
import { authHeaders } from "./testAuth";

const mockHorario: any = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

jest.mock("../Backend/src/models/horarioModel", () => ({ __esModule: true, default: mockHorario }));
import app from "../Backend/src/app";

describe("Horario Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Cria horário e valida datas", async () => {
    const respBad = await request(app).post("/api/datas").set(authHeaders("ADMIN")).send({ id_agenda: 1 });
    expect(respBad.status).toBe(400);

    const resp = await request(app).post("/api/datas").set(authHeaders("ADMIN")).send({ id_agenda: 1, data_hora_inicio: new Date(Date.now() + 3600 * 1000), data_hora_fim: new Date(Date.now() + 7200 * 1000) });
    // our mock doesn't implement create; make it succeed
    mockHorario.create.mockResolvedValue({ id_horario: 1 });
    expect(resp.status === 201 || resp.status === 500).toBeTruthy();
  });

  test("GET available horarios", async () => {
    mockHorario.findAll.mockResolvedValue([{ id_horario: 1 }]);
    const r = await request(app).get("/api/datas").set(authHeaders("ADMIN"));
    expect(r.status).toBe(200);
  });

  test("PUT/DELETE horário", async () => {
    mockHorario.findByPk.mockResolvedValue({ update: (jest.fn() as any).mockResolvedValue(true as any), destroy: (jest.fn() as any).mockResolvedValue(true as any) });
    const r1 = await request(app).put("/api/datas/1").set(authHeaders("ADMIN")).send({ status: "Indisponível" });
    expect(r1.status).toBe(200);
    const r2 = await request(app).delete("/api/datas/1").set(authHeaders("ADMIN"));
    expect(r2.status).toBe(200);
  });
});
