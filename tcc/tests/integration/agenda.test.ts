import request from "supertest";
import { authHeaders } from "./testAuth";
import app from "../../Backend/src/app";
import sequelize from "../../Backend/src/config/database";
import Agenda from "../../Backend/src/models/agendaModel";
import Horario from "../../Backend/src/models/horarioModel";
import Especialidade from "../../Backend/src/models/especialidadeModel";
import Unidade from "../../Backend/src/models/unidadeModel";
import Profissional from "../../Backend/src/models/profissionalModel";

describe("Agenda Controller (integração)", () => {
  let profissionalId: number;
  let unidadeId: number;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Horario.destroy({ where: {}, force: true });
    await Agenda.destroy({ where: {}, force: true });
    await Profissional.destroy({ where: {}, force: true });
    await Especialidade.destroy({ where: {}, force: true });
    await Unidade.destroy({ where: {}, force: true });

    const especialidade = await Especialidade.create({ nome_especialidade: "Geral", ativo: true });
    const unidade = await Unidade.create({ nome: "Unidade Teste", tipo: "UBS", telefone: "000000000", logradouro: "Rua Teste", numero: "1", bairro: "Centro", ativo: true });
    const profissional = await Profissional.create({ cpf: "12345678901", registro_profissional: "1234", tipo_registro: "CRM", nome_completo: "Dr. Teste", id_especialidade: especialidade.id_especialidade, id_unidade: unidade.id_unidade, telefone: "000000000", ativo: true });

    profissionalId = profissional.id_profissional;
    unidadeId = unidade.id_unidade;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("Cria agenda e valida campos obrigatórios", async () => {
    const bad = await request(app).post("/api/agendas").set(authHeaders("ADMIN")).send({});
    expect(bad.status).toBe(400);

    const ok = await request(app).post("/api/agendas").set(authHeaders("ADMIN")).send({ id_profissional: profissionalId, id_unidade: unidadeId, dia_semana: "Segunda-feira", horario_inicio: new Date(), horario_fim: new Date(Date.now() + 3600 * 1000), duracao_consulta: 30 });
    expect(ok.status).toBe(201);

    const found = await Agenda.findByPk(ok.body.agenda.id_agenda ?? ok.body.agendaId ?? ok.body.id_agenda);
    expect(found).not.toBeNull();
  });

  test("GET e PUT básicos", async () => {
    const agenda = await Agenda.create({ id_profissional: profissionalId, id_unidade: unidadeId, dia_semana: "Segunda-feira", horario_inicio: new Date(), horario_fim: new Date(Date.now() + 3600 * 1000), duracao_consulta: 30, vagas_disponiveis: 2 });

    const r1 = await request(app).get("/api/agendas").set(authHeaders("ADMIN"));
    expect(r1.status).toBe(200);

    const r2 = await request(app).put(`/api/agendas/${agenda.id_agenda}`).set(authHeaders("ADMIN")).send({ vagas_disponiveis: 3 });
    expect(r2.status).toBe(200);
  });

  test("DELETE inativa agenda com horários vinculados", async () => {
    const agenda = await Agenda.create({ id_profissional: profissionalId, id_unidade: unidadeId, dia_semana: "Segunda-feira", horario_inicio: new Date(), horario_fim: new Date(Date.now() + 3600 * 1000), duracao_consulta: 30, vagas_disponiveis: 2 });
    await Horario.create({ id_agenda: agenda.id_agenda, data_hora_inicio: new Date(Date.now() + 3600 * 1000), data_hora_fim: new Date(Date.now() + 5400 * 1000), status: "Disponível" });

    const r = await request(app).delete(`/api/agendas/${agenda.id_agenda}`).set(authHeaders("ADMIN"));
    expect(r.status).toBe(200);
    expect(r.body.message).toBe("Agenda inativada com sucesso.");
  });

  test("DELETE remove agenda sem horários", async () => {
    const agenda = await Agenda.create({ id_profissional: profissionalId, id_unidade: unidadeId, dia_semana: "Segunda-feira", horario_inicio: new Date(), horario_fim: new Date(Date.now() + 3600 * 1000), duracao_consulta: 30, vagas_disponiveis: 2 });

    const r = await request(app).delete(`/api/agendas/${agenda.id_agenda}`).set(authHeaders("ADMIN"));
    expect(r.status).toBe(200);
    expect(r.body.message).toBe("Agenda removida com sucesso.");
  });
});
