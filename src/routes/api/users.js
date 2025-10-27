const { Router } = require("express");
const userController = require("../../controllers/userController");
// Usa el nombre correcto del archivo:
const authMiddleware = require("../../middlewares/authMiddleWare");
// Si tu archivo se llama authMiddleware.js (sin W mayúscula), usa en cambio:
// const authMiddleware = require("../../middlewares/authMiddleware");

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos los usuarios
 *     description: Por defecto devuelve solo id y nombre. Usa ?full=true para incluir email y createdAt.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: full
 *         schema: { type: boolean }
 *         description: Si es true devuelve campos completos
 *     responses:
 *       200: { description: Lista de usuarios }
 */
router.get("/", authMiddleware, userController.listAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene datos públicos (mínimos) de un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Datos mínimos del usuario }
 *       404: { description: Usuario no encontrado }
 */
router.get("/:id", authMiddleware, userController.getPublicById);

module.exports = router;
