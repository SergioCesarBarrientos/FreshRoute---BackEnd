const express = require("express");
const path = require("path");

// importo las rutas de clientes y productos
const clientesRoutes = require("./routes/clientesRoutes");
const productosRoutes = require("./routes/productosRoutes");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ============================================
// ARCHIVOS ESTÁTICOS (CSS)
// Agregado por Miguel para que funcione el CSS
// ============================================
app.use(express.static("public"));

// indicamos a Express que vamos a utilizar pug como motor de vistas
app.set("view engine", "pug");

// indicamos a express dónde están guardados los archivos .pug
app.set("views", path.join(__dirname, "views"));

// =============================
// RUTAS DE LA API
// =============================

app.use("/api/clientes", clientesRoutes);
app.use("/api/productos", productosRoutes);

// =============================
// VISTAS
// =============================

app.get("/", (req, res) => {
  res.render("index", {
    titulo: "FreshRoute",
  });
});

// Ruta para ver la lista de clientes
app.get("/clientes", (req, res) => {
    const clientesController = require("./controllers/clientesController");
    const clientes = clientesController.obtenerClientesParaVista();
    res.render("clientes/lista", { titulo: "Clientes", clientes });
});

// Ruta para ver la lista de productos
app.get("/productos", (req, res) => {
    const productosController = require("./controllers/productosController");
    const productos = productosController.obtenerProductosParaVista();
    res.render("productos/lista", { titulo: "Productos", productos });
});

// =============================
// RUTA NO ENCONTRADA
// =============================

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
  });
});

// =============================
// MANEJO DE ERRORES
// =============================

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    error: "Error interno del servidor",
  });
});

// =============================
// INICIAR SERVIDOR
// =============================

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
