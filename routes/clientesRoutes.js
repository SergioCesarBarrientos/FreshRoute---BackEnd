const express = require("express"); //llamo al paquete express para crear y manejar rutas
//const { obtenerClientes, obtenerClientePorId, crearCliente, actualizarCliente, eliminarCliente } = require("../controllers/clientesController");
// llamo las funciones  hechas de controllers

// creo un router de express para definir las rutas de clientes
const router = express.Router();
const clientesController = require("../controllers/clientesController");
//endpoint: metodo http GET + la ruta
//Seguida de la funcion que ejecuta "obtenerClientes"
router.get("/", clientesController.obtenerClientes);

router.post("/", clientesController.crearCliente);

router.get("/:id", clientesController.obtenerClientePorId);

router.put("/:id", clientesController.actualizarCliente);

router.delete("/:id", clientesController.eliminarCliente);


// exporto el router para poder utilizarlo en app.js
module.exports = router;