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
