'use strict';

var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'mongodb connection error:'));
conn.once('open', function() {
 console.info('Connected to mongodb on port 27017');
});
mongoose.connect('mongodb://localhost/cursonode');