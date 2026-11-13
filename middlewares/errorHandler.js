// ========================================
// MIDDLEWARE CENTRAL DE MANEJO DE ERRORES
// ========================================
// Captura los errores que los controladores envían con next(error)
// y devuelve una respuesta JSON consistente.

const AppError = require("../utils/AppError");

const errorHandler = (error, req, res, next) => {
  // Si ya se enviaron headers, delegamos al handler por defecto de Express
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = 500;
  let mensaje = "Error interno del servidor";

  // 1) Error personalizado (AppError)
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    mensaje = error.message;
  }
  // 2) Error de validación de Mongoose (ej: campo requerido faltante)
  else if (error.name === "ValidationError") {
    statusCode = 400;
    mensaje = Object.values(error.errors)
      .map((e) => e.message)
      .join(", ");
  }
  // 3) Error de casteo (ej: ObjectId inválido en la URL)
  else if (error.name === "CastError") {
    statusCode = 400;
    mensaje = `El valor "${error.value}" no es válido para el campo "${error.path}"`;
  }
  // 4) Error de clave duplicada (ej: email único ya existe)
  else if (error.code === 11000) {
    statusCode = 400;
    const campo = Object.keys(error.keyValue || {}).join(", ");
    mensaje = `Ya existe un registro con ese valor en: ${campo}`;
  }
  // 5) Error de JSON mal formado (body-parser)
  else if (
    error.type === "entity.parse.failed" ||
    error instanceof SyntaxError
  ) {
    statusCode = 400;
    mensaje = "El cuerpo de la petición no es un JSON válido";
  }
  // 6) Error genérico con mensaje
  else if (error.message) {
    mensaje = error.message;
  }

  // Log del error en consola para debugging
  console.error(`[ERROR] ${req.method} ${req.url} → ${statusCode}: ${mensaje}`);

  res.status(statusCode).json({
    mensaje,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = errorHandler;
