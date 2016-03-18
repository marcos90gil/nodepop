'use strict';

// Scrip de inicialización utilizando promesas

// Models
require('../models/anuncios_model.js');
require('../models/usuarios_model.js');

let mongoose = require('mongoose');
let Anuncio = mongoose.model('Anuncio');
let Usuario = mongoose.model('Usuario');
let fs = require('fs');
let async = require('async');

// Función para eliminar todos los elementos de una colección. 
// Parámetros: modelo que queremos eliminar
function deleteDB(collection) {

    return new Promise(function(resolve, reject) {
        collection.remove(function(err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

// Función para leer archivos
// Parámetros: archivo que queremos leer
function readFilePromise(file) {
    return new Promise(function(resolve, reject) {
        fs.readFile(file, { encoding: 'utf8' }, function(err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

// Función para guardar anuncios
// Parámetros: recibe los elementos en formato JSON 
function saveAnuncios(element) {

    return new Promise(function(resolve, reject) {

        let pack = JSON.parse(element);
        async.eachSeries(pack.anuncios, function saving(item, next) {
                let anuncio = new Anuncio(item);
                anuncio.save(function(err) {
                    if (err) {
                        next(err);
                    }
                    next(null);
                    //Si aqui hay un error, se va a la función
                    //finalizadora y termina. Si tiene valor null, 
                    //sigue con el siguiente elemento.
                });
            },
            function ending(err) {
                if (err !== null) {
                    reject('ERROR AL AÑADIR ANUNCIOS');
                }
                resolve(console.log('ANUNCIOS INICIALIZADOS'));
            });

    });
}

// Función para guardar usuarios
// Parámetros: recibe los elementos en formato JSON
function saveUsuarios(element) {

    return new Promise(function(resolve, reject) {

        let pack = JSON.parse(element);
        async.eachSeries(pack.usuarios, function saving(item, next) {
            let usuario = new Usuario(item);
            usuario.save(function(err) {
                if (err) {
                    next(err);
                }
                next(null);
                //Si aqui hay un error, se va a 
                //la función finalizadora y termina. 
                //Si tiene valor null, sigue con el siguiente elemento.
            });
        },
        function ending(err) {
            if (err !== null) {
                reject('ERROR AL AÑADIR USUARIOS');
            }
            resolve(console.log('USUARIOS INICIALIZADOS'));
        });

    });
}

console.log('Empezamos');
deleteDB(Anuncio)
    .then(function() {
        console.log('borrar anuncios');
        return readFilePromise('./anuncios.json');
    })
    .then(saveAnuncios)
    .then(function() {
        return deleteDB(Usuario);
    })
    .then(function() {
        return readFilePromise('./usuarios.json');
    })
    .then(function() {
        process.exit();
    })
    .then(saveUsuarios)
    .catch(function(err) {
        console.log('ERROR EN EL PROCESO DE CARGA DE BD', err);
        process.exit(1);
    });
