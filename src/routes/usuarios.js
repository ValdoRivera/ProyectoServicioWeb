// routes/usuarios.js
const { Router } = require("express");
const Usuario = require("../models/Usuario");
const router = Router();

// GET /api/usuarios/:id -> traer un usuario
router.get("/:id", async (req, res, next) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/usuarios/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const borrado = await Usuario.destroy({ where: { id } });

    if (borrado === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado con éxito" });
  } catch (err) {
    next(err);
  }
});

// POST /api/usuarios
router.post("/", async (req, res, next) => {
  try {
    // Admite tanto email como correo
    const nombre   = req.body.nombre;
    const email    = req.body.email ?? req.body.correo; // mapeo opcional
    const password = req.body.password;
    const edad     = req.body.edad; // opcional si existe en el modelo

    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: "Faltan campos requeridos: nombre, email (o correo) y password",
      });
    }

    const user = await Usuario.create({ nombre, email, password, edad });
    res.status(201).json(user);
  } catch (err) {
    // Si es error de validación, devuelve 400 en lugar de 500
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: err.errors.map(e => e.message).join("; ") });
    }
    next(err);
  }
});

module.exports = router;
