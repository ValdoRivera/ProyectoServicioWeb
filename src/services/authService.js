// src/services/authService.js
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

// Helper mínimo para errores HTTP
function httpError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/**
 * Registrar un nuevo usuario
 * @param {Object} data
 * @param {string} data.nombre
 * @param {string} data.email
 * @param {string} data.password
 */
exports.registrarUsuario = async ({ nombre, email, password }) => {
  const existe = await Usuario.findOne({ where: { email } });
  if (existe) {
    throw httpError("Email ya registrado", 409); // CONFLICT
  }

  const hash = await bcrypt.hash(password, 10);
  return Usuario.create({ nombre, email, password: hash });
};

/**
 * Iniciar sesión de un usuario
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 */
exports.loginUsuario = async ({ email, password }) => {
  const user = await Usuario.findOne({ where: { email } });
  if (!user) {
    throw httpError("Credenciales inválidas", 401); // UNAUTHORIZED
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw httpError("Credenciales inválidas", 401); // UNAUTHORIZED
  }

  return user;
};
