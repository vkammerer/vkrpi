var mongoose = require('mongoose'),
	_ = require('underscore'),
	Rpi = mongoose.model('Rpi');

//PARAM
exports.rpi = function(req, res, next, id) {
	Rpi.load(id, function(err, rpi) {
		if (err) return next(err);
		if (!rpi) return next(new Error('Failed to load rpi ' + id));
		req.rpi = rpi;
		next();
	});
};

//CRUD
exports.create = function(req, res) {

	var rpi = new Rpi(req.body);
	rpi.user = req.user;

	rpi.save(function(err) {
		if (err) {
			return res.send(404, {errors: err.errors});
		}
		else {
			res.json(rpi);
		}
	});
};
exports.all = function(req, res) {
	Rpi.find({user:req.user}).sort('-created').populate('user').exec(function(err, rpis) {
		if (err) {
			res.send(404, {errors: err.errors});
		} else {
			res.json(rpis);
		}
	});
};

exports.show = function(req, res) {
	res.send(req.rpi);
};

exports.update = function(req, res) {

	_.extend(req.rpi, req.body);

	req.rpi.save(function(err) {
		if (err) {
			return res.send(404, {
				errors: err.errors,
				rpi: req.rpi
			});
		}
		res.json(req.rpi);
	});
};

exports.destroy = function(req, res) {

	req.rpi.remove(function(err) {
		if (err) {
			res.status(500);
		} else {
			res.json(req.rpi);
		}
	});
};

