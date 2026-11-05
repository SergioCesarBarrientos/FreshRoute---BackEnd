const express = require("express");
const router = express.Router();
const usuariosController = require("../../controllers/usuariosController");
const Empleado = require("../../models/Empleado");

// GET: Mostrar la pantalla de Mi Perfil (solo lectura)
router.get("/", async (req, res, next) => {
  try {
    const empleado = await Empleado.findOne({ idUsuario: res.locals.usuarioLogueado.id });
    
    res.render("perfil/ver-perfil", { 
      titulo: "Mi Perfil",
      empleado: empleado
    });
  } catch (error) {
    next(error);
  }
});

// GET: Mostrar la pantalla de Editar Datos (solo teléfono y dirección)
router.get("/editar-datos", async (req, res, next) => {
  try {
    const empleado = await Empleado.findOne({ idUsuario: res.locals.usuarioLogueado.id });
    
    res.render("perfil/editar-datos", { 
      titulo: "Editar Mis Datos",
      empleado: empleado
    });
  } catch (error) {
    next(error);
  }
});

// GET: Mostrar la pantalla de Cambiar Contraseña
router.get("/cambiar-password", (req, res) => {
  res.render("perfil/cambiar-password", { titulo: "Cambiar Contraseña" });
});

// POST: Procesar el cambio de contraseña
router.post("/cambiar-password", async (req, res, next) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    
    const resultado = await usuariosController.cambiarPasswordPerfil(
      res.locals.usuarioLogueado.id,
      passwordActual,
      passwordNueva
    );

    if (resultado === false) {
      return res.render("perfil/cambiar-password", { 
        titulo: "Cambiar Contraseña", 
        error: "La contraseña actual es incorrecta."
      });
    }

    if (resultado === null) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.redirect("/perfil");
  } catch (error) {
    next(error);
  }
});

// POST: Procesar la actualización de datos personales
router.post("/actualizar-datos", async (req, res, next) => {
  try {
    const { telefono, direccion } = req.body;
    await usuariosController.actualizarDatosPerfil(res.locals.usuarioLogueado.id, { telefono, direccion });
    res.redirect("/perfil");
  } catch (error) {
    next(error);
  }
});

module.exports = router;