// src/controllers/authController.js
const { StatusCodes } = require("http-status-codes");
const authService = require("../services/authService");

// Registro
exports.registrar = (req, res, next) => {
  const { nombre, email, password } = req.body;

  authService
    .registerUser({ nombre, email, password })
    .then(({ user, token }) => {
      // No regresamos el password nunca
      return res.status(StatusCodes.CREATED).json({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        token,
      });
    })
    .catch(next); // pasa cualquier error al middleware global
};

// Login
exports.login = (req, res, next) => {
  const { email, password } = req.body;

  authService
    .loginUser({ email, password })
    .then(({ user, token }) => {
      return res.status(StatusCodes.OK).json({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        token,
      });
    })
    .catch(next);
};
