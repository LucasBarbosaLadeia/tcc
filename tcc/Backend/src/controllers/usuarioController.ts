import { Request, Response } from "express";
import Usuario from "../models/usuarioModel";

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, cpf, senha, perfil } = req.body;

    if (!nome || !email || !cpf || !senha || !perfil) {
      return res.status(400).json({ error: "Dados obrigatórios não informados" });
    }

    const existente = await Usuario.findOne({ where: { cpf } });
    if (existente) return res.status(400).json({ error: "CPF já cadastrado" });

    const novo = await Usuario.create({ nome, email, cpf, senha, perfil,ativo: true });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar usuário", details: error });
  }
};

export const getAllUsuarios = async (_req: Request, res: Response) => {
  try {
    const items = await Usuario.findAll();
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuários", details: error });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Usuario.findByPk(id);
    if (!item) return res.status(404).json({ error: "Usuário não encontrado" });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuário", details: error });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome, email, cpf, senha, perfil, ativo } = req.body;
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Usuario.findByPk(id);
    if (!item) return res.status(404).json({ error: "Usuário não encontrado" });

    if (cpf) {
      const existente = await Usuario.findOne({ where: { cpf } });
      if (existente && (existente.get("id_usuario") as number) !== id) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
    }

    await item.update({ nome, email, cpf, senha, perfil, ativo });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar usuário", details: error });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Usuario.findByPk(id);
    if (!item) return res.status(404).json({ error: "Usuário não encontrado" });

    await item.destroy();
    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar usuário", details: error });
  }
};