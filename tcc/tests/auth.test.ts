import request from "supertest";
import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

const mockUsuario: any = {
  findOne: jest.fn(),
};

const mockComparePassword = jest.fn() as jest.MockedFunction<typeof import("../Backend/src/utils/password").comparePassword>;

jest.mock("../Backend/src/models/usuarioModel", () => ({ __esModule: true, default: mockUsuario }));
jest.mock("../Backend/src/utils/password", () => ({
  __esModule: true,
  comparePassword: mockComparePassword,
  hashPassword: jest.fn(),
}));

import app from "../Backend/src/app";

const secret = process.env.JWT_SECRET || "test-secret";
process.env.JWT_SECRET = secret;

const makeUsuario = (perfil: "ADMIN" | "RECEPCIONISTA" | "PACIENTE", id_usuario: number) => ({
  get: (field: string) => {
    if (field === "senha") return "hashed-password";
    if (field === "id_usuario") return id_usuario;
    if (field === "perfil") return perfil;
    return undefined;
  },
  toJSON: () => ({
    id_usuario,
    nome: "Usuario",
    email: `${perfil.toLowerCase()}@teste.com`,
    cpf: `${id_usuario}`,
    perfil,
    ativo: true,
  }),
});

describe("Autenticacao e JWT", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    ["ADMIN", "admin@teste.com", 1],
    ["RECEPCIONISTA", "recepcao@teste.com", 2],
    ["PACIENTE", "paciente@teste.com", 3],
  ] as const)("Login de %s retorna JWT valido", async (perfil, email, id_usuario) => {
    mockUsuario.findOne.mockResolvedValue(makeUsuario(perfil, id_usuario));
    mockComparePassword.mockResolvedValue(true as never);

    const resp = await request(app)
      .post("/api/auth/login")
      .send({ email, senha: "123" });

    expect(resp.status).toBe(200);
    expect(resp.body.token).toBeTruthy();
    expect(jwt.verify(resp.body.token, secret)).toMatchObject({
      id_usuario,
      perfil,
    });
  });

  test("Sem token retorna 401", async () => {
    const resp = await request(app).get("/api/usuarios");
    expect(resp.status).toBe(401);
  });

  test("Token invalido retorna 401", async () => {
    const resp = await request(app)
      .get("/api/usuarios")
      .set("Authorization", "Bearer token-invalido");

    expect(resp.status).toBe(401);
  });

  test("Token expirado retorna 401", async () => {
    const expired = jwt.sign(
      { id_usuario: 1, perfil: "ADMIN" },
      secret,
      { expiresIn: "-1s" },
    );

    const resp = await request(app)
      .get("/api/usuarios")
      .set("Authorization", `Bearer ${expired}`);

    expect(resp.status).toBe(401);
  });

  test("Perfil sem permissao retorna 403", async () => {
    const token = jwt.sign(
      { id_usuario: 2, perfil: "RECEPCIONISTA" },
      secret,
      { expiresIn: "1h" },
    );

    const resp = await request(app)
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "A", email: "a@b.com", cpf: "123", senha: "x", perfil: "ADMIN" });

    expect(resp.status).toBe(403);
  });
});
