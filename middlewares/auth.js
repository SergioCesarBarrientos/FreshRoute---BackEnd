const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Middleware para verificar que el usuario esté logueado
const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token no proporcionado o formato inválido', 401);
    }

    // Extraer el token (quitando la palabra "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verificar el token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Guardar los datos del usuario en la request
    req.usuario = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Token inválido o expirado', 401));
    }
    next(error);
  }
};

// Middleware para verificar si es administrador
const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    return next();
  }
  next(new AppError('Acceso denegado. Se requiere rol de administrador.', 403));
};

module.exports = {
  verificarToken,
  esAdmin
};