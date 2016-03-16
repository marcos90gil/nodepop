'use strict';

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Anuncio = mongoose.model('Anuncio');
let auth = require('../../../lib/auth.js'); // variable de entorno

router.use(auth()); // MIDDLEWARE de autenticación general

/* Petición GET, sacar de la db CON AUTENTICACIÓN 
router.get('/', auth('admin', 'pass'), function(req, res) {
	
	let sort = req.query.sort || 'name';
	
	Anuncio.list(sort, function(err, rows) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: rows });	
	});	
});
*/

/* Petición GET, sacar de la db*/
router.get('/', function(req, res) {
	//console.log(req.query);
	let nombre = req.query.nombre || '';
	let venta = req.query.venta || '';
	let tags = req.query.tag || '';
	let precio = req.query.precio || '';
	let filters = {};
	let sort = req.query.sort || 'nombre';
	let start = parseInt(req.query.start) || 0;
	let lim = parseInt(req.query.limit) || 0;
	
	if (nombre !== '') {
		filters.nombre = new RegExp('^' + nombre, "i");
	}
	if (venta !== '') {
		filters.venta = venta;
	}
	if (tags !== '') {
		filters.tags = tags;
	}
	
	let precioSplit = precio.split('-');
	let patternRange = /\d-\d/;
	let patternMin = /\d-/;
	let patternMax = /-\d/;

	if (patternRange.test(precio)) {
		filters.precio = {$gt: precioSplit[0], $lt: precioSplit[1]};
	} else if (patternMin.test(precio)) {
		filters.precio = {$gt: precioSplit[0]};
	} else if (patternMax.test(precio)) {
		filters.precio = {$lt: precioSplit[1]};
	} else if (precio !== '') {
		filters.precio = precio;
	}

	console.log('filtros:', filters);
	console.log('sort:', sort);
	console.log('start:', start);
	console.log('lim:', lim);

	Anuncio.list(filters, sort, start, lim, function(err, rows) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: rows });	
	});	

});

/* Petición POST, añadir un item */
router.post('/', function(req, res) {

	// Instanciamos objeto en memoria
	let anuncio = new Anuncio(req.body);

	// Guardamos en la base de datos
	anuncio.save(function(err, newRow) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: newRow });
	});

});

/* Petición PUT, editar un item */
router.put('/:id', function(req, res) {
	let options = {};
	//var options = { multi: true }; // Para actualizar varios 
	Anuncio.update({ _id: req.params.id }, { $set: req.body }, options, function(err, data) {
		if (err) {
			return res.json( { result: false, error: err });
		}
		res.json({ result: true, rows: data });
	});

});

/* Petición DELETE ALL, eliminar todos los items*/
router.delete('/', function(req, res) {
	Anuncio.remove(function(err) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: 'DELETED' });
	});
});

module.exports = router;