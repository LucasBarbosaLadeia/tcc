import { Router } from "express";
import {
  createEspecialidade,
  getAllEspecialidades,
  getEspecialidadeById,
  updateEspecialidade,
  deleteEspecialidade,
} from "../controllers/especialidadeController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/especialidades:
 *   post:
 *     summary: Cria especialidade
 *     tags:
 *       - Especialidades
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
 *         description: Especialidade criada
 */
router.post("/", authorize("ADMIN"), createEspecialidade);

/**
 * @swagger
 * /api/especialidades:
 *   get:
 *     summary: Lista especialidades
 *     tags:
 *       - Especialidades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", getAllEspecialidades);

/**
 * @swagger
 * /api/especialidades/{id}:
 *   get:
 *     summary: Busca especialidade por id
 *     tags:
 *       - Especialidades
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
 *         description: Especialidade encontrada
 *       404:
 *         description: Especialidade nao encontrada
 */
router.get("/:id", getEspecialidadeById);

/**
 * @swagger
 * /api/especialidades/{id}:
 *   put:
 *     summary: Atualiza especialidade
 *     tags:
 *       - Especialidades
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
 *         description: Especialidade atualizada
 *       404:
 *         description: Especialidade nao encontrada
 */
router.put("/:id", authorize("ADMIN"), updateEspecialidade);

/**
 * @swagger
 * /api/especialidades/{id}:
 *   delete:
 *     summary: Remove especialidade
 *     tags:
 *       - Especialidades
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
 *         description: Especialidade removida
 *       404:
 *         description: Especialidade nao encontrada
 */
router.delete("/:id", authorize("ADMIN"), deleteEspecialidade);

export default router;
