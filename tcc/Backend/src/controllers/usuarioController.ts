import { Request, Response } from "express";
import Usuario from "../models/usuarioModel";

// Criar usuário
export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, cpf, senha, id_endereco } = req.body;

    // validação básica
    if (!nome || !cpf || !senha || !id_endereco) {
      return res.status(400).json({ error: "Dados obrigatórios não informados" });
    }

    // verificar CPF duplicado
    const usuarioExistente = await Usuario.findOne({ where: { cpf } });

    if (usuarioExistente) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }

    const novoUsuario = await Usuario.create({
      nome,
      cpf,
      senha,
      id_endereco,
    });

    return res.status(201).json(novoUsuario);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar usuário", details: error });
  }
};

// Listar todos
export const getAllUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.findAll();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuários", details: error });
  }
};

// Buscar por ID
export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuário", details: error });
  }
};

// Atualizar usuário
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome, cpf, senha, id_endereco } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // verificar CPF duplicado (se estiver alterando)
    if (cpf) {
      const existente = await Usuario.findOne({ where: { cpf } });
      if (existente && existente.get("id_usuario") !== id) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
    }

    await usuario.update({
      nome,
      cpf,
      senha,
      id_endereco,
    });

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar usuário", details: error });
  }
};

// Deletar usuário
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await usuario.destroy();

    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar usuário", details: error });
  }
};