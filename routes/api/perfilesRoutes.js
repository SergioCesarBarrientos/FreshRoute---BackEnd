const express = require('express');
const router = express.Router();
const { verificarToken } = require('../../middlewares/auth');
const { cambiarPasswordAPI, actualizarDatosAPI } = require('../../controllers/usuariosController');

// PUT: Cambiar contraseña (Requiere token Bearer)
router.put('/cambiar-password', verificarToken, cambiarPasswordAPI);

// PUT: Actualizar teléfono y dirección (Requiere token Bearer)
router.put('/actualizar-datos', verificarToken, actualizarDatosAPI);

module.exports = router;