'use strict'

var Usuario = require('../models/usuarios');
var token = require("../helpers/autenticacion");
var bcrypt = require("bcryptjs");

function registrarUsuario(req, resp){

    var parametros  = req.body;
    var salt = bcrypt.genSaltSync(10);

    var password = 
    bcrypt.hashSync(parametros.password, salt);

    var rolesPermitidos = ['administrador', 'usuario basico'];
    var rolValidado = parametros.rol ? parametros.rol.toLowerCase().trim() : '';
 
        if (!rolesPermitidos.includes(rolValidado)) {
            return resp.status(400).send({
                message: "El rol proporcionado no es válido. Debe ser 'administrador' o 'usuario basico'."
            });
        }

    var nuevoUsuario  = new Usuario();
    nuevoUsuario.username = parametros.username;
    nuevoUsuario.rol = parametros.rol;
    nuevoUsuario.password = password;

    nuevoUsuario.save().then(
        (usuarioGuardado) => {
            resp.status(200).send({ usuarioCreado: usuarioGuardado });
        },
        err => {
            resp.status(500).send({
                message: "No se pudo crear, intente nuevamente"
            });
        }
    );

}

function iniciarSesion ( req, resp){
    var parametros = req.body;

    var usernameIngresado = parametros.username;
    var passwordIngresado = parametros.password;

    Usuario.findOne({username: usernameIngresado}).then(
        (usuarioEncontrado) => {
            if(usuarioEncontrado == null){
                resp.status(403).send({
                    message: "No existe usuario"
                });
            }
            else{
                if(bcrypt.compareSync(
                    passwordIngresado,
                     usuarioEncontrado.password)){
                        resp.status(200).send({
                            message: "Login exitoso",
                            token: 
                            token.generarTokenUsuario(usuarioEncontrado)
                        });
                     }
                     else{
                        resp.status(403).send({
                            message: "Credenciales incorrectas"
                        });

                     }
            }

        },
        err=>{
            resp.status(500).send({
                message: "No se pudo validar usuario"
            });
        }
    );
}

module.exports ={
    iniciarSesion, registrarUsuario
}
