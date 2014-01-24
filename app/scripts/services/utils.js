'use strict';

angular.module('vksetupApp')
	.factory('utils', [
		'$rootScope',
		'$location',
		'$window',
		function(
			$rootScope,
			$location,
			$window
		){

			var toReturn = {

				onApiError : function(errors){
					for (var error in errors) {
						var alertData = { type: 'danger', msg: errors[error].message };
						$rootScope.alerts.push(alertData);
					}
				},
				locationPath : function(href){
					$location.path(href);
				},
				getLocationPath : function(){
					return $location.path();
				},
				externalHref : function(href, name){
					$rootScope.spinner = 'Redirecting you to ' + name;
					$window.location.replace(href);
				},
				isUserConnected : function(user){
					if (user && window.VK_APP.sockets[user._id]) {
						return window.VK_APP.sockets[user._id].socket.connected;
					}
				},
				isRpiConnected : function(rpi){
					if (rpi && window.VK_APP.sockets[rpi._id]) {
						return window.VK_APP.sockets[rpi._id].socket.connected;
					}
				}
			};
			toReturn.rootScope = {
				locationPath : toReturn.locationPath,
				getLocationPath : toReturn.getLocationPath,
				externalHref : toReturn.externalHref,
				closeAlert : toReturn.closeAlert,
				isUserConnected : toReturn.isUserConnected,
				isRpiConnected : toReturn.isRpiConnected
			};
			return toReturn;
		}
	]);

angular.module('vksetupApp')
	.filter('filterByParamId', function() {
		return function(input, param, id) {
			var toReturn = [];
			var i=0, len=input.length;
			for (; i<len; i++) {
				if (input[i][param]._id === id) {
					toReturn.push(input[i]);
				}
			}
			return toReturn;
		};
	});

angular.module('vksetupApp')
	.filter('getById', function() {
		return function(input, id) {
			var i=0, len=input.length;
			for (; i<len; i++) {
				if (input[i]._id === id) {
					return input[i];
				}
			}
			return null;
		};
	});
