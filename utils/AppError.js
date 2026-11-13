// ========================================
// CLASE DE ERROR PERSONALIZADA
// ========================================
// Permite tirar errores con un código HTTP asociado.
// Ejemplo: throw new AppError('Cliente no encontrado', 404);

class AppError extends Error {
  constructor(mensaje, statusCode) {
    super(mensaje);
    this.statusCode = statusCode || 500;
    this.isOperational = true;

    // Captura el stack trace sin incluir esta clase
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;