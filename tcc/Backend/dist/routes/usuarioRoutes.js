"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
const auth_1 = require("../middlewares/auth");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.post("/", (0, authorize_1.authorize)("ADMIN", "RECEPCIONISTA"), usuarioController_1.createUsuario);
/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um usuario
 *     description: Somente ADMIN autenticado pode criar usuarios.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Usuario"
 *     responses:
 *       201:
 *         description: Usuario criado
 */
router.use((0, authorize_1.authorize)("ADMIN"));
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuarios
 *     description: Requer perfil ADMIN.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", usuarioController_1.getAllUsuarios);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca usuario por id
 *     description: Requer perfil ADMIN.
 *     tags:
 *       - Usuarios
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
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario nao encontrado
 */
router.get("/:id", usuarioController_1.getUsuarioById);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualiza usuario
 *     description: Requer perfil ADMIN.
 *     tags:
 *       - Usuarios
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
 *             $ref: "#/components/schemas/Usuario"
 *     responses:
 *       200:
 *         description: Usuario atualizado
 *       404:
 *         description: Usuario nao encontrado
 */
router.put("/:id", usuarioController_1.updateUsuario);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Remove usuario
 *     description: Requer perfil ADMIN.
 *     tags:
 *       - Usuarios
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
 *         description: Usuario removido
 *       404:
 *         description: Usuario nao encontrado
 */
router.delete("/:id", usuarioController_1.deleteUsuario);
exports.default = router;
//# sourceMappingURL=usuarioRoutes.js.map