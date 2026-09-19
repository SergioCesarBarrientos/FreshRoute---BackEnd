const fs = require("fs");
const path = require("path");
const Producto = require("../models/Producto");

const productosPath = path.join(__dirname, "..", "data", "productos.json");

// Leer productos
function leerProductos() {
  const datos = fs.readFileSync(productosPath, "utf-8");
  return JSON.parse(datos);
}

// Guardar productos
function guardarProductos(productos) {
  fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
}

// GET /productos
function obtenerProductos(req, res) {
  try {
    const productos = leerProductos();

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los productos",
    });
  }
}

// POST /productos
function crearProducto(req, res) {
  try {
    const { nombre, precio, stock } = req.body;

    // Validar campos obligatorios
    if (nombre === undefined || precio === undefined || stock === undefined) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Validar tipos
    if (
      typeof nombre !== "string" ||
      typeof precio !== "number" ||
      typeof stock !== "number"
    ) {
      return res.status(400).json({
        error: "Los datos ingresados no tienen un formato válido",
      });
    }

    // Validar valores
    if (precio < 0) {
      return res.status(400).json({
        error: "El precio no puede ser negativo",
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        error: "El stock no puede ser negativo",
      });
    }

    const productos = leerProductos();

    // Generar nuevo ID
    const nuevoId =
      productos.length > 0
        ? Math.max(...productos.map((producto) => producto.id)) + 1
        : 1;

    // Crear producto utilizando POO
    const nuevoProducto = new Producto(nuevoId, nombre, precio, stock);

    productos.push(nuevoProducto);

    guardarProductos(productos);

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto: nuevoProducto,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al crear el producto",
    });
  }
}

// GET /productos/:id
function obtenerProductoPorId(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const productos = leerProductos();

    const producto = productos.find((producto) => producto.id === id);

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar el producto",
    });
  }
}

// PUT /productos/:id
function actualizarProducto(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const { nombre, precio, stock } = req.body;

    // Validar campos
    if (nombre === undefined || precio === undefined || stock === undefined) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Validar tipos
    if (
      typeof nombre !== "string" ||
      typeof precio !== "number" ||
      typeof stock !== "number"
    ) {
      return res.status(400).json({
        error: "Los datos ingresados no tienen un formato válido",
      });
    }

    // Validar valores
    if (precio < 0) {
      return res.status(400).json({
        error: "El precio no puede ser negativo",
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        error: "El stock no puede ser negativo",
      });
    }

    const productos = leerProductos();

    const indice = productos.findIndex((producto) => producto.id === id);

    if (indice === -1) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    productos[indice].nombre = nombre;
    productos[indice].precio = precio;
    productos[indice].stock = stock;

    guardarProductos(productos);

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto: productos[indice],
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar el producto",
    });
  }
}

// DELETE /productos/:id
function eliminarProducto(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const productos = leerProductos();

    const indice = productos.findIndex((producto) => producto.id === id);

    if (indice === -1) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    productos.splice(indice, 1);

    guardarProductos(productos);

    res.status(200).json({
      mensaje: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el producto",
    });
  }
}

// ============================================
// FUNCIONES PARA VISTAS
// Agregado por Miguel para que funcionen las vistas
// ============================================

function obtenerProductosParaVista() {
  return leerProductos();
}

function obtenerProductoParaVista(id) {
  const productos = leerProductos();
  return productos.find((p) => p.id === Number(id)) || null;
}

function crearProductoParaVista(datos) {
  const productos = leerProductos();
  const nuevoId =
    productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
  const nuevoProducto = {
    id: nuevoId,
    nombre: datos.nombre,
    precio: Number(datos.precio),
    stock: Number(datos.stock),
  };
  productos.push(nuevoProducto);
  guardarProductos(productos);
  return nuevoProducto;
}

function actualizarProductoParaVista(id, datos) {
  const productos = leerProductos();
  const indice = productos.findIndex((p) => p.id === Number(id));
  if (indice === -1) return null;
  productos[indice].nombre = datos.nombre;
  productos[indice].precio = Number(datos.precio);
  productos[indice].stock = Number(datos.stock);
  guardarProductos(productos);
  return productos[indice];
}

function eliminarProductoParaVista(id) {
  const productos = leerProductos();
  const indice = productos.findIndex((p) => p.id === Number(id));
  if (indice === -1) return false;
  productos.splice(indice, 1);
  guardarProductos(productos);
  return true;
}
module.exports = {
  obtenerProductos,
  crearProducto,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  //funciones para vistas
  obtenerProductosParaVista,
  obtenerProductoParaVista,
  crearProductoParaVista,
  actualizarProductoParaVista,
  eliminarProductoParaVista,
};
