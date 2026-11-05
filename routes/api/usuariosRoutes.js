const express = require('express');
const router = express.Router();

// Importar el controlador y el middleware de seguridad
const { login, cambiarPasswordAPI } = require('../../controllers/usuariosController');
const { verificarToken } = require('../../middlewares/auth');

// POST: Login (Público)
router.post('/login', login);

// PUT: Cambiar contraseña (Requiere estar logueado con token Bearer)
router.put('/cambiar-password', verificarToken, cambiarPasswordAPI);

module.exports = router;