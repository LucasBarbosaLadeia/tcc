"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgendamento = exports.updateAgendamento = exports.getAgendamentoById = exports.getAllAgendamentos = exports.createAgendamento = void 0;
const agendamentoModel_1 = __importDefault(require("../models/agendamentoModel"));
const horarioModel_1 = __importDefault(require("../models/horarioModel"));
const pacienteModel_1 = __importDefault(require("../models/pacienteModel"));
const generateCodigo = () => {
    const year = new Date().getFullYear().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AGD-${year}-${random}`;
};
const createAgendamento = async (req, res) => {
    try {
        const { codigo_agendamento, id_paciente, id_horario, status, observacoes } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Token nao informado" });
        }
        if (user.perfil === "PACIENTE") {
            if (!user.id_paciente || Number(id_paciente) !== Number(user.id_paciente)) {
                return res.status(403).json({ error: "Paciente so pode criar agendamento para si mesmo" });
            }
        }
        // origem: preenchido automaticamente quando recepcionista cria no balcão
        let origem = req.body.origem;
        if (user.perfil === "RECEPCIONISTA")
            origem = "balcao";
        if (!id_paciente || !id_horario) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        // verificar se o horário existe e está disponível (apenas slots "Disponível" e futuros são permitidos)
        const horario = await horarioModel_1.default.findByPk(id_horario);
        if (!horario)
            return res.status(400).json({ error: "Horário não encontrado" });
        if (horario.get("status") !== "Disponível")
            return res.status(400).json({ error: "Horário não está disponível" });
        const inicio = new Date(horario.get("data_hora_inicio"));
        if (isNaN(inicio.getTime()) || inicio <= new Date())
            return res.status(400).json({ error: "Só é possível agendar horários futuros e disponíveis" });
        // generate unique readable code
        let codigo = codigo_agendamento || generateCodigo();
        let exists = await agendamentoModel_1.default.findOne({ where: { codigo_agendamento: codigo } });
        let attempts = 0;
        while (exists && attempts < 5) {
            codigo = generateCodigo();
            exists = await agendamentoModel_1.default.findOne({ where: { codigo_agendamento: codigo } });
            attempts++;
        }
        const novo = await agendamentoModel_1.default.create({ codigo_agendamento: codigo, id_paciente, id_horario, status: status || "Agendado", observacoes, });
        // marca horário como ocupado (gatilho de banco recomendado; controlador garante consistência imediata)
        try {
            await horario.update({ status: "Indisponível" });
        }
        catch (e) {
            // ignora mas loga
            console.warn("Falha ao atualizar status do horário:", e);
        }
        return res.status(201).json(novo);
    }
    catch (error) {
        // resolve constrantes unicos de código e horário
        return res.status(500).json({ error: "Erro ao criar agendamento", details: error });
    }
};
exports.createAgendamento = createAgendamento;
const getAllAgendamentos = async (_req, res) => {
    try {
        const user = _req.user;
        if (user?.perfil === "PACIENTE" && user.id_paciente) {
            const items = await agendamentoModel_1.default.findAll({ where: { id_paciente: user.id_paciente } });
            return res.status(200).json(items);
        }
        const items = await agendamentoModel_1.default.findAll();
        return res.status(200).json(items);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar agendamentos", details: error });
    }
};
exports.getAllAgendamentos = getAllAgendamentos;
const getAgendamentoById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const user = req.user;
        const item = await agendamentoModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Agendamento não encontrado" });
        if (user?.perfil === "PACIENTE" && user.id_paciente !== Number(item.get("id_paciente"))) {
            return res.status(403).json({ error: "Acesso nao autorizado" });
        }
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar agendamento", details: error });
    }
};
exports.getAgendamentoById = getAgendamentoById;
const updateAgendamento = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status, observacoes, motivo_cancelamento } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const user = req.user;
        const item = await agendamentoModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Agendamento não encontrado" });
        if (user?.perfil === "PACIENTE" && user.id_paciente !== Number(item.get("id_paciente"))) {
            return res.status(403).json({ error: "Acesso nao autorizado" });
        }
        if (user?.perfil === "PACIENTE" && status && status !== "Cancelado") {
            return res.status(403).json({ error: "Paciente so pode cancelar o proprio agendamento" });
        }
        if (status === "Cancelado" && !motivo_cancelamento) {
            return res.status(400).json({ error: "Motivo do cancelamento é obrigatório" });
        }
        await item.update({ status, observacoes, motivo_cancelamento });
        // se cancelado, liberar o horário para outros pacientes
        if (status === "Cancelado") {
            try {
                const horario = await horarioModel_1.default.findByPk(item.get("id_horario"));
                if (horario)
                    await horario.update({ status: "Disponível" });
            }
            catch (e) {
                console.warn("Falha ao liberar horário no cancelamento:", e);
            }
        }
        // se marcado como falta, incrementar contador de faltas do paciente se o campo existir
        if (status === "Falta") {
            try {
                const paciente = await pacienteModel_1.default.findByPk(item.get("id_paciente"));
                if (paciente) {
                    if (typeof paciente.get("contador_faltas") !== "undefined") {
                        const cur = Number(paciente.get("contador_faltas")) || 0;
                        paciente.set("contador_faltas", cur + 1);
                        await paciente.save();
                    }
                }
            }
            catch (e) {
                console.warn("Falha ao incrementar faltas do paciente:", e);
            }
        }
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar agendamento", details: error });
    }
};
exports.updateAgendamento = updateAgendamento;
const deleteAgendamento = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const user = req.user;
        const item = await agendamentoModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Agendamento não encontrado" });
        if (user?.perfil === "PACIENTE" && user.id_paciente !== Number(item.get("id_paciente"))) {
            return res.status(403).json({ error: "Acesso nao autorizado" });
        }
        if (user?.perfil === "PACIENTE") {
            return res.status(403).json({ error: "Paciente deve cancelar o proprio agendamento" });
        }
        await item.destroy();
        return res.status(200).json({ message: "Agendamento deletado com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao deletar agendamento", details: error });
    }
};
exports.deleteAgendamento = deleteAgendamento;
//# sourceMappingURL=agendamentoController.js.map