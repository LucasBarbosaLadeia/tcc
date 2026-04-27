import { Request, Response } from "express";
import Endereco from "../models/enderecoModel";

// Criar endereço
export const createEndereco = async (req: Request, res: Response) => {
  try {
    const { estado, cidade } = req.body;

    const novoEndereco = await Endereco.create({
      estado,
      cidade,
    });

    return res.status(201).json(novoEndereco);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar endereço", details: error });
  }
};

// Listar todos os endereços
export const getAllEnderecos = async (req: Request, res: Response) => {
  try {
    const enderecos = await Endereco.findAll();
    return res.status(200).json(enderecos);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar endereços", details: error });
  }
};

// Buscar por ID
export const getEnderecoById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const endereco = await Endereco.findByPk(id);

    if (!endereco) {
      return res.status(404).json({ error: "Endereço não encontrado" });
    }

    return res.status(200).json(endereco);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar endereço", details: error });
  }
};

// Atualizar endereço
export const updateEndereco = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { estado, cidade } = req.body;

    const endereco = await Endereco.findByPk(id);

    if (!endereco) {
      return res.status(404).json({ error: "Endereço não encontrado" });
    }

    await endereco.update({
      estado,
      cidade,
    });

    return res.status(200).json(endereco);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar endereço", details: error });
  }
};

// Deletar endereço
export const deleteEndereco = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const endereco = await Endereco.findByPk(id);

    if (!endereco) {
      return res.status(404).json({ error: "Endereço não encontrado" });
    }

    await endereco.destroy();

    return res.status(200).json({ message: "Endereço deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar endereço", details: error });
  }
};