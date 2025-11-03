// src/routes/api/users.js
const { Router } = require("express");
const userController = require("../../controllers/userController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = Router();

// Protegidas con JWT
// GET /api/users -> ahora regresa el usuario del token
router.get("/", authMiddleware, userController.listar);

// (Opcional) GET /api/users/me -> alternativa explícita
router.get("/me", authMiddleware, userController.getMe);

module.exports = router;

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuarios (requiere JWT)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Usuario' }
 *       401:
 *         description: No autorizado
 */
