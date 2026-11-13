const express = require('express');
const router = express.Router();
const Empleado = require('../../models/Empleado');
const { obtenerPedidosParaVista, obtenerPedidoParaVista } = require('../../controllers/pedidosController');
const { verificarToken } = require('../../middlewares/auth');

// Ruta para ver el panel de entregas
router.get('/entregas', verificarToken, async (req, res, next) => {
  try {
    const usuario = req.usuario;

    if (!usuario) {
      return res.redirect('/login');
    }

    const empleado = await Empleado.findOne({ idUsuario: usuario.id || usuario._id });
    const pedidos = await obtenerPedidosParaVista(usuario);

    const resumen = {
      entregados: pedidos.filter(p => p.estado === 'Entregado').length,
      enRuta: pedidos.filter(p => p.estado === 'En camino').length,
      pendientes: pedidos.filter(p => !p.estado || p.estado === 'Asignado').length,
      incidencia: pedidos.filter(p => p.estado === 'Cancelado' || p.estado === 'No Entregado').length,
    };

    res.render('repartidores/entregas', { 
      titulo: 'Panel de Entregas',
      usuario: empleado || usuario,
      pedidos,
      resumen 
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para ver el detalle de un pedido (solo si es suyo)
router.get('/detalle/:id', verificarToken, async (req, res, next) => {
  try {
    const pedido = await obtenerPedidoParaVista(req.params.id, req.usuario);
    res.render('pedidos/detalle', { titulo: 'Detalle del Pedido', pedido });
  } catch (error) {
    next(error);
  }
});

module.exports = router;