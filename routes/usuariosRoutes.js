const express = require('express');
const router = express.Router();

// Importar el controlador
const { registrarUsuario, login } = require('../controllers/usuariosController');

// POST: Registrar usuario
router.post('/registro', registrarUsuario);

// POST: Login
router.post('/login', login);

module.exports = router;