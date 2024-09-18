'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    username: String,
    password: String,
    rol:String
});

UsuarioSchema.pre('validate', function(next) {
    if (this.rol) {
        this.rol = this.rol.toLowerCase().trim(); // Convertir a minúsculas
    }
    next();
});

module.exports = 
    mongoose.model('usuarios', UsuarioSchema);