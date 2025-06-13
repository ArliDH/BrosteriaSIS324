const UserRepository = require('../repositories/UserRepositorie');

class UserController {
  // Obtener todos los usuarios
  static index(req, res) {
    UserRepository.getAll((err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener usuarios' });
      }
      res.json(users);
    });
  }

  // Crear nuevo usuario
  static store(req, res) {
    const user = { ...req.body };
    UserRepository.create(user, (err, newUser) => {
      if (err) {
        return res.status(500).json({ error: 'Error al crear usuario' });
      }
      res.status(201).json(newUser);
    });
  }

  // Obtener usuario por ID
  static show(req, res) {
    const id = req.params.id;
    UserRepository.getById(id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Error al buscar usuario' });
      }
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    });
  }

  // Actualizar usuario por ID
  static update(req, res) {
    const id = req.params.id;
    const user = { ...req.body };

    UserRepository.update(id, user, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar usuario' });
      }
      if (changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado para actualizar' });
      }
      res.json({ success: true, message: 'Usuario actualizado' });
    });
  }

  // Eliminar usuario
  static delete(req, res) {
    const id = req.params.id;

    UserRepository.delete(id, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: 'Error al eliminar usuario' });
      }
      if (changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado para eliminar' });
      }
      res.json({ success: true, message: 'Usuario eliminado' });
    });
  }

  static login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    UserRepository.getByEmailAndPassword(email, password, (err, user) => {
      if (err) return res.status(500).json({ error: 'Error del servidor' });
      if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

      res.json({
        success: true,
        message: `Usuario ${user.rol} logueado correctamente`,
        user: {
          id: user.id,
          nombre: user.nombre,
          apellidos: user.apellidos,
          rol: user.rol,
          nit: user.nit
        }
      });
    });
  }
}

module.exports = { UserController };
