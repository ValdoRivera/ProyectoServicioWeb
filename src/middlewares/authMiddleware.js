const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth = req.headers["authorization"] || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(403).json({ message: "Token requerido" });
  }

  // Verifica el token y setea req.user; sin try/catch, con manejo del callback
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
    req.user = decoded; // { id, email, ... }
    next();
  });
};
