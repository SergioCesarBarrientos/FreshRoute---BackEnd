const jwt = require('jsonwebtoken');

const verificarSesionVista = (req, res, next) => {
  // Si estamos en el login o logout, dejamos pasar
  if (req.path === '/login' || req.path === '/logout') {
    return next();
  }

  // Si no hay cookie, al login
  if (!req.headers.cookie) {
    return res.redirect('/login');
  }

  // Buscar el token en la cookie
  const tokenCookie = req.headers.cookie.split('; ').find(row => row.startsWith('token='));
  
  if (!tokenCookie) {
    return res.redirect('/login');
  }

  // Verificar que el token sea válido
  try {
    const token = tokenCookie.split('=')[1];
    jwt.verify(token, process.env.SECRET);
    next(); // Token válido, dejamos pasar
  } catch (err) {
    // Token vencido o inválido
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

module.exports = verificarSesionVista;