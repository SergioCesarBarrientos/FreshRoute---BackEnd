const express = require("express");
const router = express.Router();
const pedidosController = require("../../controllers/pedidosController");
const AppError = require("../../utils/AppError");
const { permitirRolesVista } = require("../../middlewares/permitirRoles");

// Cualquiera de estos roles puede ENTRAR al módulo de pedidos
router.use(permitirRolesVista("superadmin", "gerente", "administrativo"));

// Middleware específico para CREAR pedidos (solo SuperAdmin y Administrativo)
const puedeCrearPedido = (req, res, next) => {
  const rolesPermitidos = ['superadmin', 'administrativo'];
  if (res.locals.usuarioLogueado && rolesPermitidos.includes(res.locals.usuarioLogueado.rol)) {
    return next();
  }
  return res.status(403).send("Acceso denegado. Solo un SuperAdmin o Administrativo puede crear pedidos.");
};

// Convierte los campos repetidos del formulario (producto y cantidad) en una lista de ítems
const aLista = (valor) => (valor === undefined ? [] : Array.isArray(valor) ? valor : [valor]);
const armarItemsDesdeFormulario = (body) => {
  const productos = aLista(body.producto);
  const cantidades = aLista(body.cantidad);
  return productos.map((producto, i) => ({ producto, cantidad: cantidades[i] }));
};

// Lista de pedidos (con filtro opcional por estado)
router.get("/", async (req, res, next) => {
  try {
    const estado = req.query.estado || "";
    const pedidos = await pedidosController.obtenerPedidosParaVista(res.locals.usuarioLogueado, { estado });
    res.render("pedidos/lista", { titulo: "Pedidos", pedidos, estado });
  } catch (error) {
    next(error);
  }
});

// Formulario de nuevo pedido (SOLO SuperAdmin y Administrativo)
router.get("/nuevo", puedeCrearPedido, async (req, res, next) => {
  try {
    const { clientes, productos, repartidores } = await pedidosController.obtenerDatosNuevoPedidoParaVista();
    res.render("pedidos/nuevo", { titulo: "Nuevo Pedido", clientes, productos, repartidores });
  } catch (error) {
    next(error);
  }
});

// Guardar pedido (SOLO SuperAdmin y Administrativo)
router.post("/guardar", puedeCrearPedido, async (req, res, next) => {
  try {
    await pedidosController.crearPedidoParaVista(
      { cliente: req.body.cliente, repartidor: req.body.repartidor, items: armarItemsDesdeFormulario(req.body) },
      res.locals.usuarioLogueado
    );
    res.redirect("/pedidos");
  } catch (error) {
    if (error instanceof AppError && error.statusCode < 500) {
      try {
        const { clientes, productos, repartidores } = await pedidosController.obtenerDatosNuevoPedidoParaVista();
        return res.status(error.statusCode).render("pedidos/nuevo", {
          titulo: "Nuevo Pedido",
          clientes,
          productos,
          repartidores,
          error: error.message,
        });
      } catch (errorCarga) {
        return next(errorCarga);
      }
    }
    next(error);
  }
});

// Cancelar un pedido (SuperAdmin, Gerente y Administrativo pueden cancelar)
router.post("/:id/cancelar", async (req, res, next) => {
  try {
    await pedidosController.cambiarEstadoParaVista(req.params.id, "Cancelado", res.locals.usuarioLogueado);
    res.redirect("/pedidos");
  } catch (error) {
    next(error);
  }
});

// Ver detalle de un pedido
router.get("/detalle/:id", async (req, res, next) => {
  try {
    const pedido = await pedidosController.obtenerPedidoParaVista(req.params.id, res.locals.usuarioLogueado);
    res.render("pedidos/detalle", { titulo: "Detalle del Pedido", pedido });
  } catch (error) {
    next(error);
  }
});

module.exports = router;