//services/PlatilloService.js
const PlatilloRepository = require('../repositories/PlatilloRepositorie');

class PlatilloService {
    static getAll(callback) {
        PlatilloRepository.getAll(callback);
    }

    static geById(codigo, callback) {
        PlatilloRepository.getById(codigo, callback);
    }

    static create(platilloData, callback) {
        PlatilloRepository.create(platilloData, callback);
    }

    static updatePlatillo(codigo, platilloData, callback) {
        PlatilloRepository.updatePlatillo(codigo, platilloData, callback);
    }

    static deletePlatillo(codigo, callback) {
        PlatilloRepository.deletePlatillo(codigo, callback);
    }
}

module.exports = PlatilloService;