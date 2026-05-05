import { Request, Response } from "express";
import Agendamento from "../models/agendamentoModel";

export const createAgendamento = async (req: Request, res: Response) => {
  try {
    const { id_unidade, id_especialidade, id_data, id_usuario } = req.body;

    if (!id_unidade || !id_especialidade || !id_data || !id_usuario) {
      return res.status(400).json({ error: "Dados obrigatórios não informados" });
    }

    const novo = await Agendamento.create({ id_unidade, id_especialidade, id_data, id_usuario });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar agendamento", details: error });
  }
};

export const getAllAgendamentos = async (req: Request, res: Response) => {
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
    const { id_unidade, id_especialidade, id_data, id_usuario } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Agendamento.findByPk(id);
    if (!item) return res.status(404).json({ error: "Agendamento não encontrado" });

    await item.update({ id_unidade, id_especialidade, id_data, id_usuario });
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
