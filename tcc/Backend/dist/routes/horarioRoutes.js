"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const horarioController_1 = require("../controllers/horarioController");
const auth_1 = require("../middlewares/auth");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.use((0, authorize_1.authorize)("ADMIN"));
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
router.post("/", horarioController_1.createHorario);
/**
 * @swagger
 * /api/datas:
 *   get:
 *     summary: Lista horarios
 *     tags:
 *       - Horarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", horarioController_1.getAllHorarios);
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
router.get("/:id", horarioController_1.getHorarioById);
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
router.put("/:id", horarioController_1.updateHorario);
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
router.delete("/:id", horarioController_1.deleteHorario);
exports.default = router;
//# sourceMappingURL=horarioRoutes.js.map