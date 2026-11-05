const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    trim: true,
    lowercase: true
  },
  dni: {
    type: String,
    required: [true, 'El DNI es obligatorio'],
    unique: true,
    trim: true
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true
  },
  rol: {
    type: String,
    required: [true, 'El rol es obligatorio'],
    enum: ['gerente', 'administrativo', 'repartidor']
  },
  legajo: {
    type: String,
    trim: true,
    required: function() { return this.rol === 'administrativo'; }
  },
  vehiculo: {
    type: String,
    trim: true,
    required: function() { return this.rol === 'repartidor'; }
  },
  patente: {
    type: String,
    trim: true,
    required: function() { return this.rol === 'repartidor'; }
  },
  estado: {
    type: String,
    enum: ['Disponible', 'Ocupado', 'Inactivo'],
    default: 'Disponible'
  },
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El ID de usuario es obligatorio']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Empleado', empleadoSchema);