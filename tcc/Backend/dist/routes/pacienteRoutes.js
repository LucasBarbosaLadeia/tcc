"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pacienteController_1 = require("../controllers/pacienteController");
const auth_1 = require("../middlewares/auth");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
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
router.use(auth_1.authMiddleware);
router.post("/", (0, authorize_1.authorize)("RECEPCIONISTA", "ADMIN"), pacienteController_1.createPaciente);
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
router.get("/", (0, authorize_1.authorize)("RECEPCIONISTA", "ADMIN"), pacienteController_1.getAllPacientes);
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
router.get("/:id", (0, authorize_1.authorize)("RECEPCIONISTA", "ADMIN", "PACIENTE"), (req, res, next) => {
    const user = req.user;
    const id = Number(req.params.id);
    if (user?.perfil === "PACIENTE" && Number(user.id_paciente) !== id) {
        return res.status(403).json({ error: "Acesso nao autorizado" });
    }
    return next();
}, pacienteController_1.getPacienteById);
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
router.put("/:id", (0, authorize_1.authorize)("RECEPCIONISTA", "ADMIN", "PACIENTE"), (req, res, next) => {
    const user = req.user;
    const id = Number(req.params.id);
    if (user?.perfil === "PACIENTE" && Number(user.id_paciente) !== id) {
        return res.status(403).json({ error: "Acesso nao autorizado" });
    }
    return next();
}, pacienteController_1.updatePaciente);
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
router.delete("/:id", (0, authorize_1.authorize)("ADMIN"), pacienteController_1.deletePaciente);
exports.default = router;
//# sourceMappingURL=pacienteRoutes.js.map