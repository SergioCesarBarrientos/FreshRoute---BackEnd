const express = require('express');
const router = express.Router();
const { verificarToken } = require('../../middlewares/auth');
const { permitirRoles } = require('../../middlewares/permitirRoles');

const {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido
} = require('../../controllers/pedidosController');

// Roles que crean pedidos
const gestion = permitirRoles('superadmin', 'gerente', 'administrativo');

// GET: listar pedidos (el repartidor solo ve los suyos)
router.get('/', verificarToken, obtenerPedidos);

// GET: obtener un pedido por su ID
router.get('/:id', verificarToken, obtenerPedidoPorId);

// POST: crear un pedido (Superadmin, Gerente, Administrativo)
router.post('/', verificarToken, gestion, crearPedido);

// PUT: cambiar el estado (el controller valida qué puede hacer cada rol)
router.post('/:id/estado', verificarToken, actualizarEstadoPedido);

module.exports = router;
