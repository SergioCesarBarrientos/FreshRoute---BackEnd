const express = require("express");
const router = express.Router();
const productosController = require("../../controllers/productosController");
const { verificarAdminVista } = require("../../controllers/usuariosController");

// Listar productos (Cualquiera logueado puede ver)
router.get("/", async (req, res, next) => {
  try {
    const productos = await productosController.obtenerProductosParaVista();
    res.render("productos/lista", { titulo: "Productos", productos });
  } catch (error) {
    next(error);
  }
});

// Formulario para crear producto (Solo SuperAdmin y Gerente)
router.get("/nuevo", verificarAdminVista, (req, res) => {
  res.render("productos/nuevo", { titulo: "Nuevo Producto" });
});

// Guardar producto (Solo SuperAdmin y Gerente)
router.post("/guardar", verificarAdminVista, async (req, res, next) => {
  try {
    await productosController.crearProductoParaVista(req.body);
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al guardar producto:", error);
    next(error);
  }
});

// Formulario para editar producto (Solo SuperAdmin y Gerente)
router.get("/editar/:id", verificarAdminVista, async (req, res, next) => {
  try {
    const producto = await productosController.obtenerProductoParaVista(req.params.id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("productos/editar", { titulo: "Editar Producto", producto });
  } catch (error) {
    next(error);
  }
});

// Actualizar producto (Solo SuperAdmin y Gerente)
router.post("/editar/:id", verificarAdminVista, async (req, res, next) => {
  try {
    const producto = await productosController.actualizarProductoParaVista(req.params.id, req.body);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    res.redirect("/productos");
  } catch (error) {
    next(error);
  }
});

// Eliminar producto (Solo SuperAdmin y Gerente)
router.post("/eliminar/:id", verificarAdminVista, async (req, res, next) => {
  try {
    const producto = await productosController.eliminarProductoParaVista(req.params.id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    res.redirect("/productos");
  } catch (error) {
    next(error);
  }
});

module.exports = router;