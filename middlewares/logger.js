// ============================================
// MIDDLEWARE LOGGER
// Agregado por Miguel
// Registra cada solicitud en consola
// ============================================

function logger(req, res, next) {
    const fecha = new Date().toISOString();
    console.log(`[${fecha}] ${req.method} ${req.url}`);
    next();
}

module.exports = logger;