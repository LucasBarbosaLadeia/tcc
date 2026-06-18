"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgenda = exports.updateAgenda = exports.getAgendaById = exports.getAllAgendas = exports.createAgenda = void 0;
const agendaModel_1 = __importDefault(require("../models/agendaModel"));
const horarioModel_1 = __importDefault(require("../models/horarioModel"));
// Retorna a data da próxima ocorrência do dia da semana (nunca hoje mesmo)
function nextOccurrence(diaSemana) {
    const dayMap = {
        "Domingo": 0, "Segunda-feira": 1, "Terça-feira": 2, "Quarta-feira": 3,
        "Quinta-feira": 4, "Sexta-feira": 5, "Sábado": 6,
    };
    const target = dayMap[diaSemana] ?? 1;
    const now = new Date();
    const daysUntil = (target - now.getDay() + 7) % 7 || 7;
    const result = new Date(now);
    result.setDate(result.getDate() + daysUntil);
    result.setHours(0, 0, 0, 0);
    return result;
}
const createAgenda = async (req, res) => {
    try {
        const { id_profissional, id_unidade, dia_semana, horario_inicio, horario_fim, duracao_consulta } = req.body;
        if (!id_profissional || !id_unidade || !dia_semana || !horario_inicio || !horario_fim || !duracao_consulta) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        const agStart = new Date(horario_inicio);
        const agEnd = new Date(horario_fim);
        if (isNaN(agStart.getTime()) || isNaN(agEnd.getTime())) {
            return res.status(400).json({ error: "Horário inválido" });
        }
        const durMin = Number(duracao_consulta);
        const totalMin = (agEnd.getTime() - agStart.getTime()) / 60000;
        const vagas_calculadas = totalMin > 0 && durMin > 0 ? Math.floor(totalMin / durMin) : 0;
        const novo = await agendaModel_1.default.create({
            id_profissional,
            id_unidade,
            dia_semana,
            horario_inicio: agStart,
            horario_fim: agEnd,
            duracao_consulta: durMin,
            vagas_disponiveis: vagas_calculadas,
            ativo: true,
        });
        // Gera horários automaticamente para a próxima ocorrência do dia da semana
        const horariosData = [];
        if (vagas_calculadas > 0) {
            const target = nextOccurrence(dia_semana);
            const y = target.getFullYear();
            const mo = target.getMonth();
            const d = target.getDate();
            const durMs = durMin * 60000;
            let cursorMs = Date.UTC(y, mo, d, agStart.getUTCHours(), agStart.getUTCMinutes());
            const endMs = Date.UTC(y, mo, d, agEnd.getUTCHours(), agEnd.getUTCMinutes());
            while (cursorMs + durMs <= endMs) {
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
        const { id_profissional, id_unidade, dia_semana, horario_inicio, horario_fim, duracao_consulta, ativo } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await agendaModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Agenda não encontrada" });
        // Recalcula vagas somente quando os três valores que definem a grade estão presentes
        let vagas_calc;
        if (horario_inicio && horario_fim && duracao_consulta) {
            const inicio = new Date(horario_inicio);
            const fim = new Date(horario_fim);
            const dur = Number(duracao_consulta);
            const totalMin = (fim.getTime() - inicio.getTime()) / 60000;
            vagas_calc = totalMin > 0 && dur > 0 ? Math.floor(totalMin / dur) : undefined;
        }
        await item.update({
            id_profissional,
            id_unidade,
            dia_semana,
            horario_inicio: horario_inicio ? new Date(horario_inicio) : undefined,
            horario_fim: horario_fim ? new Date(horario_fim) : undefined,
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