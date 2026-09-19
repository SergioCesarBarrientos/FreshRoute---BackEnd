// clienteModel: guarda y lee los clientes del archivo clientes.json, y hace el CRUD completo.

const fs = require('fs');
const path = require('path');
const Cliente = require('./Cliente');

const clientesFilePath = path.join(__dirname, '../data/clientes.json');

class ClienteModel {
    constructor(filePath = clientesFilePath) {
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
            const err = new Error('Error al leer el archivo de clientes: ' + error.message);
            err.codigo = 500;
            throw err;
        }
    }

    _guardarArchivo(clientes) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(clientes, null, 2), 'utf-8');
        } catch (error) {
            const err = new Error('Error al guardar el archivo de clientes: ' + error.message);
            err.codigo = 500;
            throw err;
        }
    }

    obtenerTodos() {
        return this._leerArchivo();
    }

    obtenerPorId(id) {
        const clientes = this._leerArchivo();
        const cliente = clientes.find((c) => c.id === Number(id));

        if (!cliente) {
            const err = new Error(`Cliente con id ${id} no encontrado`);
            err.codigo = 404;
            throw err;
        }

        return cliente;
    }

    crear(nuevoClienteData) {
        const clientes = this._leerArchivo();

        const nuevoId = clientes.length > 0
            ? Math.max(...clientes.map((c) => c.id)) + 1
            : 1;

        const nuevoCliente = new Cliente({ id: nuevoId, ...nuevoClienteData });

        clientes.push(nuevoCliente.toJSON());
        this._guardarArchivo(clientes);

        return nuevoCliente.toJSON();
    }

    actualizar(id, datosActualizados) {
        const clientes = this._leerArchivo();
        const indice = clientes.findIndex((c) => c.id === Number(id));

        if (indice === -1) {
            const err = new Error(`Cliente con id ${id} no encontrado`);
            err.codigo = 404;
            throw err;
        }

        const clienteActualizado = new Cliente({
            ...clientes[indice],
            ...datosActualizados,
            id: clientes[indice].id,
        });

        clientes[indice] = clienteActualizado.toJSON();
        this._guardarArchivo(clientes);

        return clienteActualizado.toJSON();
    }

    eliminar(id) {
        const clientes = this._leerArchivo();
        const indice = clientes.findIndex((c) => c.id === Number(id));

        if (indice === -1) {
            const err = new Error(`Cliente con id ${id} no encontrado`);
            err.codigo = 404;
            throw err;
        }

        const [eliminado] = clientes.splice(indice, 1);
        this._guardarArchivo(clientes);

        return eliminado;
    }
}

module.exports = new ClienteModel();
module.exports.ClienteModel = ClienteModel;
