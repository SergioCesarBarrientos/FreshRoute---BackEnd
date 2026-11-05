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
// GESTIÓN DE USUARIOS (SOLO ADMIN/GERENTE)
// ========================================

// Listar usuarios
router.get("/lista", usuariosController.verificarAdminVista, async (req, res, next) => {
  try {
    const usuarios = await usuariosController.obtenerUsuariosParaVista();
    res.render("usuarios/lista", { titulo: "Usuarios", usuarios });
  } catch (error) {
    next(error);
  }
});

// Dar de baja / Activar usuario
router.post("/cambiar-estado/:id", usuariosController.verificarAdminVista, async (req, res, next) => {
  try {
    await usuariosController.cambiarEstadoUsuario(req.params.id);
    res.redirect("/usuarios/lista");
  } catch (error) {
    next(error);
  }
});

// Restablecer contraseña (volver al DNI)
router.post("/restablecer/:id", usuariosController.verificarAdminVista, async (req, res, next) => {
  try {
    await usuariosController.restablecerPassword(req.params.id);
    res.redirect("/usuarios/lista");
  } catch (error) {
    next(error);
  }
});

module.exports = router;