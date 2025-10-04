const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

exports.registrar = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    const user = await authService.registrarUsuario({ nombre, email, password });

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

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },    // payload
      process.env.JWT_SECRET,                // clave secreta desde .env
      { expiresIn: "1h" }                    // duración
    );

    res.json({ 
      id: user.id, 
      nombre: user.nombre, 
      email: user.email,
      token                                    // 👈 aquí devuelves el token
    });
  } catch (err) {
    if (err.message === "Credenciales inválidas") {
      return res.status(401).json({ message: err.message });
    }
    next(err);
  }
};
