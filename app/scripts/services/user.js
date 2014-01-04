'use strict';

angular.module('vksetupApp')
	.factory('User', [
		'$resource',
		'$rootScope',
		function(
			$resource,
			$rootScope
		){
			var userUrl = $rootScope.constants.API_URL + '/users/:userId';
			var userFactory = $resource(
				userUrl,
				{userId:'@id'},
				{ "update": {method:"PUT"}
			});
			return userFactory;
	}]);

angular.module('vksetupApp')
	.factory('UserStatus', [
		'$q',
		'$rootScope',
		'$http',
		function(
			$q,
			$rootScope,
			$http
		){
			var isUserSignedinServer = function(){
				var defer = $q.defer();
				$http.get($rootScope.constants.API_URL + '/users/me')
					.success(function(user){
						$rootScope.user = user;
						$rootScope.state.isUserSignedinServer = true;
						defer.resolve(user);
					})
					.error(function(){
						delete $rootScope.user;
						$rootScope.state.isUserSignedinServer = false;
						defer.reject('Not logged in');
					});
				return defer.promise;
			};
			var isUserSignedoutServer = function(){
				var defer = $q.defer();
				isUserSignedinServer().then(
					function(success){
						defer.reject(success);
					},function(rejection){
						defer.resolve(rejection);
					}
				)
				return defer.promise;
			};
			var isUserSignedinLocal = function(){
				if (!($rootScope.state.isUserSignedinServer)) {
					return isUserSignedinServer();
				}
				else {
					var defer = $q.defer();
					if ($rootScope.user && $rootScope.user !== 'null') {
						defer.resolve('Already logged in');
					}
					else {
						defer.reject('Not logged in');
					}
					return defer.promise;
				}
			};
			var isUserSignedoutLocal = function(){
				var defer = $q.defer();
				isUserSignedinLocal().then(
					function(success){
						defer.reject(success);
					},function(){
						defer.resolve();
					}
				)
				return defer.promise;
			};
			return {
				isUserSignedinServer : isUserSignedinServer,
				isUserSignedoutServer : isUserSignedoutServer,
				isUserSignedinLocal : isUserSignedinLocal,
				isUserSignedoutLocal : isUserSignedoutLocal
			};
	}]);

angular.module('vksetupApp')
	.service('UserStatusInterceptor', [
		'$q',
		'$rootScope',
		'$injector',
		function(
			$q,
			$rootScope,
			$injector
		){
			return {
				responseError: function(rejection) {
					if (
						rejection.config.url !== $rootScope.constants.API_URL + '/users/session'
						&& rejection.config.url !== $rootScope.constants.API_URL + '/users/me'
						&& rejection.config.url !== $rootScope.constants.API_URL + '/users'
						&& rejection.config.url !== $rootScope.constants.API_URL + '/gpios'
						&& rejection.config.url !== $rootScope.constants.API_URL + '/rpis'
					){
						$injector.get('UserStatus').isUserSignedinServer().then(
							function(user){
								$rootScope.user = user;
								var alertData = { type: 'danger', msg: 'Your are not allowed you to do this'};
								$rootScope.alerts.push(alertData);
							},function(){
								delete $rootScope.user;
								var alertData = { type: 'danger', msg: 'You must be signed in to do this'};
								$rootScope.alerts.push(alertData);
							}
							)
					}
					return $q.reject(rejection);
				}
			}
	}]);
