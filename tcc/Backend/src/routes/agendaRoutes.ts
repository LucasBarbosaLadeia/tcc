import { Router } from "express";
import {
  createAgenda,
  getAllAgendas,
  getAgendaById,
  updateAgenda,
  deleteAgenda,
} from "../controllers/agendaController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/agendas:
 *   post:
 *     summary: Cria agenda
 *     tags:
 *       - Agendas
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
 *         description: Agenda criada
 */
router.post("/", authorize("ADMIN", "RECEPCIONISTA"), createAgenda);

/**
 * @swagger
 * /api/agendas:
 *   get:
 *     summary: Lista agendas
 *     tags:
 *       - Agendas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", authorize("PACIENTE", "RECEPCIONISTA", "ADMIN"), getAllAgendas);

/**
 * @swagger
 * /api/agendas/{id}:
 *   get:
 *     summary: Busca agenda por id
 *     tags:
 *       - Agendas
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
 *         description: Agenda encontrada
 *       404:
 *         description: Agenda nao encontrada
 */
router.get("/:id", authorize("RECEPCIONISTA", "ADMIN"), getAgendaById);

/**
 * @swagger
 * /api/agendas/{id}:
 *   put:
 *     summary: Atualiza agenda
 *     tags:
 *       - Agendas
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
 *         description: Agenda atualizada
 *       404:
 *         description: Agenda nao encontrada
 */
router.put("/:id", authorize("ADMIN", "RECEPCIONISTA"), updateAgenda);

/**
 * @swagger
 * /api/agendas/{id}:
 *   delete:
 *     summary: Remove agenda
 *     tags:
 *       - Agendas
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
 *         description: Agenda removida
 *       404:
 *         description: Agenda nao encontrada
 */
router.delete("/:id", authorize("ADMIN", "RECEPCIONISTA"), deleteAgenda);

export default router;
