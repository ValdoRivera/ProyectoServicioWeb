const { Router } = require("express");
const userController = require("../../controllers/userController");

// OJO con el nombre real del middleware:
// - Si tu archivo es src/middlewares/authMiddleWare.js  (con W mayúscula)
const authMiddleware = require("../../middlewares/authMiddleWare");
// - Si se llama authMiddleware.js (sin la W mayúscula), usa esta línea en su lugar:
// const authMiddleware = require("../../middlewares/authMiddleware");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints del usuario autenticado
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Obtiene los datos completos del usuario autenticado
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Datos completos del usuario }
 *       403: { description: No autorizado }
 *       404: { description: Usuario no encontrado }
 *       401: { description: Token inválido o expirado }
 */
router.get("/:id", authMiddleware, userController.getPrivateById);

module.exports = router;
