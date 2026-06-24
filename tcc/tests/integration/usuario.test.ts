import request from "supertest";
import { authHeaders } from "./testAuth";
import app from "../../Backend/src/app";
import sequelize from "../../Backend/src/config/database";
import Usuario from "../../Backend/src/models/usuarioModel";

describe("Usuario Controller (integração)", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Usuario.destroy({ where: {}, force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("Cria usuário com sucesso", async () => {
    const resp = await request(app).post("/api/usuarios").set(authHeaders("ADMIN")).send({ nome: "A", email: "a@b.com", cpf: "123", senha: "x", perfil: "ADMIN" });
    expect(resp.status).toBe(201);
    expect(resp.body.id_usuario).toBeTruthy();
  });

  test("Não cria usuário com CPF duplicado", async () => {
    await Usuario.create({ nome: "A", email: "a@b.com", cpf: "123", senha: "x", perfil: "ADMIN" as any });
    const resp = await request(app).post("/api/usuarios").set(authHeaders("ADMIN")).send({ nome: "A", email: "a2@b.com", cpf: "123", senha: "x", perfil: "ADMIN" });
    expect(resp.status).toBe(400);
  });

  test("GET all e GET by id", async () => {
    const u = await Usuario.create({ nome: "U", email: "u@x.com", cpf: "111", senha: "x", perfil: "ADMIN" as any });
    const r1 = await request(app).get("/api/usuarios").set(authHeaders("ADMIN"));
    expect(r1.status).toBe(200);

    const r2 = await request(app).get(`/api/usuarios/${u.id_usuario}`).set(authHeaders("ADMIN"));
    expect(r2.status).toBe(200);
  });

  test("PUT atualiza e valida CPF único", async () => {
    const u1 = await Usuario.create({ nome: "U1", email: "u1@x.com", cpf: "1", senha: "x", perfil: "ADMIN" as any });
    const u2 = await Usuario.create({ nome: "U2", email: "u2@x.com", cpf: "2", senha: "x", perfil: "ADMIN" as any });

    // trying to update u1 with cpf of u2 should fail
    const rBad = await request(app).put(`/api/usuarios/${u1.id_usuario}`).set(authHeaders("ADMIN")).send({ cpf: "2" });
    expect(rBad.status).toBe(400);

    const r = await request(app).put(`/api/usuarios/${u1.id_usuario}`).set(authHeaders("ADMIN")).send({ nome: "B" });
    expect(r.status).toBe(200);
  });

  test("DELETE usuário", async () => {
    const u = await Usuario.create({ nome: "Del", email: "d@x.com", cpf: "9", senha: "x", perfil: "ADMIN" as any });
    const r = await request(app).delete(`/api/usuarios/${u.id_usuario}`).set(authHeaders("ADMIN"));
    expect(r.status).toBe(200);
  });
});
