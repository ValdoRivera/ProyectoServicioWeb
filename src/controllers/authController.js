const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

exports.registrar = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    const user = await authService.registrarUsuario({ nombre, email, password });

    // No regresamos password nunca
    res.status(201).json({
      id: user.id,
      nombre: user.nombre,
      email: user.email
    });
  } catch (err) {
    if (err.message === "Email ya registrado") {
      return res.status(409).json({ message: err.message });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUsuario({ email, password });

    // Generar token JWT con id y email
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      token
    });
  } catch (err) {
    if (err.message === "Credenciales inválidas") {
      return res.status(401).json({ message: err.message });
    }
    next(err);
  }
};