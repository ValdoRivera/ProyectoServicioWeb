// src/test/_mocks_/services/authService.js
module.exports = {
  registrarUsuario: jest.fn(async ({ nombre, email }) => {
    // Simula registro exitoso
    return { id: 123, nombre, email }; // nunca incluir password
  }),

  loginUsuario: jest.fn(async ({ email }) => {
    // Si el email es "malo", simulamos credenciales inválidas con status 401
    if (email === "bad@example.com") {
      const err = new Error("Credenciales inválidas");
      err.status = 401; // <- CLAVE para que el handler global no responda 500
      throw err;
    }
    // Caso feliz
    return { id: 4, nombre: "Inge", email };
  }),
};
