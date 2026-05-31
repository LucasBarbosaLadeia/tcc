import { Router } from "express";
import {
  createUnidade,
  getAllUnidades,
  getUnidadeById,
  updateUnidade,
  deleteUnidade,
} from "../controllers/unidadeController";

const router = Router();

/**
 * @swagger
 * /api/unidades:
 *   post:
 *     summary: Cria unidade
 *     tags:
 *       - Unidades
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Unidade criada
 */
router.post("/", createUnidade);

/**
 * @swagger
 * /api/unidades:
 *   get:
 *     summary: Lista unidades
 *     tags:
 *       - Unidades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", getAllUnidades);

/**
 * @swagger
 * /api/unidades/{id}:
 *   get:
 *     summary: Busca unidade por id
 *     tags:
 *       - Unidades
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
 *         description: Unidade encontrada
 *       404:
 *         description: Unidade nao encontrada
 */
router.get("/:id", getUnidadeById);

/**
 * @swagger
 * /api/unidades/{id}:
 *   put:
 *     summary: Atualiza unidade
 *     tags:
 *       - Unidades
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
 *             type: object
 *     responses:
 *       200:
 *         description: Unidade atualizada
 *       404:
 *         description: Unidade nao encontrada
 */
router.put("/:id", updateUnidade);

/**
 * @swagger
 * /api/unidades/{id}:
 *   delete:
 *     summary: Remove unidade
 *     tags:
 *       - Unidades
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
 *         description: Unidade removida
 *       404:
 *         description: Unidade nao encontrada
 */
router.delete("/:id", deleteUnidade);

export default router;
