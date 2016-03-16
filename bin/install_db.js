'use strict';

// Models
require('../models/anuncios_model.js');
require('../models/usuarios_model.js');

let mongoose = require('mongoose');
let Anuncio = mongoose.model('Anuncio');
let Usuario = mongoose.model('Usuario');
let fs = require('fs');

// Inicialización de anuncios
Anuncio.remove(function(err) {

    if (err) {
        return console.log('ERROR', err);
    }

    console.log('anuncios eliminados');
    fs.readFile('./anuncios.json', { encoding: 'utf8' }, function(err, data) {

        if (err) {
            return console.log('ERROR', err);
        }

        let pack = JSON.parse(data);

        for (let i = 0; i < pack.anuncios.length; i++) {
            
            let anuncio = new Anuncio(pack.anuncios[i]);
            
            anuncio.save(function(err, newRow) {
                if (err) {
                    return console.log('ERROR', err);
                }
                return console.log('anuncios creados', newRow);             
            });

        }
    });

});

// Inicialización de usuarios
Usuario.remove(function(err) {

    if (err) {
        return console.log('ERROR', err);
    }

    console.log('usuarios eliminados');
    fs.readFile('./usuarios.json', { encoding: 'utf8' }, function(err, data) {

        if (err) {
            return console.log('ERROR', err);
        }

        let pack = JSON.parse(data);

        for (let i = 0; i < pack.usuarios.length; i++) {
            
            let ususario = new Usuario(pack.usuarios[i]);
            
            ususario.save(function(err, newRow) {
                if (err) {
                    return console.log('ERROR', err);
                }
                return console.log('usuarios creados', newRow);             
            });

        }
    });

});