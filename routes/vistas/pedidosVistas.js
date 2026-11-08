const express = require("express");
const router = express.Router();
const pedidosController = require("../../controllers/pedidosController");
const AppError = require("../../utils/AppError");
const { permitirRolesVista } = require("../../middlewares/permitirRoles");

// Solo Superadmin, Gerente y Administrativo gestionan pedidos
router.use(permitirRolesVista("superadmin", "gerente", "administrativo"));

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

// Formulario de nuevo pedido
router.get("/nuevo", async (req, res, next) => {
  try {
    const { clientes, productos, repartidores } = await pedidosController.obtenerDatosNuevoPedidoParaVista();
    res.render("pedidos/nuevo", { titulo: "Nuevo Pedido", clientes, productos, repartidores });
  } catch (error) {
    next(error);
  }
});

// Guardar pedido. Si hay un error de datos (ej: sin stock), se vuelve a mostrar el formulario con el mensaje.
router.post("/guardar", async (req, res, next) => {
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

// Cancelar un pedido
router.post("/:id/cancelar", async (req, res, next) => {
  try {
    await pedidosController.cambiarEstadoParaVista(req.params.id, "Cancelado", res.locals.usuarioLogueado);
    res.redirect("/pedidos");
  } catch (error) {
    next(error);
  }
});

module.exports = router;