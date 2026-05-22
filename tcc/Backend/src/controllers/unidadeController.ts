import { Request, Response } from "express";
import Unidade from "../models/unidadeModel";

export const createUnidade = async (req: Request, res: Response) => {
  try {
    const { nome, tipo, telefone, logradouro, numero, bairro } = req.body;

    if (!nome || !tipo || !telefone || !logradouro || !numero || !bairro) {
      return res.status(400).json({ error: "Dados obrigatórios não informados" });
    }

    const novo = await Unidade.create({ nome, tipo, telefone, logradouro, numero, bairro, ativo: true });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar unidade", details: error });
  }
};

export const getAllUnidades = async (_req: Request, res: Response) => {
  try {
    const items = await Unidade.findAll();
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar unidades", details: error });
  }
};

export const getUnidadeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Unidade.findByPk(id);
    if (!item) return res.status(404).json({ error: "Unidade não encontrada" });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar unidade", details: error });
  }
};

export const updateUnidade = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome, tipo, telefone, logradouro, numero, bairro, ativo } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Unidade.findByPk(id);
    if (!item) return res.status(404).json({ error: "Unidade não encontrada" });

    await item.update({ nome, tipo, telefone, logradouro, numero, bairro, ativo });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar unidade", details: error });
  }
};

export const deleteUnidade = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Unidade.findByPk(id);
    if (!item) return res.status(404).json({ error: "Unidade não encontrada" });

    await item.destroy();
    return res.status(200).json({ message: "Unidade deletada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar unidade", details: error });
  }
};
