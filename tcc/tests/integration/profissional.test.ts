import request from "supertest";
import { authHeaders } from "./testAuth";
import app from "../../Backend/src/app";
import sequelize from "../../Backend/src/config/database";
import Especialidade from "../../Backend/src/models/especialidadeModel";
import Profissional from "../../Backend/src/models/profissionalModel";
import Unidade from "../../Backend/src/models/unidadeModel";

describe("Profissional Controller (integração)", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Profissional.destroy({ where: {}, force: true });
    await Especialidade.destroy({ where: {}, force: true });
    await Unidade.destroy({ where: {}, force: true });
  });

  const createDependencies = async () => {
    const especialidade = await Especialidade.create({ nome_especialidade: "Cardiologia", ativo: true });
    const unidade = await Unidade.create({ nome: "Unidade Teste", tipo: "UBS", telefone: "0000", logradouro: "Rua Teste", numero: "1", bairro: "Centro", ativo: true });
    return { especialidade, unidade };
  };

  afterAll(async () => {
    await sequelize.close();
  });

  test("Cria profissional e valida campos obrigatórios", async () => {
    const bad = await request(app).post("/api/profissionais").set(authHeaders("ADMIN")).send({});
    expect(bad.status).toBe(400);

    const { especialidade, unidade } = await createDependencies();
    const ok = await request(app)
      .post("/api/profissionais")
      .set(authHeaders("ADMIN"))
      .send({
        cpf: "1",
        registro_profissional: "r",
        tipo_registro: "CRM",
        nome_completo: "N",
        id_especialidade: especialidade.id_especialidade,
        id_unidade: unidade.id_unidade,
        telefone: "t",
      });
    expect(ok.status).toBe(201);

    const found = await Profissional.findOne({ where: { cpf: "1" } });
    expect(found).not.toBeNull();
  });

  test("GET list e GET by id", async () => {
    const { especialidade, unidade } = await createDependencies();
    const p = await Profissional.create({
      cpf: "2",
      registro_profissional: "r2",
      tipo_registro: "CRM",
      nome_completo: "N2",
      id_especialidade: especialidade.id_especialidade,
      id_unidade: unidade.id_unidade,
      telefone: "t",
      ativo: true,
    });
    const r1 = await request(app).get("/api/profissionais").set(authHeaders("ADMIN"));
    expect(r1.status).toBe(200);
    const r2 = await request(app).get(`/api/profissionais/${p.id_profissional}`).set(authHeaders("ADMIN"));
    expect(r2.status).toBe(200);
  });
});
