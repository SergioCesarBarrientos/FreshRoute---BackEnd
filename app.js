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

// ============================================
// MIDDLEWARE LOGGER
// Agregado por Miguel
// ============================================
const logger = require("./middlewares/logger");
app.use(logger);

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

// =============================
// RUTAS DE VISTAS - CLIENTES
// =============================

// Lista de clientes
app.get("/clientes", (req, res) => {
  const clientesController = require("./controllers/clientesController");
  const clientes = clientesController.obtenerClientesParaVista();
  res.render("clientes/lista", { titulo: "Clientes", clientes });
});

// Formulario para crear cliente
app.get("/clientes/nuevo", (req, res) => {
  res.render("clientes/nuevo", { titulo: "Nuevo Cliente" });
});

// Formulario para editar cliente
app.get("/clientes/editar/:id", (req, res) => {
  const clientesController = require("./controllers/clientesController");
  const cliente = clientesController.obtenerClienteParaVista(req.params.id);
  if (!cliente) {
    return res.status(404).send("Cliente no encontrado");
  }
  res.render("clientes/editar", { titulo: "Editar Cliente", cliente });
});

// Guardar cliente desde el formulario
app.post("/clientes/guardar", (req, res) => {
  const clientesController = require("./controllers/clientesController");
  clientesController.crearClienteParaVista(req.body);
  res.redirect("/clientes");
});

// Actualizar cliente desde el formulario
app.post("/clientes/editar/:id", (req, res) => {
  const clientesController = require("./controllers/clientesController");
  clientesController.actualizarClienteParaVista(req.params.id, req.body);
  res.redirect("/clientes");
});

// Eliminar cliente desde el formulario
app.post("/clientes/eliminar/:id", (req, res) => {
  const clientesController = require("./controllers/clientesController");
  clientesController.eliminarClienteParaVista(req.params.id);
  res.redirect("/clientes");
});

// =============================
// RUTAS DE VISTAS - PRODUCTOS
// =============================

// Lista de productos
app.get("/productos", (req, res) => {
  const productosController = require("./controllers/productosController");
  const productos = productosController.obtenerProductosParaVista();
  res.render("productos/lista", { titulo: "Productos", productos });
});

// Formulario para crear producto
app.get("/productos/nuevo", (req, res) => {
  res.render("productos/nuevo", { titulo: "Nuevo Producto" });
});

// Formulario para editar producto
app.get("/productos/editar/:id", (req, res) => {
  const productosController = require("./controllers/productosController");
  const producto = productosController.obtenerProductoParaVista(req.params.id);
  if (!producto) {
    return res.status(404).send("Producto no encontrado");
  }
  res.render("productos/editar", { titulo: "Editar Producto", producto });
});

// Guardar producto desde el formulario
app.post("/productos/guardar", (req, res) => {
  const productosController = require("./controllers/productosController");
  productosController.crearProductoParaVista(req.body);
  res.redirect("/productos");
});

// Actualizar producto desde el formulario
app.post("/productos/editar/:id", (req, res) => {
  const productosController = require("./controllers/productosController");
  productosController.actualizarProductoParaVista(req.params.id, req.body);
  res.redirect("/productos");
});

// Eliminar producto desde el formulario
app.post("/productos/eliminar/:id", (req, res) => {
  const productosController = require("./controllers/productosController");
  productosController.eliminarProductoParaVista(req.params.id);
  res.redirect("/productos");
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
