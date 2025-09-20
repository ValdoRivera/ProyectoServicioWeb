const express = require('express');
const router = express.Router();
require('dotenv').config();

const authrouter = require('./api/auth');
router.use(process.env.BASE_URL || '/api', authrouter);

module.exports = router;
