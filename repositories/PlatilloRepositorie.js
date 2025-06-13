//repositories/PlatilloRepositorie.js
const db_brosteria = require('../datas_bases/dbBrosteria');

const PlatilloRepository = {
    getAll(callback) {
        db_brosteria.all('SELECT * FROM platillos', callback);
    },

    getById(codigo, callback) {
        db_brosteria.get('SELECT * FROM platillos WHERE codigo = ?', [codigo], callback);
    },

    create(platillo, callback) {
        db_brosteria.run(
            'INSERT INTO platillos (nombre, descripcion, precio, img, categoria, descuento) VALUES (?, ?, ?, ?, ?, ?)',
            [platillo.nombre, platillo.descripcion, platillo.precio, platillo.img, platillo.categoria, platillo.descuento],
            function (err) {
                if (err) {
                    console.error(err); // <-- esto ayudará a detectar errores
                    return callback(err);
                }
                callback(null, { codigo: this.lastID });
            }
        );
    },

    updatePlatillo(codigo, platillo, callback) {
        // Si no hay imagen, excluye la columna img de la consulta
        const query = platillo.img ?
            'UPDATE platillos SET nombre = ?, descripcion = ?, precio = ?, img = ?, categoria = ?, descuento = ? WHERE codigo = ?' :
            'UPDATE platillos SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, descuento = ? WHERE codigo = ?';

        const params = platillo.img ?
            [platillo.nombre, platillo.descripcion, platillo.precio, platillo.img, platillo.categoria, platillo.descuento, codigo] :
            [platillo.nombre, platillo.descripcion, platillo.precio, platillo.categoria, platillo.descuento, codigo];

        db_brosteria.run(query, params, function (err) {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                return callback(err);
            }
            callback(null, { changes: this.changes });
        });
    },


    delete(codigo, callback) {
        db_brosteria.run('DELETE FROM platillos WHERE codigo = ?', [codigo], function (err) {
            if (err) return callback(err);
            // Devuelve el número de filas afectadas
            callback(null, { changes: this.changes });
        });
    }
};

module.exports = PlatilloRepository;
