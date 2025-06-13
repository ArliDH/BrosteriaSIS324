//repositories/PedidoRepositorie.js
const db_brosteria = require('../datas_bases/dbBrosteria');

//Pedidos
const pedidoRepository = {

    getAllPedidos(userId, callback) {
        db_brosteria.all(`
        SELECT 
            u.nombre AS nombre_usuario,
            u.apellidos AS apellido_usuario,
            u.nit AS nit_usuario,
            pl.nombre AS platillo_nombre,
            pl.precio AS precio_platillo,
            pl.descuento AS descuento_platillo,
            pe.id AS id_pedido,
            pe.cantidad,
            pe.total
        FROM pedidos pe
        JOIN users u ON u.id = pe.user_id
        JOIN platillos pl ON pl.codigo = pe.platillo_codigo
        WHERE u.id = ?
    `, [userId], callback);
    },
    getAll_Pedidos(callback) {
        db_brosteria.all(`
        SELECT 
            u.nombre AS nombre_usuario,
            u.apellidos AS apellido_usuario,
            u.nit AS nit_usuario,
            pl.nombre AS platillo_nombre,
            pl.precio AS precio_platillo,
            pl.descuento AS descuento_platillo,
            pe.id AS id_pedido,
            pe.cantidad,
            pe.total
        FROM pedidos pe
        JOIN users u ON u.id = pe.user_id
        JOIN platillos pl ON pl.codigo = pe.platillo_codigo
        WHERE u.rol = 'cliente'
    `, callback);
    },
    getPedidoById(id, callback) {
        db_brosteria.get('SELECT * FROM pedidos WHERE id = ?', [id], callback);
    },

    createOrUpdate({ user_id, platillo_codigo }, callback) {
        // Primero buscar pedido existente
        db_brosteria.get(
            'SELECT * FROM pedidos WHERE user_id = ? AND platillo_codigo = ?',
            [user_id, platillo_codigo],
            (err, pedido) => {
                if (err) return callback(err);

                if (pedido) {
                    // Actualizar cantidad y total
                    const nuevaCantidad = pedido.cantidad + 1;

                    // Obtener precio del platillo (puedes hacerlo con otro query o usando JOIN)
                    db_brosteria.get('SELECT precio FROM platillos WHERE codigo = ?', [platillo_codigo], (err, platillo) => {
                        if (err) return callback(err);

                        const nuevoTotal = nuevaCantidad * platillo.precio;

                        db_brosteria.run(
                            'UPDATE pedidos SET cantidad = ?, total = ? WHERE id = ?',
                            [nuevaCantidad, nuevoTotal, pedido.id],
                            function (err) {
                                if (err) return callback(err);
                                callback(null, { id: pedido.id, cantidad: nuevaCantidad, total: nuevoTotal });
                            }
                        );
                    });
                } else {
                    // Crear nuevo pedido con cantidad 1
                    db_brosteria.get('SELECT precio FROM platillos WHERE codigo = ?', [platillo_codigo], (err, platillo) => {
                        if (err) return callback(err);

                        const total = platillo.precio;

                        db_brosteria.run(
                            'INSERT INTO pedidos (user_id, platillo_codigo, cantidad, total) VALUES (?, ?, ?, ?)',
                            [user_id, platillo_codigo, 1, total],
                            function (err) {
                                if (err) return callback(err);
                                callback(null, { id: this.lastID, cantidad: 1, total });
                            }
                        );
                    });
                }
            }
        );
    },


    // Buscar si ya existe pedido del mismo platillo por el mismo usuario
    updateCantidadPedido(idPedido, nuevaCantidad, callback) {
        db_brosteria.run(`
        UPDATE pedidos SET cantidad = ? WHERE id = ?
    `, [nuevaCantidad, idPedido], callback);
    },

    // Actualizar cantidad y total
    updateCantidadYTotal(id, nuevaCantidad, nuevoTotal, callback) {
        db_brosteria.run(
            'UPDATE pedidos SET cantidad = ?, total = ? WHERE id = ?',
            [nuevaCantidad, nuevoTotal, id],
            function (err) {
                if (err) return callback(err);
                callback(null);
            }
        );
    },

    updatePedido(id, pedido, callback) {
        db_brosteria.run('UPDATE pedidos SET platillo = ?, extra = ?, cantidad = ?, total = ? WHERE id = ?', [pedido.platillo, pedido.extra, pedido.cantidad, pedido.total, id], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, { changes: this.changes });
        });
    },
    deletePedido(idPedido, callback) {
        db_brosteria.run(`
        DELETE FROM pedidos WHERE id = ?
    `, [idPedido], callback);
    }
};

module.exports = pedidoRepository;