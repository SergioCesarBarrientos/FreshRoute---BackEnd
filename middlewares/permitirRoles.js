// Middlewares para permitir una ruta solo a ciertos roles.
// Se usan después de verificar la sesión: verificarToken (API) o verificarSesionVista (vistas).

const AppError = require('../utils/AppError');

// Para la API: lee el rol del token (req.usuario) y responde 403 con JSON si no corresponde.
const permitirRoles = (...roles) => (req, res, next) => {
  if (req.usuario && roles.includes(req.usuario.rol)) {
    return next();
  }
  next(new AppError('Acceso denegado. No tenés permiso para realizar esta acción.', 403));
};

// Para las vistas: lee el rol de la cookie (res.locals.usuarioLogueado) y responde 403 con texto.
const permitirRolesVista = (...roles) => (req, res, next) => {
  const usuario = res.locals.usuarioLogueado;
  if (usuario && roles.includes(usuario.rol)) {
    return next();
  }
  res.status(403).send('Acceso denegado. No tenés permiso para acceder a esta pantalla.');
};

module.exports = { permitirRoles, permitirRolesVista };
