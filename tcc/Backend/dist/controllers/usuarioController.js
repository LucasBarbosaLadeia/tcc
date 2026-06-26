"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuario = exports.updateUsuario = exports.getUsuarioById = exports.getAllUsuarios = exports.createUsuario = void 0;
const usuarioModel_1 = __importDefault(require("../models/usuarioModel"));
const pacienteModel_1 = __importDefault(require("../models/pacienteModel"));
const agendamentoModel_1 = __importDefault(require("../models/agendamentoModel"));
const password_1 = require("../utils/password");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const createUsuario = async (req, res) => {
    try {
        const { nome, email, cpf, senha, perfil } = req.body;
        const requester = req.user;
        if (!nome || !email || !cpf || !senha) {
            return res
                .status(400)
                .json({ error: "Dados obrigatórios não informados" });
        }
        const emailNorm = email.trim().toLowerCase();
        if (!EMAIL_REGEX.test(emailNorm)) {
            return res.status(400).json({ error: "E-mail inválido" });
        }
        if (perfil && perfil !== "PACIENTE" && requester?.perfil !== "ADMIN") {
            return res.status(403).json({ error: "Sem permissão para criar usuário com este perfil" });
        }
        const existente = await usuarioModel_1.default.findOne({ where: { cpf } });
        if (existente)
            return res.status(400).json({ error: "CPF já cadastrado" });
        const senhaHash = await (0, password_1.hashPassword)(senha);
        const perfilFinal = requester?.perfil === "ADMIN" && perfil
            ? perfil
            : "PACIENTE";
        const novo = await usuarioModel_1.default.create({
            nome,
            email: emailNorm,
            cpf,
            senha: senhaHash,
            perfil: perfilFinal,
            ativo: true,
        });
        const { senha: _senha, ...usuarioSemSenha } = novo.toJSON();
        return res.status(201).json(usuarioSemSenha);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Erro ao criar usuário", details: error });
    }
};
exports.createUsuario = createUsuario;
const getAllUsuarios = async (_req, res) => {
    try {
        const items = await usuarioModel_1.default.findAll();
        return res.status(200).json(items);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Erro ao buscar usuários", details: error });
    }
};
exports.getAllUsuarios = getAllUsuarios;
const getUsuarioById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await usuarioModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Usuário não encontrado" });
        return res.status(200).json(item);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Erro ao buscar usuário", details: error });
    }
};
exports.getUsuarioById = getUsuarioById;
const updateUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nome, email, cpf, senha, perfil, ativo } = req.body;
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await usuarioModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Usuário não encontrado" });
        if (cpf) {
            const existente = await usuarioModel_1.default.findOne({ where: { cpf } });
            if (existente && existente.get("id_usuario") !== id) {
                return res.status(400).json({ error: "CPF já cadastrado" });
            }
        }
        const requester = req.user;
        if (requester?.perfil === "PACIENTE" &&
            perfil &&
            perfil !== item.get("perfil")) {
            return res
                .status(403)
                .json({ error: "Paciente não pode alterar perfil" });
        }
        let emailNorm;
        if (email !== undefined) {
            emailNorm = email.trim().toLowerCase();
            if (!EMAIL_REGEX.test(emailNorm)) {
                return res.status(400).json({ error: "E-mail inválido" });
            }
        }
        const updates = { nome, email: emailNorm, cpf, ativo };
        if (perfil) {
            updates.perfil = perfil;
        }
        if (senha) {
            updates.senha = await (0, password_1.hashPassword)(senha);
        }
        const atualizado = await item.update(updates);
        const { senha: _senha, ...usuarioSemSenha } = atualizado.toJSON();
        return res.status(200).json(usuarioSemSenha);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Erro ao atualizar usuário", details: error });
    }
};
exports.updateUsuario = updateUsuario;
const deleteUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "ID inválido" });
        const item = await usuarioModel_1.default.findByPk(id);
        if (!item)
            return res.status(404).json({ error: "Usuário não encontrado" });
        const paciente = await pacienteModel_1.default.findOne({ where: { id_usuario: id } });
        if (paciente) {
            const agendamentoCount = await agendamentoModel_1.default.count({
                where: { id_paciente: paciente.get("id_paciente") },
            });
            if (agendamentoCount > 0) {
                await item.update({ ativo: false });
                return res.status(200).json({ message: "Usuário inativado com sucesso." });
            }
            await paciente.destroy();
        }
        await item.destroy();
        return res.status(200).json({ message: "Usuário removido com sucesso." });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Erro ao deletar usuário", details: error });
    }
};
exports.deleteUsuario = deleteUsuario;
//# sourceMappingURL=usuarioController.js.map