const express = require("express");

const router = express.Router();

const productosController = require("../controllers/productosController");

// GET /productos
router.get("/", productosController.obtenerProductos);

// POST /productos
router.post("/", productosController.crearProducto);

// GET /productos/:id
router.get("/:id", productosController.obtenerProductoPorId);

// PUT /productos/:id
router.put("/:id", productosController.actualizarProducto);

// DELETE /productos/:id
router.delete("/:id", productosController.eliminarProducto);

module.exports = router;