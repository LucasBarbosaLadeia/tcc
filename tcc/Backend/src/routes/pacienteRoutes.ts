import { Router } from "express";
import {
  createPaciente,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
  deletePaciente,
} from "../controllers/pacienteController";

const router = Router();

/**
 * @swagger
 * /api/pacientes:
 *   post:
 *     summary: Cria paciente
 *     tags:
 *       - Pacientes
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
 *         description: Paciente criado
 */
router.post("/", createPaciente);

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Lista pacientes
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", getAllPacientes);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Busca paciente por id
 *     tags:
 *       - Pacientes
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
 *         description: Paciente encontrado
 *       404:
 *         description: Paciente nao encontrado
 */
router.get("/:id", getPacienteById);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   put:
 *     summary: Atualiza paciente
 *     tags:
 *       - Pacientes
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
 *         description: Paciente atualizado
 *       404:
 *         description: Paciente nao encontrado
 */
router.put("/:id", updatePaciente);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   delete:
 *     summary: Remove paciente
 *     tags:
 *       - Pacientes
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
 *         description: Paciente removido
 *       404:
 *         description: Paciente nao encontrado
 */
router.delete("/:id", deletePaciente);

export default router;
