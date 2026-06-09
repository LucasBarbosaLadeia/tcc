import { Router } from "express";
import {
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuarioController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.use(authMiddleware);

router.post("/", authorize("ADMIN"), createUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um usuario
 *     description: Somente ADMIN autenticado pode criar usuarios.
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
router.use(authorize("ADMIN"));

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuarios
 *     description: Requer perfil ADMIN.
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
 *     description: Requer perfil ADMIN.
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
 *     description: Requer perfil ADMIN.
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
 *     description: Requer perfil ADMIN.
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
