const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  rol: {
    type: String,
    enum: ['superadmin', 'gerente', 'administrativo', 'repartidor'],
    default: 'administrativo'
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

usuarioSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
    return returnedObject;
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);