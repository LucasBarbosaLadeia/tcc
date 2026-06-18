"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profissionalController_1 = require("../controllers/profissionalController");
const auth_1 = require("../middlewares/auth");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
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
router.post("/", (0, authorize_1.authorize)("ADMIN"), profissionalController_1.createProfissional);
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
router.get("/", profissionalController_1.getAllProfissionais);
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
router.get("/:id", profissionalController_1.getProfissionalById);
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
router.put("/:id", (0, authorize_1.authorize)("ADMIN"), profissionalController_1.updateProfissional);
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
router.delete("/:id", (0, authorize_1.authorize)("ADMIN"), profissionalController_1.deleteProfissional);
exports.default = router;
//# sourceMappingURL=profissionalRoutes.js.map