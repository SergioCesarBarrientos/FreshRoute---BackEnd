process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../config/connectDB');

jest.setTimeout(15000);

beforeAll(async () => {
  // Nos conectamos a tu base de datos real de Atlas
  await connectDB();
});

afterAll(async () => {
  // Cerramos la conexión para que Jest no se quede colgado
  await mongoose.connection.close();
});

describe('Pruebas de Autenticación', () => {
  test('Debería fallar el login con credenciales inválidas', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        username: 'usuario_inexistente',
        password: 'password_incorrecta'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('mensaje');
  });
});