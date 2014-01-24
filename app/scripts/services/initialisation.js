'use strict';

angular.module('vksetupApp')
	.factory('initialisation', [
		'$rootScope',
		'$route',
		function(
			$rootScope,
			$route
		){

			var connectServer = function(user){
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
						$rootScope.$apply();
					});
					window.VK_APP.sockets[user._id].on('disconnect', function (socket, args) {
						$rootScope.$apply();
					});
				}
			};

			var disConnectServer = function(){
				setTimeout(function(){
					for (var i in window.VK_APP.sockets) {
						window.VK_APP.sockets[i].disconnect();
					}
				}, 0);
			};

			var toReturn = {
				removeLoader : function (){
					angular.element(document.getElementById('siteloader')).remove();
				},
				initIsMobileReloadOnWindowResize : function (){
					var isMobile = function(){
						return window.innerWidth < $rootScope.constants.DESKTOP_MIN_WIDTH;
					};
					var reloadOnIsMobile = function(){
						var isLastMobile = isMobile();
						if ($rootScope.state.isMobile !== isLastMobile) {
							$rootScope.state.isMobile = isLastMobile;
							console.log($rootScope.$$watchers.length);
							$rootScope.$digest();
						}
					};
					$rootScope.state.isMobile = isMobile();
					window.onresize = reloadOnIsMobile;
				},
				initRedirectionListener : function(){
					$rootScope.$on('$routeChangeError', function (event, nextLocation, currentLocation, rejection) {
						var errorMessage;

						if (rejection.reason === 'notLoggedIn') {
							errorMessage = 'You need to sign in to access "' + nextLocation.$$route.originalPath + '"';
						}
						else if (rejection.reason === 'loggedIn') {
							errorMessage = 'You need to sign out to access "' + nextLocation.$$route.originalPath + '"';
						}
						else {
							errorMessage = 'You currently cannot access "' + nextLocation.$$route.originalPath + '"';
						}
						var alertData = { type: 'danger', msg: errorMessage};
						$rootScope.alerts.push(alertData);
					});
				},
				initSocketManager : function(){
					$rootScope.$watch('user', function(user) {
						if (user) {
							connectServer(user);
						}
						else {
							disConnectServer();
						}
					});
				}
			};
			return toReturn;
		}
	]);
