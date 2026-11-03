const express = require('express');
const router = express.Router();
const { verificarToken, esAdmin } = require('../middlewares/auth');

// Importar las funciones del controller de clientes
const {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/clientesController');

// GET: Obtener todos los clientes (Público)
router.get('/', obtenerClientes);

// GET: Obtener un cliente por su ID (Público)
router.get('/:id', obtenerClientePorId);

// POST: Registrar un nuevo cliente (Protegido)
router.post('/', verificarToken, esAdmin, crearCliente);

// PUT: Actualizar un cliente por su ID (Protegido)
router.put('/:id', verificarToken, esAdmin, actualizarCliente);

// DELETE: Eliminar un cliente por su ID (Protegido)
router.delete('/:id', verificarToken, esAdmin, eliminarCliente);

// Exportar las rutas
module.exports = router;