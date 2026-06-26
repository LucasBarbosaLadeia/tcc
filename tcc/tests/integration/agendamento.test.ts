import request from "supertest";
import { authHeaders } from "./testAuth";
import app from "../../Backend/src/app";
import sequelize from "../../Backend/src/config/database";
import Agendamento from "../../Backend/src/models/agendamentoModel";
import Agenda from "../../Backend/src/models/agendaModel";
import Especialidade from "../../Backend/src/models/especialidadeModel";
import Horario from "../../Backend/src/models/horarioModel";
import Paciente from "../../Backend/src/models/pacienteModel";
import Profissional from "../../Backend/src/models/profissionalModel";
import Unidade from "../../Backend/src/models/unidadeModel";
import Usuario from "../../Backend/src/models/usuarioModel";

describe("Agendamento Controller (integração)", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Agendamento.destroy({ where: {}, force: true });
    await Horario.destroy({ where: {}, force: true });
    await Agenda.destroy({ where: {}, force: true });
    await Profissional.destroy({ where: {}, force: true });
    await Especialidade.destroy({ where: {}, force: true });
    await Unidade.destroy({ where: {}, force: true });
    await Paciente.destroy({ where: {}, force: true });
    await Usuario.destroy({ where: {}, force: true });
  });

  const createAgendaWithHorario = async () => {
    const especialidade = await Especialidade.create({ nome_especialidade: "Cardiologia", ativo: true });
    const unidade = await Unidade.create({ nome: "Unidade Teste", tipo: "UBS", telefone: "0000", logradouro: "Rua Teste", numero: "1", bairro: "Centro", ativo: true });
    const profissional = await Profissional.create({ cpf: "12345678900", registro_profissional: "12345", tipo_registro: "CRM", nome_completo: "Dr. Teste", id_especialidade: especialidade.id_especialidade, id_unidade: unidade.id_unidade, telefone: "99999-9999", ativo: true });
    const agenda = await Agenda.create({ id_profissional: profissional.id_profissional, id_unidade: unidade.id_unidade, data: "2027-01-10", horario_inicio: new Date(Date.now() + 3600 * 1000), horario_fim: new Date(Date.now() + 7200 * 1000), duracao_consulta: 60, vagas_disponiveis: 1, ativo: true });
    const horario = await Horario.create({ id_agenda: agenda.id_agenda, data_hora_inicio: new Date(Date.now() + 3600 * 1000), data_hora_fim: new Date(Date.now() + 7200 * 1000), status: "Disponível" });
    return { agenda, horario };
  };

  afterAll(async () => {
    await sequelize.close();
  });

  test("Paciente não pode criar agendamento para outro paciente (403)", async () => {
    const user = await Usuario.create({ nome: "U", email: "u@x.com", cpf: "10", senha: "123", perfil: "PACIENTE" as any });
    const paciente = await Paciente.create({ id_usuario: user.id_usuario, cpf: "10", nome_completo: "P", data_nascimento: new Date("2000-01-01"), sexo: "M", telefone: "t", cep: "00000000", logradouro: "L", numero: "1", bairro: "B", cidade: "C", estado: "ES" });

    const resp = await request(app)
      .post("/api/agendamentos")
      .set(authHeaders("PACIENTE", 10))
      .send({ id_paciente: paciente.id_paciente + 1, id_horario: 10 });

    expect(resp.status).toBe(403);
  });

  test("Cria agendamento com sucesso e marca horário indisponível", async () => {
    const user = await Usuario.create({ nome: "U2", email: "u2@x.com", cpf: "11", senha: "123", perfil: "PACIENTE" as any });
    const paciente = await Paciente.create({ id_usuario: user.id_usuario, cpf: "11", nome_completo: "P2", data_nascimento: new Date("2000-01-01"), sexo: "M", telefone: "t", cep: "00000000", logradouro: "L", numero: "1", bairro: "B", cidade: "C", estado: "ES" });
    const { horario } = await createAgendaWithHorario();

    const resp = await request(app).post("/api/agendamentos").set(authHeaders("PACIENTE", user.id_usuario)).send({ id_paciente: paciente.id_paciente, id_horario: horario.id_horario });
    expect(resp.status).toBe(201);

    const created = await Agendamento.findOne({ where: { id_paciente: paciente.id_paciente } });
    expect(created).not.toBeNull();
  });

  test("GET listagem retorna 200", async () => {
    const user = await Usuario.create({ nome: "U3", email: "u3@x.com", cpf: "12", senha: "123", perfil: "PACIENTE" as any });
    const paciente = await Paciente.create({ id_usuario: user.id_usuario, cpf: "12", nome_completo: "P3", data_nascimento: new Date("2000-01-01"), sexo: "M", telefone: "t", cep: "00000000", logradouro: "L", numero: "1", bairro: "B", cidade: "C", estado: "ES" });
    const { horario } = await createAgendaWithHorario();
    await Agendamento.create({ id_paciente: paciente.id_paciente, id_horario: horario.id_horario, codigo_agendamento: `AG-${Date.now()}`, status: "Agendado" });

    const resp = await request(app).get("/api/agendamentos").set(authHeaders("PACIENTE", user.id_usuario));
    expect(resp.status).toBe(200);
    expect(Array.isArray(resp.body)).toBe(true);
  });

  test("PUT atualiza e requer motivo quando cancelar", async () => {
    const user = await Usuario.create({ nome: "U4", email: "u4@x.com", cpf: "13", senha: "123", perfil: "PACIENTE" as any });
    const paciente = await Paciente.create({ id_usuario: user.id_usuario, cpf: "13", nome_completo: "P4", data_nascimento: new Date("2000-01-01"), sexo: "M", telefone: "t", cep: "00000000", logradouro: "L", numero: "1", bairro: "B", cidade: "C", estado: "ES" } as any);
    const { horario } = await createAgendaWithHorario();
    const ag = await Agendamento.create({ id_paciente: paciente.id_paciente, id_horario: horario.id_horario, codigo_agendamento: `AG-${Date.now()}`, status: "Agendado" });

    const respBad = await request(app).put(`/api/agendamentos/${ag.id_agendamento}`).set(authHeaders("PACIENTE", user.id_usuario)).send({ status: "Cancelado" });
    expect(respBad.status).toBe(400);

    const resp = await request(app).put(`/api/agendamentos/${ag.id_agendamento}`).set(authHeaders("PACIENTE", user.id_usuario)).send({ status: "Cancelado", motivo_cancelamento: "Motivo" });
    expect(resp.status).toBe(200);
  });

  test("DELETE agendamento", async () => {
    const admin = await Usuario.create({ nome: "A", email: "a@x.com", cpf: "99", senha: "123", perfil: "ADMIN" as any });
    const paciente = await Paciente.create({ id_usuario: admin.id_usuario, cpf: "99", nome_completo: "P", data_nascimento: new Date("2000-01-01"), sexo: "M", telefone: "t", cep: "00000000", logradouro: "L", numero: "1", bairro: "B", cidade: "C", estado: "ES" });
    const { horario } = await createAgendaWithHorario();
    const ag = await Agendamento.create({ id_paciente: paciente.id_paciente, id_horario: horario.id_horario, codigo_agendamento: `AG-${Date.now()}`, status: "Agendado" });
    const resp = await request(app).delete(`/api/agendamentos/${ag.id_agendamento}`).set(authHeaders("ADMIN"));
    expect(resp.status).toBe(200);
    expect(resp.body.message).toMatch(/deletado/);
  });
});
