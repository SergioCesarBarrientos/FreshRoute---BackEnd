const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Producto = require('../models/Producto');
const Empleado = require('../models/Empleado');
const AppError = require('../utils/AppError');

const { ESTADOS } = Pedido;

// Roles que gestionan pedidos (crear, asignar, cancelar)
const ROLES_GESTION = ['superadmin', 'gerente', 'administrativo'];

// Estados a los que puede pasar un pedido desde cada estado.
const TRANSICIONES = {
  Asignado: ['En camino', 'Entregado', 'Cancelado', 'No Entregado'],
  'En camino': ['Entregado', 'Cancelado', 'No Entregado'],
  Entregado: [],
  Cancelado: [],
  'No Entregado': [],
};

// Límite de pedidos activos por repartidor
const LIMITE_PEDIDOS = 2;

const esIdValido = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));

// ========================================
// LÓGICA DE NEGOCIO
// ========================================

const armarItems = async (itemsEntrada) => {
  if (!Array.isArray(itemsEntrada) || itemsEntrada.length === 0) {
    throw new AppError('El pedido debe incluir al menos un producto', 400);
  }

  const cantidades = new Map();
  for (const item of itemsEntrada) {
    if (!esIdValido(item.producto)) {
      throw new AppError('Hay un producto con un ID no válido', 400);
    }
    const cantidad = Number(item.cantidad);
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      throw new AppError('La cantidad de cada producto debe ser un número entero mayor a 0', 400);
    }
    const clave = String(item.producto);
    cantidades.set(clave, (cantidades.get(clave) || 0) + cantidad);
  }

  const productos = await Producto.find({ _id: { $in: [...cantidades.keys()] } });
  if (productos.length !== cantidades.size) {
    throw new AppError('Alguno de los productos no existe', 404);
  }

  let total = 0;
  const items = productos.map((producto) => {
    const cantidad = cantidades.get(String(producto._id));
    if (cantidad > producto.stock) {
      throw new AppError(
        `Stock insuficiente de "${producto.nombre}": hay ${producto.stock} y se pidieron ${cantidad}`,
        400
      );
    }
    total += producto.precio * cantidad;
    return { producto: producto._id, cantidad, precioUnitario: producto.precio };
  });

  return { items, total };
};

const validarRepartidor = async (repartidorId) => {
  if (!repartidorId) {
    throw new AppError('El pedido debe tener un repartidor', 400);
  }
  if (!esIdValido(repartidorId)) {
    throw new AppError('El ID del repartidor no es válido', 400);
  }
  const repartidor = await Empleado.findById(repartidorId);
  if (!repartidor) {
    throw new AppError('Repartidor no encontrado', 404);
  }
  if (repartidor.rol !== 'repartidor') {
    throw new AppError('El empleado seleccionado no es un repartidor', 400);
  }
  if (repartidor.estado === 'Inactivo') {
    throw new AppError('El repartidor seleccionado está inactivo', 400);
  }

  // Contamos cuántos pedidos activos tiene
  const pedidosActivos = await Pedido.countDocuments({
    repartidor: repartidor._id,
    estado: { $in: ['Asignado', 'En camino'] }
  });

  if (pedidosActivos >= LIMITE_PEDIDOS) {
    throw new AppError(`El repartidor ya tiene ${LIMITE_PEDIDOS} pedidos activos y no puede recibir más`, 400);
  }

  return repartidor;
};

const actualizarEstadoRepartidor = async (repartidorId) => {
  if (!repartidorId) return;
  const repartidor = await Empleado.findById(repartidorId);
  if (!repartidor) return;

  const pedidosActivos = await Pedido.countDocuments({
    repartidor: repartidor._id,
    estado: { $in: ['Asignado', 'En camino'] }
  });

  repartidor.estado = pedidosActivos >= LIMITE_PEDIDOS ? 'Ocupado' : 'Disponible';
  await repartidor.save();
};

const crearPedidoParaVista = async (datos, usuario) => {
  if (!esIdValido(datos.cliente)) {
    throw new AppError('El ID del cliente no es válido', 400);
  }
  const cliente = await Cliente.findById(datos.cliente);
  if (!cliente) {
    throw new AppError('Cliente no encontrado', 404);
  }

  const repartidor = await validarRepartidor(datos.repartidor);
  const { items, total } = await armarItems(datos.items);

  const pedido = new Pedido({
    cliente: cliente._id,
    repartidor: repartidor._id,
    items,
    total,
    creadoPor: usuario ? usuario.id : undefined,
  });

  const pedidoGuardado = await pedido.save();
  await actualizarEstadoRepartidor(repartidor._id);

  return pedidoGuardado;
};

const obtenerEmpleadoDeUsuario = async (usuario) => {
  return await Empleado.findOne({ idUsuario: usuario.id });
};

