module.exports = function(app, server, passport, auth) {

	require('./users')(app, passport, auth);
	require('./rfcds')(app, auth);
	require('./rpis')(app, auth);
	require('./gpios')(app, auth);
	require('./socket')(app, server);

};