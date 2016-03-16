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

// Muestra lista según sort
anuncioSchema.statics.list = function(filters, sort, start, lim, cb) {
	// preparamos las query sin ejecutar
	let query = Anuncio.find(filters);
	// añadimos más parámetros a la query y ejecutamos
	query.sort(sort);
	query.skip(start);
	query.limit(lim);
	query.exec(function(err, rows){
		if (err) {
			return cb(err);
		}
		return cb(null, rows);		
	});
};


anuncioSchema.statics.listFiltered = function(filters, cb) {
	// preparamos las query sin ejecutar
	let query = Anuncio.find(filters);
	// añadimos más parámetros a la query y ejecutamos
	//query.sort(sort);
	query.exec(function(err, rows){
		if (err) {
			return cb(err);
		}
		return cb(null, rows);		
	});
};

// Lo registro en mongoose
let Anuncio = mongoose.model('Anuncio', anuncioSchema);