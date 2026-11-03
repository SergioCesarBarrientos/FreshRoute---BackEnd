const express = require("express");
const router = express.Router();
const usuariosController = require("../../controllers/usuariosController");

// ========================================
// LOGIN Y LOGOUT
// ========================================

router.get("/login", (req, res) => {
  res.render("usuarios/login", { titulo: "Iniciar Sesión" });
});

router.post("/login", async (req, res, next) => {
  try {
    const response = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: req.body.email, password: req.body.password })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.render("usuarios/login", { 
        titulo: "Iniciar Sesión", 
        error: data.mensaje || "Credenciales inválidas" 
      });
    }

    res.cookie('token', data.token, { httpOnly: true }); 
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.redirect("/");
});

// ========================================
// CRUD VISUAL DE USUARIOS
// ========================================

router.get("/lista", usuariosController.verificarAdminVista, async (req, res, next) => {
  try {
    const usuarios = await usuariosController.obtenerUsuariosParaVista();
    res.render("usuarios/lista", { titulo: "Usuarios", usuarios });
  } catch (error) {
    next(error);
  }
});

router.get("/nuevo", usuariosController.verificarAdminVista, (req, res) => {
  res.render("usuarios/nuevo", { titulo: "Nuevo Usuario" });
});

router.post("/guardar", usuariosController.verificarAdminVista, async (req, res, next) => {
  try {
    await usuariosController.crearUsuarioParaVista(req.body);
    res.redirect("/usuarios/lista");
  } catch (error) {
    next(error);
  }
});

router.get("/editar/:id", usuariosController.verificarAdminVista, async (req, res, next) => {
  try {
    const usuario = await usuariosController.obtenerUsuarioParaVista(req.params.id);
    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.render("usuarios/editar", { titulo: "Editar Usuario", usuario });
  } catch (error) {
    next(error);
  }
});

router.post("/editar/:id", usuariosController.verificarAdminVista, async (req, res, next) => {
  try {
    const usuario = await usuariosController.actualizarUsuarioParaVista(req.params.id, req.body);
    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.redirect("/usuarios/lista");
  } catch (error) {
    next(error);
  }
});

router.post("/eliminar/:id", usuariosController.verificarAdminVista, async (req, res, next) => {
  try {
    await usuariosController.eliminarUsuarioParaVista(req.params.id);
    res.redirect("/usuarios/lista");
  } catch (error) {
    next(error);
  }
});

module.exports = router;