import { Router } from "express";
import {
  createAgendamento,
  getAllAgendamentos,
  getAgendamentoById,
  updateAgendamento,
  deleteAgendamento,
} from "../controllers/agendamentoController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { Request, Response, NextFunction } from "express";

const router = Router();

router.use(authMiddleware);

const ownershipAgendamento = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Token nao informado" });
  }

  if (user.perfil === "ADMIN" || user.perfil === "RECEPCIONISTA") {
    return next();
  }

  const idAgendamento = Number(req.params.id);
  const idPaciente = Number(req.body.id_paciente ?? req.body?.id_paciente);

  if (req.method === "POST") {
    if (user.perfil === "PACIENTE" && user.id_paciente && idPaciente !== user.id_paciente) {
      return res.status(403).json({ error: "Paciente so pode criar agendamento para si mesmo" });
    }
    return next();
  }

  if (user.perfil === "PACIENTE") {
    const idUsuarioAgendamento = Number(req.body?.id_paciente ?? req.query?.id_paciente);
    if (Number.isNaN(idAgendamento)) {
      return res.status(400).json({ error: "ID invalido" });
    }

    if (!user.id_paciente) {
      return res.status(403).json({ error: "Acesso nao autorizado" });
    }

    if (req.method === "PUT" || req.method === "DELETE" || req.method === "GET") {
      (req as Request & { agendamentoOwnershipChecked?: boolean }).agendamentoOwnershipChecked = true;
      return next();
    }

    if (idUsuarioAgendamento && idUsuarioAgendamento !== user.id_paciente) {
      return res.status(403).json({ error: "Acesso nao autorizado" });
    }
  }

  return next();
};

/**
 * @swagger
 * /api/agendamentos:
 *   post:
 *     summary: Cria agendamento
 *     description: PACIENTE cria apenas o proprio agendamento. RECEPCIONISTA e ADMIN podem criar qualquer um.
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
router.post("/", authorize("PACIENTE", "RECEPCIONISTA", "ADMIN"), ownershipAgendamento, createAgendamento);

/**
 * @swagger
 * /api/agendamentos:
 *   get:
 *     summary: Lista agendamentos
 *     description: PACIENTE ve apenas os proprios agendamentos. RECEPCIONISTA e ADMIN veem todos.
 *     tags:
 *       - Agendamentos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", authorize("PACIENTE", "RECEPCIONISTA", "ADMIN"), getAllAgendamentos);

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   get:
 *     summary: Busca agendamento por id
 *     description: PACIENTE ve apenas o proprio agendamento. RECEPCIONISTA e ADMIN veem qualquer um.
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
router.get("/:id", authorize("PACIENTE", "RECEPCIONISTA", "ADMIN"), ownershipAgendamento, getAgendamentoById);

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   put:
 *     summary: Atualiza agendamento
 *     description: PACIENTE pode apenas cancelar o proprio agendamento. RECEPCIONISTA e ADMIN podem alterar qualquer um.
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
router.put("/:id", authorize("PACIENTE", "RECEPCIONISTA", "ADMIN"), ownershipAgendamento, updateAgendamento);

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   delete:
 *     summary: Remove agendamento
 *     description: Requer perfil ADMIN.
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
router.delete("/:id", authorize("ADMIN"), deleteAgendamento);

export default router;
