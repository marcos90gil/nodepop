'use strict';

/* jshint node: true */

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Usuario = mongoose.model('Usuario');

/* Petición GET con renderizado de vista */
router.get('/view', function(req, res) {
	
	Usuario.list({}, function(err, rows) {
		// cuando estén disponibles mando la vista
		res.render('usuarios_view', {usuarios: rows});	
	});

});

/* Petición GET, sacar de la db*/
router.get('/', function(req, res) {
	
	let sort = req.query.sort || 'name';
	
	Usuario.list(sort, function(err, rows) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: rows });	
	});	
});

/**
 * @api {post} apiv1/usuarios Crear nuevo usuario
 * @apiVersion 0.1.0
 * @apiName PostUsuario
 * @apiGroup Usuarios
 * @apiPermission none
 *
 * @apiDescription Creación de un usuario por el método post, al no tener interfaz se recomienda utilizar la herramienta POSTMAN con los campos en 'urlencoded'. Cuando se añade un usuario con exito se muestra como respuesta el usuario en un objeto json.
 *
 * @apiParam {String} username Nombre del usuario.
 * @apiParam {String} email Email del usuario.
 * @apiParam {String} password Contraseña del usuario.
 *
 * @apiSuccess {String} id         Guarda usuario en la base de datos con su id correspondiente.
 *
 */
router.post('/', function(req, res) {

	// Instanciamos objeto en memoria
	let usuario = new Usuario(req.body);

	// Guardamos en la base de datos
	usuario.save(function(err, newRow) {
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
	Usuario.update({ _id: req.params.id }, { $set: req.body }, options, function(err, data) {
		if (err) {
			return res.json( { result: false, error: err });
		}
		res.json({ result: true, rows: data });
	});

});

/* Petición DELETE ALL, eliminar todos los items*/
router.delete('/', function(req, res) {
	Usuario.remove(function(err) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: 'DELETED' });
	});
});

module.exports = router;