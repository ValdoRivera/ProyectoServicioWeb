// src/routes/api/rates.js
const { Router } = require("express");
const ctrl = require("../../controllers/ratesController");
const router = Router();

router.get("/", ctrl.getRates);                 // GET /api/rates?base=USD
router.get("/convert", ctrl.convert);           // GET /api/rates/convert?amount=100&from=USD&to=BTC

module.exports = router;

/**
 * @openapi
 * /rates:
 *   get:
 *     tags: [Rates]
 *     summary: Obtener tasas por moneda base
 *     parameters:
 *       - in: query
 *         name: base
 *         schema:
 *           type: string
 *           example: USD
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @openapi
 * /rates/convert:
 *   get:
 *     tags: [Rates]
 *     summary: Convertir importe entre símbolos
 *     parameters:
 *       - in: query
 *         name: amount
 *         required: true
 *         schema: { type: number, example: 100 }
 *       - in: query
 *         name: from
 *         required: true
 *         schema: { type: string, example: USD }
 *       - in: query
 *         name: to
 *         required: true
 *         schema: { type: string, example: BTC }
 *     responses:
 *       200:
 *         description: Conversión realizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConvertResponse'
 *       400:
 *         description: Parámetros faltantes/incorrectos
 */
