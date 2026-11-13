const express = require('express');
const router = express.Router();
const { obtenerEntregasRepartidor } = require('../controllers/repartidoresController');

// Ruta GET para mostrar la vista de entregas
router.get('/entregas', obtenerEntregasRepartidor);

module.exports = router;