const { StatusCodes } = require("http-status-codes");
const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

exports.registrar = async (req, res, next) => {
  const { nombre, email, password } = req.body;

  const user = await authService.registrarUsuario({ nombre, email, password });

  // No regresamos el password nunca
  return res.status(StatusCodes.CREATED).json({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authService.loginUsuario({ email, password });

  // Generar token JWT con id y email
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(StatusCodes.OK).json({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    token,
  });
};


