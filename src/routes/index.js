// src/routes/index.js
const { Router } = require("express");
const router = Router();

const apiRoutes = require("./api");
router.use("/", apiRoutes); 

module.exports = router;
