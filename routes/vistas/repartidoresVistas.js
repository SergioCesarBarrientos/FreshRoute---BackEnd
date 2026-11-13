// routes/vistas/repartidoresVistas.js
const express = require('express');
const router = express.Router();

// Ruta para renderizar la vista de entregas del repartidor
router.get('/entregas', (req, res) => {
  res.render('repartidores/entregas', { 
    titulo: 'Panel de Entregas' 
  });
});

module.exports = router;