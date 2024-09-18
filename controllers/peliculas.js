'use strict'

const peliculas = require('../models/peliculas');
var Peliculas = require('../models/peliculas');
var Usuario = require('../models/usuarios');

function consultarPeliculas(req,resp){
    Peliculas.find({}).then(
        (peliculas)=>{
            resp.status(200).send({peliculas: peliculas });
        },
        (err) => {
            resp.status(500).send({
                message: 'No se pudieron obtener las películas. Intente nuevamente.'
            });
        }
    );
}

function consultarPeliclasFiltradas(req,resp){
    var añoLanzamientoUsuario = req.query.añoLanzamiento;
    var precioUsuario = req.query.precio;

    if (!añoLanzamientoUsuario || !precioUsuario) {
        return resp.status(400).send({
            message: 'Debes ingresar los parámetros de año de lanzamiento y precio.'
        });
    }

        // Convertir a números los parámetros para la consulta
        añoLanzamientoUsuario = Number(añoLanzamientoUsuario);
        precioUsuario = Number(precioUsuario);

        Peliculas.find({
            añoLanzamiento: { $gt: añoLanzamientoUsuario },  // mayor que el año ingresado
            precio: { $lte: precioUsuario }  // menor o igual al precio ingresado
        }).then((peliculas) => {
            if (peliculas.length === 0) {
                resp.status(404).send({
                    message: 'No se encontraron películas con esos criterios.'
                });
            } else {
                resp.status(200).send({ peliculas });
            }
        }, (err) => {
            resp.status(500).send({
                message: 'Error al obtener películas filtradas.'
            });
        });
}


function crearPelicula(req, resp) {
    
    var usuarioId = req.userId;  
    var usuarioRol = req.userRol;

    console.log("Rol del usuario: ", usuarioRol);

    // Verificar si el usuario tiene rol de administrador
    if (usuarioRol === 'administrador') {
        // Si el usuario es administrador, crear la película
        var peliculaRecibida = req.body;

        var nuevaPelicula = new Peliculas();
        nuevaPelicula.titulo = peliculaRecibida.titulo;
        nuevaPelicula.director = peliculaRecibida.director;
        nuevaPelicula.añoLanzamiento = peliculaRecibida.añoLanzamiento;
        nuevaPelicula.productora = peliculaRecibida.productora;
        nuevaPelicula.precio = peliculaRecibida.precio;

        nuevaPelicula.save().then(
            (peliculaGuardada) => {
                resp.status(200).send({ peliculaCreada: peliculaGuardada });
            },
            (err) => {
                resp.status(500).send({
                    message: 'No se pudo crear, intente nuevamente'
                });
            }
        );
    } else {
        // Si el usuario no es administrador, devolver un error
        resp.status(403).send({
            message: 'No está autorizado para crear películas.'
        });
    }
}

   
module.exports = {
    crearPelicula,
    consultarPeliculas,
    consultarPeliclasFiltradas
} 
