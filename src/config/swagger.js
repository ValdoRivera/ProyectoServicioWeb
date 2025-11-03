// src/config/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Divisas & Cripto API",
      version: "1.0.0",
      description: "API para conversión de divisas/cripto y gestión de usuarios",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nombre: { type: "string", example: "Ada Lovelace" },
            email: { type: "string", example: "ada@ejemplo.com" },
          },
        },
        AuthLoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "ada@ejemplo.com" },
            password: { type: "string", example: "Secreto123" },
          },
        },
        AuthLoginResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "eyJhbGciOi..." },
            usuario: { $ref: "#/components/schemas/Usuario" },
          },
        },
        ConvertResponse: {
          type: "object",
          properties: {
            amount: { type: "number", example: 100 },
            from: { type: "string", example: "USD" },
            to: { type: "string", example: "BTC" },
            result: { type: "number", example: 0.0017 },
            base: { type: "string", example: "USD" },
          },
        },
      },
    },
  },
  // Archivos donde tienes las anotaciones JSDoc
  apis: [
    "src/routes/**/*.js",
    "src/controllers/**/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
