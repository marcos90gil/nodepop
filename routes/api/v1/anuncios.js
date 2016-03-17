'use strict';

/* jshint node: true */

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Anuncio = mongoose.model('Anuncio');
let auth = require('../../../lib/auth.js'); // variable de entorno

router.use(auth()); // MIDDLEWARE de autenticación general

/**
 * @api {get} apiv1/anuncios? Mostrar y filtrar anuncios
 * @apiVersion 0.1.0
 * @apiName GetAnuncios
 * @apiGroup Anuncios
 * @apiPermission admin
 *
 * @apiDescription Para obtener una lista de los anuncios existentes en la base de datos con la posibilidad de filtrar los resultados, para ello se añade un signo '?' al final de la url y se busca con queries 'clave=valor' concatenadas por '&'
 *
 * @apiParam {String} nombre Nombres de artículos, se puede buscar con palabras incompletas. Ej: bicicleta, bic, iphone, ip, etc.
 * @apiParam {String} venta true (artículos en venta), false (propuestas de compra).
 * @apiParam {String} tag work, lifestyle, motor o mobile
 * @apiParam {String} precio Número (busca por precio justo), 60-1000 (rango de precios), 60- (desde un precio mínimo), -1000 (hasta un precio máximo).
 * @apiParam {String} sort nombre ó precio (ordenar por orden alfabético o de menor a mayor precio, si queremos inverti el orden incluimos un '-' sort=-precio)
 * @apiParam {Number} start Número (empieza a partir del elemento pedido, sirve para paginar los resultados)
 * @apiParam {Number} limit Número (solo muestra el número dado de resultados, sirve para paginar los resultados)
 * @apiParam {String} select all ó nombre de clave (por defecto en la respuesta json se muestran los campos nombre, precio, venta y tags de los anuncios. Si se quieren obtener todos los campos guardados en la base de datos se utiliza select=all, si se quieren campos concretos se añaden a la query select separados por espacios ' ' o '%20'. El campo id tiene un comportamiento que lo muestra por defecto con la llamada select, para evitar que salga se añade a la query '-_id')
 *
 * @apiExample Ejemplo de filtrado:
 * curl -i http://localhost:3000/apiv1/anuncios?tag=mobile&venta=true&nombre=ip&precio=50-&start=0&limit=2&sort=precio
 * @apiExample Ejemplo de selección de respuestas:
 * curl -i http://localhost:3000/apiv1/anuncios?select=nombre precio&sort=-precio
 *
 * @apiSuccess {Object}   JSON       Respuesta de la petición
 * @apiSuccess {Boolean}  Result     Resultado true o false
 * @apiSuccess {Object}   Rows       Objeto con artículos
 * @apiSuccess {String}   nombre     Nombre del artículo
 * @apiSuccess {Number}   precio     Precio del artículo
 * @apiSuccess {Boolean}  venta      En venta o compra
 * @apiSuccess {String}   foto       Nombre del archivo
 * @apiSuccess {Array}   tags       Matriz con tags
 *
 * @apiError Unauthorized Se requiere autenticación.
 *
 * @apiErrorExample Response (example):
 *     Unauthorized
 */
router.get('/', function (req, res) {

	let nombre = req.query.nombre || '';
	let venta = req.query.venta || '';
	let tags = req.query.tag || '';
	let precio = req.query.precio || '';
	let filters = {};
	let sort = req.query.sort || 'nombre';
	let start = parseInt(req.query.start) || 0;
	let lim = parseInt(req.query.limit) || 0;
	let sel = req.query.select || '-_id nombre precio venta foto tags';
	
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

	// console.log('filtros:', filters);
	// console.log('sort:', sort);
	// console.log('start:', start);
	// console.log('lim:', lim);
	// console.log('select:',sel);

	Anuncio.list(filters, sort, start, lim, sel, function (err, rows) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: rows });	
	});	

});

/**
 * @api {get} apiv1/anuncios/tags Mostrar lista de tags
 * @apiVersion 0.1.0
 * @apiName GetTags
 * @apiGroup Anuncios
 * @apiPermission none
 *
 * @apiDescription Esta función muestra en un objeto json todos los tags disponibles más todos los tags de los objetos presentes en la base de datos.
 *
 * @apiParam {String} tags Cadena de texto con los tags permitidos.
 * @apiParam {Object} result Objeto con los tags de todos los anuncios guardados en la base de datos.
 *
 */
router.get('/tags', function (req, res) {
	let tags = 'Tags permitidos: work, lifestyle, motor o mobile';
	let query = Anuncio.find({});
	query.select('tags -_id');
	query.exec(function (err, rows) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ tags: tags, result: true, rows: rows });		
	});

});

/**
 * @api {post} apiv1/anuncios Crear nuevo anuncio
 * @apiVersion 0.1.0
 * @apiName PostAnuncio
 * @apiGroup Anuncios
 * @apiPermission none
 *
 * @apiDescription Creación de un anuncio por el método post, al no tener interfaz se recomienda utilizar la herramienta POSTMAN con los campos en 'urlencoded'. Cuando se añade un anuncio con exito se muestra como respuesta el anuncio en un objeto json.
 *
 * @apiParam {String} nombre Nombre del artículo.
 * @apiParam {String} precio Precio del artículo.
 * @apiParam {Boolean} venta true (artículos en venta), false (propuestas de compra).
 * @apiParam {String} foto Foto del artículo.
 * @apiParam {String} tag work, lifestyle, motor o mobile
 *
 * @apiSuccess {String} id         Guarda artículo en la base de datos con su id correspondiente.
 *
 */
router.post('/', function (req, res) {

	// Instanciamos objeto en memoria
	let anuncio = new Anuncio(req.body);

	// Guardamos en la base de datos
	anuncio.save(function (err, newRow) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: newRow });
	});

});

/**
 * @api {put} apiv1/anuncios/:id Editar un artículo
 * @apiVersion 0.1.0
 * @apiName PutAnuncio
 * @apiGroup Anuncios
 * @apiPermission none
 *
 * @apiDescription Esta función edita un anuncio seleccionado por id, se recomienda utilizar también la herramienta POSTMAN con los campos en 'urlencoded'. Si se completa con éxito la edición la respuesta, que es un objeto json, contendrá un campo "nModified": 1, si se produce algún error  el susodicho campo valdrá 0, "nModified": 0.
 *
 * @apiParam {String} name Name of the User.
 *
 */
router.put('/:id', function (req, res) {
	let options = {};
	//var options = { multi: true }; // Para actualizar varios 
	Anuncio.update({ _id: req.params.id }, { $set: req.body }, options, function (err, data) {
		if (err) {
			return res.json( { result: false, error: err });
		}
		res.json({ result: true, rows: data });
	});

});

/**
 * @api {delete} apiv1/anuncios Eliminar todos los anuncios
 * @apiVersion 0.1.0
 * @apiName DeleteAnuncio
 * @apiGroup Anuncios
 * @apiPermission none
 *
 * @apiDescription Esta función elimina todos los anuncios de la base de datos.
 *
 */
router.delete('/', function (req, res) {
	Anuncio.remove(function (err) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: 'DELETED' });
	});
});

module.exports = router;