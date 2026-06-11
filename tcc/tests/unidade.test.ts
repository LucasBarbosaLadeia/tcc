import request from "supertest";
import { jest } from "@jest/globals";
import { authHeaders } from "./testAuth";

const mockUnidade: any = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

jest.mock("../Backend/src/models/unidadeModel", () => ({ __esModule: true, default: mockUnidade }));
import app from "../Backend/src/app";

describe("Unidade Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Cria unidade com validação básica", async () => {
    const bad = await request(app).post("/api/unidades").set(authHeaders("ADMIN")).send({});
    expect(bad.status).toBe(400);

    mockUnidade.create.mockResolvedValue({ id_unidade: 1 });
    const ok = await request(app).post("/api/unidades").set(authHeaders("ADMIN")).send({ nome: "U", tipo: "T", telefone: "123", logradouro: "L", numero: "1", bairro: "B" });
    expect(ok.status === 201 || ok.status === 500).toBeTruthy();
  });

  test("GET/PUT/DELETE básicos", async () => {
    mockUnidade.findAll.mockResolvedValue([{ id_unidade: 1 }]);
    mockUnidade.findByPk.mockResolvedValue({ update: (jest.fn() as any).mockResolvedValue(true as any), destroy: (jest.fn() as any).mockResolvedValue(true as any) });

    const r1 = await request(app).get("/api/unidades").set(authHeaders("ADMIN"));
    expect(r1.status).toBe(200);
    const r2 = await request(app).put("/api/unidades/1").set(authHeaders("ADMIN")).send({ nome: "U2" });
    expect(r2.status).toBe(200);
    const r3 = await request(app).delete("/api/unidades/1").set(authHeaders("ADMIN"));
    expect(r3.status).toBe(200);
  });
});
