import { Request, Response } from "express";
import Especialidade from "../models/especialidadeModel";

export const createEspecialidade = async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Dados obrigatórios não informados" });
    }

    const existente = await Especialidade.findOne({ where: { nome } });
    if (existente) return res.status(400).json({ error: "Especialidade já cadastrada" });

    const novo = await Especialidade.create({ nome });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar especialidade", details: error });
  }
};

export const getAllEspecialidades = async (req: Request, res: Response) => {
  try {
    const items = await Especialidade.findAll();
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar especialidades", details: error });
  }
};

export const getEspecialidadeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Especialidade.findByPk(id);
    if (!item) return res.status(404).json({ error: "Especialidade não encontrada" });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar especialidade", details: error });
  }
};

export const updateEspecialidade = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Especialidade.findByPk(id);
    if (!item) return res.status(404).json({ error: "Especialidade não encontrada" });

    if (nome) {
      const existente = await Especialidade.findOne({ where: { nome } });
      if (existente && (existente.get("id_especialidade") as number) !== id) {
        return res.status(400).json({ error: "Nome já em uso" });
      }
    }

    await item.update({ nome });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar especialidade", details: error });
  }
};

export const deleteEspecialidade = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Especialidade.findByPk(id);
    if (!item) return res.status(404).json({ error: "Especialidade não encontrada" });

    await item.destroy();
    return res.status(200).json({ message: "Especialidade deletada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar especialidade", details: error });
  }
};
