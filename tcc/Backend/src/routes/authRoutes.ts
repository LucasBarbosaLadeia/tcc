import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login
 *     tags:
 *       - Autenticacao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais invalidas
 */
router.post("/login", login);

export default router;
