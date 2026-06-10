import { Router } from "express";
import {
  createPaciente,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
  deletePaciente,
} from "../controllers/pacienteController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { Request, Response, NextFunction } from "express";

const router = Router();

/**
 * @swagger
 * /api/pacientes:
 *   post:
 *     summary: Cria paciente
 *     description: Somente RECEPCIONISTA ou ADMIN autenticado pode cadastrar pacientes.
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
router.use(authMiddleware);

router.post("/", authorize("RECEPCIONISTA", "ADMIN"), createPaciente);

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Lista pacientes
 *     description: Requer RECEPCIONISTA ou ADMIN.
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", authorize("RECEPCIONISTA", "ADMIN"), getAllPacientes);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Busca paciente por id
 *     description: ADMIN e RECEPCIONISTA podem acessar qualquer registro. PACIENTE apenas o proprio cadastro.
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
router.get(
  "/:id",
  authorize("RECEPCIONISTA", "ADMIN", "PACIENTE"),
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const id = Number(req.params.id);

    if (user?.perfil === "PACIENTE" && Number(user.id_paciente) !== id) {
      return res.status(403).json({ error: "Acesso nao autorizado" });
    }

    return next();
  },
  getPacienteById,
);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   put:
 *     summary: Atualiza paciente
 *     description: ADMIN e RECEPCIONISTA podem alterar qualquer cadastro. PACIENTE apenas o proprio cadastro.
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
router.put(
  "/:id",
  authorize("RECEPCIONISTA", "ADMIN", "PACIENTE"),
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const id = Number(req.params.id);

    if (user?.perfil === "PACIENTE" && Number(user.id_paciente) !== id) {
      return res.status(403).json({ error: "Acesso nao autorizado" });
    }

    return next();
  },
  updatePaciente,
);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   delete:
 *     summary: Remove paciente
 *     description: Requer perfil ADMIN.
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
router.delete("/:id", authorize("ADMIN"), deletePaciente);

export default router;
