
const express = require('express');
const router = express.Router();

// Importar las funciones del controller de clientes
const {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/clientesController');

// GET: Obtener todos los clientes
router.get('/', obtenerClientes);

// GET: Obtener un cliente por su ID
router.get('/:id', obtenerClientePorId);

// POST: Registrar un nuevo cliente
router.post('/', crearCliente);

// PUT: Actualizar un cliente por su ID
router.put('/:id', actualizarCliente);

// DELETE: Eliminar un cliente por su ID
router.delete('/:id', eliminarCliente);

// Exportar las rutas
module.exports = router;
