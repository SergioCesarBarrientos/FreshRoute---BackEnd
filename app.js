// cargo las variables del archivo .env. debe ejecutarse antes de utilizar process.env.MONGO_URL o PORT.
/*
==================================================
FRESHROUTE - APLICACIÓN PRINCIPAL
==================================================
*/

// Cargar variables de entorno
require("dotenv").config();

// Importar dependencias
const express = require("express");
const path = require("path");

// Importar rutas de la API
const clientesRoutes = require("./routes/clientesRoutes");
const productosRoutes = require("./routes/productosRoutes");

// Importar controladores para las vistas
const clientesController = require("./controllers/clientesController");
const productosController = require("./controllers/productosController");

// Importar conexión y middleware
const connectDB = require("./config/connectDB");
const logger = require("./middlewares/logger");

// Crear aplicación
const app = express();
const PORT = process.env.PORT || 3000;

/*
==================================================
MIDDLEWARES
==================================================
*/

// Procesar JSON
app.use(express.json());

// Procesar formularios HTML
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos: CSS, JavaScript e imágenes
app.use(express.static(path.join(__dirname, "public")));

// Registrar solicitudes
app.use(logger);

// Configurar Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/*
==================================================
RUTAS DE LA API
==================================================
*/

app.use("/api/clientes", clientesRoutes);
app.use("/api/productos", productosRoutes);

/*
==================================================
PÁGINA PRINCIPAL
==================================================
*/

app.get("/", (req, res) => {
  res.render("index", {
    titulo: "FreshRoute"
  });
});

/*
==================================================
VISTAS DE CLIENTES
==================================================
*/

// Listar clientes
app.get("/clientes", async (req, res, next) => {
  try {
    const clientes =
      await clientesController.obtenerClientesParaVista();

    res.render("clientes/lista", {
      titulo: "Clientes",
      clientes
    });
  } catch (error) {
    next(error);
  }
});

// Formulario para crear cliente
app.get("/clientes/nuevo", (req, res) => {
  res.render("clientes/nuevo", {
    titulo: "Nuevo Cliente"
  });
});

// Formulario para editar cliente
app.get("/clientes/editar/:id", async (req, res, next) => {
  try {
    const cliente =
      await clientesController.obtenerClienteParaVista(req.params.id);

    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }

    res.render("clientes/editar", {
      titulo: "Editar Cliente",
      cliente
    });
  } catch (error) {
    next(error);
  }
});

// Guardar cliente
app.post("/clientes/guardar", async (req, res, next) => {
  try {
    console.log("Datos recibidos del formulario:", req.body);

    const cliente =
      await clientesController.crearClienteParaVista(req.body);

    console.log("Cliente guardado correctamente:", cliente._id);

    res.redirect("/clientes");
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    next(error);
  }
});

// Actualizar cliente
app.post("/clientes/editar/:id", async (req, res, next) => {
  try {
    const cliente =
      await clientesController.actualizarClienteParaVista(
        req.params.id,
        req.body
      );

    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }

    res.redirect("/clientes");
  } catch (error) {
    next(error);
  }
});

// Eliminar cliente
app.post("/clientes/eliminar/:id", async (req, res, next) => {
  try {
    const cliente =
      await clientesController.eliminarClienteParaVista(req.params.id);

    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }

    res.redirect("/clientes");
  } catch (error) {
    next(error);
  }
});

/*
==================================================
VISTAS DE PRODUCTOS
==================================================
*/

// Listar productos
app.get("/productos", async (req, res, next) => {
  try {
    const productos =
      await productosController.obtenerProductosParaVista();

    res.render("productos/lista", {
      titulo: "Productos",
      productos
    });
  } catch (error) {
    next(error);
  }
});

// Formulario para crear producto
app.get("/productos/nuevo", (req, res) => {
  res.render("productos/nuevo", {
    titulo: "Nuevo Producto"
  });
});

// Formulario para editar producto
app.get("/productos/editar/:id", async (req, res, next) => {
  try {
    const producto =
      await productosController.obtenerProductoParaVista(req.params.id);

    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productos/editar", {
      titulo: "Editar Producto",
      producto
    });
  } catch (error) {
    next(error);
  }
});

// Guardar producto
app.post("/productos/guardar", async (req, res, next) => {
  try {
    await productosController.crearProductoParaVista(req.body);

    res.redirect("/productos");
  } catch (error) {
    console.error("Error al guardar producto:", error);
    next(error);
  }
});

// Actualizar producto
app.post("/productos/editar/:id", async (req, res, next) => {
  try {
    const producto =
      await productosController.actualizarProductoParaVista(
        req.params.id,
        req.body
      );

    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    res.redirect("/productos");
  } catch (error) {
    next(error);
  }
});

// Eliminar producto
app.post("/productos/eliminar/:id", async (req, res, next) => {
  try {
    const producto =
      await productosController.eliminarProductoParaVista(req.params.id);

    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    res.redirect("/productos");
  } catch (error) {
    next(error);
  }
});

/*
==================================================
RUTA NO ENCONTRADA
==================================================
*/

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

/*
==================================================
MANEJO DE ERRORES
==================================================
*/

app.use((error, req, res, next) => {
  console.error("Error en la aplicación:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: "Error interno del servidor",
    mensaje: error.message
  });
});

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
    console.error(
      "No se pudo iniciar la aplicación:",
      error.message
    );

    process.exit(1);
  }
};

iniciarServidor();
