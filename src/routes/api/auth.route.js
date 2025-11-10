const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const authController = require("../../controllers/authController");

const router = Router();

/* VALIDACIONES */
const validarRegistro = [
  check("nombre")
    .trim().notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  check("email")
    .trim().notEmpty().withMessage("El email es requerido")
    .isEmail().withMessage("El email no es válido")
    .normalizeEmail(),
  check("password")
    .notEmpty().withMessage("El password es requerido")
    .isLength({ min: 6 }).withMessage("El password debe tener al menos 6 caracteres"),
];

const validarLogin = [
  check("email")
    .trim().notEmpty().withMessage("El email es requerido")
    .isEmail().withMessage("El email no es válido")
    .normalizeEmail(),
  check("password")
    .notEmpty().withMessage("El password es requerido"),
];

/* MIDDLEWARE DE ERRORES */
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({ campo: err.param, mensaje: err.msg }))
    });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints para autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error de validación o datos incorrectos
 */
router.post("/register", validarRegistro, validarCampos, authController.registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", validarLogin, validarCampos, authController.login);

module.exports = router;
