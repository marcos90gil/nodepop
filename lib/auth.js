'use strict';

// Models
require('../models/usuarios_model.js');

let basicAuth = require('basic-auth-mongoose');
let mongoose = require('mongoose');
let Usuario = mongoose.model('Usuario');



let fn = function (user, pass) {
	return function (req, res, next) {
        let userRequest = basicAuth(req);
        
        Usuario.list({}, function (err, rows) {
            let valid = rows.map( function (obj) {
                if (!userRequest ||
                    userRequest.name !== obj.nombre ||
                    userRequest.pass !== obj.clave)
                {
                    return false;
                }
                return next();
            });
            console.log(valid);
        });
        
        //res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        //return res.send(401);

    }
};

module.exports = fn;
