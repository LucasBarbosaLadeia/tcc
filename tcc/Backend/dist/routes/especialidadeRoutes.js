"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const especialidadeController_1 = require("../controllers/especialidadeController");
const auth_1 = require("../middlewares/auth");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.use((0, authorize_1.authorize)("ADMIN"));
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
router.post("/", especialidadeController_1.createEspecialidade);
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
router.get("/", especialidadeController_1.getAllEspecialidades);
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
router.get("/:id", especialidadeController_1.getEspecialidadeById);
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
router.put("/:id", especialidadeController_1.updateEspecialidade);
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
router.delete("/:id", especialidadeController_1.deleteEspecialidade);
exports.default = router;
//# sourceMappingURL=especialidadeRoutes.js.map