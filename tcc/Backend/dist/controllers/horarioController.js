"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHorario = exports.updateHorario = exports.getHorarioById = exports.getAllHorarios = exports.createHorario = void 0;
const horarioModel_1 = __importDefault(require("../models/horarioModel"));
const agendaModel_1 = __importDefault(require("../models/agendaModel"));
const profissionalModel_1 = __importDefault(require("../models/profissionalModel"));
const sequelize_1 = require("sequelize");
const createHorario = async (req, res) => {
    try {
        const { id_agenda, data_hora_inicio, data_hora_fim, status } = req.body;
        if (!id_agenda || !data_hora_inicio || !data_hora_fim) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        const inicio = new Date(data_hora_inicio);
        const fim = new Date(data_hora_fim);
        if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
            return res.status(400).json({ error: "Data/hora inválida" });
        }
        const novo = await horarioModel_1.default.create({ id_agenda, data_hora_inicio: inicio, data_hora_fim: fim, status: status || "Disponível" });
        return res.status(201).json(novo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar horário", details: error });
    }
};
exports.createHorario = createHorario;
const getAllHorarios = async (_req, res) => {
    try {
        const items = await horarioModel_1.default.findAll({
            where: {
                status: "Disponível",
                data_hora_inicio: { [sequelize_1.Op.gt]: new Date() },
            },
        });
        const agendaIds = Array.from(new Set(items.map((h) => h.get("id_agenda")).filter(Boolean)));
        const agendas = agendaIds.length ? await agendaModel_1.default.findAll({ where: { id_agenda: agendaIds } }) : [];
        const agendaMap = new Map(agendas.map((a) => [a.get("id_agenda"), a.get("id_profissional")]));
        const profissionalIds = Array.from(new Set(agendas.map((a) => a.get("id_profissional")).filter(Boolean)));
        const profissionais = profissionalIds.length ? await profissionalModel_1.default.findAll({ where: { id_profissional: profissionalIds } }) : [];
        const profissionalMap = new Map(profissionais.map((p) => [
            p.get("id_profissional"),
            { nome_completo: p.get("nome_completo"), tipo_registro: p.get("tipo_registro") },
        ]));
        const result = items.map((h) => {
            const idProf = agendaMap.get(h.get("id_agenda"));
            return {
                ...(h.toJSON?.() ?? {}),
                profissional: idProf ? (profissionalMap.get(idProf) ?? null) : null,
            };
        });
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar horários", details: error });
    }
};
exports.getAllHorarios = getAllHorarios;
const getHorarioById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await horarioModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Horário não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar horário", details: error });
    }
};
exports.getHorarioById = getHorarioById;
const updateHorario = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { data_hora_inicio, data_hora_fim, status } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await horarioModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Horário não encontrado" });
        const updateData = {};
        if (data_hora_inicio)
            updateData.data_hora_inicio = new Date(data_hora_inicio);
        if (data_hora_fim)
            updateData.data_hora_fim = new Date(data_hora_fim);
        if (status)
            updateData.status = status;
        await item.update(updateData);
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar horário", details: error });
    }
};
exports.updateHorario = updateHorario;
const deleteHorario = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await horarioModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Horário não encontrado" });
        await item.destroy();
        return res.status(200).json({ message: "Horário deletado com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao deletar horário", details: error });
    }
};
exports.deleteHorario = deleteHorario;
//# sourceMappingURL=horarioController.js.map