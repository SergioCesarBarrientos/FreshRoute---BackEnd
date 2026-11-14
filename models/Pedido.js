// Modelo Pedido: relaciona un cliente con los productos que pidió y con el repartidor que lo entrega.

const mongoose = require('mongoose');

const ESTADOS = ['Asignado', 'En camino', 'Entregado', 'Cancelado','No Entregado'];

// Cada ítem guarda el precio del producto al momento del pedido, para que un cambio
// de precio posterior no modifique los pedidos ya hechos.
const itemPedidoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'El producto es obligatorio'],
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad debe ser al menos 1'],
      validate: {
        validator: Number.isInteger,
        message: 'La cantidad debe ser un número entero',
      },
    },
    precioUnitario: {
      type: Number,
      required: [true, 'El precio unitario es obligatorio'],
      min: [0, 'El precio unitario no puede ser negativo'],
    },
  },
  { _id: false }
);

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El cliente es obligatorio'],
    },
    items: {
      type: [itemPedidoSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: 'El pedido debe incluir al menos un producto',
      },
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio'],
      min: [0, 'El total no puede ser negativo'],
    },
    estado: {
      type: String,
      enum: { values: ESTADOS, message: 'El estado "{VALUE}" no es válido' },
      default: 'Asignado',
    },
    repartidor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado',
      required: [true, 'El repartidor es obligatorio'],
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pedido', pedidoSchema);
module.exports.ESTADOS = ESTADOS;
