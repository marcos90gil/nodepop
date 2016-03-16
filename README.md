# NODEPOP

API que dará servicio a una app de venta de artículos de segunda mano, llamada Nodepop (nombre interno). Esta app tiene versión iOS y Android y se está desarrollando actualmente. La pantalla principal de la app muestra una lista de anuncios y permite tanto buscar como poner filtros por varios criterios.

## Changelog

### v.0.1.0 - 2016-03-16

* Funcionalidad básica definida por el cliente
* Modelos de anuncios y usuarios con sus controladores que incluyen los métodos GET, POST, PUT y DELETE
* Búsqueda de anuncios con filtros y método para hallar los tags en la base de datos
* Autenticación de usuarios con hash en las contraseñas

## Arrancar API

* Arrancamos la base de datos Mongo
* Arrancamos la api `$ nodemon` con nodemon automatiza la recarga cuando modificamos y guardamos algún archivo

## Búsqueda de resultados

* Para obtener una lista de los anuncios existentes en la base de datos llamamos a la url:
[Anuncios](http://localhost:3000/apiv1/anuncios)

* Para filtrar los resultados utilizamos una query en la url, esta búsqueda se realiza añadiento un signo '?' después de la url y a continuación los datos de búsqueda según una estructura 'clave=valor', si se quieren añadir más condiciones se concatenan utilizando el caracter '&'
[Query](http://localhost:3000/apiv1/anuncios?tags=lifestyle&tags=mobile)

* Las posibles queries de la API se presentan a continuación:

	* nombre=bicicleta ó bici (partes de palabras)
	* venta=true ó false
	* tag=work, lifestyle, motor o mobile; una llamada con más de un tag se realiza por separado tags=lifestyle&tags=motor
	* precio=50 (precio justo); precio=60-1000 (rango de precios); precio=60- (desde un precio mínimo); precio=-1000 (hasta un precio máximo)
	* sort=nombre ó precio (ordenar por orden alfabético o de menor a mayor precio, si queremos inverti el orden incluimos un '-' nombre=-precio)
	* start=2 (empieza a partir del elemento 2, sirve para paginar los resultados)
	* limit=10 (solo muestra 10 resultados, sirve para paginar los resultados)
[Ejemplo](http://localhost:3000/apiv1/anuncios?tag=mobile&venta=true&nombre=ip&precio=50-&start=0&limit=2&sort=precio)

	* select=nombre (por defecto se muestran los campos nombre, precio, venta y tags de los anuncios. Si se quieren obtener todos los campos se utiliza select=all, si se quieren campos concretos se añaden a la query select separados por espacios o '%20'. El campo id tiene un comportamiento que lo muestra por defecto con la llamada select, para evitar que salga se añade a la query '-_id')

