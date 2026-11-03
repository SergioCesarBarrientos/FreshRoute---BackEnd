const express = require("express");
const router = express.Router();
const clientesController = require("../../controllers/clientesController");

// Listar clientes
router.get("/", async (req, res, next) => {
  try {
    const clientes = await clientesController.obtenerClientesParaVista();

    res.render("clientes/lista", {
      titulo: "Clientes",
      clientes
    });
  } catch (error) {
    next(error);
  }
});

// Formulario para crear cliente
router.get("/nuevo", (req, res) => {
  res.render("clientes/nuevo", {
    titulo: "Nuevo Cliente"
  });
});

// Formulario para editar cliente
router.get("/editar/:id", async (req, res, next) => {
  try {
    const cliente = await clientesController.obtenerClienteParaVista(req.params.id);

    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }

    res.render("clientes/editar", {
      titulo: "Editar Cliente",
      cliente
    });
  } catch (error) {
    next(error);
  }
});

// Guardar cliente
router.post("/guardar", async (req, res, next) => {
  try {
    console.log("Datos recibidos del formulario:", req.body);

    const cliente = await clientesController.crearClienteParaVista(req.body);

    console.log("Cliente guardado correctamente:", cliente._id);

    res.redirect("/clientes");
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    next(error);
  }
});

// Actualizar cliente
router.post("/editar/:id", async (req, res, next) => {
  try {
    const cliente = await clientesController.actualizarClienteParaVista(
      req.params.id,
      req.body
    );

    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }

    res.redirect("/clientes");
  } catch (error) {
    next(error);
  }
});

// Eliminar cliente
router.post("/eliminar/:id", async (req, res, next) => {
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