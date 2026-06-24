import request from "supertest";
import { authHeaders } from "./testAuth";
import app from "../../Backend/src/app";
import sequelize from "../../Backend/src/config/database";
import Unidade from "../../Backend/src/models/unidadeModel";

describe("Unidade Controller (integração)", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Unidade.destroy({ where: {}, force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("Cria unidade com validação básica", async () => {
    const bad = await request(app).post("/api/unidades").set(authHeaders("ADMIN")).send({});
    expect(bad.status).toBe(400);

    const ok = await request(app).post("/api/unidades").set(authHeaders("ADMIN")).send({ nome: "U", tipo: "UBS", telefone: "123", logradouro: "L", numero: "1", bairro: "B" });
    expect(ok.status).toBe(201);

    const found = await Unidade.findOne({ where: { nome: "U" } });
    expect(found).not.toBeNull();
  });

  test("GET/PUT/DELETE básicos", async () => {
    const u = await Unidade.create({ nome: "U2", tipo: "UBS" as any, telefone: "123", logradouro: "L", numero: "1", bairro: "B", ativo: true });
    const r1 = await request(app).get("/api/unidades").set(authHeaders("ADMIN"));
    expect(r1.status).toBe(200);
    const r2 = await request(app).put(`/api/unidades/${u.id_unidade}`).set(authHeaders("ADMIN")).send({ nome: "U2-up" });
    expect(r2.status).toBe(200);
    const r3 = await request(app).delete(`/api/unidades/${u.id_unidade}`).set(authHeaders("ADMIN"));
    expect(r3.status).toBe(200);
  });
});
