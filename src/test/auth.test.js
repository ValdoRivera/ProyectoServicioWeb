// tests/auth.test.js
import { describe, expect, beforeAll } from '@jest/globals';
import { faker } from '@faker-js/faker';
import status from 'http-status';
import request from 'supertest';
import server from '../src/server.js'; // ajusta la ruta a tu archivo real
import 'dotenv/config';

describe('POST - register a new user', () => {
  const basePath = '/api/v1/register';
  const fixedUser = {
    name: 'Nathaly',
    email: 'nathaly.cedeno@cutonalapan.ug.mx', // mismo del ejemplo
    password: '123456',
  };

  // Creamos/aseguramos el usuario base para que la prueba de "duplicado" tenga sentido
  beforeAll(async () => {
    await request(server).post(basePath).send(fixedUser);
  });

  it("Should return status 400 if the registered user is duplicated", async () => {
    const response = await request(server).post(basePath).send(fixedUser);

    expect(response.body?.status).toBe(false);
    expect(response.status).toBe(status.BAD_REQUEST);
  });

  it('Should return status 201 if register user is successful', async () => {
    const uniqueUser = {
      name: 'Nathaly',
      email: faker.internet.email({ firstName: 'nathaly' }),
      password: '123456',
    };

    const response = await request(server).post(basePath).send(uniqueUser);

    expect(response.body?.status).toBe(true);
    expect(response.status).toBe(status.CREATED);
  });
});
