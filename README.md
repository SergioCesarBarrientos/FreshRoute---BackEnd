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

El sistema contempla cuatro roles de usuario, organizados en tres paneles principales:

| Panel | Roles | Descripción |
|---|---|---|
| Administrativo principal | Superadmin | Acceso principal a la administración del sistema. |
| Administrativo | Gerente y Administrativo | Gestión de las operaciones administrativas, según los permisos asignados a cada rol. |
| Repartidores | Repartidor | Consulta de pedidos asignados y actualización del estado de las entregas. |

Los permisos determinan qué operaciones puede realizar cada usuario dentro de la aplicación.

## 📦 Reglas de negocio

FreshRoute incorpora controles para mantener la consistencia de las operaciones:

- Cada pedido debe estar asociado a un cliente, al menos un producto y un repartidor.
- Se verifica que exista stock suficiente antes de registrar un pedido.
- El precio de cada producto se guarda en el pedido al momento de su creación.
- Un repartidor puede tener como máximo **dos pedidos activos** simultáneamente.
- No se pueden asignar nuevos pedidos a repartidores inactivos.
- El estado de disponibilidad del repartidor se actualiza según la cantidad de pedidos activos.
- Los pedidos siguen transiciones de estado permitidas por el sistema.
- Los repartidores solamente pueden modificar determinados estados de los pedidos que tienen asignados.

## 🛠️ Tecnologías utilizadas

**Backend**
- [Node.js](https://nodejs.org/): entorno de ejecución de JavaScript.
- [Express](https://expressjs.com/): framework para desarrollar el servidor y gestionar las rutas.
- [Mongoose](https://mongoosejs.com/): modelado y conexión con MongoDB.

**Base de datos**
- [MongoDB](https://www.mongodb.com/): almacenamiento de la información del sistema.

**Frontend**
- [Pug](https://pugjs.org/): motor de plantillas para generar las vistas de la aplicación.
- HTML, CSS y JavaScript.

**Seguridad y herramientas**
- [JSON Web Token (JWT)](https://jwt.io/): autenticación mediante tokens.
- [Bcrypt](https://www.npmjs.com/package/bcrypt): cifrado de contraseñas.
- [Dotenv](https://www.npmjs.com/package/dotenv): administración de variables de entorno.
- [Nodemon](https://nodemon.io/): reinicio automático del servidor durante el desarrollo.

## 📁 Estructura del proyecto

La aplicación se organiza en módulos para separar las responsabilidades y facilitar el mantenimiento del código.

```text
FreshRoute/
│
├── app.js
├── package.json
├── .env
├── .gitignore
│
├── config/
│   └── db.js
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
│   └── vistas/
│
├── utils/
│   └── AppError.js
│
├── views/
│   ├── layout.pug
│   └── ...
│
└── public/
    ├── css/
    ├── js/
    └── img/
```

*La estructura representa la organización general del proyecto. Dentro de las carpetas de rutas y vistas se encuentran los archivos correspondientes a cada módulo.*

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Ingresar a la carpeta del proyecto

```bash
cd FreshRoute
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
PORT=3000
MONGO_URI=tu_uri_de_conexion_a_mongodb
SECRET=tu_clave_secreta_jwt
```

- `PORT`: puerto en el que se ejecutará el servidor.
- `MONGO_URI`: dirección de conexión a la base de datos MongoDB.
- `SECRET`: clave utilizada para firmar y verificar los tokens JWT.

**Importante:** el archivo `.env` contiene información sensible y no debe subirse al repositorio. Cada integrante debe configurar sus propias variables de entorno.

### 5. Iniciar el servidor

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor normalmente:

```bash
npm start
```

Una vez iniciado, acceder desde el navegador a:

```text
http://localhost:3000
```

## 🔑 Usuarios de prueba

Para facilitar las pruebas y la demostración del sistema, se dispone de las siguientes cuentas:

| Panel | Usuario |
|---|---|
| Administrativo principal | `miguel` |
| Administrativo | `csilva` |
| Administrativo | `sbarrientos` |
| Administrativo | `msosa` |
| Repartidores | `jperez` |
| Repartidores | `rdos` |

**Contraseña de las cuentas de prueba:** `123`

*Estas credenciales son únicamente para demostración y pruebas del proyecto. No deben utilizarse en un entorno de producción.*

## 🔐 Autenticación y manejo de errores

El sistema utiliza JWT para gestionar la autenticación de los usuarios. Las contraseñas se almacenan mediante hashing con Bcrypt.

Además, cuenta con middlewares para verificar sesiones y permisos según los roles, así como un manejador centralizado de errores que permite controlar distintos tipos de excepciones durante la ejecución de la aplicación.

## 🎓 Información académica

**Institución:** IFTS N.º 29  
**Materia:** Desarrollo de Sistemas Web (Back End)  
**Período:** Segundo cuatrimestre de 2026  
**Equipo:** TechLab – Grupo 3

## 👨‍💻 Integrantes

- [Miguel Marcaida]
- [Carolina Silva Cotto]
- [Sergio Cesar Barrientos]
- [Mariana Sosa]

## 📌 Estado del proyecto

Proyecto académico grupal en desarrollo, orientado a implementar un sistema web de gestión logística con autenticación, administración de datos y gestión de pedidos y entregas.