exports.setSessionReferer = function(req, res, next) {
    req.session.vkreferer = req.get('Referer');
    next();   
};

exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
    next();   
};

exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

exports.rpi = {
    hasAuthorization: function(req, res, next) {
        if (req.rpi.user != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

exports.gpio = {
    hasAuthorization: function(req, res, next) {
        if (req.gpio.parent().user != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};