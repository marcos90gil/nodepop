'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');
//var auth = require('../../../lib/auth.js'); // variable de entorno

/* Petición GET, sacar de la db CON AUTENTICACIÓN 
router.get('/', auth('admin', 'pass'), function(req, res) {
	
	var sort = req.query.sort || 'name';
	
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
	
	var sort = req.query.sort || 'name';
	
	Anuncio.list(sort, function(err, rows) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: rows });	
	});	
});

/* Petición POST, añadir un item */
router.post('/', function(req, res) {

	// Instanciamos objeto en memoria
	var anuncio = new Anuncio(req.body);

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
	var options = {};
	//var options = { multi: true }; // Para actualizar varios 
	Anuncio.update({ _id: req.params.id }, { $set: req.body }, options, function(err, data) {
		if (err) {
			return res.json( { result: false, error: err });
		}
		res.json({ result: true, rows: data });
	});

});

module.exports = router;