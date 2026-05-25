"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfissional = exports.updateProfissional = exports.getProfissionalById = exports.getAllProfissionais = exports.createProfissional = void 0;
const profissionalModel_1 = __importDefault(require("../models/profissionalModel"));
const createProfissional = async (req, res) => {
    try {
        const { cpf, registro_profissional, tipo_registro, nome_completo, id_especialidade, id_unidade, telefone } = req.body;
        if (!cpf || !registro_profissional || !tipo_registro || !nome_completo || !id_especialidade || !id_unidade || !telefone) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        const existente = await profissionalModel_1.default.findOne({ where: { cpf } });
        if (existente)
            return res.status(400).json({ error: "CPF já cadastrado" });
        const novo = await profissionalModel_1.default.create({ cpf, registro_profissional, tipo_registro, nome_completo, id_especialidade, id_unidade, telefone, ativo: true });
        return res.status(201).json(novo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar profissional", details: error });
    }
};
exports.createProfissional = createProfissional;
const getAllProfissionais = async (_req, res) => {
    try {
        // profissionais ativos devem aparecer nas buscas (RN06)
        const items = await profissionalModel_1.default.findAll({ where: { ativo: true } });
        return res.status(200).json(items);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar profissionais", details: error });
    }
};
exports.getAllProfissionais = getAllProfissionais;
const getProfissionalById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await profissionalModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Profissional não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar profissional", details: error });
    }
};
exports.getProfissionalById = getProfissionalById;
const updateProfissional = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { cpf, registro_profissional, tipo_registro, nome_completo, id_especialidade, id_unidade, telefone, ativo } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await profissionalModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Profissional não encontrado" });
        if (cpf) {
            const existente = await profissionalModel_1.default.findOne({ where: { cpf } });
            if (existente && existente.get("id_profissional") !== id) {
                return res.status(400).json({ error: "CPF já cadastrado" });
            }
        }
        await item.update({ cpf, registro_profissional, tipo_registro, nome_completo, id_especialidade, id_unidade, telefone, ativo });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar profissional", details: error });
    }
};
exports.updateProfissional = updateProfissional;
const deleteProfissional = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await profissionalModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Profissional não encontrado" });
        await item.destroy();
        return res.status(200).json({ message: "Profissional deletado com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao deletar profissional", details: error });
    }
};
exports.deleteProfissional = deleteProfissional;
//# sourceMappingURL=profissionalController.js.map