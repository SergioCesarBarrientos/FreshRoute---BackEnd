process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');
const connectDB = require('../config/connectDB');
const Usuario = require('../models/Usuario');

jest.setTimeout(15000);

let token;

beforeAll(async () => {
  await connectDB();
  
  let user = await Usuario.findOne({ username: 'testadmin' });
  if (!user) {
    const passHash = await bcrypt.hash('123', 10);
    user = new Usuario({
      username: 'testadmin',
      email: 'testadmin@freshroute.com',
      password: passHash,
      rol: 'superadmin',
      activo: true
    });
    await user.save();
  }

  const loginRes = await request(app)
    .post('/api/usuarios/login')
    .send({ username: 'testadmin', password: '123' });
    
  token = loginRes.body.token;
});

afterAll(async () => {
  await Usuario.deleteOne({ username: 'testadmin' });
  await mongoose.connection.close();
});

describe('Pruebas de Clientes', () => {
  test('Debería obtener la lista de clientes con un token válido', async () => {
    const response = await request(app)
      .get('/api/clientes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});