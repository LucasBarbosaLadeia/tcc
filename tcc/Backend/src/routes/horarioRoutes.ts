import { Router } from "express";
import {
  createHorario,
  getAllHorarios,
  getHorarioById,
  updateHorario,
  deleteHorario,
} from "../controllers/horarioController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/datas:
 *   post:
 *     summary: Cria horario
 *     tags:
 *       - Horarios
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
 *         description: Horario criado
 */
router.post("/", authorize("ADMIN"), createHorario);

/**
 * @swagger
 * /api/datas:
 *   get:
 *     summary: Lista horarios disponiveis
 *     tags:
 *       - Horarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", authorize("PACIENTE", "RECEPCIONISTA", "ADMIN"), getAllHorarios);

/**
 * @swagger
 * /api/datas/{id}:
 *   get:
 *     summary: Busca horario por id
 *     tags:
 *       - Horarios
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
 *         description: Horario encontrado
 *       404:
 *         description: Horario nao encontrado
 */
router.get("/:id", authorize("PACIENTE", "RECEPCIONISTA", "ADMIN"), getHorarioById);

/**
 * @swagger
 * /api/datas/{id}:
 *   put:
 *     summary: Atualiza horario
 *     tags:
 *       - Horarios
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
 *         description: Horario atualizado
 *       404:
 *         description: Horario nao encontrado
 */
router.put("/:id", authorize("ADMIN"), updateHorario);

/**
 * @swagger
 * /api/datas/{id}:
 *   delete:
 *     summary: Remove horario
 *     tags:
 *       - Horarios
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
 *         description: Horario removido
 *       404:
 *         description: Horario nao encontrado
 */
router.delete("/:id", authorize("ADMIN"), deleteHorario);

export default router;
