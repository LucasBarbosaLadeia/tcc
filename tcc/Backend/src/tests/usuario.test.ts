import request from "supertest";
import { jest } from "@jest/globals";
import { authHeaders } from "./testAuth";

const mockUsuario: any = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

jest.mock("../models/usuarioModel", () => ({ __esModule: true, default: mockUsuario }));
import app from "../app";

describe("Usuario Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Cria usuário com sucesso", async () => {
    mockUsuario.findOne.mockResolvedValue(null);
    mockUsuario.create.mockImplementation(async (d: any) => ({
      toJSON: () => ({ id_usuario: 1, ...d }),
    }));

    const resp = await request(app).post("/api/usuarios").set(authHeaders("ADMIN")).send({ nome: "A", email: "a@b.com", cpf: "123", senha: "x", perfil: "user" });
    expect(resp.status).toBe(201);
    expect(resp.body.id_usuario).toBe(1);
  });

  test("Não cria usuário com CPF duplicado", async () => {
    mockUsuario.findOne.mockResolvedValue({ id_usuario: 1 });
    const resp = await request(app).post("/api/usuarios").set(authHeaders("ADMIN")).send({ nome: "A", email: "a@b.com", cpf: "123", senha: "x", perfil: "user" });
    expect(resp.status).toBe(400);
  });

  test("GET all e GET by id", async () => {
    mockUsuario.findAll.mockResolvedValue([{ id_usuario: 1 }]);
    mockUsuario.findByPk.mockResolvedValue({ id_usuario: 1 });

    const r1 = await request(app).get("/api/usuarios").set(authHeaders("ADMIN"));
    expect(r1.status).toBe(200);

    const r2 = await request(app).get("/api/usuarios/1").set(authHeaders("ADMIN"));
    expect(r2.status).toBe(200);
  });

  test("PUT atualiza e valida CPF único", async () => {
    mockUsuario.findByPk.mockResolvedValue({
      get: () => 1,
      update: (jest.fn() as any).mockResolvedValue({
        toJSON: () => ({ id_usuario: 1, nome: "B" }),
      } as any),
    });
    mockUsuario.findOne.mockResolvedValue({ get: () => 2 });

    const rBad = await request(app).put("/api/usuarios/1").set(authHeaders("ADMIN")).send({ cpf: "dup" });
    expect(rBad.status).toBe(400);

    mockUsuario.findOne.mockResolvedValue(null);
    const r = await request(app).put("/api/usuarios/1").set(authHeaders("ADMIN")).send({ nome: "B" });
    expect(r.status).toBe(200);
  });

  test("DELETE usuário", async () => {
    mockUsuario.findByPk.mockResolvedValue({ destroy: (jest.fn() as any).mockResolvedValue(true as any) });
    const r = await request(app).delete("/api/usuarios/1").set(authHeaders("ADMIN"));
    expect(r.status).toBe(200);
  });
});
