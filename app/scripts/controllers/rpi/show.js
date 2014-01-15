'use strict';

angular.module('vksetupApp')
	.controller('RpiShowCtrl', [
		'Rpi',
		'Gpio',
		'$scope',
		'$rootScope',
		'$location',
		'$routeParams',
		function (
			Rpi,
			Gpio,
			$scope,
			$rootScope,
			$location,
			$routeParams
		){

			var rpiId = $routeParams.rpiId || "";
			$rootScope.navigationpath = ['home','rpis'];


			var queryRpi = function(rpiId){
				$rootScope.spinner = 'Loading device';
				Rpi.get({rpiId:rpiId}, function(rpi){
					delete $rootScope.spinner;
					$scope.rpi = rpi;
					$rootScope.navigationpath = ['home','rpis',{
						ref : 'show',
						name : rpi.name,
						url: ''
					}];
				})
			}
			if (rpiId) {
				queryRpi(rpiId);
			}

			$scope.connectRpi = function(rpi){
				if (window.VK_APP.sockets[rpi._id] && !window.VK_APP.sockets[rpi._id].socket.connected) {
					window.VK_APP.sockets[rpi._id].socket.reconnect();
				}
				else {
					window.VK_APP.sockets[rpi._id] = io.connect($rootScope.constants.ROOT_URL, {
						'resource' : 'rpisocket',
						'query': 'user=' + $rootScope.user._id + '&targetrpi=' + rpi._id,
						'force new connection': true
					});
					window.VK_APP.sockets[rpi._id].on('connect', function (socket, args){
						$scope.$apply()
					})
					window.VK_APP.sockets[rpi._id].on('disconnect', function (socket, args){
						$scope.$apply()
					})
				}
			};
			$scope.deleteRpi = function(rpi){
				if (window.confirm('Delete device?')) {
					Rpi.delete({rpiId: rpi._id}, function(){
						$location.path('/rpis');
					});
				}
			}
			$scope.deleteGpio = function(gpio){
				if (window.confirm('Delete pin?')) {
					Gpio.delete({gpioId: gpio._id}, function(){
						queryRpi(rpiId);
					});
				}
			}

			$scope.disConnectRpi = function(rpi){
				setTimeout(function(){window.VK_APP.sockets[rpi._id].disconnect()}, 0);
			};
	}]);
