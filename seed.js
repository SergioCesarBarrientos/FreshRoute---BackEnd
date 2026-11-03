// ========================================
// SEED - Precarga de datos de prueba
// ========================================
// Uso: node seed.js

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("./config/connectDB");
const Cliente = require("./models/Cliente");
const Producto = require("./models/Producto");
const Usuario = require("./models/Usuario");

// Datos de prueba - Clientes
const clientesSeed = [
  { nombre: "Supermercado Del Sol", email: "contacto@delsol.com", telefono: "011-4567-8901" },
  { nombre: "Distribuidora Norte", email: "ventas@distnorte.com", telefono: "011-4567-8902" },
  { nombre: "Almacén Los Andes", email: "pedidos@losandes.com", telefono: "011-4567-8903" },
  { nombre: "Restaurante La Huerta", email: "compras@lahuerta.com", telefono: "011-4567-8904" },
  { nombre: "Mercado Central", email: "info@mercadocentral.com", telefono: "011-4567-8905" },
  { nombre: "Verdulería El Campo", email: "hola@elcampo.com", telefono: "011-4567-8906" },
  { nombre: "Rotisería Doña Rosa", email: "pedidos@donarosa.com", telefono: "011-4567-8907" },
  { nombre: "Autoservicio San Martín", email: "contacto@sanmartin.com", telefono: "011-4567-8908" }
];

// Datos de prueba - Productos
const productosSeed = [
  { nombre: "Manzana Roja x kg", precio: 2500, stock: 120 },
  { nombre: "Banana Ecuador x kg", precio: 1800, stock: 200 },
  { nombre: "Tomate Perita x kg", precio: 2200, stock: 80 },
  { nombre: "Papa Lavada x kg", precio: 1200, stock: 300 },
  { nombre: "Cebolla Blanca x kg", precio: 1400, stock: 150 },
  { nombre: "Zanahoria x kg", precio: 1600, stock: 90 },
  { nombre: "Lechuga Criolla x unidad", precio: 900, stock: 60 },
  { nombre: "Caja de Cartón x 10", precio: 3500, stock: 40 }
];

const ejecutarSeed = async () => {
  try {
    await connectDB();

    // 1) Borrar datos actuales
    await Cliente.deleteMany({});
    await Producto.deleteMany({});
    await Usuario.deleteMany({}); // Limpiar usuarios también
    console.log("🧹 Datos anteriores eliminados (Clientes, Productos, Usuarios)");

    // 2) Insertar Clientes y Productos
    const clientesInsertados = await Cliente.insertMany(clientesSeed);
    console.log(`✅ ${clientesInsertados.length} clientes insertados`);

    const productosInsertados = await Producto.insertMany(productosSeed);
    console.log(`✅ ${productosInsertados.length} productos insertados`);

    // 3) Crear Usuarios con contraseñas hasheadas
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash("123456", saltRounds);

    const usuariosSeed = [
      { nombre: "Miguel Admin", email: "miguel@freshroute.com", password: passwordHash, rol: "admin" },
      { nombre: "Caro", email: "caro@freshroute.com", password: passwordHash, rol: "admin" },
      { nombre: "Sergio", email: "sergio@freshroute.com", password: passwordHash, rol: "admin" },
      { nombre: "Mariana", email: "mariana@freshroute.com", password: passwordHash, rol: "admin" },
      { nombre: "Juan Perez", email: "juan@freshroute.com", password: passwordHash, rol: "administrativo" },
      { nombre: "Repartidor 1", email: "repartidor@freshroute.com", password: passwordHash, rol: "repartidor" }
    ];

    const usuariosInsertados = await Usuario.insertMany(usuariosSeed);
    console.log(`✅ ${usuariosInsertados.length} usuarios insertados (admins, administrativo y repartidor)`);

    console.log("🌱 Seed completada correctamente");
  } catch (error) {
    console.error("❌ Error en la seed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
    process.exit(0);
  }
};

ejecutarSeed();