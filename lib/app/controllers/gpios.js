var mongoose = require('mongoose'),
    _ = require('underscore'),
    Rpi = mongoose.model('Rpi');

//PARAM
exports.gpio = function(req, res, next, id) {
    Rpi.findOne({'gpios._id':id}, function(err, rpi) {
        if (err) return next(err);
        if (!rpi) return next(new Error('Failed to load pin ' + id));
        else {
            req.gpio = rpi.gpios.id(id);
            next();
        }
    });
};

//CRUD
exports.create = function(req, res) {
    Rpi.load(req.body.rpi, function(err, rpi) {
        if (err) {
            res.json(404, {errors: err.errors});
        }
        else if (!rpi) { 
            res.json(404, {errors:[{message: 'Failed to load device'}]});
        }
        else {
            var thisGpio = JSON.parse(JSON.stringify(req.body));
            delete thisGpio.rpi;
            rpi.gpios.push(thisGpio);
            rpi.save(function(err) {
                if (err) {
                    res.json(404, {errors: err.errors});
                }
                else {
                    res.json(200, rpi);
                }
            });
        }
    });
};

exports.all = function(req, res) {
    Rpi.find().sort('-created').exec(function(err, rpis) {
        if (err) {
            res.status(500);
        } else {
            var theseGpios = [];
            _.each(rpis, function(rpi){
                _.each(rpi.gpios, function(gpio){
                    theseGpios.push(gpio.flattenWithRpi())
                });
            });
            res.json(theseGpios);
        }
    });
};

exports.show = function(req, res) {
    if (req.gpio) {
        res.json(req.gpio.flattenWithRpi());
    }
    else return next({error: 'no pin defined'});
};

exports.update = function(req, res) {

    var gpio = req.gpio;
    gpio = _.extend(gpio, req.body);

    gpio.parent().save(function(err) {
        if (err) {
            return res.send(401, {errors: err.errors});
        }
        res.json(gpio);
    });
};

exports.destroy = function(req, res) {

    var rpi = req.gpio.parent();

    req.gpio.remove();
    rpi.save(function(){
        res.send(200);
    },function(){
        res.json(404, {errors:{remove:{message:'error removing gpio'}}});
    }
    );
};
