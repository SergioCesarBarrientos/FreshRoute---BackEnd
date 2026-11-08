// Cargar variables de entorno
require("dotenv").config();

// Importar dependencias
const express = require("express");
const path = require("path");
const jwt = require('jsonwebtoken');

// Importar rutas de la API
const clientesRoutes = require("./routes/api/clientesRoutes");
const productosRoutes = require("./routes/api/productosRoutes");
const usuariosRoutes = require("./routes/api/usuariosRoutes");
const empleadosRoutes = require("./routes/api/empleadosRoutes");
const perfilesRoutes = require("./routes/api/perfilesRoutes");
const pedidosRoutes = require("./routes/api/pedidosRoutes");

// Importar rutas de las Vistas
const clientesVistas = require("./routes/vistas/clientesVistas");
const productosVistas = require("./routes/vistas/productosVistas");
const usuariosVistas = require("./routes/vistas/usuariosVistas");
const empleadosVistas = require("./routes/vistas/empleadosVistas");
const perfilesVistas = require("./routes/vistas/perfilesVistas");
const pedidosVistas = require("./routes/vistas/pedidosVistas");

// Importar conexión y middleware
const connectDB = require("./config/connectDB");
const logger = require("./middlewares/logger");
const verificarSesionVista = require("./middlewares/verificarSesionVista");

// Crear aplicación
const app = express();
const PORT = process.env.PORT || 3000;

/*
==================================================
MIDDLEWARES
==================================================
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(logger);

// Middleware para leer el usuario de la cookie y pasarlo a las vistas
app.use((req, res, next) => {
  res.locals.usuarioLogueado = null;
  if (req.headers.cookie) {
    const tokenCookie = req.headers.cookie.split('; ').find(row => row.startsWith('token='));
    if (tokenCookie) {
      try {
        const token = tokenCookie.split('=')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        res.locals.usuarioLogueado = decoded;
      } catch (err) {
        // Token vencido o inválido
      }
    }
  }
  next();
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/*
==================================================
RUTAS DE LA API (JSON)
==================================================
*/

app.use("/api/clientes", clientesRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/perfil", perfilesRoutes);
app.use("/api/pedidos", pedidosRoutes);

/*
==================================================
RUTAS DE LAS VISTAS (HTML / PUG)
==================================================
*/

// 1. Rutas públicas de usuarios (login y logout)
app.use("/", usuariosVistas);

// 2. Rutas del CRUD de usuarios (tienen su propia protección interna)
app.use("/usuarios", usuariosVistas);

// 3. Middleware que protege el resto de las vistas
app.use(verificarSesionVista);

// 4. Página principal (ya protegida)
app.get("/", (req, res) => {
  res.render("index", { titulo: "FreshRoute" });
});

// 5. Vistas de clientes (protegidas)
app.use("/clientes", clientesVistas);

// 6. Vistas de productos (protegidas)
app.use("/productos", productosVistas);

// 7. Vistas de empleados (protegidas)
app.use("/empleados", empleadosVistas);

// 8. Vistas de perfil (protegidas)
app.use("/perfil", perfilesVistas);

//9. Vistas de pedidos (protegidas)
app.use("/pedidos", pedidosVistas);

/*
==================================================
RUTA NO ENCONTRADA
==================================================
*/

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

/*
==================================================
MANEJO DE ERRORES
==================================================
*/

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

/*
==================================================
VERIFICAR VARIABLE DE ENTORNO
==================================================
*/

if (!process.env.SECRET) {
  console.warn(
    "⚠️ Advertencia: La variable SECRET no está definida en el .env. Los tokens fallarán.",
  );
}

/*
==================================================
INICIAR SERVIDOR
==================================================
*/

const iniciarServidor = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar la aplicación:", error.message);
    process.exit(1);
  }
};

iniciarServidor();