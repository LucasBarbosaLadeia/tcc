import request from "supertest";
import { authHeaders } from "./testAuth";
import app from "../../Backend/src/app";
import sequelize from "../../Backend/src/config/database";
import Especialidade from "../../Backend/src/models/especialidadeModel";

describe("Especialidade Controller (integração)", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Especialidade.destroy({ where: {}, force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("deve criar uma especialidade e evitar duplicidade", async () => {
    const bad = await request(app).post("/api/especialidades").set(authHeaders("ADMIN")).send({});
    expect(bad.status).toBe(400);

    const ok = await request(app).post("/api/especialidades").set(authHeaders("ADMIN")).send({ nome_especialidade: "Cardiologia" });
    expect(ok.status).toBe(201);

    const found = await Especialidade.findOne({ where: { nome_especialidade: "Cardiologia" } });
    expect(found).not.toBeNull();
  });

  test("não deve permitir duplicidade", async () => {
    await Especialidade.create({ nome_especialidade: "Cardiologia" });

    const response = await request(app).post("/api/especialidades").set(authHeaders("ADMIN")).send({ nome_especialidade: "Cardiologia" });
    expect(response.status).toBe(409);
  });

  test("deve atualizar especialidade", async () => {
    const especialidade = await Especialidade.create({ nome_especialidade: "Cardio" });

    const response = await request(app).put(`/api/especialidades/${especialidade.id_especialidade}`).set(authHeaders("ADMIN")).send({ nome_especialidade: "Neurologia" });
    expect(response.status).toBe(200);

    await especialidade.reload();
    expect(especialidade.nome_especialidade).toBe("Neurologia");
  });

  test("deve remover especialidade", async () => {
    const especialidade = await Especialidade.create({ nome_especialidade: "Cardio" });

    const response = await request(app).delete(`/api/especialidades/${especialidade.id_especialidade}`).set(authHeaders("ADMIN"));
    expect(response.status).toBe(200);

    const apagada = await Especialidade.findByPk(especialidade.id_especialidade);
    expect(apagada).toBeNull();
  });
});
