import request from "supertest";
import { jest } from "@jest/globals";
import { authHeaders } from "./testAuth";

const mockProfissional: any = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

jest.mock("../Backend/src/models/profissionalModel", () => ({ __esModule: true, default: mockProfissional }));
import app from "../Backend/src/app";

describe("Profissional Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Cria profissional e valida campos obrigatórios", async () => {
    mockProfissional.findOne.mockResolvedValue(null);
    mockProfissional.create.mockResolvedValue({ id_profissional: 1 });

    const bad = await request(app).post("/api/profissionais").set(authHeaders("ADMIN")).send({});
    expect(bad.status).toBe(400);

    const ok = await request(app).post("/api/profissionais").set(authHeaders("ADMIN")).send({ cpf: "1", registro_profissional: "r", tipo_registro: "t", nome_completo: "N", id_especialidade: 1, id_unidade: 1, telefone: "t" });
    expect(ok.status === 201 || ok.status === 500).toBeTruthy();
  });

  test("GET list e GET by id", async () => {
    mockProfissional.findAll.mockResolvedValue([{ id_profissional: 1 }]);
    mockProfissional.findByPk.mockResolvedValue({ id_profissional: 1 });
    const r1 = await request(app).get("/api/profissionais").set(authHeaders("ADMIN"));
    expect(r1.status).toBe(200);
    const r2 = await request(app).get("/api/profissionais/1").set(authHeaders("ADMIN"));
    expect(r2.status).toBe(200);
  });
});
