"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaciente = exports.updatePaciente = exports.getPacienteById = exports.getAllPacientes = exports.createPaciente = void 0;
const pacienteModel_1 = __importDefault(require("../models/pacienteModel"));
const createPaciente = async (req, res) => {
    try {
        const { id_usuario, cpf, nome_completo, data_nascimento, sexo, telefone, cep, logradouro, numero, bairro, cidade, estado } = req.body;
        if (!id_usuario || !cpf || !nome_completo || !data_nascimento || !sexo) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        const existente = await pacienteModel_1.default.findOne({ where: { cpf } });
        if (existente)
            return res.status(400).json({ error: "CPF já cadastrado" });
        const novo = await pacienteModel_1.default.create({ id_usuario, cpf, nome_completo, data_nascimento, sexo, telefone, cep, logradouro, numero, bairro, cidade, estado });
        return res.status(201).json(novo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar paciente", details: error });
    }
};
exports.createPaciente = createPaciente;
const getAllPacientes = async (_req, res) => {
    try {
        const items = await pacienteModel_1.default.findAll();
        return res.status(200).json(items);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar pacientes", details: error });
    }
};
exports.getAllPacientes = getAllPacientes;
const getPacienteById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const user = req.user;
        if (user?.perfil === "PACIENTE" && Number(user.id_paciente) !== id) {
            return res.status(403).json({ error: "Acesso nao autorizado" });
        }
        const item = await pacienteModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Paciente não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar paciente", details: error });
    }
};
exports.getPacienteById = getPacienteById;
const updatePaciente = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { cpf, nome_completo, data_nascimento, sexo, telefone, cep, logradouro, numero, bairro, cidade, estado } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const user = req.user;
        if (user?.perfil === "PACIENTE" && Number(user.id_paciente) !== id) {
            return res.status(403).json({ error: "Acesso nao autorizado" });
        }
        const item = await pacienteModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Paciente não encontrado" });
        if (cpf) {
            const existente = await pacienteModel_1.default.findOne({ where: { cpf } });
            if (existente && existente.get("id_paciente") !== id) {
                return res.status(400).json({ error: "CPF já cadastrado" });
            }
        }
        await item.update({ cpf, nome_completo, data_nascimento, sexo, telefone, cep, logradouro, numero, bairro, cidade, estado });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar paciente", details: error });
    }
};
exports.updatePaciente = updatePaciente;
const deletePaciente = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await pacienteModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Paciente não encontrado" });
        await item.destroy();
        return res.status(200).json({ message: "Paciente deletado com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao deletar paciente", details: error });
    }
};
exports.deletePaciente = deletePaciente;
//# sourceMappingURL=pacienteController.js.map