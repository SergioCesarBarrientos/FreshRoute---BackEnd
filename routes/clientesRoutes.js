const express = require("express"); //llamo al paquete express para crear y manejar rutas
const { obtenerClientes, obtenerClientePorId, crearCliente, actualizarCliente, eliminarCliente } = require("../controllers/clientesController");
// llamo las funciones  hechas de controllers

// creo un router de express para definir las rutas de clientes
const router = express.Router();

//endpoint: metodo http GET + la ruta
//Seguida de la funcion que ejecuta "obtenerClientes"
router.get("/", obtenerClientes);

router.get("/:id", obtenerClientePorId);

router.post("/", crearCliente);

router.put("/:id", actualizarCliente);

router.delete("/:id", eliminarCliente);


// exporto el router para poder utilizarlo en app.js
module.exports = router;