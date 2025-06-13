const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { UserController } = require('./controllers/UserController');
const { PlatilloController, upload } = require('./controllers/PlatilloController');
const { PedidoController } = require('./controllers/PedidoController');

const app = express();

// Middleware para servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para servir imágenes desde /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para procesar formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware simulado de autenticación
function isAuthenticated(req, res, next) {
  // Aquí podrías integrar express-session o JWT más adelante
  return next();
}

// Rutas de usuarios
app.get('/users', isAuthenticated, UserController.index);
app.post('/users', isAuthenticated, UserController.store);
app.get('/users/:id', isAuthenticated, UserController.show);
app.put('/users/:id', isAuthenticated, UserController.update);
app.delete('/users/:id', isAuthenticated, UserController.delete);
app.post('/login', isAuthenticated, UserController.login);


// Rutas de platillos
app.get('/platillos', PlatilloController.index);
app.get('/platillos/:codigo', PlatilloController.show);
app.post('/platillos', upload.single('img'), PlatilloController.store);
app.put('/platillos/:codigo', upload.single('img'), PlatilloController.update);
app.delete('/platillos/:codigo', PlatilloController.delete);

//Rutas de pedidos
app.get('/Pedir', PedidoController.index);
app.post('/Pedir', PedidoController.store);
app.get('/PedidosUser', PedidoController.indexTodos);
app.post('/Pedir/editar', PedidoController.editarCantidad);
app.delete('/Pedir/eliminar/:id', PedidoController.eliminar);

// Ruta de inicio (sirve el HTML principal)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Inicio.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
