"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unidadeController_1 = require("../controllers/unidadeController");
const auth_1 = require("../middlewares/auth");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.use((0, authorize_1.authorize)("ADMIN"));
/**
 * @swagger
 * /api/unidades:
 *   post:
 *     summary: Cria unidade
 *     tags:
 *       - Unidades
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
 *         description: Unidade criada
 */
router.post("/", unidadeController_1.createUnidade);
/**
 * @swagger
 * /api/unidades:
 *   get:
 *     summary: Lista unidades
 *     tags:
 *       - Unidades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", unidadeController_1.getAllUnidades);
/**
 * @swagger
 * /api/unidades/{id}:
 *   get:
 *     summary: Busca unidade por id
 *     tags:
 *       - Unidades
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
 *         description: Unidade encontrada
 *       404:
 *         description: Unidade nao encontrada
 */
router.get("/:id", unidadeController_1.getUnidadeById);
/**
 * @swagger
 * /api/unidades/{id}:
 *   put:
 *     summary: Atualiza unidade
 *     tags:
 *       - Unidades
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
 *         description: Unidade atualizada
 *       404:
 *         description: Unidade nao encontrada
 */
router.put("/:id", unidadeController_1.updateUnidade);
/**
 * @swagger
 * /api/unidades/{id}:
 *   delete:
 *     summary: Remove unidade
 *     tags:
 *       - Unidades
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
 *         description: Unidade removida
 *       404:
 *         description: Unidade nao encontrada
 */
router.delete("/:id", unidadeController_1.deleteUnidade);
exports.default = router;
//# sourceMappingURL=unidadeRoutes.js.map