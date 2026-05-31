import { Router } from "express";
import {
  createAgendamento,
  getAllAgendamentos,
  getAgendamentoById,
  updateAgendamento,
  deleteAgendamento,
} from "../controllers/agendamentoController";

const router = Router();

/**
 * @swagger
 * /api/agendamentos:
 *   post:
 *     summary: Cria agendamento
 *     tags:
 *       - Agendamentos
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
 *         description: Agendamento criado
 */
router.post("/", createAgendamento);

/**
 * @swagger
 * /api/agendamentos:
 *   get:
 *     summary: Lista agendamentos
 *     tags:
 *       - Agendamentos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", getAllAgendamentos);

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   get:
 *     summary: Busca agendamento por id
 *     tags:
 *       - Agendamentos
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
 *         description: Agendamento encontrado
 *       404:
 *         description: Agendamento nao encontrado
 */
router.get("/:id", getAgendamentoById);

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   put:
 *     summary: Atualiza agendamento
 *     tags:
 *       - Agendamentos
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
 *         description: Agendamento atualizado
 *       404:
 *         description: Agendamento nao encontrado
 */
router.put("/:id", updateAgendamento);

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   delete:
 *     summary: Remove agendamento
 *     tags:
 *       - Agendamentos
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
 *         description: Agendamento removido
 *       404:
 *         description: Agendamento nao encontrado
 */
router.delete("/:id", deleteAgendamento);

export default router;
