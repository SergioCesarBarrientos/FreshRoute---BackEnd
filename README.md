# 🚚 FreshRoute – Sistema de gestión logística de alimentos refrigerados

**FreshRoute** es un sistema web desarrollado para gestionar las operaciones de una empresa dedicada a la venta y distribución de alimentos refrigerados. El proyecto busca centralizar y digitalizar la administración de clientes, productos, empleados y pedidos, facilitando la organización del trabajo administrativo y de las entregas.

El sistema cuenta con distintos niveles de acceso según el rol del usuario, ofreciendo herramientas específicas para la administración y para los repartidores.

## 🎯 Objetivo del proyecto

Desarrollar una aplicación web que permita administrar las principales operaciones de FreshRoute, mejorar la organización de los pedidos y facilitar el seguimiento de las entregas mediante una plataforma centralizada.

## ⚙️ Funcionalidades principales

- **Gestión de clientes:** registrar, consultar, buscar, modificar y eliminar clientes.
- **Gestión de productos:** administrar el catálogo de productos, sus precios y el stock disponible.
- **Gestión de empleados:** registrar empleados, administrar sus datos y asignarles roles dentro del sistema.
- **Gestión de usuarios:** iniciar sesión, administrar cuentas, activar o desactivar usuarios y restablecer contraseñas.
- **Gestión de pedidos:** crear pedidos vinculados a clientes, productos y repartidores; consultar su información y actualizar sus estados.
- **Panel de repartidores:** consultar los pedidos asignados y actualizar el estado de las entregas.
- **Gestión del perfil:** modificar datos personales, cambiar la contraseña y administrar la disponibilidad del repartidor.

## 👥 Roles y permisos

El sistema contempla cuatro roles de usuario. Tres de ellos son roles de negocio (Gerente, Administrativo y Repartidor) y uno es un rol técnico (Superadmin).

| Rol | Tipo | Descripción |
|---|---|---|
| **Superadmin** | Técnico | Acceso total al sistema para tareas de soporte y configuración. |
| **Gerente** | Negocio | Supervisa la operación y gestiona clientes, productos, empleados y usuarios. No crea pedidos. |
| **Administrativo** | Negocio | Gestiona clientes, crea y modifica pedidos, y consulta productos. |
| **Repartidor** | Negocio | Consulta sus pedidos asignados y actualiza el estado de las entregas. |

Los permisos determinan qué operaciones puede realizar cada usuario dentro de la aplicación.

## 📦 Reglas de negocio

FreshRoute incorpora controles para mantener la consistencia de las operaciones:

- Cada pedido debe estar asociado a un cliente, al menos un producto y un repartidor.
- Se verifica que exista stock suficiente antes de registrar un pedido.
- El precio de cada producto se guarda en el pedido al momento de su creación.
- Un repartidor puede tener como máximo **dos pedidos asignados** simultáneamente (en estado "Asignado" o "En camino").
- No se pueden asignar nuevos pedidos a repartidores inactivos.
- El estado de disponibilidad del repartidor se actualiza según la cantidad de pedidos asignados.
- Los pedidos siguen transiciones de estado permitidas por el sistema.
- Los repartidores solamente pueden modificar determinados estados de los pedidos que tienen asignados.

## 🛠️ Tecnologías utilizadas

**Backend**
- Node.js: entorno de ejecución de JavaScript.
- Express: framework para desarrollar el servidor y gestionar las rutas.
- Mongoose: modelado y conexión con MongoDB.

**Base de datos**
- MongoDB: almacenamiento de la información del sistema.

**Frontend**
- Pug: motor de plantillas para generar las vistas de la aplicación.
- HTML, CSS y JavaScript.

**Seguridad, testing y herramientas**
- JSON Web Token (JWT): autenticación mediante tokens.
- Bcrypt: cifrado de contraseñas.
- Dotenv: administración de variables de entorno.
- Nodemon: reinicio automático del servidor durante el desarrollo.
- Jest: framework de testing.
- Supertest: pruebas de endpoints HTTP.

## 📁 Estructura del proyecto

La aplicación se organiza en módulos para separar las responsabilidades y facilitar el mantenimiento del código.

