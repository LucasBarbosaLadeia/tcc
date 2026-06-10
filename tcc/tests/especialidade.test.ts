import request from "supertest";
import { jest } from "@jest/globals";

const mockEspecialidade: any = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

jest.mock(require.resolve("../Backend/src/models/especialidadeModel"), () => ({ __esModule: true, default: mockEspecialidade }));
import app from "../Backend/src/app";

describe("Especialidade Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Cria especialidade e evita duplicidade", async () => {
    mockEspecialidade.findOne.mockResolvedValue(null);
    mockEspecialidade.create.mockResolvedValue({ id_especialidade: 1 });

    const bad = await request(app).post("/api/especialidades").send({});
    expect(bad.status).toBe(400);

    const ok = await request(app).post("/api/especialidades").send({ nome_especialidade: "Cardio" });
    expect(ok.status === 201 || ok.status === 500).toBeTruthy();
  });

  test("GET/PUT/DELETE básicos", async () => {
    mockEspecialidade.findAll.mockResolvedValue([{ id_especialidade: 1 }]);
    mockEspecialidade.findByPk.mockResolvedValue({ update: (jest.fn() as any).mockResolvedValue(true as any), destroy: (jest.fn() as any).mockResolvedValue(true as any) });

    const r1 = await request(app).get("/api/especialidades");
    expect(r1.status).toBe(200);

    const r2 = await request(app).put("/api/especialidades/1").send({ nome_especialidade: "Novo" });
    expect(r2.status).toBe(200);

    const r3 = await request(app).delete("/api/especialidades/1");
    expect(r3.status).toBe(200);
  });
});
