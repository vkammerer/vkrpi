'use strict';

angular.module('vksetupApp')
	.controller('HomeCtrl', [
		'$rootScope',
		'$scope',
		function (
			$rootScope,
			$scope
		){

			$rootScope.navigationpath = ['home'];

			$scope.connectServer = function(user){
				if (window.VK_APP.sockets[user._id] && !window.VK_APP.sockets[user._id].socket.connected) {
					window.VK_APP.sockets[user._id].socket.reconnect();
				}
				else {
					window.VK_APP.sockets[user._id] = window.io.connect($rootScope.constants.ROOT_URL, {
						'resource' : 'usersocket',
						'query': 'user=' + $rootScope.user._id,
						'force new connection': true
					});
					window.VK_APP.sockets[user._id].on('connect', function (socket, args) {
						$scope.$apply();
					});
					window.VK_APP.sockets[user._id].on('disconnect', function (socket, args) {
						$scope.$apply();
					});
				}
			};

			$scope.disConnectServer = function(user){
				setTimeout(function(){
					window.VK_APP.sockets[user._id].disconnect();
				}, 0);
			};
		}
	]);
