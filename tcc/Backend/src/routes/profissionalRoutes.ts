import { Router } from "express";
import {
  createProfissional,
  getAllProfissionais,
  getProfissionalById,
  updateProfissional,
  deleteProfissional,
} from "../controllers/profissionalController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/profissionais:
 *   post:
 *     summary: Cria profissional
 *     tags:
 *       - Profissionais
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
 *         description: Profissional criado
 */
router.post("/", authorize("ADMIN"), createProfissional);

/**
 * @swagger
 * /api/profissionais:
 *   get:
 *     summary: Lista profissionais
 *     tags:
 *       - Profissionais
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", getAllProfissionais);

/**
 * @swagger
 * /api/profissionais/{id}:
 *   get:
 *     summary: Busca profissional por id
 *     tags:
 *       - Profissionais
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
 *         description: Profissional encontrado
 *       404:
 *         description: Profissional nao encontrado
 */
router.get("/:id", getProfissionalById);

/**
 * @swagger
 * /api/profissionais/{id}:
 *   put:
 *     summary: Atualiza profissional
 *     tags:
 *       - Profissionais
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
 *         description: Profissional atualizado
 *       404:
 *         description: Profissional nao encontrado
 */
router.put("/:id", authorize("ADMIN"), updateProfissional);

/**
 * @swagger
 * /api/profissionais/{id}:
 *   delete:
 *     summary: Remove profissional
 *     tags:
 *       - Profissionais
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
 *         description: Profissional removido
 *       404:
 *         description: Profissional nao encontrado
 */
router.delete("/:id", authorize("ADMIN"), deleteProfissional);

export default router;