```text
FreshRoute/
│
├── app.js
├── package.json
├── jest.config.js
├── seed.js
├── .env
├── .gitignore
│
├── config/
│   └── connectDB.js
│
├── middlewares/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── logger.js
│   ├── permitirRoles.js
│   └── verificarSesionVista.js
│
├── models/
│   ├── Cliente.js
│   ├── Empleado.js
│   ├── Pedido.js
│   ├── Producto.js
│   └── Usuario.js
│
├── controllers/
│   ├── clientesController.js
│   ├── empleadosController.js
│   ├── pedidosController.js
│   ├── productosController.js
│   ├── repartidoresController.js
│   └── usuariosController.js
│
├── routes/
│   ├── api/
│   │   ├── clientesRoutes.js
│   │   ├── empleadosRoutes.js
│   │   ├── pedidosRoutes.js
│   │   ├── perfilesRoutes.js
│   │   ├── productosRoutes.js
│   │   ├── repartidoresRoutes.js
│   │   └── usuariosRoutes.js
│   └── vistas/
│       ├── clientesVistas.js
│       ├── empleadosVistas.js
│       ├── pedidosVistas.js
│       ├── perfilesVistas.js
│       ├── productosVistas.js
│       ├── repartidoresVistas.js
│       └── usuariosVistas.js
│
├── tests/
│   ├── auth.test.js
│   └── clientes.test.js
│
├── utils/
│   └── AppError.js
│
├── views/
│   ├── clientes/
│   ├── empleados/
│   ├── pedidos/
│   ├── perfil/
│   ├── productos/
│   ├── repartidores/
│   ├── usuarios/
│   ├── index.pug
│   └── layout.pug
│
├── docs/
│   └── img/
│
└── public/
    ├── css/
    │   └── styles.css
    └── img/
        ├── bg.jpg
        └── icon.png
```

*La estructura representa la organización general del proyecto. Dentro de las carpetas de rutas y vistas se encuentran los archivos correspondientes a cada módulo.*

## 🚀 Instalación y ejecución

1. Clonar el repositorio:
git clone URL_DEL_REPOSITORIO

2. Ingresar a la carpeta del proyecto:
cd FreshRoute

3. Instalar las dependencias:
npm install

4. Configurar las variables de entorno:
Crear un archivo .env en la raíz del proyecto con la siguiente estructura:

PORT=3000
MONGO_URI=tu_uri_de_conexion_a_mongodb
SECRET=tu_clave_secreta_jwt

- PORT: puerto en el que se ejecutará el servidor.
- MONGO_URI: dirección de conexión a la base de datos MongoDB.
- SECRET: clave utilizada para firmar y verificar los tokens JWT.

**Importante:** el archivo .env contiene información sensible y no debe subirse al repositorio.

5. Cargar los datos de prueba (seed):
node seed.js

6. Iniciar el servidor:
npm run dev

Una vez iniciado, acceder desde el navegador a: http://localhost:3000

## 🧪 Testing

El proyecto incluye pruebas automáticas utilizando **Jest** y **Supertest** para verificar los aspectos más críticos del sistema.

- **Jest:** framework de testing para JavaScript.
- **Supertest:** librería para simular peticiones HTTP a la API.

Pruebas implementadas:
- Autenticación: login con credenciales inválidas (401) y login exitoso (token JWT).
- Clientes: obtención de la lista de clientes con token válido (200).

Cómo ejecutar los tests:
npm test

## 🔑 Usuarios de prueba

| Panel | Usuario |
|---|---|
| Superadmin | miguel |
| Gerente | gerente |
| Administrativo | csilva |
| Administrativo | sbarrientos |
| Administrativo | msosa |
| Repartidor | jperez |
| Repartidor | rdos |

**Contraseña de las cuentas de prueba:** 123

## 🔐 Autenticación y manejo de errores

El sistema utiliza JWT para gestionar la autenticación de los usuarios, con una expiración de 15 minutos. Las contraseñas se almacenan mediante hashing con Bcrypt.

El login bloquea a los usuarios inactivos (activo: false). Además, cuenta con middlewares para verificar sesiones y permisos según los roles (devolviendo 403 Acceso denegado si corresponde).

El manejador centralizado de errores controla distintos tipos de excepciones: errores de validación de Mongoose, CastError (ID inválido), JSON mal formado y errores inesperados (500).

## 📌 Enlaces del proyecto

- **Repositorio GitHub:** https://github.com/SergioCesarBarrientos/FreshRoute---BackEnd
- **Despliegue en Vercel:** [Pendiente]

## 🎓 Información académica

**Institución:** IFTS N.º 29  
**Materia:** Desarrollo de Sistemas Web (Back End)  
**Período:** Segundo cuatrimestre de 2026  
**Equipo:** TechLab – Grupo 3

## 👨‍💻 Integrantes

- Miguel Marcaida
- Carolina Silva Cotto
- Sergio Cesar Barrientos
- Mariana Sosa

## 📌 Estado del proyecto

Proyecto académico grupal en desarrollo, orientado a implementar un sistema web de gestión logística con autenticación, administración de datos y gestión de pedidos y entregas.