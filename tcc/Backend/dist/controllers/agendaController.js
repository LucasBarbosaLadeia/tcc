"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgenda = exports.updateAgenda = exports.getAgendaById = exports.getAllAgendas = exports.createAgenda = void 0;
const agendaModel_1 = __importDefault(require("../models/agendaModel"));
const createAgenda = async (req, res) => {
    try {
        const { id_profissional, id_unidade, dia_semana, horario_inicio, horario_fim, duracao_consulta, vagas_disponiveis } = req.body;
        if (!id_profissional || !id_unidade || !dia_semana || !horario_inicio || !horario_fim || !duracao_consulta || vagas_disponiveis === undefined) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        const novo = await agendaModel_1.default.create({ id_profissional, id_unidade, dia_semana, horario_inicio: new Date(horario_inicio), horario_fim: new Date(horario_fim), duracao_consulta, vagas_disponiveis, ativo: true });
        return res.status(201).json(novo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar agenda", details: error });
    }
};
exports.createAgenda = createAgenda;
const getAllAgendas = async (_req, res) => {
    try {
        const items = await agendaModel_1.default.findAll();
        return res.status(200).json(items);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar agendas", details: error });
    }
};
exports.getAllAgendas = getAllAgendas;
const getAgendaById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await agendaModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Agenda não encontrada" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar agenda", details: error });
    }
};
exports.getAgendaById = getAgendaById;
const updateAgenda = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { id_profissional, id_unidade, dia_semana, horario_inicio, horario_fim, duracao_consulta, vagas_disponiveis, ativo } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await agendaModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Agenda não encontrada" });
        await item.update({ id_profissional, id_unidade, dia_semana, horario_inicio: horario_inicio ? new Date(horario_inicio) : undefined, horario_fim: horario_fim ? new Date(horario_fim) : undefined, duracao_consulta, vagas_disponiveis, ativo });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar agenda", details: error });
    }
};
exports.updateAgenda = updateAgenda;
const deleteAgenda = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await agendaModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Agenda não encontrada" });
        await item.destroy();
        return res.status(200).json({ message: "Agenda deletada com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao deletar agenda", details: error });
    }
};
exports.deleteAgenda = deleteAgenda;
//# sourceMappingURL=agendaController.js.map