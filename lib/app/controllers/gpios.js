var mongoose = require('mongoose'),
	_ = require('underscore'),
	Gpio = mongoose.model('Gpio');

//PARAM
exports.gpio = function(req, res, next, id) {
	Gpio.load(id, function(err, gpio) {
		if (err) return next(err);
		if (!gpio) return next(new Error('Failed to load gpio ' + id));
		req.gpio = gpio;
		next();
	});
};

//CRUD
exports.create = function(req, res) {

	var gpio = new Gpio(req.body);
	gpio.user = req.user;

	gpio.save(function(err) {
		if (err) {
			return res.send(404, {errors: err.errors});
		}
		else {
			res.json(gpio);
		}
	});
};

exports.all = function(req, res) {
	Gpio.find({user:req.user}).sort('-created').populate('user rpi').exec(function(err, gpios) {
		if (err) {
			res.send(404, {errors: err.errors});
		} else {
			res.json(gpios);
		}
	});
};

exports.show = function(req, res) {
	res.send(req.gpio);
};

exports.update = function(req, res) {
	_.extend(req.gpio, req.body);

	req.gpio.save(function(err) {
		if (err) {
			return res.send(404, {errors: err.errors});
		}
		res.json(req.gpio);
	});
};

exports.destroy = function(req, res) {
	req.gpio.remove(function(err) {
		if (err) {
			res.status(500);
		} else {
			res.json(req.gpio);
		}
	});
};
