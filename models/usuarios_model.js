'use strict';

let conn = require('../lib/connectMongoose.js');
let mongoose = require('mongoose');

// Creo el esquema
let usuarioSchema = mongoose.Schema({
	nombre: String,
	email: String,
});

usuarioSchema.statics.list = function(sort, cb) {
	// preparamos las query sin ejecutar
	let query = Usuario.find({});
	// añadimos más parámetros a la query y ejecutamos
	query.sort(sort);
	query.exec(function(err, rows){
		if (err) {
			return cb(err);
		}
		return cb(null, rows);		
	});
};

// Añado funcionalidad para autenticación
usuarioSchema.plugin(require('basic-auth-mongoose'));
// Lo registro en mongoose
let Usuario = mongoose.model('Usuario', usuarioSchema);