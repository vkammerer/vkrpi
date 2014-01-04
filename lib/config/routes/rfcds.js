module.exports = function(app, auth) {

	var rfcds = require(process.cwd() + '/lib/app/controllers/rfcds');
	app.param('rfcdId', rfcds.rfcd);

	app.get('/api/rfcds', rfcds.all);
	app.post('/api/rfcds', auth.requiresLogin, rfcds.create);
	app.get('/api/rfcds/:rfcdId', rfcds.show);
	app.put('/api/rfcds/:rfcdId', auth.requiresLogin, auth.rfcd.hasAuthorization, rfcds.update);
	app.del('/api/rfcds/:rfcdId', auth.requiresLogin, auth.rfcd.hasAuthorization, rfcds.destroy);

};
