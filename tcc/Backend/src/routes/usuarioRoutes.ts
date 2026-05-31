import { Router } from "express";
import {
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuarioController";

const router = Router();

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Usuario"
 *     responses:
 *       201:
 *         description: Usuario criado
 */
router.post("/", createUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuarios
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", getAllUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca usuario por id
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario nao encontrado
 */
router.get("/:id", getUsuarioById);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualiza usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Usuario"
 *     responses:
 *       200:
 *         description: Usuario atualizado
 *       404:
 *         description: Usuario nao encontrado
 */
router.put("/:id", updateUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Remove usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario removido
 *       404:
 *         description: Usuario nao encontrado
 */
router.delete("/:id", deleteUsuario);

export default router;
