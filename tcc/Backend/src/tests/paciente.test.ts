import request from "supertest";
import { jest } from "@jest/globals";

const mockPaciente: any = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

jest.mock(require.resolve("../Backend/src/models/pacienteModel"), () => ({ __esModule: true, default: mockPaciente }));
import app from "../Backend/src/app";

describe("Paciente Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Cria paciente com sucesso e valida campos obrigatórios", async () => {
    mockPaciente.findOne.mockResolvedValue(null);
    mockPaciente.create.mockImplementation(async (d: any) => ({ id_paciente: 1, ...d }));

    const respBad = await request(app).post("/api/pacientes").send({});
    expect(respBad.status).toBe(400);

    const resp = await request(app).post("/api/pacientes").send({ id_usuario: 1, cpf: "123", nome_completo: "X", data_nascimento: "2000-01-01", sexo: "M" });
    expect(resp.status).toBe(201);
  });

  test("GET/PUT/DELETE básica", async () => {
    mockPaciente.findAll.mockResolvedValue([{ id_paciente: 1 }]);
    mockPaciente.findByPk.mockResolvedValue({ id_paciente: 1, update: (jest.fn() as any).mockResolvedValue(true as any), destroy: (jest.fn() as any).mockResolvedValue(true as any), get: () => 1 });

    const r1 = await request(app).get("/api/pacientes");
    expect(r1.status).toBe(200);

    const r2 = await request(app).put("/api/pacientes/1").send({ nome_completo: "Y" });
    expect(r2.status).toBe(200);

    const r3 = await request(app).delete("/api/pacientes/1");
    expect(r3.status).toBe(200);
  });
});
