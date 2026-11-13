const express = require('express');
const router = express.Router();
const Empleado = require('../../models/Empleado');
const { obtenerPedidosParaVista } = require('../../controllers/pedidosController');
const { verificarToken } = require('../../middlewares/auth'); // Usamos tu middleware oficial

router.get('/entregas', verificarToken, async (req, res, next) => {
  try {
    // El middleware 'verificarToken' ya descifró el token y dejó al usuario en req.usuario
    const usuario = req.usuario;

    if (!usuario) {
      return res.redirect('/login');
    }

    // Buscamos el empleado asociado
    const empleado = await Empleado.findOne({ idUsuario: usuario.id || usuario._id });

    // Obtenemos los pedidos asignados a este usuario
    const pedidos = await obtenerPedidosParaVista(usuario);

    // Calculamos los contadores para el resumen del día
    const resumen = {
      entregados: pedidos.filter(p => p.estado === 'Entregado').length,
      enRuta: pedidos.filter(p => p.estado === 'En camino').length,
      pendientes: pedidos.filter(p => !p.estado || p.estado === 'Asignado').length,
      incidencia: pedidos.filter(p => p.estado === 'Cancelado' || p.estado === 'No Entregado').length,
    };

    // Renderizamos la vista pasando toda la info
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

module.exports = router;