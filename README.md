# NODEPOP

API que dará servicio a una app de venta de artículos de segunda mano, llamada Nodepop (nombre interno). Esta app tiene versión iOS y Android y se está desarrollando actualmente. La pantalla principal de la app muestra una lista de anuncios y permite tanto buscar como poner filtros por varios criterios.

## Changelog

### v.0.1.0 - 2016-03-16

* Funcionalidad básica definida por el cliente
* Modelos de anuncios y usuarios con sus controladores que incluyen los métodos GET, POST, PUT y DELETE
* Búsqueda de anuncios con filtros y método para hallar los tags en la base de datos
* Autenticación de usuarios con hash en las contraseñas

### v.0.1.1 - 2016-03-17

* Añadida documentación con apidocs y favicon

## Instalación de la API

* Descargar o clonar el código de github
* Node: La API trabaja sobre node.js por lo que es imprescindible su instalación, para ello seguir los pasos descritos en [NODE](https://nodejs.org/). Si ya se dispone de node, se deben instalar las dependencias de la API entrando en la carpeta del proyecto en un terminal y ejecutando el siguiente comando `$ npm install`
* Base de datos Mongo: Arrancamos una base de datos Mongo para conectarla con nuestra app. La conexión se realiza en el archivo ./lib/connectMongoose.js, se está utilizando la librería mongoose para trabajar con mongo. Por defecto esta conexión se realiza en el puerto 27017. Cargamos datos en la base de datos para poder empezar a trabajar en una consola dentro de la carpeta del proyecto introducimos `$ npm run initial-db`.
* Servidor: En una consola dentro de la carpeta del proyecto introducimos `$ npm start` se lanza el servidor en el puerto 3000.

## Documentación de funcionalidad

* Para generar la documentación y poder consultarla se abre un terminal en la carpeta del proyecto, se ejecuta el comando `$ apidoc -i routes/api/v1/ -o public/doc`. Esto genera la carpera doc dentro de la carpeta public. Para ello se ha utilizando el generador de documentación [apidoc](http://apidocjs.com/). Ahora se podrá consultar dicha funcionalidad desde el navegador dentro de [DOC](http://localhost:3000/doc).