const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite3');

// Crear tablas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        nombre TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        rol TEXT NOT NULL CHECK (rol IN ('cliente', 'cajero', 'gerente')),
        nit INT NOT NULL
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS platillos (
    codigo INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio INT NOT NULL,
    descripcion TEXT NOT NULL,
    img TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('platillo', 'bebidas', 'extras')),
    descuento DECIMAL(3,2) DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    platillo_codigo INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    total REAL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (platillo_codigo) REFERENCES platillos(codigo)
  )`);
});

module.exports = db;
