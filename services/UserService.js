//services/UserService.js
const UserRepository= require('../repositories/UserRepository');

class UserService{
    // Mostrar todos los usuarios
    static getAllUsers(callback) {
        UserRepository.getAllUsers(callback);
    }
    
    static getUserById(id, callback) {
        UserRepository.getUserById(id, callback);
    }
    
    static createUser(userData, callback) {
        UserRepository.createUser(userData, callback);
    }
    
    static updateUser(id, userData, callback) {
        UserRepository.updateUser(id, userData, callback);
    }
    
    static deleteUser(id, callback) {
        UserRepository.deleteUser(id, callback);
    }
    

    //otras opciones de validacion
}

module.exports = UserService;