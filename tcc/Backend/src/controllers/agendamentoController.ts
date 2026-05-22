import { Request, Response } from "express";
import Agendamento from "../models/agendamentoModel";

const generateCodigo = () => `AG-${Date.now().toString(36).toUpperCase()}`;

export const createAgendamento = async (req: Request, res: Response) => {
  try {
    const { codigo_agendamento, id_paciente, id_horario, status, observacoes } = req.body;

    if (!id_paciente || !id_horario) {
      return res.status(400).json({ error: "Dados obrigatórios não informados" });
    }

    const codigo = codigo_agendamento || generateCodigo();
    const novo = await Agendamento.create({ codigo_agendamento: codigo, id_paciente, id_horario, status: status || "Agendado", observacoes });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar agendamento", details: error });
  }
};

export const getAllAgendamentos = async (_req: Request, res: Response) => {
  try {
    const items = await Agendamento.findAll();
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar agendamentos", details: error });
  }
};

export const getAgendamentoById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Agendamento.findByPk(id);
    if (!item) return res.status(404).json({ error: "Agendamento não encontrado" });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar agendamento", details: error });
  }
};

export const updateAgendamento = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, observacoes, motivo_cancelamento } = req.body;
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Agendamento.findByPk(id);
    if (!item) return res.status(404).json({ error: "Agendamento não encontrado" });

    if (status === "Cancelado" && !motivo_cancelamento) {
      return res.status(400).json({ error: "Motivo do cancelamento é obrigatório" });
    }

    await item.update({ status, observacoes, motivo_cancelamento });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar agendamento", details: error });
  }
};

export const deleteAgendamento = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Agendamento.findByPk(id);
    if (!item) return res.status(404).json({ error: "Agendamento não encontrado" });

    await item.destroy();
    return res.status(200).json({ message: "Agendamento deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar agendamento", details: error });
  }
};
