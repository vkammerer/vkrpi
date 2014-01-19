module.exports = function(app, auth) {

	var tasks = require(process.cwd() + '/lib/app/controllers/tasks');
	app.param('taskId', tasks.task);

	app.get('/api/tasks', auth.requiresLogin, tasks.all);
	app.post('/api/tasks', auth.requiresLogin, tasks.create);
	app.get('/api/tasks/:taskId', auth.requiresLogin, auth.task.hasAuthorization, tasks.show);
	app.put('/api/tasks/:taskId', auth.requiresLogin, auth.task.hasAuthorization, tasks.update);
	app.del('/api/tasks/:taskId', auth.requiresLogin, auth.task.hasAuthorization, tasks.destroy);

};
