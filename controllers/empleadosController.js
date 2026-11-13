const Empleado = require('../models/Empleado');
const Usuario = require('../models/Usuario');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');

// ========================================
// FUNCIONES PARA LA API (JSON)
// ========================================

const obtenerEmpleados = async (req, res, next) => {
  try {
    // Filtro opcional por rol (ej: /api/empleados?rol=repartidor)
    const { rol } = req.query;
    let query = {};
    if (rol && rol !== 'todos') {
      query.rol = rol;
    }
    const empleados = await Empleado.find(query).populate('idUsuario', 'username email rol');
    res.status(200).json(empleados);
  } catch (error) {
    next(error);
  }
};

const obtenerEmpleadoPorId = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError("El ID del empleado no es válido", 400);
    }
    const empleado = await Empleado.findById(req.params.id).populate('idUsuario', 'username email rol');
    if (!empleado) {
      throw new AppError("Empleado no encontrado", 404);
    }
    res.status(200).json(empleado);
  } catch (error) {
    next(error);
  }
};

const crearEmpleado = async (req, res, next) => {
  try {
    const { nombre, apellido, dni, telefono, direccion, rol, legajo, vehiculo, patente } = req.body;

    let baseUsername = (nombre.charAt(0) + apellido).toLowerCase().replace(/\s+/g, '');
    let username = baseUsername;
    let contador = 1;
    while (await Usuario.findOne({ username })) {
      username = baseUsername + contador;
      contador++;
    }

    const email = `${username}@freshroute.com`;
    const passwordHash = await bcrypt.hash(dni, 10);

    const nuevoUsuario = new Usuario({ username, email, password: passwordHash, rol });
    const usuarioGuardado = await nuevoUsuario.save();

    const nuevoEmpleado = new Empleado({
      nombre, 
      apellido, 
      email: email,
      dni, 
      telefono, 
      direccion, 
      rol,
      legajo: legajo || undefined,
      vehiculo: vehiculo || undefined,
      patente: patente || undefined,
      idUsuario: usuarioGuardado._id
    });

    const empleadoGuardado = await nuevoEmpleado.save();

    res.status(201).json({
      mensaje: "Empleado y Usuario creados correctamente",
      empleado: empleadoGuardado,
      credenciales: { username, email, passwordGenerica: dni }
    });
  } catch (error) {
    next(error);
  }
};

const actualizarEmpleado = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError("El ID del empleado no es válido", 400);
    }
    
    const empleadoActualizado = await Empleado.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!empleadoActualizado) {
      throw new AppError("Empleado no encontrado", 404);
    }

    if (req.body.rol) {
      await Usuario.findByIdAndUpdate(
        empleadoActualizado.idUsuario,
        { rol: req.body.rol }
      );
    }

    res.status(200).json(empleadoActualizado);
  } catch (error) {
    next(error);
  }
};

const eliminarEmpleado = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError("El ID del empleado no es válido", 400);
    }
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      throw new AppError("Empleado no encontrado", 404);
    }
    await Usuario.findByIdAndDelete(empleado.idUsuario);
    await Empleado.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ mensaje: "Empleado y Usuario eliminados correctamente" });
  } catch (error) {
    next(error);
  }
};

// ========================================
// FUNCIONES PARA LAS VISTAS (CRUD)
// ========================================

const obtenerEmpleadosParaVista = async (filtroRol) => {
  let query = {};
  if (filtroRol && filtroRol !== 'todos') {
    query.rol = filtroRol;
  }
  return await Empleado.find(query).populate('idUsuario', 'username email rol').sort({ apellido: 1 });
};

const obtenerEmpleadoParaVista = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Empleado.findById(id).populate('idUsuario', 'username email rol');
};

const crearEmpleadoParaVista = async (datos) => {
  const { nombre, apellido, dni, telefono, direccion, rol, legajo, vehiculo, patente } = datos;

  let baseUsername = (nombre.charAt(0) + apellido).toLowerCase().replace(/\s+/g, '');
  let username = baseUsername;
  let contador = 1;
  while (await Usuario.findOne({ username })) {
    username = baseUsername + contador;
    contador++;
  }

  const email = `${username}@freshroute.com`;
  const passwordHash = await bcrypt.hash(dni, 10);

  const nuevoUsuario = new Usuario({ username, email, password: passwordHash, rol });
  const usuarioGuardado = await nuevoUsuario.save();

  const nuevoEmpleado = new Empleado({
    nombre, 
    apellido, 
    email: email,
    dni, 
    telefono, 
    direccion, 
    rol,
    legajo: legajo || undefined,
    vehiculo: vehiculo || undefined,
    patente: patente || undefined,
    idUsuario: usuarioGuardado._id
  });

  return await nuevoEmpleado.save();
};

const actualizarEmpleadoParaVista = async (id, datos) => {
  if (!mongoose.isValidObjectId(id)) return null;

  const empleadoActualizado = await Empleado.findByIdAndUpdate(
    id,
    datos,
    { new: true, runValidators: true }
  );

  if (!empleadoActualizado) return null;

  if (datos.rol) {
    await Usuario.findByIdAndUpdate(
      empleadoActualizado.idUsuario,
      { rol: datos.rol }
    );
  }

  return empleadoActualizado;
};

const eliminarEmpleadoParaVista = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  
  const empleado = await Empleado.findById(id);
  if (!empleado) return null;

  await Usuario.findByIdAndDelete(empleado.idUsuario);
  return await Empleado.findByIdAndDelete(id);
};

// ========================================
// EXPORTAR
// ========================================

module.exports = {
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerEmpleadosParaVista,
  obtenerEmpleadoParaVista,
  crearEmpleadoParaVista,
  actualizarEmpleadoParaVista,
  eliminarEmpleadoParaVista
};