import { Request, Response } from "express";
import Horario from "../models/horarioModel";

export const createHorario = async (req: Request, res: Response) => {
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

    const novo = await Horario.create({ id_agenda, data_hora_inicio: inicio, data_hora_fim: fim, status: status || "Disponível" });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar horário", details: error });
  }
};

export const getAllHorarios = async (_req: Request, res: Response) => {
  try {
    const items = await Horario.findAll();
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar horários", details: error });
  }
};

export const getHorarioById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Horario.findByPk(id);
    if (!item) return res.status(404).json({ error: "Horário não encontrado" });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar horário", details: error });
  }
};

export const updateHorario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { data_hora_inicio, data_hora_fim, status } = req.body;
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Horario.findByPk(id);
    if (!item) return res.status(404).json({ error: "Horário não encontrado" });

    const updateData: any = {};
    if (data_hora_inicio) updateData.data_hora_inicio = new Date(data_hora_inicio);
    if (data_hora_fim) updateData.data_hora_fim = new Date(data_hora_fim);
    if (status) updateData.status = status;

    await item.update(updateData);
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar horário", details: error });
  }
};

export const deleteHorario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Horario.findByPk(id);
    if (!item) return res.status(404).json({ error: "Horário não encontrado" });

    await item.destroy();
    return res.status(200).json({ message: "Horário deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar horário", details: error });
  }
};