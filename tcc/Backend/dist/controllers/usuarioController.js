"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuario = exports.updateUsuario = exports.getUsuarioById = exports.getAllUsuarios = exports.createUsuario = void 0;
const usuarioModel_1 = __importDefault(require("../models/usuarioModel"));
const createUsuario = async (req, res) => {
    try {
        const { nome, email, cpf, senha, perfil } = req.body;
        if (!nome || !email || !cpf || !senha || !perfil) {
            return res.status(400).json({ error: "Dados obrigatórios não informados" });
        }
        const existente = await usuarioModel_1.default.findOne({ where: { cpf } });
        if (existente)
            return res.status(400).json({ error: "CPF já cadastrado" });
        const novo = await usuarioModel_1.default.create({ nome, email, cpf, senha, perfil, ativo: true });
        return res.status(201).json(novo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar usuário", details: error });
    }
};
exports.createUsuario = createUsuario;
const getAllUsuarios = async (_req, res) => {
    try {
        const items = await usuarioModel_1.default.findAll();
        return res.status(200).json(items);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar usuários", details: error });
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
        return res.status(500).json({ error: "Erro ao buscar usuário", details: error });
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
        await item.update({ nome, email, cpf, senha, perfil, ativo });
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar usuário", details: error });
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
        await item.destroy();
        return res.status(200).json({ message: "Usuário deletado com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao deletar usuário", details: error });
    }
};
exports.deleteUsuario = deleteUsuario;
//# sourceMappingURL=usuarioController.js.map