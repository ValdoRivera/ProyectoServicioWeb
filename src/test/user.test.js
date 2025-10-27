// src/test/user.test.js
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

// SECRET para el middleware de auth en tests
process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";

// Mock del modelo para NO tocar la DB
jest.mock("../models/Usuario", () => ({
  findAll: jest.fn(async () => [
    { id: 1, nombre: "A" },
    { id: 4, nombre: "Inge" },
  ]),
  findByPk: jest.fn(async (id) => {
    if (Number(id) === 4) {
      return {
        id: 4,
        nombre: "Inge",
        email: "inges16@example.com",
        createdAt: "2025-09-29T15:49:01.000Z",
      };
    }
    if (Number(id) === 1) {
      return { id: 1, nombre: "A" };
    }
    return null;
  }),
}));

describe("User routes", () => {
  test("GET /api/users (mínimo) -> 200 lista", async () => {
    const token = jwt.sign({ id: 99, email: "x@y.com" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("count");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("id");
    expect(res.body.data[0]).toHaveProperty("nombre");
  });

  test("GET /api/users/1 -> 200 mínimos por id", async () => {
    const token = jwt.sign({ id: 99, email: "x@y.com" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .get("/api/users/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual({ id: 1, nombre: "A" });
  });

  test("GET /api/user/4 con token id=4 -> 200 completos", async () => {
    const token = jwt.sign(
      { id: 4, email: "inges16@example.com" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/user/4")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: 4,
      nombre: "Inge",
      email: "inges16@example.com",
    });
  });

  test("GET /api/user/4 con token id≠4 -> 403", async () => {
    const token = jwt.sign(
      { id: 5, email: "otro@example.com" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/user/4")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    expect(res.body).toEqual({ message: "No autorizado" });
  });
});
