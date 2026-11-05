const express = require("express");
const router = express.Router();
const empleadosController = require("../../controllers/empleadosController");

// Listar empleados
router.get("/", empleadosController.obtenerEmpleadosParaVista ? async (req, res, next) => {
  try {
    const empleados = await empleadosController.obtenerEmpleadosParaVista();
    res.render("empleados/lista", { titulo: "Empleados", empleados });
  } catch (error) {
    next(error);
  }
} : (req, res) => res.send("Error en controlador"));

// Formulario nuevo
router.get("/nuevo", (req, res) => {
  res.render("empleados/nuevo", { titulo: "Nuevo Empleado" });
});

// Guardar
router.post("/guardar", async (req, res, next) => {
  try {
    await empleadosController.crearEmpleadoParaVista(req.body);
    res.redirect("/empleados");
  } catch (error) {
    next(error);
  }
});

// Formulario editar
router.get("/editar/:id", async (req, res, next) => {
  try {
    const empleado = await empleadosController.obtenerEmpleadoParaVista(req.params.id);
    if (!empleado) {
      return res.status(404).send("Empleado no encontrado");
    }
    res.render("empleados/editar", { titulo: "Editar Empleado", empleado });
  } catch (error) {
    next(error);
  }
});

// Actualizar
router.post("/editar/:id", async (req, res, next) => {
  try {
    const empleado = await empleadosController.actualizarEmpleadoParaVista(req.params.id, req.body);
    if (!empleado) {
      return res.status(404).send("Empleado no encontrado");
    }
    res.redirect("/empleados");
  } catch (error) {
    next(error);
  }
});

// Eliminar
router.post("/eliminar/:id", async (req, res, next) => {
  try {
    await empleadosController.eliminarEmpleadoParaVista(req.params.id);
    res.redirect("/empleados");
  } catch (error) {
    next(error);
  }
});

module.exports = router;