const obtenerPedidosParaVista = async (usuario, filtros = {}) => {
  const consulta = {};
  if (filtros.estado && ESTADOS.includes(filtros.estado)) {
    consulta.estado = filtros.estado;
  }

  if (usuario.rol === 'repartidor') {
    const empleado = await obtenerEmpleadoDeUsuario(usuario);
    if (!empleado) return [];
    consulta.repartidor = empleado._id;
  }

  return await Pedido.find(consulta)
    .populate('cliente', 'nombre cuit telefono direccion')
    .populate('repartidor', 'nombre apellido')
    .populate('items.producto', 'nombre')
    .sort({ createdAt: -1 });
};

const obtenerPedidoParaVista = async (id, usuario) => {
  if (!esIdValido(id)) {
    throw new AppError('El ID del pedido no es válido', 400);
  }
  const pedido = await Pedido.findById(id)
    .populate('cliente', 'nombre cuit telefono direccion')
    .populate('repartidor', 'nombre apellido')
    .populate('items.producto', 'nombre');
  if (!pedido) {
    throw new AppError('Pedido no encontrado', 404);
  }

  if (usuario.rol === 'repartidor') {
    const empleado = await obtenerEmpleadoDeUsuario(usuario);
    const repartidorId = pedido.repartidor && (pedido.repartidor._id || pedido.repartidor);
    if (!empleado || String(repartidorId) !== String(empleado._id)) {
      throw new AppError('Este pedido no está asignado a vos', 403);
    }
  }
  return pedido;
};

const cambiarEstadoParaVista = async (id, nuevoEstado, usuario) => {
  if (!esIdValido(id)) {
    throw new AppError('El ID del pedido no es válido', 400);
  }
  if (!ESTADOS.includes(nuevoEstado)) {
    throw new AppError(`El estado "${nuevoEstado}" no es válido`, 400);
  }
  if (!ROLES_GESTION.includes(usuario.rol) && usuario.rol !== 'repartidor') {
    throw new AppError('No tenés permiso para cambiar el estado de un pedido', 403);
  }

  const pedido = await Pedido.findById(id);
  if (!pedido) {
    throw new AppError('Pedido no encontrado', 404);
  }
  if (!TRANSICIONES[pedido.estado].includes(nuevoEstado)) {
    throw new AppError(`No se puede pasar un pedido de "${pedido.estado}" a "${nuevoEstado}"`, 400);
  }

  if (usuario.rol === 'repartidor') {
    // ✅ CORREGIDO: ahora el repartidor puede marcar "No Entregado"
    if (!['En camino', 'Entregado', 'No Entregado'].includes(nuevoEstado)) {
      throw new AppError('Un repartidor solo puede marcar un pedido como "En camino", "Entregado" o "No Entregado"', 403);
    }
    const empleado = await obtenerEmpleadoDeUsuario(usuario);
    if (!empleado || String(pedido.repartidor) !== String(empleado._id)) {
      throw new AppError('Este pedido no está asignado a vos', 403);
    }
  }

  pedido.estado = nuevoEstado;
  const pedidoActualizado = await pedido.save();

  if (nuevoEstado === 'Entregado' || nuevoEstado === 'Cancelado' || nuevoEstado === 'No Entregado') {
    await actualizarEstadoRepartidor(pedido.repartidor);
  }

  return pedidoActualizado;
};

const obtenerDatosNuevoPedidoParaVista = async () => {
  const clientes = await Cliente.find().sort({ nombre: 1 });
  const productos = await Producto.find({ stock: { $gt: 0 } }).sort({ nombre: 1 });
  // Traemos a todos los repartidores que no estén inactivos (los Ocupados se verán deshabilitados en la vista)
  const repartidores = await Empleado.find({ rol: 'repartidor', estado: { $ne: 'Inactivo' } }).sort({ apellido: 1 });
  return { clientes, productos, repartidores };
};

// ========================================
// FUNCIONES PARA LA API
// ========================================

const obtenerPedidos = async (req, res, next) => {
  try {
    const pedidos = await obtenerPedidosParaVista(req.usuario, { estado: req.query.estado });
    res.status(200).json(pedidos);
  } catch (error) {
    next(error);
  }
};

const obtenerPedidoPorId = async (req, res, next) => {
  try {
    const pedido = await obtenerPedidoParaVista(req.params.id, req.usuario);
    res.status(200).json(pedido);
  } catch (error) {
    next(error);
  }
};

const crearPedido = async (req, res, next) => {
  try {
    const pedido = await crearPedidoParaVista(req.body, req.usuario);
    res.status(201).json({ mensaje: 'Pedido creado correctamente', pedido });
  } catch (error) {
    next(error);
  }
};

const actualizarEstadoPedido = async (req, res, next) => {
  try {
    const pedido = await cambiarEstadoParaVista(req.params.id, req.body.estado, req.usuario);
    
    // Si la petición viene del panel de repartidor, redirigimos a su vista
    if (req.usuario.rol === 'repartidor') {
      return res.redirect('/repartidores/entregas');
    }

    res.status(200).json({ mensaje: 'Estado actualizado correctamente', pedido });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido,
  obtenerPedidosParaVista,
  obtenerPedidoParaVista,
  crearPedidoParaVista,
  cambiarEstadoParaVista,
  obtenerDatosNuevoPedidoParaVista,
};