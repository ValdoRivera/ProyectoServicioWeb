// src/controllers/userController.js
const Usuario = require("../models/Usuario");

// GET /api/users  -> devuelve SOLO el usuario del token
exports.listar = async (req, res, next) => {
  try {
    const user = await Usuario.findByPk(req.user.id, {
      attributes: ["id", "nombre", "email", "createdAt"]
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// (Opcional) GET /api/users/me  -> también devuelve solo el usuario del token
exports.getMe = async (req, res, next) => {
  try {
    const user = await Usuario.findByPk(req.user.id, {
      attributes: ["id", "nombre", "email", "createdAt"]
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
