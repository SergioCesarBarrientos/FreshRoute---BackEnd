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

// Middleware para verificar si es gerente o superadmin
const esAdmin = (req, res, next) => {
  const rolesPermitidos = ['superadmin', 'gerente'];
  
  if (req.usuario && rolesPermitidos.includes(req.usuario.rol)) {
    return next();
  }
  
  next(new AppError('Acceso denegado. Se requiere rol de administrador o gerente.', 403));
};

module.exports = {
  verificarToken,
  esAdmin
};