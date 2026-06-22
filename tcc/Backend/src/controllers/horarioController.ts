import { Request, Response } from "express";
import Horario from "../models/horarioModel";
import Agenda from "../models/agendaModel";
import Profissional from "../models/profissionalModel";
import { Op } from "sequelize";

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
    const items = await Horario.findAll({
      where: {
        status: "Disponível",
        data_hora_inicio: { [Op.gt]: new Date() },
      },
    });

    const agendaIds = Array.from(new Set<number>(items.map((h) => h.get("id_agenda") as number).filter(Boolean)));
    const agendas = agendaIds.length ? await Agenda.findAll({ where: { id_agenda: agendaIds } }) : [];
    const agendaMap = new Map(agendas.map((a) => [a.get("id_agenda") as number, a.get("id_profissional") as number]));

    const profissionalIds = Array.from(new Set<number>(agendas.map((a) => a.get("id_profissional") as number).filter(Boolean)));
    const profissionais = profissionalIds.length ? await Profissional.findAll({ where: { id_profissional: profissionalIds } }) : [];
    const profissionalMap = new Map(
      profissionais.map((p) => [
        p.get("id_profissional") as number,
        { nome_completo: p.get("nome_completo") as string, tipo_registro: p.get("tipo_registro") as string },
      ]),
    );

    const result = items.map((h) => {
      const idProf = agendaMap.get(h.get("id_agenda") as number);
      return {
        ...(h.toJSON?.() ?? {}),
        profissional: idProf ? (profissionalMap.get(idProf) ?? null) : null,
      };
    });

    return res.status(200).json(result);
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