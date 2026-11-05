const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  cuit: {
    type: String,
    required: [true, 'El CUIT es obligatorio'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no tiene un formato válido'],
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true,
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true,
  },
});

module.exports = mongoose.model('Cliente', clienteSchema);