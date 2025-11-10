// src/test/rates.test.js
const request = require("supertest");
const app = require("../app");

// Mock del ratesService que usa el controlador
jest.mock("../services/ratesService", () => ({
  getRates: jest.fn(async (base = "USD") => ({ EUR: 0.9, MXN: 17.2 })),
  convertAndRecord: jest.fn(async (amount, from, to) => ({
    amount: Number(amount),
    from,
    to,
    result: 123.45,
  })),
  getWorldCupSymbols: jest.fn(() => ["ARG", "FRA", "BRA"]),
}));

describe("Rates routes", () => {
  test("GET /api/rates -> 200 con rates", async () => {
    const res = await request(app).get("/api/rates").expect(200);
    expect(res.body).toHaveProperty("rates");
  });

  test("GET /api/rates/convert sin params -> 400", async () => {
    const res = await request(app).get("/api/rates/convert").expect(400);
    expect(res.body).toEqual({
      message: "Parámetros requeridos: amount, from, to",
    });
  });

  test("GET /api/rates/convert ok -> 200", async () => {
    const res = await request(app)
      .get("/api/rates/convert?amount=10&from=USD&to=MXN")
      .expect(200);

    expect(res.body).toMatchObject({
      amount: 10,
      from: "USD",
      to: "MXN",
    });
  });
});
