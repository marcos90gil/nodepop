'use strict';

let conn = require('../lib/connectMongoose.js');
let mongoose = require('mongoose');

// Creo el esquema
let anuncioSchema = mongoose.Schema({
	nombre: String,
	venta: Boolean,
	precio: Number,
	foto: String,
	tags: [String]
});

anuncioSchema.statics.list = function(sort, cb) {
	// preparamos las query sin ejecutar
	let query = Anuncio.find({});
	// añadimos más parámetros a la query y ejecutamos
	query.sort(sort);
	query.exec(function(err, rows){
		if (err) {
			return cb(err);
		}
		return cb(null, rows);		
	});
};

// Lo registro en mongoose
let Anuncio = mongoose.model('Anuncio', anuncioSchema);