var mongoose = require('mongoose'),
	_ = require('underscore'),
	Task = mongoose.model('Task');

//PARAM
exports.task = function(req, res, next, id) {
	Task.load(id, function(err, task) {
		if (err) return next(err);
		if (!task) return next(new Error('Failed to load task ' + id));
		req.task = task;
		next();
	});
};

//CRUD
exports.create = function(req, res) {

	var task = new Task(req.body);
	task.user = req.user;

	task.save(function(err) {
		if (err) {
			return res.send(404, {errors: err.errors});
		}
		else {
			res.json(task);
		}
	});
};
exports.all = function(req, res) {
	Task.find({user:req.user}).sort('-created').populate('user').exec(function(err, tasks) {
		if (err) {
			res.send(404, {errors: err.errors});
		} else {
			res.json(tasks);
		}
	});
};

exports.show = function(req, res) {
	res.send(req.task);
};

exports.update = function(req, res) {

	_.extend(req.task, req.body);

	req.task.save(function(err) {
		if (err) {
			return res.send(404, {errors: err.errors});
		}
		res.json(req.task);
	});
};

exports.destroy = function(req, res) {

	req.task.remove(function(err) {
		if (err) {
			res.status(500);
		} else {
			res.json(req.task);
		}
	});
};
