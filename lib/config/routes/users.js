module.exports = function(app, passport, auth) {

	var users = require(process.cwd() + '/lib/app/controllers/users');
	app.param('userId', users.user);

	app.get('/api/users/signout', users.signout);

	//SESSION
	app.post('/api/users/session', function(req, res, next) {
	  passport.authenticate('local', function(err, user, info) {
		if (err) {
		  return res.send(401, { success : false, message : 'an error occured' });
		}
		if (!user) {
		  return res.send(401, {errors:{email:{message : info.message }}});
		}
		req.login(user, function(err) {
		  if (err) { return res.send(401); }
		  return res.redirect('/');
		});
	  })(req, res, next);
	}, users.session);

	app.post('/api/users', users.create);
	app.get('/api/users/me', users.me);
	app.get('/api/users/:userId', users.show);
	app.put('/api/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.update);

	//FACEBOOK
	app.get('/auth/facebook', auth.setSessionReferer, passport.authenticate('facebook', {
		scope: ['email', 'user_about_me', 'user_photos', 'user_birthday', 'user_location', 'user_website'],
		failureRedirect: '/api/signin'
	}), users.signin);
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/api/signin'
	}), users.authCallback);

	//TWITTER
	app.get('/auth/twitter',auth.setSessionReferer, passport.authenticate('twitter', {
		failureRedirect: '/signin'
	}),users.signin);
	app.get('/auth/twitter/callback', passport.authenticate('twitter', {
		failureRedirect: '/signin'
	}), users.authCallback);

	//GOOGLE
	app.get('/auth/google', auth.setSessionReferer, passport.authenticate('google', {
		failureRedirect: '/signin',
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}), users.signin);
	app.get('/auth/google/callback', passport.authenticate('google', {
		failureRedirect: '/signin'
	}), users.authCallback);

	//GITHUB
	app.get('/auth/github', auth.setSessionReferer, passport.authenticate('github', {
		failureRedirect: '/signin'
	}), users.signin);
	app.get('/auth/github/callback', passport.authenticate('github', {
		failureRedirect: '/signin'
	}), users.authCallback);

};
