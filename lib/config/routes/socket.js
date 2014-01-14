var httpProxy = require('http-proxy'),
	_ = require('underscore'),
	mongoose = require('mongoose'),
	socketio = require('socket.io'),
	Q = require('q'),
	Rpi = mongoose.model('Rpi');

module.exports = function(app,server) {

	var apiProxies = [];

	app.get('/rpisocket/1/*', function(req,res){
		if (!req.query.targetrpi) res.json(404, {error: 'Rpi id should be defined in the route'});
		Rpi.load(req.query.targetrpi, function(err, rpi) {
			if (err) return next(err);
			if (!rpi) return next(new Error('Failed to load rpi ' + req.query.targetrpi));

			if (
				rpi.user == req.user.id
				&& rpi.host && rpi.port
				) {
				var options = {
					target: {
						host: rpi.host,
						port: rpi.port
					}
				}
				req.url = req.url + '&pwd=' + rpi.pwd;
				apiProxies[rpi.id] = new httpProxy.HttpProxy(options);
				apiProxies[rpi.id].proxyRequest(req,res);
			}
		});
	});

	server.on('upgrade', function (req, socket, head) {
		var urlParam = require('url').parse(req.url, true).query;
		if (urlParam.targetrpi){
			apiProxies[urlParam.targetrpi].proxyWebSocketRequest(req, socket, head);
		}
	});

	var vkRpis = [];

	var io = socketio.listen(server);

	io.set('resource', '/usersocket');
	io.set('destroy upgrade', false);

	io.sockets.on('connection', function (socket) {
		if (socket.handshake.query.user) {
			joinRpiRooms(socket);
			socket.on('gpioOutput', function(data){
				io.sockets.socket(vkRpis[data.rpi]).emit('gpioOutput',data)
			});
			socket.on('initGpioInput', function(data){
				io.sockets.socket(vkRpis[data.rpi]).emit('initGpioInput',data)
			});
			socket.on('rfcdOutput', function(data){
				io.sockets.socket(vkRpis[data.rfcd.gpio.rpi._id]).emit('rfcdOutput',data)
			});
		}
		else if (socket.handshake.query.rpi) {
			vkRpis[socket.handshake.query.rpi] = socket.id;
			socket.on('gpioInput', function(data){
				socket.broadcast.to('rpi_' + socket.handshake.query.rpi).emit('gpioInput', data)
			});
			socket.broadcast.to('rpi_' + socket.handshake.query.rpi).emit('rpiConnection', {
				rpi: socket.handshake.query.rpi
			})
		}
	})

	var getUserRpis = function(userId) {
		var deferred = Q.defer();
		Rpi.find({"user":userId}).sort('-created').exec(function(err, rpis) {
			if (err) {
				deferred.resolve([])
			} else {
				deferred.resolve(rpis)
			}
		});
		return deferred.promise;
	}
	var joinRpiRooms = function(socket){
		getUserRpis(socket.handshake.query.user).then(function(rpis){
			_.each(rpis, function(rpi){
				socket.join('rpi_' + rpi._id)
			})
			console.log(io.sockets.manager.roomClients[socket.id])
		});
	}

};

