var express = require('express'),
	mongoStore = require('connect-mongo')(express),
	flash = require('connect-flash'),
	config = require('./config');

module.exports = function(app, passport) {
	app.set('showStackError', true);

	//Should be placed before express.static
	app.use(express.compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	app.use(express.favicon());

	if (process.env.NODE_ENV == 'development') {
		app.use(express.static(config.root + '/app'));
		app.use(express.static(config.root + '/.tmp'));
	}
	else {
		app.use(express.static(config.root + '/public'));
	}

	if (process.env.NODE_ENV !== 'test') {
		app.use(express.logger('dev'));
	}

	app.configure(function() {
		//cookieParser should be above session
		app.use(express.cookieParser());

		//bodyParser should be above methodOverride
		app.use(express.bodyParser());
		app.use(express.methodOverride());

		//express/mongo session storage
		app.use(express.session({
			secret: 'VKSETUP',
			store: new mongoStore({
				url: config.db,
				collection: 'sessions'
			})
		}));

		//connect flash for flash messages
		app.use(flash());

		//use passport session
		app.use(passport.initialize());
		app.use(passport.session());

		//routes should be at the last
		app.use(app.router);

		//Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
		app.use(function(err, req, res, next) {
			if (~err.message.indexOf('not found')) return next();
			console.error(err.stack);
			res.json(500, {
				error: err.stack
			});
		});

		//Assume 404 since no middleware responded
		app.use(function(req, res, next) {
			console.log('error');
			res.json(404, {
				url: req.originalUrl,
				error: 'Not found'
			});
		});

	});
};
