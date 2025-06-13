//services/PedidoService.js
const PedidoRepository= require('../repositories/PedidoRepository');

class PedidoService{
    // Mostrar todos los pedidos
    static getAllPedidos(callback) {
        PedidoRepository.getAll(callback)
    }

    static getPedidoById(codigo, callback) {
        PedidoRepository.getById(codigo, callback)
    }

    static createPedido(pedidoData, callback) {
        PedidoRepository.create(pedidoData, callback)
    }

    static updatePedido(codigo, pedidoData, callback) {
        PedidoRepository.update(codigo, pedidoData, callback)
    }

    static deletePedido(codigo, callback) {
        PedidoRepository.delete(codigo, callback)
    }
}

module.exports = PedidoService;