'use strict'

var express = require('express');

var peliculasController = require ('../controllers/peliculas');

var token = require('../helpers/autenticacion');

const usuarios = require('../models/usuarios');

var authenticationController = require("../controllers/autenticacion");


var routes = express.Router();

routes.post('/api/peliculas',
    token.validarToken,
    peliculasController.crearPelicula
);

routes.get('/api/peliculas',
    token.validarToken,
    peliculasController.consultarPeliculas
);

routes.get('/api/peliculas/filtradas',
    token.validarToken,
    peliculasController.consultarPeliclasFiltradas
);


routes.post('/api/usuario',
    authenticationController.registrarUsuario
);

routes.post('/api/login',
    authenticationController.iniciarSesion
);


module.exports = routes;