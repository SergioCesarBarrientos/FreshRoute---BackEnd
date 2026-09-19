const express = require("express"); //llamo al paquete express para el manejo de rutas
const { obtenerProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto } = require("../controllers/productosController");
// llamo las funciones  hechas de controllers


const router = express.Router();

router.get("/", obtenerProductos);

router.get("/:id", obtenerProductoPorId);

router.post("/", crearProducto);

router.put("/:id", actualizarProducto);

router.delete("/:id", eliminarProducto);

module.exports = router;