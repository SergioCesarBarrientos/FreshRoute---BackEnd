
const mongoose = require("mongoose");
const Cliente = require("../models/Cliente");

// ========================================
// FUNCIONES PARA LA API
// ========================================

// GET: obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los clientes",
      error: error.message
    });
  }
};

// GET: obtener un cliente por ID
const obtenerClientePorId = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del cliente no es válido"
      });
    }

    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al buscar el cliente",
      error: error.message
    });
  }
};

// POST: registrar un cliente
const crearCliente = async (req, res) => {
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
    res.status(400).json({
      mensaje: "Error al registrar el cliente",
      error: error.message
    });
  }
};

// PUT: actualizar un cliente
const actualizarCliente = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del cliente no es válido"
      });
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
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Cliente actualizado correctamente",
      cliente: clienteActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el cliente",
      error: error.message
    });
  }
};

// DELETE: eliminar un cliente
const eliminarCliente = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del cliente no es válido"
      });
    }

    const clienteEliminado = await Cliente.findByIdAndDelete(
      req.params.id
    );

    if (!clienteEliminado) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Cliente eliminado correctamente",
      cliente: clienteEliminado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al eliminar el cliente",
      error: error.message
    });
  }
};

// ========================================
// FUNCIONES PARA LAS VISTAS PUG
// ========================================

// Listar clientes
const obtenerClientesParaVista = async () => {
  return await Cliente.find().sort({ nombre: 1 });
};

// Buscar un cliente para editar
const obtenerClienteParaVista = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Cliente.findById(id);
};

// Crear cliente desde el formulario
const crearClienteParaVista = async (datos) => {
  const cliente = new Cliente({
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono
  });

  return await cliente.save();
};

// Actualizar cliente desde el formulario
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

// Eliminar cliente desde el formulario
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
