const Empleado = require('../models/Empleado');
const Pedido = require('../models/Pedido'); // Ajusta según el nombre de tu modelo de pedidos

const obtenerEntregasRepartidor = async (req, res, next) => {
  try {
    // Obtenemos el ID del usuario logueado (dependiendo de cómo guardes la sesión o el token)
    const idUsuario = req.usuario ? req.usuario.id : req.session?.usuarioId;

    // Buscamos al empleado asociado a este usuario
    const empleado = await Empleado.findOne({ idUsuario });
    
    if (!empleado) {
      return res.status(404).send('No se encontró el perfil de empleado para este usuario.');
    }

    // Buscamos los pedidos/entregas asignados a este repartidor
    // (Asegúrate de que tu modelo Pedido tenga un campo que relacione al repartidor o empleado)
    const entregas = await Pedido.find({ repartidor: empleado._id });

    // Renderizamos la vista entregas.pug pasando los datos
    res.render('repartidores/entregas', { 
      titulo: 'Panel de Entregas',
      empleado,
      entregas 
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerEntregasRepartidor
};