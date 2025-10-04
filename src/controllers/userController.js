// src/controllers/userController.js
const Usuario = require("../models/Usuario");

// GET /api/users  (listar)
exports.listar = async (_req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "email", "createdAt"],
    });
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
};