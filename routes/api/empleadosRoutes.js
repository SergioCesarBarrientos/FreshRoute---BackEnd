const express = require('express');
const router = express.Router();
const { verificarToken, esAdmin } = require('../../middlewares/auth');
const empleadosController = require('../../controllers/empleadosController');

// GET: Obtener todos (Solo admin/gerente)
router.get('/', verificarToken, esAdmin, empleadosController.obtenerEmpleados);

// GET: Obtener uno por ID (Solo admin/gerente)
router.get('/:id', verificarToken, esAdmin, empleadosController.obtenerEmpleadoPorId);

// POST: Crear (Solo admin/gerente)
router.post('/', verificarToken, esAdmin, empleadosController.crearEmpleado);

// PUT: Actualizar (Solo admin/gerente)
router.put('/:id', verificarToken, esAdmin, empleadosController.actualizarEmpleado);

// DELETE: Eliminar (Solo admin/gerente)
router.delete('/:id', verificarToken, esAdmin, empleadosController.eliminarEmpleado);

module.exports = router;