// controllers/PedidoController.js
const PedidoRepository = require('../repositories/PedidoRepositorie');
const PlatilloRepository = require('../repositories/PlatilloRepositorie');
//const UserRepository = require('../repositories/UserRepositorie');

// controles del pedido
class PedidoController {
  // Mostrar todos los pedidos
  static index(req, res) {
    const userId = req.query.id; // porque lo estás mandando en la URL

    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario faltante' });
    }

    PedidoRepository.getAllPedidos(userId, (err, pedidos) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener pedidos' });
      }

      res.json(pedidos);
    });
  }


  static store(req, res) {
    const { idUsuario, idPlatillo } = req.body;

    if (!idUsuario || !idPlatillo) {
      return res.status(400).json({ success: false, message: 'Faltan datos' });
    }

    PedidoRepository.createOrUpdate({ user_id: idUsuario, platillo_codigo: idPlatillo }, (err, pedido) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al guardar pedido' });
      }
      res.json({ success: true, message: 'Pedido Seleccionado', pedido });
    });
  }


  static indexTodos(req, res) {
    PedidoRepository.getAll_Pedidos((err, pedidos) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener pedidos de clientes' });
      }
      res.json(pedidos);
    });
  }

  //Mostrar formulario de edicion
  static edit(req, res) {
    const id = req.params.id;
    PedidoRepository.getById(id, (err, pedido) => {
      if (err) throw err;
      res.render('--pagina aqui--', { pedido });
    });
  }

  //Actualizar pedido
  static editarCantidad(req, res) {
    const { id, cantidad } = req.body;

    PedidoRepository.updateCantidadPedido(id, cantidad, (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Error al actualizar pedido' });
      }
      res.json({ success: true });
    });
  }

  //Eliminar pedido
  static eliminar(req, res) {
    const id = req.params.id;

    PedidoRepository.deletePedido(id, (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Error al eliminar pedido' });
      }
      res.json({ success: true });
    });
  }
}

module.exports = { PedidoController };