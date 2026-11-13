const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Middleware para verificar que el usuario esté logueado
const verificarToken = (req, res, next) => {
  try {
    // 1. Si el app.js ya leyó la cookie y cargó el usuario en res.locals, lo aprovechamos directamente
    if (res.locals && res.locals.usuarioLogueado) {
      req.usuario = res.locals.usuarioLogueado;
      return next();
    }

    // 2. Si no, intentamos buscar el token en el header tradicional (para APIs o Postman)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Si es una petición web de vistas, redirigimos al login en lugar de tirar error JSON
      if (req.originalUrl.includes('/repartidores/') || !req.originalUrl.startsWith('/api/')) {
        return res.redirect('/login');
      }
      throw new AppError('Token no proporcionado o formato inválido', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    req.usuario = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      if (req.originalUrl.includes('/repartidores/') || !req.originalUrl.startsWith('/api/')) {
        return res.redirect('/login');
      }
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