// src/routes/api/users.js
const { Router } = require("express");
const userController = require("../../controllers/userController");
const authMiddleware = require("../../middlewares/authMiddleware"); // 👈 nuevo

const router = Router();

// GET /api/users (protegida con JWT)
router.get("/", authMiddleware, userController.listar);

module.exports = router;
