import { Request, Response } from "express";
import Usuario, { IUsuario, PerfilUsuario } from "../models/usuarioModel";
import Paciente from "../models/pacienteModel";
import Agendamento from "../models/agendamentoModel";
import { hashPassword } from "../utils/password";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, cpf, senha, perfil } = req.body;
    const requester = (req as Request & { user?: { perfil?: string } }).user;

    if (!nome || !email || !cpf || !senha) {
      return res
        .status(400)
        .json({ error: "Dados obrigatórios não informados" });
    }

    const emailNorm = (email as string).trim().toLowerCase();
    if (!EMAIL_REGEX.test(emailNorm)) {
      return res.status(400).json({ error: "E-mail inválido" });
    }

    if (perfil && perfil !== "PACIENTE" && requester?.perfil !== "ADMIN") {
      return res.status(403).json({ error: "Sem permissão para criar usuário com este perfil" });
    }

    const existente = await Usuario.findOne({ where: { cpf } });
    if (existente) return res.status(400).json({ error: "CPF já cadastrado" });

    const senhaHash = await hashPassword(senha);
    const perfilFinal =
      requester?.perfil === "ADMIN" && perfil
        ? (perfil as PerfilUsuario)
        : "PACIENTE";

    const novo = await Usuario.create({
      nome,
      email: emailNorm,
      cpf,
      senha: senhaHash,
      perfil: perfilFinal,
      ativo: true,
    });
    const { senha: _senha, ...usuarioSemSenha } = novo.toJSON();
    return res.status(201).json(usuarioSemSenha);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao criar usuário", details: error });
  }
};

export const getAllUsuarios = async (_req: Request, res: Response) => {
  try {
    const items = await Usuario.findAll();
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao buscar usuários", details: error });
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
    return res
      .status(500)
      .json({ error: "Erro ao buscar usuário", details: error });
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

    const requester = (req as Request & { user?: { perfil?: string } }).user;
    if (
      requester?.perfil === "PACIENTE" &&
      perfil &&
      perfil !== item.get("perfil")
    ) {
      return res
        .status(403)
        .json({ error: "Paciente não pode alterar perfil" });
    }

    let emailNorm: string | undefined;
    if (email !== undefined) {
      emailNorm = (email as string).trim().toLowerCase();
      if (!EMAIL_REGEX.test(emailNorm)) {
        return res.status(400).json({ error: "E-mail inválido" });
      }
    }

    const updates: Partial<IUsuario> = { nome, email: emailNorm, cpf, ativo };
    if (perfil) {
      updates.perfil = perfil as PerfilUsuario;
    }

    if (senha) {
      updates.senha = await hashPassword(senha);
    }

    const atualizado = await item.update(updates);
    const { senha: _senha, ...usuarioSemSenha } = atualizado.toJSON();
    return res.status(200).json(usuarioSemSenha);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao atualizar usuário", details: error });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await Usuario.findByPk(id);
    if (!item) return res.status(404).json({ error: "Usuário não encontrado" });

    const paciente = await Paciente.findOne({ where: { id_usuario: id } });

    if (paciente) {
      const agendamentoCount = await Agendamento.count({
        where: { id_paciente: paciente.get("id_paciente") as number },
      });

      if (agendamentoCount > 0) {
        await item.update({ ativo: false });
        return res.status(200).json({ message: "Usuário inativado com sucesso." });
      }

      await paciente.destroy();
    }

    await item.destroy();
    return res.status(200).json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao deletar usuário", details: error });
  }
};
