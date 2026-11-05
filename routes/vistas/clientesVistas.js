const express = require("express");
const router = express.Router();
const clientesController = require("../../controllers/clientesController");

// Middleware para verificar si puede crear clientes (superadmin, gerente, administrativo)
const puedeCrearCliente = (req, res, next) => {
  const rolesPermitidos = ['superadmin', 'gerente', 'administrativo'];
  if (res.locals.usuarioLogueado && rolesPermitidos.includes(res.locals.usuarioLogueado.rol)) {
    return next();
  }
  return res.status(403).send("Acceso denegado. No tenés permiso para crear clientes.");
};

// Middleware para verificar si puede editar o eliminar clientes (solo superadmin y gerente)
const puedeEditarCliente = (req, res, next) => {
  const rolesPermitidos = ['superadmin', 'gerente'];
  if (res.locals.usuarioLogueado && rolesPermitidos.includes(res.locals.usuarioLogueado.rol)) {
    return next();
  }
  return res.status(403).send("Acceso denegado. No tenés permiso para editar o eliminar clientes.");
};

// Listar clientes (Cualquiera logueado puede ver)
router.get("/", async (req, res, next) => {
  try {
    const clientes = await clientesController.obtenerClientesParaVista();
    res.render("clientes/lista", { titulo: "Clientes", clientes });
  } catch (error) {
    next(error);
  }
});

// Formulario para crear cliente (Administrativo, Gerente y SuperAdmin)
router.get("/nuevo", puedeCrearCliente, (req, res) => {
  res.render("clientes/nuevo", { titulo: "Nuevo Cliente" });
});

// Guardar cliente (Administrativo, Gerente y SuperAdmin)
router.post("/guardar", puedeCrearCliente, async (req, res, next) => {
  try {
    await clientesController.crearClienteParaVista(req.body);
    res.redirect("/clientes");
  } catch (error) {
    next(error);
  }
});

// Formulario para editar cliente (Solo Gerente y SuperAdmin)
router.get("/editar/:id", puedeEditarCliente, async (req, res, next) => {
  try {
    const cliente = await clientesController.obtenerClienteParaVista(req.params.id);
    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }
    res.render("clientes/editar", { titulo: "Editar Cliente", cliente });
  } catch (error) {
    next(error);
  }
});

// Actualizar cliente (Solo Gerente y SuperAdmin)
router.post("/editar/:id", puedeEditarCliente, async (req, res, next) => {
  try {
    const cliente = await clientesController.actualizarClienteParaVista(req.params.id, req.body);
    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }
    res.redirect("/clientes");
  } catch (error) {
    next(error);
  }
});

// Eliminar cliente (Solo Gerente y SuperAdmin)
router.post("/eliminar/:id", puedeEditarCliente, async (req, res, next) => {
  try {
    const cliente = await clientesController.eliminarClienteParaVista(req.params.id);
    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }
    res.redirect("/clientes");
  } catch (error) {
    next(error);
  }
});

module.exports = router;