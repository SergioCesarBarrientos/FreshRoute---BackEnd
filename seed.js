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
const Empleado = require("./models/Empleado");

// Datos de prueba - Clientes (con CUIT y Dirección)
const clientesSeed = [
  { nombre: "Supermercado Del Sol", cuit: "30-12345678-1", email: "contacto@delsol.com", telefono: "011-4567-8901", direccion: "Av. Corrientes 1234" },
  { nombre: "Distribuidora Norte", cuit: "30-12345678-2", email: "ventas@distnorte.com", telefono: "011-4567-8902", direccion: "Av. Cabildo 5678" },
  { nombre: "Almacén Los Andes", cuit: "30-12345678-3", email: "pedidos@losandes.com", telefono: "011-4567-8903", direccion: "Calle San Martín 123" },
  { nombre: "Restaurante La Huerta", cuit: "30-12345678-4", email: "compras@lahuerta.com", telefono: "011-4567-8904", direccion: "Av. Belgrano 987" },
  { nombre: "Mercado Central", cuit: "30-12345678-5", email: "info@mercadocentral.com", telefono: "011-4567-8905", direccion: "Calle Lavalle 456" },
  { nombre: "Verdulería El Campo", cuit: "30-12345678-6", email: "hola@elcampo.com", telefono: "011-4567-8906", direccion: "Av. Rivadavia 654" },
  { nombre: "Rotisería Doña Rosa", cuit: "30-12345678-7", email: "pedidos@donarosa.com", telefono: "011-4567-8907", direccion: "Calle Mitre 321" },
  { nombre: "Autoservicio San Martín", cuit: "30-12345678-8", email: "contacto@sanmartin.com", telefono: "011-4567-8908", direccion: "Av. Santa Fe 789" }
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

// Datos de prueba - Empleados
const empleadosSeed = [
  { nombre: "Caro", apellido: "Silva", dni: "11111111", telefono: "1111", direccion: "Calle 1", rol: "administrativo", legajo: "A001", estado: "Disponible" },
  { nombre: "Sergio", apellido: "Barrientos", dni: "22222222", telefono: "2222", direccion: "Calle 2", rol: "administrativo", legajo: "A002", estado: "Disponible" },
  { nombre: "Mariana", apellido: "Sosa", dni: "33333333", telefono: "3333", direccion: "Calle 3", rol: "administrativo", legajo: "A003", estado: "Disponible" },
  { nombre: "Juan", apellido: "Perez", dni: "44444444", telefono: "4444", direccion: "Calle 4", rol: "repartidor", vehiculo: "Moto", patente: "AB123CD", estado: "Disponible" },
  { nombre: "Repartidor", apellido: "Dos", dni: "55555555", telefono: "5555", direccion: "Calle 5", rol: "repartidor", vehiculo: "Camioneta", patente: "EF456GH", estado: "Disponible" }
];

const ejecutarSeed = async () => {
  try {
    await connectDB();

    // 1) Borrar datos actuales
    await Cliente.deleteMany({});
    await Producto.deleteMany({});
    await Usuario.deleteMany({});
    await Empleado.deleteMany({});
    console.log("🧹 Datos anteriores eliminados");

    // 2) Insertar Clientes y Productos
    const clientesInsertados = await Cliente.insertMany(clientesSeed);
    console.log(`✅ ${clientesInsertados.length} clientes insertados`);

    const productosInsertados = await Producto.insertMany(productosSeed);
    console.log(`✅ ${productosInsertados.length} productos insertados`);

    // 3) Crear SuperAdmin y Gerente (Usuarios sin ficha de empleado)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash("123", saltRounds);

    const adminsSeed = [
      { username: "miguel", email: "miguel@freshroute.com", password: passwordHash, rol: "superadmin" },
      { username: "gerente", email: "gerente@freshroute.com", password: passwordHash, rol: "gerente" }
    ];
    await Usuario.insertMany(adminsSeed);
    console.log("✅ SuperAdmin y Gerente insertados (pass: 123)");

    // 4) Crear Empleados (con su Usuario automático y email guardado)
    for (const emp of empleadosSeed) {
      // Generar username único
      let baseUsername = (emp.nombre.charAt(0) + emp.apellido).toLowerCase().replace(/\s+/g, '');
      let username = baseUsername;
      let contador = 1;
      while (await Usuario.findOne({ username })) {
        username = baseUsername + contador;
        contador++;
      }

      const email = `${username}@freshroute.com`;
      const passHash = await bcrypt.hash("123", 10); // Contraseña corta: 123

      const nuevoUsuario = new Usuario({ 
        username, 
        email, 
        password: passHash, 
        rol: emp.rol,
        activo: true 
      });
      const usuarioGuardado = await nuevoUsuario.save();

      const nuevoEmpleado = new Empleado({
        ...emp,
        email,
        idUsuario: usuarioGuardado._id
      });
      await nuevoEmpleado.save();
      
      console.log(`👤 Empleado creado: ${emp.nombre} ${emp.apellido} | User: ${username} | Pass: 123 | Email: ${email}`);
    }

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