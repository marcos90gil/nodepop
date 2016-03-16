'use strict';

// Models
require('../models/usuarios_model.js');
require('basic-auth-mongoose');


let basicAuth = require('basic-auth');
let mongoose = require('mongoose');
let Usuario = mongoose.model('Usuario');

let fn = function () {
	return function (req, res, next) {
        let userRequest = basicAuth(req) || '';
        Usuario.findOne({ 'username': userRequest.name }, function (err, rows) {
            if (err) {
                res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
                return res.sendStatus(401);
            }
            if ( rows !== null && rows.authenticate(userRequest.pass) ) {
                next();
            } else {
                res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
                return res.sendStatus(401);
            }
        });

    }
};

module.exports = fn;
