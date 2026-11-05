const Usuario = require('../models/Usuario');
const Empleado = require('../models/Empleado');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// ========================================
// LOGIN
// ========================================

const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      throw new AppError('Faltan datos obligatorios (email/username, password)', 400);
    }

    const usuario = await Usuario.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }]
    });

    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      throw new AppError('Credenciales inválidas', 401);
    }

    if (usuario.activo === false) {
      throw new AppError('Tu cuenta está desactivada. Contactá al administrador.', 403);
    }

    const userForToken = {
      id: usuario._id,
      username: usuario.username,
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
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// CAMBIO DE CONTRASEÑA DESDE LA API
// ========================================

const cambiarPasswordAPI = async (req, res, next) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const resultado = await cambiarPasswordPerfil(req.usuario.id, passwordActual, passwordNueva);

    if (resultado === false) {
      throw new AppError('La contraseña actual es incorrecta', 400);
    }
    if (resultado === null) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    next(error);
  }
};

// ========================================
// ACTUALIZAR DATOS PERSONALES DESDE LA API
// ========================================

const actualizarDatosAPI = async (req, res, next) => {
  try {
    const { telefono, direccion } = req.body;
    const empleadoActualizado = await actualizarDatosPerfil(req.usuario.id, { telefono, direccion });

    if (!empleadoActualizado) {
      throw new AppError('Empleado no encontrado', 404);
    }

    res.status(200).json({ 
      mensaje: 'Datos actualizados correctamente',
      empleado: empleadoActualizado
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// FUNCIONES PARA LAS VISTAS (CRUD)
// ========================================

const obtenerUsuariosParaVista = async () => {
  return await Usuario.find().sort({ username: 1 });
};

const obtenerUsuarioParaVista = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Usuario.findById(id);
};

const actualizarUsuarioParaVista = async (id, datos) => {
  if (!mongoose.isValidObjectId(id)) return null;

  const { username, email, rol, password } = datos;

  const datosAActualizar = { username, email, rol };

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
// FUNCIONES DE ACCESO (BAJA Y RESTABLECER)
// ========================================

const cambiarEstadoUsuario = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  const usuario = await Usuario.findById(id);
  if (!usuario) return null;

  usuario.activo = !usuario.activo;
  return await usuario.save();
};

const restablecerPassword = async (idUsuario) => {
  if (!mongoose.isValidObjectId(idUsuario)) return null;

  const empleado = await Empleado.findOne({ idUsuario });
  if (!empleado) return null;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(empleado.dni, saltRounds);

  return await Usuario.findByIdAndUpdate(
    idUsuario,
    { password: passwordHash },
    { new: true }
  );
};

// ========================================
// CAMBIO DE CONTRASEÑA DESDE EL PERFIL (VISTAS)
// ========================================

const cambiarPasswordPerfil = async (idUsuario, passwordActual, passwordNueva) => {
  if (!mongoose.isValidObjectId(idUsuario)) return null;

  const usuario = await Usuario.findById(idUsuario);
  if (!usuario) return null;

  const passwordCorrecta = await bcrypt.compare(passwordActual, usuario.password);
  if (!passwordCorrecta) return false;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(passwordNueva, saltRounds);
  
  await Usuario.findByIdAndUpdate(idUsuario, { password: passwordHash });
  return true;
};

// ========================================
// ACTUALIZAR DATOS PERSONALES DESDE EL PERFIL (VISTAS)
// ========================================

const actualizarDatosPerfil = async (idUsuario, datos) => {
  if (!mongoose.isValidObjectId(idUsuario)) return null;

  const empleado = await Empleado.findOne({ idUsuario });
  if (!empleado) return null;

  // Solo permitimos actualizar teléfono y dirección
  if (datos.telefono) empleado.telefono = datos.telefono;
  if (datos.direccion) empleado.direccion = datos.direccion;

  return await empleado.save();
};

// ========================================
// MIDDLEWARE DE AUTORIZACIÓN
// ========================================
const verificarAdminVista = (req, res, next) => {
  const rolesPermitidos = ['superadmin', 'gerente'];
  if (res.locals.usuarioLogueado && rolesPermitidos.includes(res.locals.usuarioLogueado.rol)) {
    return next();
  }
  return res.status(403).send("Acceso denegado. Solo los gerentes o superadmins pueden gestionar usuarios.");
};

// ========================================
// EXPORTAR TODO
// ========================================

module.exports = {
  login,
  cambiarPasswordAPI,
  actualizarDatosAPI,
  obtenerUsuariosParaVista,
  obtenerUsuarioParaVista,
  actualizarUsuarioParaVista,
  eliminarUsuarioParaVista,
  cambiarEstadoUsuario,
  restablecerPassword,
  cambiarPasswordPerfil,
  actualizarDatosPerfil,
  verificarAdminVista
};