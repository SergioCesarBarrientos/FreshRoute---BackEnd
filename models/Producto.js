// Clase Producto: define qué es un producto válido y lo valida antes de guardarlo.

class Producto {
  constructor({ id, nombre, precio, stock }) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;

    this.validar();
  }

  validar() {
    if (!this.nombre || typeof this.nombre !== 'string' || this.nombre.trim() === '') {
      throw new Error('El producto debe tener un nombre válido (texto no vacío)');
    }

    if (typeof this.precio !== 'number' || Number.isNaN(this.precio) || this.precio < 0) {
      throw new Error('El precio debe ser un número mayor o igual a 0');
    }

    if (typeof this.stock !== 'number' || Number.isNaN(this.stock) || this.stock < 0) {
      throw new Error('El stock debe ser un número mayor o igual a 0');
    }
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      precio: this.precio,
      stock: this.stock,
    };
  }
}

module.exports = Producto;