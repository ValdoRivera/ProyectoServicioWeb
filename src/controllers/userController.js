const Usuario = require("../models/Usuario");

// GET /api/users      -> lista de usuarios (por defecto datos mínimos)
exports.listAll = async (req, res) => {
  const full = String(req.query.full || "").toLowerCase() === "true";
  const attributes = full
    ? ["id", "nombre", "email", "createdAt"]
    : ["id", "nombre"];

  const users = await Usuario.findAll({ attributes });
  res.json({ count: users.length, data: users });
};

// GET /api/users/:id  -> datos mínimos (públicos)
exports.getPublicById = async (req, res) => {
  const { id } = req.params;

  const user = await Usuario.findByPk(id, {
    attributes: ["id", "nombre"],
  });

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json(user);
};

// GET /api/user/:id   -> datos completos (privado: debe ser el propio usuario)
exports.getPrivateById = async (req, res) => {
  const { id } = req.params;

  if (Number(id) !== Number(req.user.id)) {
    return res.status(403).json({ message: "No autorizado" });
  }

  const user = await Usuario.findByPk(id, {
    attributes: ["id", "nombre", "email", "createdAt"],
  });

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json(user);
};
