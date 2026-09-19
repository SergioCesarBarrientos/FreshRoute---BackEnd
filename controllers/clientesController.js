const fs = require("fs");
const path = require("path");
const Cliente = require("../models/Cliente");

const clientesPath = path.join(__dirname, "..", "data", "clientes.json");

// Leer clientes
function leerClientes() {
  const datos = fs.readFileSync(clientesPath, "utf-8");
  return JSON.parse(datos);
}

// Guardar clientes
function guardarClientes(clientes) {
  fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));
}

// GET /clientes
function obtenerClientes(req, res) {
  try {
    const clientes = leerClientes();

    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los clientes",
    });
  }
}

// POST /clientes
function crearCliente(req, res) {
  try {
    const { nombre, telefono, email } = req.body;

    // Validar campos obligatorios
    if (!nombre || !telefono || !email) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Validar tipos
    if (
      typeof nombre !== "string" ||
      typeof telefono !== "string" ||
      typeof email !== "string"
    ) {
      return res.status(400).json({
        error: "Los datos ingresados no tienen un formato válido",
      });
    }

    const clientes = leerClientes();

    // Generar nuevo ID
    const nuevoId =
      clientes.length > 0
        ? Math.max(...clientes.map((cliente) => cliente.id)) + 1
        : 1;

    // Crear objeto utilizando la clase Cliente
    const nuevoCliente = new Cliente({
      id: nuevoId,
      nombre: nombre,
      email: email,
      telefono: telefono,
    });

    //clientes.push(nuevoCliente);
    clientes.push(nuevoCliente.toJSON());

    guardarClientes(clientes);

    res.status(201).json({
      mensaje: "Cliente creado correctamente",
      cliente: nuevoCliente,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear el cliente",
    });
  }
}

// GET /clientes/:id
function obtenerClientePorId(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const clientes = leerClientes();

    const cliente = clientes.find((cliente) => cliente.id === id);

    if (!cliente) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar el cliente",
    });
  }
}

// PUT /clientes/:id
function actualizarCliente(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const { nombre, telefono, email } = req.body;

    if (!nombre || !telefono || !email) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    if (
      typeof nombre !== "string" ||
      typeof telefono !== "string" ||
      typeof email !== "string"
    ) {
      return res.status(400).json({
        error: "Los datos ingresados no tienen un formato válido",
      });
    }

    const clientes = leerClientes();

    const indice = clientes.findIndex((cliente) => cliente.id === id);

    if (indice === -1) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    clientes[indice].nombre = nombre;
    clientes[indice].telefono = telefono;
    clientes[indice].email = email;

    guardarClientes(clientes);

    res.status(200).json({
      mensaje: "Cliente actualizado correctamente",
      cliente: clientes[indice],
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar el cliente",
    });
  }
}

// DELETE /clientes/:id
function eliminarCliente(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const clientes = leerClientes();

    const indice = clientes.findIndex((cliente) => cliente.id === id);

    if (indice === -1) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    clientes.splice(indice, 1);

    guardarClientes(clientes);

    res.status(200).json({
      mensaje: "Cliente eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el cliente",
    });
  }
}

// ============================================
// FUNCIÓN PARA VISTAS
// Agregado por Miguel para que funcione la vista clientes/lista.pug
// ============================================
function obtenerClientesParaVista() {
  return leerClientes();
}

function obtenerClienteParaVista(id) {
  const clientes = leerClientes();
  return clientes.find((c) => c.id === Number(id)) || null;
}

function crearClienteParaVista(datos) {
  const clientes = leerClientes();
  const nuevoId =
    clientes.length > 0 ? Math.max(...clientes.map((c) => c.id)) + 1 : 1;
  const nuevoCliente = {
    id: nuevoId,
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono,
  };
  clientes.push(nuevoCliente);
  guardarClientes(clientes);
  return nuevoCliente;
}

function actualizarClienteParaVista(id, datos) {
  const clientes = leerClientes();
  const indice = clientes.findIndex((c) => c.id === Number(id));
  if (indice === -1) return null;
  clientes[indice].nombre = datos.nombre;
  clientes[indice].email = datos.email;
  clientes[indice].telefono = datos.telefono;
  guardarClientes(clientes);
  return clientes[indice];
}

function eliminarClienteParaVista(id) {
  const clientes = leerClientes();
  const indice = clientes.findIndex((c) => c.id === Number(id));
  if (indice === -1) return false;
  clientes.splice(indice, 1);
  guardarClientes(clientes);
  return true;
}

module.exports = {
  obtenerClientes,
  crearCliente,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
  //funciones para las vistas
  obtenerClientesParaVista,
  obtenerClienteParaVista,
  crearClienteParaVista,
  actualizarClienteParaVista,
  eliminarClienteParaVista,
};
