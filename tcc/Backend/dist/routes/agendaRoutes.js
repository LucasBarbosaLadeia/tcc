"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agendaController_1 = require("../controllers/agendaController");
const auth_1 = require("../middlewares/auth");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
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
router.post("/", (0, authorize_1.authorize)("ADMIN", "RECEPCIONISTA"), agendaController_1.createAgenda);
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
router.get("/", (0, authorize_1.authorize)("PACIENTE", "RECEPCIONISTA", "ADMIN"), agendaController_1.getAllAgendas);
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
router.get("/:id", (0, authorize_1.authorize)("RECEPCIONISTA", "ADMIN"), agendaController_1.getAgendaById);
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
router.put("/:id", (0, authorize_1.authorize)("ADMIN", "RECEPCIONISTA"), agendaController_1.updateAgenda);
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
router.delete("/:id", (0, authorize_1.authorize)("ADMIN", "RECEPCIONISTA"), agendaController_1.deleteAgenda);
exports.default = router;
//# sourceMappingURL=agendaRoutes.js.map