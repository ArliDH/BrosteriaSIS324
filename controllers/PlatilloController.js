//controllers/PlatilloController.js
const PlatilloRepository = require('../repositories/PlatilloRepositorie');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Controlador de platillos
class PlatilloController {

    // Obtener todos los platillos
    static index(req, res) {
        PlatilloRepository.getAll((err, platillos) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener platillos' });
            }
            res.json(platillos);
        });
    }

    // Obtener platillo por ID
    static show(req, res) {
        const codigo = req.params.codigo;
        PlatilloRepository.getById(codigo, (err, platillo) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener el platillo' });
            }
            if (!platillo) {
                return res.status(404).json({ error: 'Platillo no encontrado' });
            }
            res.json(platillo);
        });
    }

    // Crear nuevo platillo
    static store(req, res) {
        const platillo = {
            ...req.body,
            img: req.file ? `/uploads/${req.file.filename}` : null,
            descuento: req.body.descuento || 0 // asegúrate de esto
        };

        PlatilloRepository.create(platillo, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    error: 'Error al crear platillo'
                });
            }
            res.status(201).json({
                success: true,
                message: 'Platillo creado con éxito',
                codigo: result.codigo
            });
        });
    }


    static update(req, res) {
        const codigo = req.params.codigo;
        const platillo = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            img: req.file ? `/uploads/${req.file.filename}` : null,
            categoria: req.body.categoria,  // Si no se sube una nueva imagen, se deja como null
            descuento: req.body.descuento
        };

        // Si img es null y no se está proporcionando una imagen nueva, asegurémonos de no modificarla
        if (platillo.img === null) {
            delete platillo.img;  // Elimina img de la actualización si no se está proporcionando una nueva imagen
        }

        // Llamar al repositorio para hacer la actualización en la base de datos
        PlatilloRepository.updatePlatillo(codigo, platillo, (err, result) => {
            if (err) {
                console.error('Error en la actualización:', err);
                return res.status(500).json({ success: false, message: 'Error al actualizar el platillo', error: err });
            }

            // Verificar si hubo cambios
            if (result && result.changes > 0) {
                res.json({ success: true, message: 'Platillo actualizado con éxito' });
            } else {
                res.status(404).json({ success: false, message: 'Platillo no encontrado o no hubo cambios' });
            }
        });
    }




    // Eliminar platillo
    static delete(req, res) {
        const codigo = req.params.codigo;
        PlatilloRepository.delete(codigo, (err, result) => {
            if (result && result.changes > 0) {
                // Si se eliminó el platillo, enviamos 'success: true'
                res.json({ message: 'Platillo eliminado con éxito', changes: result.changes });
            } else {
                // Si no se eliminó, enviamos 'success: false'
                res.status(404).json({ message: 'Platillo no encontrado o no fue eliminado' });
            }
        });
    }
}

module.exports = { PlatilloController, upload };
