module.exports = function(app, auth) {

	var gpios = require(process.cwd() + '/lib/app/controllers/gpios');
	app.param('gpioId', gpios.gpio);

	app.get('/api/gpios', auth.requiresLogin, gpios.all);
	app.post('/api/gpios', auth.requiresLogin, gpios.create);
	app.get('/api/gpios/:gpioId', auth.requiresLogin, auth.gpio.hasAuthorization, gpios.show);
	app.put('/api/gpios/:gpioId', auth.requiresLogin, auth.gpio.hasAuthorization, gpios.update);
	app.del('/api/gpios/:gpioId', auth.requiresLogin, auth.gpio.hasAuthorization, gpios.destroy);

};
