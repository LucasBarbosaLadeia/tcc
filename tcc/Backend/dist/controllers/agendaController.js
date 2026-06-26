"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgenda = exports.updateAgenda = exports.getAgendaById = exports.getAllAgendas = exports.createAgenda = void 0;
const agendaModel_1 = __importDefault(require("../models/agendaModel"));
const horarioModel_1 = __importDefault(require("../models/horarioModel"));
const createAgenda = async (req, res) => {
    try {
        const { id_profissional, id_unidade, data, horario_inicio, horario_fim, horario_almoco_inicio, horario_almoco_fim, duracao_consulta, } = req.body;
        if (!id_profissional || !id_unidade || !data || !horario_inicio || !horario_fim || !duracao_consulta) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        const agStart = new Date(horario_inicio);
        const agEnd = new Date(horario_fim);
        if (isNaN(agStart.getTime()) || isNaN(agEnd.getTime())) {
            return res.status(400).json({ error: "Horário inválido" });
        }
        // Parse data específica (DATEONLY string: "2025-03-10")
        const parts = String(data).split("-").map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) {
            return res.status(400).json({ error: "Data inválida. Formato esperado: AAAA-MM-DD" });
        }
        const [year, month, day] = parts;
        // Calcula duração do almoço se informada
        let almocoMin = 0;
        let almocoInicioMs = null;
        let almocoFimMs = null;
        if (horario_almoco_inicio && horario_almoco_fim) {
            const almocoStart = new Date(horario_almoco_inicio);
            const almocoEnd = new Date(horario_almoco_fim);
            if (!isNaN(almocoStart.getTime()) && !isNaN(almocoEnd.getTime())) {
                almocoMin = (almocoEnd.getTime() - almocoStart.getTime()) / 60000;
                almocoInicioMs = Date.UTC(year, month - 1, day, almocoStart.getUTCHours(), almocoStart.getUTCMinutes());
                almocoFimMs = Date.UTC(year, month - 1, day, almocoEnd.getUTCHours(), almocoEnd.getUTCMinutes());
            }
        }
        const durMin = Number(duracao_consulta);
        const totalMin = (agEnd.getTime() - agStart.getTime()) / 60000;
        const vagas_calculadas = totalMin > 0 && durMin > 0
            ? Math.floor((totalMin - almocoMin) / durMin)
            : 0;
        const novo = await agendaModel_1.default.create({
            id_profissional,
            id_unidade,
            data,
            horario_inicio: agStart,
            horario_fim: agEnd,
            horario_almoco_inicio: almocoInicioMs !== null ? new Date(almocoInicioMs) : null,
            horario_almoco_fim: almocoFimMs !== null ? new Date(almocoFimMs) : null,
            duracao_consulta: durMin,
            vagas_disponiveis: vagas_calculadas,
            ativo: true,
        });
        const horariosData = [];
        if (vagas_calculadas > 0) {
            const durMs = durMin * 60000;
            let cursorMs = Date.UTC(year, month - 1, day, agStart.getUTCHours(), agStart.getUTCMinutes());
            const endMs = Date.UTC(year, month - 1, day, agEnd.getUTCHours(), agEnd.getUTCMinutes());
            while (cursorMs + durMs <= endMs) {
                // Pula horários que se sobrepõem ao intervalo de almoço
                if (almocoInicioMs !== null &&
                    almocoFimMs !== null &&
                    cursorMs < almocoFimMs &&
                    cursorMs + durMs > almocoInicioMs) {
                    cursorMs = almocoFimMs;
                    continue;
                }
                horariosData.push({
                    id_agenda: novo.id_agenda,
                    data_hora_inicio: new Date(cursorMs),
                    data_hora_fim: new Date(cursorMs + durMs),
                    status: "Disponível",
                });
                cursorMs += durMs;
            }
            try {
                await horarioModel_1.default.bulkCreate(horariosData);
            }
            catch (err) {
                console.warn("Agenda criada mas falha ao gerar horários:", err);
            }
        }
        return res.status(201).json({ agenda: novo, horariosGerados: horariosData.length });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar agenda", details: error });
    }
};
exports.createAgenda = createAgenda;
const getAllAgendas = async (_req, res) => {
    try {
        const items = await agendaModel_1.default.findAll({ where: { ativo: true } });
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
        const { id_profissional, id_unidade, data, horario_inicio, horario_fim, horario_almoco_inicio, horario_almoco_fim, duracao_consulta, ativo, } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await agendaModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Agenda não encontrada" });
        let vagas_calc;
        if (horario_inicio && horario_fim && duracao_consulta) {
            const inicio = new Date(horario_inicio);
            const fim = new Date(horario_fim);
            const dur = Number(duracao_consulta);
            const totalMin = (fim.getTime() - inicio.getTime()) / 60000;
            let almocoMin = 0;
            if (horario_almoco_inicio && horario_almoco_fim) {
                const almocoStart = new Date(horario_almoco_inicio);
                const almocoEnd = new Date(horario_almoco_fim);
                if (!isNaN(almocoStart.getTime()) && !isNaN(almocoEnd.getTime())) {
                    almocoMin = (almocoEnd.getTime() - almocoStart.getTime()) / 60000;
                }
            }
            vagas_calc = totalMin > 0 && dur > 0 ? Math.floor((totalMin - almocoMin) / dur) : undefined;
        }
        await item.update({
            id_profissional,
            id_unidade,
            data,
            horario_inicio: horario_inicio ? new Date(horario_inicio) : undefined,
            horario_fim: horario_fim ? new Date(horario_fim) : undefined,
            horario_almoco_inicio: horario_almoco_inicio ? new Date(horario_almoco_inicio) : null,
            horario_almoco_fim: horario_almoco_fim ? new Date(horario_almoco_fim) : null,
            duracao_consulta: duracao_consulta ? Number(duracao_consulta) : undefined,
            vagas_disponiveis: vagas_calc,
            ativo,
        });
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
        const horarioCount = await horarioModel_1.default.count({ where: { id_agenda: id } });
        if (horarioCount > 0) {
            await item.update({ ativo: false });
            return res.status(200).json({ message: "Agenda inativada com sucesso." });
        }
        await item.destroy();
        return res.status(200).json({ message: "Agenda removida com sucesso." });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao deletar agenda", details: error });
    }
};
exports.deleteAgenda = deleteAgenda;
//# sourceMappingURL=agendaController.js.map