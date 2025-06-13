const db_brosteria = require('../datas_bases/dbBrosteria');

const UserRepository = {
  getAll(callback) {
    const sql = 'SELECT * FROM users';
    db_brosteria.all(sql, [], callback);
  },

  getById(id, callback) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db_brosteria.get(sql, [id], callback);
  },

  create(user, callback) {
    const sql = `INSERT INTO users (username, password, nombre, apellidos, email, rol, nit) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [user.username, user.password, user.nombre, user.apellidos, user.email, user.rol, user.nit];
    db_brosteria.run(sql, params, function (err) {
      callback(err, { id: this.lastID, ...user });
    });
  },

  update(id, user, callback) {
    const sql = `UPDATE users SET username = ?, password = ?, nombre = ?, apellidos = ?, email = ?, rol = ?, nit = ?
                 WHERE id = ?`;
    const params = [user.username, user.password, user.nombre, user.apellidos, user.email, user.rol, user.nit, id];
    db_brosteria.run(sql, params, function (err) {
      callback(err, { id, ...user });
    });
  },

  delete(id, callback) {
    const sql = 'DELETE FROM users WHERE id = ?';
    db_brosteria.run(sql, [id], callback);
  },

  getByEmailAndPassword(email, password, callback) {
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db_brosteria.get(sql, [email, password], callback);
  }
};

module.exports = UserRepository;
