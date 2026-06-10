"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnidade = exports.updateUnidade = exports.getUnidadeById = exports.getAllUnidades = exports.createUnidade = void 0;
const unidadeModel_1 = __importDefault(require("../models/unidadeModel"));
const createUnidade = async (req, res) => {
    try {
        const { nome, tipo, telefone, logradouro, numero, bairro } = req.body;
        if (!nome || !tipo || !telefone || !logradouro || !numero || !bairro) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        const novo = await unidadeModel_1.default.create({ nome, tipo, telefone, logradouro, numero, bairro, ativo: true });
        return res.status(201).json(novo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar unidade", details: error });
    }
};
exports.createUnidade = createUnidade;
const getAllUnidades = async (_req, res) => {
    try {
        const items = await unidadeModel_1.default.findAll();
        return res.status(200).json(items);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar unidades", details: error });
    }
};
exports.getAllUnidades = getAllUnidades;
const getUnidadeById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await unidadeModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Unidade não encontrada" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar unidade", details: error });
    }
};
exports.getUnidadeById = getUnidadeById;
const updateUnidade = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nome, tipo, telefone, logradouro, numero, bairro, ativo } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await unidadeModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Unidade não encontrada" });
        await item.update({ nome, tipo, telefone, logradouro, numero, bairro, ativo });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar unidade", details: error });
    }
};
exports.updateUnidade = updateUnidade;
const deleteUnidade = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await unidadeModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Unidade não encontrada" });
        await item.destroy();
        return res.status(200).json({ message: "Unidade deletada com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao deletar unidade", details: error });
    }
};
exports.deleteUnidade = deleteUnidade;
//# sourceMappingURL=unidadeController.js.map