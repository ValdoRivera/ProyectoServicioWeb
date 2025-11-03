const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

// POST /api/users  (registro)
exports.registrar = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ message: "nombre, email y password son requeridos" });
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(409).json({ message: "Email ya registrado" });

    const hash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({ nombre, email, password: hash });
    // no regreses el hash:
    res.status(201).json({ id: user.id, nombre: user.nombre, email: user.email });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email y password son requeridos" });

    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    // por ahora sin JWT; responde datos básicos
    res.json({ id: user.id, nombre: user.nombre, email: user.email });
  } catch (err) { next(err); }
};

// GET /api/users  (listar)
exports.listar = async (_req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: ["id", "nombre", "email", "createdAt"] });
    res.json(usuarios);
  } catch (err) { next(err); }
};
