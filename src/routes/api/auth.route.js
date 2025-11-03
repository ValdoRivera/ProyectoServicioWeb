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

/* RUTAS */
router.post("/register", validarRegistro, validarCampos, authController.registrar);
router.post("/login", validarLogin, validarCampos, authController.login);

module.exports = router;

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       400:
 *         description: Datos inválidos
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos inválidos
 */
