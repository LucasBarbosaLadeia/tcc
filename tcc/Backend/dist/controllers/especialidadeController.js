"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEspecialidade = exports.updateEspecialidade = exports.getEspecialidadeById = exports.getAllEspecialidades = exports.createEspecialidade = void 0;
const especialidadeModel_1 = __importDefault(require("../models/especialidadeModel"));
const createEspecialidade = async (req, res) => {
    try {
        const { nome_especialidade } = req.body;
        if (!nome_especialidade) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        const existente = await especialidadeModel_1.default.findOne({ where: { nome_especialidade } });
        if (existente)
            return res.status(400).json({ error: "Especialidade já cadastrada" });
        const novo = await especialidadeModel_1.default.create({ nome_especialidade, ativo: true });
        return res.status(201).json(novo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar especialidade", details: error });
    }
};
exports.createEspecialidade = createEspecialidade;
const getAllEspecialidades = async (req, res) => {
    try {
        const items = await especialidadeModel_1.default.findAll();
        return res.status(200).json(items);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar especialidades", details: error });
    }
};
exports.getAllEspecialidades = getAllEspecialidades;
const getEspecialidadeById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await especialidadeModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Especialidade não encontrada" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar especialidade", details: error });
    }
};
exports.getEspecialidadeById = getEspecialidadeById;
const updateEspecialidade = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nome_especialidade } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await especialidadeModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Especialidade não encontrada" });
        if (nome_especialidade) {
            const existente = await especialidadeModel_1.default.findOne({ where: { nome_especialidade } });
            if (existente && existente.get("id_especialidade") !== id) {
                return res.status(400).json({ error: "Nome já em uso" });
            }
        }
        await item.update({ nome_especialidade });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar especialidade", details: error });
    }
};
exports.updateEspecialidade = updateEspecialidade;
const deleteEspecialidade = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await especialidadeModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Especialidade não encontrada" });
        await item.destroy();
        return res.status(200).json({ message: "Especialidade deletada com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao deletar especialidade", details: error });
    }
};
exports.deleteEspecialidade = deleteEspecialidade;
//# sourceMappingURL=especialidadeController.js.map