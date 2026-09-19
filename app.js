const express = require("express"); // importo express para poder crear el servidor y manejar rutas
const path = require("path"); // importo path para trabajar con rutas de archivos y carpetas


// importo las rutas de clientes y productos
const clientesRoutes = require("./routes/clientesRoutes");
const productosRoutes = require("./routes/productosRoutes");

const app = express(); // creamos la aplicación de Express
 
const PORT = 3000; //puerto donde se ejecutará el servidor

app.use(express.json());    // permite que express pueda recibir datos enviados en formato JSON
// Los datos enviados por POST o PUT estarán disponibles en req.body


//permite recibir datos enviados desde formularios HTML/Pug también estarán disponibles en req.body
app.use(express.urlencoded({
  extended: true
}));


// indicamos a Express que vamos a utilizar pug como motor de vistas
app.set(
  "view engine",
  "pug"
);

// indicamos a express dónde están guardados los archivos .pug en este caso dentro de la carpeta "views"
app.set(
  "views",
  path.join(__dirname, "views")
);


// =============================
// RUTAS DE LA API
// =============================

app.use(
  "/api/clientes",
  clientesRoutes
);

app.use(
  "/api/productos",
  productosRoutes
);


// =============================
// VISTAS
// =============================

// Cuando alguien entra a http://localhost:3000/ express busca views/index.pug y le pasa el título "FreshRoute"
app.get("/", (req, res) => {
  res.render("index", {
    titulo: "FreshRoute"
  });
});

// Cuando alguien entra a: http://localhost:3000/clientes express busca views/clientes.pug
app.get("/clientes", (req, res) => {
  res.render("clientes", {
    titulo: "Clientes"
  });
});

// Cuando alguien entra a: http://localhost:3000/productos express busca views/productos.pug
app.get("/productos", (req, res) => {
  res.render("productos", {
    titulo: "Productos"
  });
});


// =============================
// RUTA NO ENCONTRADA
// =============================

// si ninguna de las rutas anteriores coincide con la petición se devuelve un error 404
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});


// =============================
// MANEJO DE ERRORES
// =============================

// Si ocurre un error en alguna parte de la aplicación este middleware lo captura
app.use((error, req, res, next) => {

  // Mostramos el error en la consola
  console.error(error);

  // Respondemos al cliente con código 500
  res.status(500).json({
    error: "Error interno del servidor"
  });
});


// =============================
// INICIAR SERVIDOR
// =============================

app.listen(PORT, () => {
  console.log(
    `Servidor ejecutándose en http://localhost:${PORT}`
  );
});