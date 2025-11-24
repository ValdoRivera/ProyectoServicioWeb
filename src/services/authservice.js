// src/services/authService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "cambia-esto";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1d";
const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña en texto plano.
 */
async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano contra el hash almacenado.
 */
async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

/**
 * Genera un JWT con el payload mínimo necesario.
 */
function generateToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    nombre: user.nombre,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/**
 * Verifica un JWT y retorna el payload si es válido.
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Registro de usuario:
 * - Valida datos mínimos
 * - Encripta la contraseña
 * - Crea el usuario
 * - Devuelve user + token
 */
async function registerUser({ nombre, email, password }) {
  if (!nombre || !email || !password) {
    throw new BadRequestError("nombre, email y password son requeridos", {
      code: "AUTH_MISSING_FIELDS",
    });
  }

  // ¿Ya existe?
  const existing = await Usuario.findOne({ where: { email } });
  if (existing) {
    throw new ConflictError("El email ya está registrado", {
      code: "AUTH_EMAIL_EXISTS",
    });
  }

  const passwordHash = await hashPassword(password);
  const nuevo = await Usuario.create({ nombre, email, password: passwordHash });

  const token = generateToken(nuevo);
  // No regreses el hash
  const safeUser = { id: nuevo.id, nombre: nuevo.nombre, email: nuevo.email };

  return { user: safeUser, token };
}

/**
 * Login de usuario:
 * - Busca por email
 * - Compara password
 * - Devuelve user + token
 */
async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new BadRequestError("email y password son requeridos", {
      code: "AUTH_MISSING_FIELDS",
    });
  }

  const user = await Usuario.findOne({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Credenciales inválidas", {
      code: "AUTH_INVALID_CREDENTIALS",
    });
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    throw new UnauthorizedError("Credenciales inválidas", {
      code: "AUTH_INVALID_CREDENTIALS",
    });
  }

  const token = generateToken(user);
  const safeUser = { id: user.id, nombre: user.nombre, email: user.email };

  return { user: safeUser, token };
}

/**
 * Middleware de autenticación para Express:
 * - Lee token de Authorization: Bearer <token>
 * - Verifica y adjunta req.user
 * - Usa callback de jwt.verify 
 */
function authenticateJWT(req, _res, next) {
  const auth = req.headers.authorization || "";
  const parts = auth.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next(
      new UnauthorizedError("Token no provisto", {
        code: "AUTH_TOKEN_MISSING",
      })
    );
  }

  const token = parts[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(
        new UnauthorizedError("Token inválido o expirado", {
          code: "AUTH_TOKEN_INVALID",
        })
      );
    }

    req.user = decoded; // { sub, email, nombre, iat, exp }
    return next();
  });
}

/**
 * Helper opcional: obtener usuario desde req.user.sub
 */
async function getCurrentUser(req) {
  if (!req.user?.sub) return null;
  const user = await Usuario.findByPk(req.user.sub, {
    attributes: ["id", "nombre", "email", "createdAt"],
  });
  return user;
}

module.exports = {
  // hashing & jwt
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,

  // casos de uso
  registerUser,
  loginUser,

  // express middleware
  authenticateJWT,

  // helper
  getCurrentUser,
};

