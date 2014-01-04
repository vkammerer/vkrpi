module.exports = function(app, auth) {

	var rpis = require(process.cwd() + '/lib/app/controllers/rpis');
	app.param('rpiId', rpis.rpi);

	app.get('/api/rpis', rpis.all);
	app.post('/api/rpis', auth.requiresLogin, rpis.create);
	app.get('/api/rpis/:rpiId', rpis.show);
	app.put('/api/rpis/:rpiId', auth.requiresLogin, auth.rpi.hasAuthorization, rpis.update);
	app.del('/api/rpis/:rpiId', auth.requiresLogin, auth.rpi.hasAuthorization, rpis.destroy);

};
