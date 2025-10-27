// src/routes/api/rates.js
const { Router } = require("express");
const ctrl = require("../../controllers/ratesController");
const router = Router();

/**
 * @swagger
 * /rates:
 *   get:
 *     tags: [Rates]
 *     summary: Obtiene el mapa de tasas en una moneda base
 *     parameters:
 *       - name: base
 *         in: query
 *         schema: { type: string, example: "USD" }
 *         description: Moneda base (por defecto USD)
 *     responses:
 *       200:
 *         description: Mapa de tasas
 */
router.get("/", ctrl.getRates);

/**
 * @swagger
 * /rates/convert:
 *   get:
 *     tags: [Rates]
 *     summary: Convierte entre monedas aplicando bono de ranking y promos
 *     parameters:
 *       - name: amount
 *         in: query
 *         required: true
 *         schema: { type: number, example: 150 }
 *       - name: from
 *         in: query
 *         required: true
 *         schema: { type: string, example: "USD" }
 *       - name: to
 *         in: query
 *         required: true
 *         schema: { type: string, example: "MXN" }
 *       - name: isMatchDay
 *         in: query
 *         schema: { type: boolean, example: true }
 *         description: Si es día de partido (reduce comisión)
 *       - name: promoCode
 *         in: query
 *         schema: { type: string, example: "GOAL10" }
 *         description: Código promocional (-10% sobre comisión)
 *       - name: rank
 *         in: query
 *         schema: { type: integer, example: 4 }
 *         description: Ranking FIFA del equipo (Top5=-5%, Top10=-3%)
 *     responses:
 *       200:
 *         description: Conversión con detalle (comisión, neto, efectivo)
 */
router.get("/convert", ctrl.convert);

/**
 * @swagger
 * /rates/symbols:
 *   get:
 *     tags: [Rates]
 *     summary: Lista de países/monedas del mundial y su estado de clasificación 2026
 *     responses:
 *       200:
 *         description: Lista de símbolos mundialistas
 */
router.get("/symbols", ctrl.symbols);

module.exports = router;

