import { Request, Response } from "express";
import Paciente from "../models/pacienteModel";

export const createPaciente = async (req: Request, res: Response) => {
  try {
    const { id_usuario, cpf, nome_completo, data_nascimento, sexo, telefone, cep, logradouro, numero, bairro, cidade, estado } = req.body;

    if (!id_usuario || !cpf || !nome_completo || !data_nascimento || !sexo) {
      return res.status(400).json({ error: "Dados obrigatórios não informados" });
    }

    const existente = await Paciente.findOne({ where: { cpf } });
    if (existente) return res.status(400).json({ error: "CPF já cadastrado" });

    const novo = await Paciente.create({ id_usuario, cpf, nome_completo, data_nascimento, sexo, telefone, cep, logradouro, numero, bairro, cidade, estado });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar paciente", details: error });
  }
};

export const getAllPacientes = async (_req: Request, res: Response) => {
  try {
    const items = await Paciente.findAll();
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar pacientes", details: error });
  }
};

export const getPacienteById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Paciente.findByPk(id);
    if (!item) return res.status(404).json({ error: "Paciente não encontrado" });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar paciente", details: error });
  }
};

export const updatePaciente = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { cpf, nome_completo, data_nascimento, sexo, telefone, cep, logradouro, numero, bairro, cidade, estado } = req.body;
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Paciente.findByPk(id);
    if (!item) return res.status(404).json({ error: "Paciente não encontrado" });

    if (cpf) {
      const existente = await Paciente.findOne({ where: { cpf } });
      if (existente && (existente.get("id_paciente") as number) !== id) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
    }

    await item.update({ cpf, nome_completo, data_nascimento, sexo, telefone, cep, logradouro, numero, bairro, cidade, estado });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar paciente", details: error });
  }
};

export const deletePaciente = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Paciente.findByPk(id);
    if (!item) return res.status(404).json({ error: "Paciente não encontrado" });

    await item.destroy();
    return res.status(200).json({ message: "Paciente deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar paciente", details: error });
  }
};
