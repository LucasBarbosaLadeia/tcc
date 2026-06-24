import request from "supertest";
import jwt from "jsonwebtoken";
import { authHeaders } from "./testAuth";
import app from "../../Backend/src/app";
import sequelize from "../../Backend/src/config/database";
import Usuario from "../../Backend/src/models/usuarioModel";
import Paciente from "../../Backend/src/models/pacienteModel";

const secret = process.env.JWT_SECRET || "test-secret";
process.env.JWT_SECRET = secret;

describe("Autenticacao e JWT (integração)", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Paciente.destroy({ where: {}, force: true });
    await Usuario.destroy({ where: {}, force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test.each([
    ["ADMIN", "admin@teste.com", 1],
    ["RECEPCIONISTA", "recepcao@teste.com", 2],
    ["PACIENTE", "paciente@teste.com", 3],
  ] as const)("Login de %s retorna JWT valido", async (perfil, email, id_usuario) => {
    // create user (hooks will hash password)
    const usuario = await Usuario.create({ nome: "U", email, cpf: `${id_usuario}`, senha: "123", perfil: perfil as any });
    if (perfil === "PACIENTE") {
      await Paciente.create({ id_usuario: usuario.id_usuario, cpf: `${id_usuario}`, nome_completo: "P", data_nascimento: new Date("2000-01-01"), sexo: "M", telefone: "t", cep: "00000000", logradouro: "L", numero: "1", bairro: "B", cidade: "C", estado: "ES" });
    }

    const resp = await request(app)
      .post("/api/auth/login")
      .send({ email, senha: "123" });

    expect(resp.status).toBe(200);
    expect(resp.body.token).toBeTruthy();
    expect(jwt.verify(resp.body.token, secret)).toMatchObject({ perfil });
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
    // create a recepcionista user to build token
    const usuario = await Usuario.create({ nome: "R", email: "r@x.com", cpf: "99", senha: "123", perfil: "RECEPCIONISTA" as any });
    const token = jwt.sign({ id_usuario: usuario.id_usuario, perfil: "RECEPCIONISTA" }, secret, { expiresIn: "1h" });

    const resp = await request(app)
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "A", email: "a@b.com", cpf: "123", senha: "x", perfil: "ADMIN" });

    expect(resp.status).toBe(403);
  });
});
