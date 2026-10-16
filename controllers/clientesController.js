const mongoose = require("mongoose");
const Cliente = require("../models/Cliente");
const AppError = require("../utils/AppError");

// ========================================
// FUNCIONES PARA LA API
// ========================================

// GET: obtener todos los clientes
const obtenerClientes = async (req, res, next) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};

// GET: obtener un cliente por ID
const obtenerClientePorId = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError("El ID del cliente no es válido", 400);
    }

    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      throw new AppError("Cliente no encontrado", 404);
    }

    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
};

// POST: registrar un cliente
const crearCliente = async (req, res, next) => {
  try {
    const nuevoCliente = new Cliente({
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono
    });

    const clienteGuardado = await nuevoCliente.save();

    res.status(201).json({
      mensaje: "Cliente registrado correctamente",
      cliente: clienteGuardado
    });
  } catch (error) {
    next(error);
  }
};

// PUT: actualizar un cliente
const actualizarCliente = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError("El ID del cliente no es válido", 400);
    }

    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!clienteActualizado) {
      throw new AppError("Cliente no encontrado", 404);
    }

    res.status(200).json({
      mensaje: "Cliente actualizado correctamente",
      cliente: clienteActualizado
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: eliminar un cliente
const eliminarCliente = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError("El ID del cliente no es válido", 400);
    }

    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);

    if (!clienteEliminado) {
      throw new AppError("Cliente no encontrado", 404);
    }

    res.status(200).json({
      mensaje: "Cliente eliminado correctamente",
      cliente: clienteEliminado
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// FUNCIONES PARA LAS VISTAS PUG
// ========================================

const obtenerClientesParaVista = async () => {
  return await Cliente.find().sort({ nombre: 1 });
};

const obtenerClienteParaVista = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Cliente.findById(id);
};

const crearClienteParaVista = async (datos) => {
  const cliente = new Cliente({
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono
  });

  return await cliente.save();
};

const actualizarClienteParaVista = async (id, datos) => {
  if (!mongoose.isValidObjectId(id)) return null;

  return await Cliente.findByIdAndUpdate(
    id,
    {
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono
    },
    {
      new: true,
      runValidators: true
    }
  );
};

const eliminarClienteParaVista = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Cliente.findByIdAndDelete(id);
};

// ========================================
// EXPORTAR TODAS LAS FUNCIONES
// ========================================

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerClientesParaVista,
  obtenerClienteParaVista,
  crearClienteParaVista,
  actualizarClienteParaVista,
  eliminarClienteParaVista
};