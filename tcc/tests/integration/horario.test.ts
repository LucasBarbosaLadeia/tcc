import request from "supertest";
import { authHeaders } from "./testAuth";
import app from "../../Backend/src/app";
import sequelize from "../../Backend/src/config/database";
import Horario from "../../Backend/src/models/horarioModel";
import Especialidade from "../../Backend/src/models/especialidadeModel";
import Unidade from "../../Backend/src/models/unidadeModel";
import Profissional from "../../Backend/src/models/profissionalModel";
import Agenda from "../../Backend/src/models/agendaModel";

describe("Horario Controller (integração)", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  let agendaId: number;

  beforeEach(async () => {
    await Horario.destroy({ where: {}, force: true });
    await Agenda.destroy({ where: {}, force: true });
    await Profissional.destroy({ where: {}, force: true });
    await Especialidade.destroy({ where: {}, force: true });
    await Unidade.destroy({ where: {}, force: true });

    const esp = await Especialidade.create({ nome_especialidade: "Geral" });
    const uni = await Unidade.create({ nome: "Unidade", tipo: "UBS", telefone: "0000", logradouro: "R", numero: "1", bairro: "B", ativo: true });
    const prof = await Profissional.create({ cpf: "123", registro_profissional: "R-1", tipo_registro: "CRM", nome_completo: "Dr", id_especialidade: esp.id_especialidade, id_unidade: uni.id_unidade, telefone: "000", ativo: true });
    const ag = await Agenda.create({ id_profissional: prof.id_profissional, id_unidade: uni.id_unidade, dia_semana: "Segunda-feira", horario_inicio: new Date(), horario_fim: new Date(Date.now() + 3600 * 1000), duracao_consulta: 30, vagas_disponiveis: 10, ativo: true });
    agendaId = ag.id_agenda;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("Cria horário e valida datas", async () => {
    const respBad = await request(app).post("/api/datas").set(authHeaders("ADMIN")).send({ id_agenda: agendaId });
    expect(respBad.status).toBe(400);
    const resp = await request(app).post("/api/datas").set(authHeaders("ADMIN")).send({ id_agenda: agendaId, data_hora_inicio: new Date(Date.now() + 3600 * 1000), data_hora_fim: new Date(Date.now() + 7200 * 1000) });
    expect(resp.status).toBe(201);

    const created = await Horario.findByPk(resp.body.id_horario ?? resp.body.id);
    expect(created).not.toBeNull();
  });

  test("GET available horarios", async () => {
    await Horario.create({ id_agenda: agendaId, data_hora_inicio: new Date(Date.now() + 3600 * 1000), data_hora_fim: new Date(Date.now() + 7200 * 1000), status: "Disponível" });
    const r = await request(app).get("/api/datas").set(authHeaders("ADMIN"));
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
  });

  test("PUT/DELETE horário", async () => {
    const horario = await Horario.create({ id_agenda: agendaId, data_hora_inicio: new Date(Date.now() + 3600 * 1000), data_hora_fim: new Date(Date.now() + 7200 * 1000), status: "Disponível" });

    const r1 = await request(app).put(`/api/datas/${horario.id_horario}`).set(authHeaders("ADMIN")).send({ status: "Indisponível" });
    expect(r1.status).toBe(200);

    const r2 = await request(app).delete(`/api/datas/${horario.id_horario}`).set(authHeaders("ADMIN"));
    expect(r2.status).toBe(200);
  });
});
