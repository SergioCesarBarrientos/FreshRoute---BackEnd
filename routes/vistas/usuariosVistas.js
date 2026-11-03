const express = require("express");
const router = express.Router();

// GET: Mostrar formulario de login
router.get("/login", (req, res) => {
  res.render("usuarios/login", { titulo: "Iniciar Sesión" });
});

// POST: Procesar el login
router.post("/login", async (req, res, next) => {
  try {
    // Hacemos la petición a nuestra propia API de login
    const response = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: req.body.email, password: req.body.password })
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la API devuelve error (ej: 401), mostramos el mensaje en el formulario
      return res.render("usuarios/login", { 
        titulo: "Iniciar Sesión", 
        error: data.mensaje || "Credenciales inválidas" 
      });
    }

    // SEGURIDAD: Al no poner 'maxAge', es una cookie de sesión.
    // Se borra automáticamente cuando el usuario cierra el navegador.
    res.cookie('token', data.token, { httpOnly: true }); 
    
    res.redirect("/"); // Redirige al inicio

  } catch (error) {
    next(error);
  }
});

// GET: Cerrar sesión
router.get("/logout", (req, res) => {
  // Borramos la cookie del token
  res.clearCookie('token');
  res.redirect("/");
});

module.exports = router;