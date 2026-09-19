// productoModel: guarda y lee los productos del archivo productos.json, y hace el CRUD completo.

const fs = require('fs');
const path = require('path');
const Producto = require('./Producto');

const productosFilePath = path.join(__dirname, '../data/productos.json');

class ProductoModel {
    constructor(filePath = productosFilePath) {
        this.filePath = filePath;
    }

    _leerArchivo() {
        try {
            if (!fs.existsSync(this.filePath)) {
                fs.writeFileSync(this.filePath, '[]', 'utf-8');
                return [];
            }

            const contenido = fs.readFileSync(this.filePath, 'utf-8');
            if (!contenido.trim()) {
                return [];
            }

            return JSON.parse(contenido);
        } catch (error) {
            const err = new Error('Error al leer el archivo de productos: ' + error.message);
            err.codigo = 500;
            throw err;
        }
    }

    _guardarArchivo(productos) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(productos, null, 2), 'utf-8');
        } catch (error) {
            const err = new Error('Error al guardar el archivo de productos: ' + error.message);
            err.codigo = 500;
            throw err;
        }
    }

    obtenerTodos() {
        return this._leerArchivo();
    }

    obtenerPorId(id) {
        const productos = this._leerArchivo();
        const producto = productos.find((p) => p.id === Number(id));

        if (!producto) {
            const err = new Error(`Producto con id ${id} no encontrado`);
            err.codigo = 404;
            throw err;
        }

        return producto;
    }

    crear(nuevoProductoData) {
        const productos = this._leerArchivo();

        const nuevoId = productos.length > 0
            ? Math.max(...productos.map((p) => p.id)) + 1
            : 1;

        const nuevoProducto = new Producto({ id: nuevoId, ...nuevoProductoData });

        productos.push(nuevoProducto.toJSON());
        this._guardarArchivo(productos);

        return nuevoProducto.toJSON();
    }

    actualizar(id, datosActualizados) {
        const productos = this._leerArchivo();
        const indice = productos.findIndex((p) => p.id === Number(id));

        if (indice === -1) {
            const err = new Error(`Producto con id ${id} no encontrado`);
            err.codigo = 404;
            throw err;
        }

        const productoActualizado = new Producto({
            ...productos[indice],
            ...datosActualizados,
            id: productos[indice].id,
        });

        productos[indice] = productoActualizado.toJSON();
        this._guardarArchivo(productos);

        return productoActualizado.toJSON();
    }

    eliminar(id) {
        const productos = this._leerArchivo();
        const indice = productos.findIndex((p) => p.id === Number(id));

        if (indice === -1) {
            const err = new Error(`Producto con id ${id} no encontrado`);
            err.codigo = 404;
            throw err;
        }

        const [eliminado] = productos.splice(indice, 1);
        this._guardarArchivo(productos);

        return eliminado;
    }
}

module.exports = new ProductoModel();
module.exports.ProductoModel = ProductoModel;
