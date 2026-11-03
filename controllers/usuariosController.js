const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// POST: Registrar un nuevo usuario
const registrarUsuario = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      throw new AppError('Faltan datos obligatorios (nombre, email, password)', 400);
    }

    // Hashear la contraseña (seguridad)
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

// POST: Login de usuario
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Faltan datos obligatorios (email, password)', 400);
    }

    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Verificar la contraseña con bcrypt
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Crear el token JWT
    const userForToken = {
      id: usuario._id,
      email: usuario.email,
      rol: usuario.rol
    };

    // SEGURIDAD: El token expira a los 15 minutos ('15m').
    // Si el usuario no hace nada en ese tiempo, debe volver a loguearse.
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

module.exports = {
  registrarUsuario,
  login
};