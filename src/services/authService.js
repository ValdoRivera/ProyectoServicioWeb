// src/services/authService.js
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

/**
 * Registrar un nuevo usuario
 * @param {Object} data - Datos del usuario
 * @param {string} data.nombre
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<Usuario>}
 */
exports.registrarUsuario = async ({ nombre, email, password }) => {
  // Verificar si el email ya existe
  const existe = await Usuario.findOne({ where: { email } });
  if (existe) {
    throw new Error("Email ya registrado");
  }

  const hash = await bcrypt.hash(password, 10);

  // Crear usuario
  return Usuario.create({ nombre, email, password: hash });
};

/**
 * Iniciar sesión de un usuario
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<Usuario>}
 */
exports.loginUsuario = async ({ email, password }) => {
  // Buscar usuario
  const user = await Usuario.findOne({ where: { email } });
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  // Comparar contraseña
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new Error("Credenciales inválidas");
  }

  return user;
};
