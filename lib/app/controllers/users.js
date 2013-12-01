var mongoose = require('mongoose'),
    _ = require('underscore'),
    crypto = require('crypto'),
    User = mongoose.model('User');

//PARAM
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });        
};

//CRUD
exports.create = function(req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    if (user.email) {
        var hash = crypto.createHash('md5').update(user.email.toLowerCase().trim()).digest('hex');
        user.photo = 'http://www.gravatar.com/avatar/' + hash;        
    }
    user.save(function(err) {
        if (err) {
            return res.json(404, {
                errors: err.errors,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.json(user);
        });
    });
};
exports.show = function(req, res) {
    if (req.profile) {
        res.json(req.profile);
    }
    else {
        res.json(404, {error: 'No user for this id'});
    }
};
exports.me = function(req, res) {
    if (req.user) {
        res.json(req.user);
    }
    else {
        res.json(404, {error: 'No active session'});
    }
};
exports.update = function(req, res) {
    var user = req.user;
    user = _.extend(user, req.body);
    user.save(function(err) {
        if (err) {
            return res.send(404, {
                errors: err.errors,
                user: user
            });
        }
        res.json(user);
    });
};

//SESSION
exports.session = function(req, res) {
    res.redirect('/');
};
exports.signout = function(req, res) {
    req.logout();
    res.send(200);
};

//OAUTH
exports.authCallback = function(req, res, next) {
    if (req.session.vkreferer) {
        res.redirect('/');
    }
    else {
        res.redirect('/redirect.html');
    }
};
exports.signin = function(req, res) {
    res.redirect('/#/signin');
};


