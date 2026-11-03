const Usuario = require('../models/Usuario');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// ========================================
// FUNCIONES PARA LA API (JSON)
// ========================================

const registrarUsuario = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      throw new AppError('Faltan datos obligatorios (nombre, email, password)', 400);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      rol: rol || 'administrativo'
    });

    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: usuarioGuardado
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Faltan datos obligatorios (email, password)', 400);
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const userForToken = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: '15m' 
    });

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// FUNCIONES PARA LAS VISTAS (CRUD)
// ========================================

const obtenerUsuariosParaVista = async () => {
  return await Usuario.find().sort({ nombre: 1 });
};

const obtenerUsuarioParaVista = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Usuario.findById(id);
};

const crearUsuarioParaVista = async (datos) => {
  const { nombre, email, password, rol } = datos;
  
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const nuevoUsuario = new Usuario({
    nombre,
    email,
    password: passwordHash,
    rol: rol || 'administrativo'
  });

  return await nuevoUsuario.save();
};

const actualizarUsuarioParaVista = async (id, datos) => {
  if (!mongoose.isValidObjectId(id)) return null;

  const { nombre, email, rol, password } = datos;

  // Armamos el objeto con los datos básicos
  const datosAActualizar = { nombre, email, rol };

  // Si el usuario escribió una nueva contraseña, la hasheamos
  if (password && password.trim() !== "") {
    const saltRounds = 10;
    datosAActualizar.password = await bcrypt.hash(password, saltRounds);
  }

  return await Usuario.findByIdAndUpdate(
    id,
    datosAActualizar,
    { new: true, runValidators: true }
  );
};

const eliminarUsuarioParaVista = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Usuario.findByIdAndDelete(id);
};

// ========================================
// MIDDLEWARE DE AUTORIZACIÓN (Solo Admin)
// ========================================
const verificarAdminVista = (req, res, next) => {
  if (res.locals.usuarioLogueado && res.locals.usuarioLogueado.rol === 'admin') {
    return next();
  }
  return res.status(403).send("Acceso denegado. Solo los administradores pueden gestionar usuarios.");
};

// ========================================
// EXPORTAR TODO
// ========================================

module.exports = {
  registrarUsuario,
  login,
  obtenerUsuariosParaVista,
  obtenerUsuarioParaVista,
  crearUsuarioParaVista,
  actualizarUsuarioParaVista,
  eliminarUsuarioParaVista,
  verificarAdminVista
};