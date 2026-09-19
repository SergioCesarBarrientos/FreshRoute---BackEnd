// Clase Cliente: define qué es un cliente válido y lo valida antes de guardarlo.

class Cliente {
  constructor({ id, nombre, email, telefono }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;

    this.validar();
  }

  validar() {
    if (!this.nombre || typeof this.nombre !== 'string' || this.nombre.trim() === '') {
      throw new Error('El cliente debe tener un nombre válido (texto no vacío)');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || typeof this.email !== 'string' || !emailRegex.test(this.email)) {
      throw new Error('El cliente debe tener un email válido');
    }

    if (!this.telefono || (typeof this.telefono !== 'string' && typeof this.telefono !== 'number')) {
      throw new Error('El cliente debe tener un teléfono válido');
    }
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
    };
  }
}

module.exports = Cliente;