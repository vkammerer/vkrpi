var mongoose = require('mongoose'),
	_ = require('underscore'),
	Rfcd = mongoose.model('Rfcd');
//	, Rpi = mongoose.model('Rpi');

//PARAM
exports.rfcd = function(req, res, next, id) {
	Rfcd.load(id, function(err, rfcd) {
		if (err) return next(err);
		if (!rfcd) return next(new Error('Failed to load rfcd ' + id));
		req.rfcd = rfcd;
		next();
	});
};

//CRUD
exports.create = function(req, res) {

	var rfcd = new Rfcd(req.body);
	rfcd.user = req.user;

	rfcd.save(function(err) {
		if (err) {
			return res.send(404, {errors: err.errors});
		}
		else {
			res.json(rfcd);
		}
	});
};

exports.all = function(req, res) {
	Rfcd.find({user:req.user}).sort('-created').populate('user rpi').exec(function(err, rfcds) {
		if (err) {
			res.send(404, {errors: err.errors});
		} else {
			res.json(rfcds);
		}
	});
};

exports.show = function(req, res) {
	res.send(req.rfcd);
};

exports.update = function(req, res) {

	_.extend(req.rfcd, req.body);

	req.rfcd.save(function(err) {
		if (err) {
			return res.send(404, {
				errors: err.errors,
				rfcd: req.rfcd
			});
		}
		res.json(req.rfcd);
	});
};

exports.destroy = function(req, res) {

	req.rfcd.remove(function(err) {
		if (err) {
			res.status(500);
		} else {
			res.json(req.rfcd);
		}
	});
};
