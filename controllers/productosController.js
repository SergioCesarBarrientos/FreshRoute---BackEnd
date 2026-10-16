const Producto = require("../models/Producto");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

// Validar los datos recibidos
function validarProducto(datos) {
    const { nombre, precio, stock } = datos;

    if (
        !nombre ||
        precio === undefined ||
        precio === "" ||
        stock === undefined ||
        stock === ""
    ) {
        return "El nombre, el precio y el stock son obligatorios";
    }

    if (
        !Number.isFinite(Number(precio)) ||
        !Number.isFinite(Number(stock))
    ) {
        return "El precio y el stock deben ser números válidos";
    }

    if (Number(precio) < 0 || Number(stock) < 0) {
        return "El precio y el stock no pueden ser negativos";
    }

    return null;
}

// ========================================
// FUNCIONES PARA LA API
// ========================================

// Listar todos los productos
async function obtenerProductos(req, res, next) {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
}

// Crear un producto
async function crearProducto(req, res, next) {
    try {
        const errorValidacion = validarProducto(req.body);

        if (errorValidacion) {
            throw new AppError(errorValidacion, 400);
        }

        const nuevoProducto = new Producto({
            nombre: req.body.nombre,
            precio: Number(req.body.precio),
            stock: Number(req.body.stock)
        });

        const productoGuardado = await nuevoProducto.save();

        res.status(201).json({
            mensaje: "Producto registrado correctamente",
            producto: productoGuardado
        });
    } catch (error) {
        next(error);
    }
}

// Obtener un producto por su ID de MongoDB
async function obtenerProductoPorId(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("El ID del producto no es válido", 400);
        }

        const producto = await Producto.findById(id);

        if (!producto) {
            throw new AppError("Producto no encontrado", 404);
        }

        res.status(200).json(producto);
    } catch (error) {
        next(error);
    }
}

// Actualizar un producto
async function actualizarProducto(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("El ID del producto no es válido", 400);
        }

        const errorValidacion = validarProducto(req.body);

        if (errorValidacion) {
            throw new AppError(errorValidacion, 400);
        }

        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            {
                nombre: req.body.nombre,
                precio: Number(req.body.precio),
                stock: Number(req.body.stock)
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!productoActualizado) {
            throw new AppError("Producto no encontrado", 404);
        }

        res.status(200).json({
            mensaje: "Producto actualizado correctamente",
            producto: productoActualizado
        });
    } catch (error) {
        next(error);
    }
}

// Eliminar un producto
async function eliminarProducto(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("El ID del producto no es válido", 400);
        }

        const productoEliminado = await Producto.findByIdAndDelete(id);

        if (!productoEliminado) {
            throw new AppError("Producto no encontrado", 404);
        }

        res.status(200).json({
            mensaje: "Producto eliminado correctamente",
            producto: productoEliminado
        });
    } catch (error) {
        next(error);
    }
}

// ========================================
// FUNCIONES PARA LAS VISTAS PUG
// ========================================

async function obtenerProductosParaVista() {
    return await Producto.find().sort({ nombre: 1 });
}

async function obtenerProductoParaVista(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    return await Producto.findById(id);
}

async function crearProductoParaVista(datos) {
    const errorValidacion = validarProducto(datos);

    if (errorValidacion) {
        throw new AppError(errorValidacion, 400);
    }

    const nuevoProducto = new Producto({
        nombre: datos.nombre,
        precio: Number(datos.precio),
        stock: Number(datos.stock)
    });

    return await nuevoProducto.save();
}

async function actualizarProductoParaVista(id, datos) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    const errorValidacion = validarProducto(datos);

    if (errorValidacion) {
        throw new AppError(errorValidacion, 400);
    }

    return await Producto.findByIdAndUpdate(
        id,
        {
            nombre: datos.nombre,
            precio: Number(datos.precio),
            stock: Number(datos.stock)
        },
        {
            new: true,
            runValidators: true
        }
    );
}

async function eliminarProductoParaVista(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }

    const producto = await Producto.findByIdAndDelete(id);
    return producto !== null;
}

module.exports = {
    obtenerProductos,
    crearProducto,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosParaVista,
    obtenerProductoParaVista,
    crearProductoParaVista,
    actualizarProductoParaVista,
    eliminarProductoParaVista
};