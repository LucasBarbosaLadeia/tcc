import { Request, Response } from "express";
import Profissional from "../models/profissionalModel";

export const createProfissional = async (req: Request, res: Response) => {
  try {
    const { cpf, registro_profissional, tipo_registro, nome_completo, id_especialidade, id_unidade, telefone } = req.body;

    if (!cpf || !registro_profissional || !tipo_registro || !nome_completo || !id_especialidade || !id_unidade || !telefone) {
      return res.status(400).json({ error: "Dados obrigatórios não informados" });
    }

    const existente = await Profissional.findOne({ where: { cpf } });
    if (existente) return res.status(400).json({ error: "CPF já cadastrado" });

    const novo = await Profissional.create({ cpf, registro_profissional, tipo_registro, nome_completo, id_especialidade, id_unidade, telefone,ativo: true });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar profissional", details: error });
  }
};

export const getAllProfissionais = async (_req: Request, res: Response) => {
  try {
    // profissionais ativos devem aparecer nas buscas (RN06)
    const items = await Profissional.findAll({ where: { ativo: true } });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar profissionais", details: error });
  }
};

export const getProfissionalById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Profissional.findByPk(id);
    if (!item) return res.status(404).json({ error: "Profissional não encontrado" });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar profissional", details: error });
  }
};

export const updateProfissional = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { cpf, registro_profissional, tipo_registro, nome_completo, id_especialidade, id_unidade, telefone, ativo } = req.body;
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Profissional.findByPk(id);
    if (!item) return res.status(404).json({ error: "Profissional não encontrado" });

    if (cpf) {
      const existente = await Profissional.findOne({ where: { cpf } });
      if (existente && (existente.get("id_profissional") as number) !== id) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
    }

    await item.update({ cpf, registro_profissional, tipo_registro, nome_completo, id_especialidade, id_unidade, telefone, ativo });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar profissional", details: error });
  }
};

export const deleteProfissional = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Profissional.findByPk(id);
    if (!item) return res.status(404).json({ error: "Profissional não encontrado" });

    await item.destroy();
    return res.status(200).json({ message: "Profissional deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar profissional", details: error });
  }
};