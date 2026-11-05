const express = require("express");
const router = express.Router();
const productosController = require("../../controllers/productosController");
const {verificarAdminVista}= require("../../controllers/usuariosController")

// Listar productos
router.get("/", async (req, res, next) => {
  try {
    const productos = await productosController.obtenerProductosParaVista();
    res.render("productos/lista", { titulo: "Productos", productos });
  } catch (error) {
    next(error);
  }
});

// Formulario para crear producto
router.get("/nuevo", verificarAdminVista, (req, res) => {
  res.render("productos/nuevo", { titulo: "Nuevo Producto" });
});

// Formulario para editar producto
router.get("/editar/:id", async (req, res, next) => {
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

// Guardar producto
router.post("/guardar", async (req, res, next) => {
  try {
    await productosController.crearProductoParaVista(req.body);
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al guardar producto:", error);
    next(error);
  }
});

// Actualizar producto
router.post("/editar/:id", async (req, res, next) => {
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

// Eliminar producto
router.post("/eliminar/:id", async (req, res, next) => {
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