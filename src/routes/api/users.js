const { Router } = require("express");
const ctrl = require("../../controllers/userController");
const router = Router();

router.get("/", ctrl.listar);        // GET  /api/users
router.post("/", ctrl.registrar);    // POST /api/users
router.post("/login", ctrl.login);   // POST /api/users/login

module.exports = router;
