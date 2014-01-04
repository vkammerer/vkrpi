'use strict';

// Module dependencies.
var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	passport = require('passport'),
	http = require('http'),
	mongoose = require('mongoose');

// config
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	config = require('./lib/config/config'),
	auth = require('./lib/config/middlewares/authorization');

// bootstrap
var db = mongoose.connect(config.db),
	app = express(),
	server = http.createServer(app);

// models
var modelsPath = path.join(__dirname, 'lib/app/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

require('./lib/config/passport')(passport);
require('./lib/config/express')(app, passport);
require('./lib/config/routes/main')(app, server, passport, auth);

// listen
server.listen(config.port);
console.log('Express app started on port ' + config.port);
