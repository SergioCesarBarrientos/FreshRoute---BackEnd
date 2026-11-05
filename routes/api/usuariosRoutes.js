const express = require('express');
const router = express.Router();

// Importar el controlador y el middleware de seguridad
const { login } = require('../../controllers/usuariosController');
const { verificarToken, esAdmin } = require('../../middlewares/auth');

// POST: Login (Público)
router.post('/login', login);

module.exports = router;