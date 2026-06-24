import request from "supertest";
import { authHeaders } from "./testAuth";
import app from "../../Backend/src/app";
import sequelize from "../../Backend/src/config/database";
import Paciente from "../../Backend/src/models/pacienteModel";
import Usuario from "../../Backend/src/models/usuarioModel";

describe("Paciente Controller (integração)", () => {
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

  test("Cria paciente com sucesso e valida campos obrigatórios", async () => {
    const respBad = await request(app).post("/api/pacientes").set(authHeaders("RECEPCIONISTA")).send({});
    expect(respBad.status).toBe(400);

    const user = await Usuario.create({ nome: "U", email: "u@x.com", cpf: "1234", senha: "123", perfil: "RECEPCIONISTA" as any });

    const resp = await request(app).post("/api/pacientes").set(authHeaders("RECEPCIONISTA")).send({ id_usuario: user.id_usuario, cpf: "123", nome_completo: "X", data_nascimento: "2000-01-01", sexo: "M", telefone: "t", cep: "00000000", logradouro: "L", numero: "1", bairro: "B", cidade: "C", estado: "ES" });
    expect(resp.status).toBe(201);
  });

  test("GET/PUT/DELETE básica", async () => {
    const user = await Usuario.create({ nome: "U2", email: "u2@x.com", cpf: "2222", senha: "123", perfil: "RECEPCIONISTA" as any });
    const paciente = await Paciente.create({ id_usuario: user.id_usuario, cpf: "2222", nome_completo: "N", data_nascimento: new Date("2000-01-01"), sexo: "M", telefone: "t", cep: "00000000", logradouro: "L", numero: "1", bairro: "B", cidade: "C", estado: "ES" });

    const r1 = await request(app).get("/api/pacientes").set(authHeaders("ADMIN"));
    expect(r1.status).toBe(200);

    const r2 = await request(app).put(`/api/pacientes/${paciente.id_paciente}`).set(authHeaders("ADMIN")).send({ nome_completo: "Y" });
    expect(r2.status).toBe(200);

    const r3 = await request(app).delete(`/api/pacientes/${paciente.id_paciente}`).set(authHeaders("ADMIN"));
    expect(r3.status).toBe(200);
  });

  test("PACIENTE acessa apenas o proprio paciente por id_paciente", async () => {
    const user = await Usuario.create({ nome: "P", email: "p@x.com", cpf: "7", senha: "123", perfil: "PACIENTE" as any });
    const paciente = await Paciente.create({ id_usuario: user.id_usuario, cpf: "7", nome_completo: "P", data_nascimento: new Date("2000-01-01"), sexo: "M", telefone: "t", cep: "00000000", logradouro: "L", numero: "1", bairro: "B", cidade: "C", estado: "ES" } as any);

    const autorizado = await request(app)
      .get(`/api/pacientes/${paciente.id_paciente}`)
      .set(authHeaders("PACIENTE", user.id_usuario));

    expect(autorizado.status).toBe(200);

    const bloqueado = await request(app)
      .get(`/api/pacientes/${paciente.id_paciente + 1}`)
      .set(authHeaders("PACIENTE", user.id_usuario));

    expect(bloqueado.status).toBe(403);
  });
});
