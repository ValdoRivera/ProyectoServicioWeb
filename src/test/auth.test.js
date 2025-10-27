// src/test/auth.test.js
const request = require("supertest");
const app = require("../app");

// Mockea el servicio real con el mock de tests
jest.mock("../services/authService", () =>
  require("./_mocks_/services/authService")
);

// SECRET para firmar tokens en tests (si no viene por env)
process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";

describe("Auth routes", () => {
  test("POST /api/auth/register -> 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Inge",
        email: "inges16@example.com",
        password: "123456",
      })
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      nombre: "Inge",
      email: "inges16@example.com",
    });
    expect(res.body.password).toBeUndefined();
  });

  test("POST /api/auth/login -> 200 y token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "inges16@example.com", password: "123456" })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body).toMatchObject({
      id: 4,
      nombre: "Inge",
      email: "inges16@example.com",
    });
  });

  test("POST /api/auth/login credenciales malas -> 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "bad@example.com", password: "wrong" })
      .expect(401);

    expect(res.body).toEqual({ message: "Credenciales inválidas" });
  });
});
