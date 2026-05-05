import { Request, Response } from "express";
import DataModel from "../models/dataModel";

export const createData = async (req: Request, res: Response) => {
  try {
    const { horario } = req.body;

    if (!horario) {
      return res.status(400).json({ error: "Dados obrigatórios não informados" });
    }

    const horarioDate = new Date(horario);
    if (isNaN(horarioDate.getTime())) {
      return res.status(400).json({ error: "Horário inválido" });
    }

    const novo = await DataModel.create({ horario: horarioDate });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar data", details: error });
  }
};

export const getAllDatas = async (req: Request, res: Response) => {
  try {
    const items = await DataModel.findAll();
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar datas", details: error });
  }
};

export const getDataById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await DataModel.findByPk(id);
    if (!item) return res.status(404).json({ error: "Data não encontrada" });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar data", details: error });
  }
};

export const updateData = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { horario } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await DataModel.findByPk(id);
    if (!item) return res.status(404).json({ error: "Data não encontrada" });

    if (horario) {
      const horarioDate = new Date(horario);
      if (isNaN(horarioDate.getTime())) {
        return res.status(400).json({ error: "Horário inválido" });
      }
      await item.update({ horario: horarioDate });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar data", details: error });
  }
};

export const deleteData = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await DataModel.findByPk(id);
    if (!item) return res.status(404).json({ error: "Data não encontrada" });

    await item.destroy();
    return res.status(200).json({ message: "Data deletada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar data", details: error });
  }
};
