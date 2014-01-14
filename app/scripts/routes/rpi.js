'use strict';

angular.module('vksetupApp')
	.config([
		'$routeProvider',
		function (
			$routeProvider
		){
			var isUserSignedinLocal = function($injector){
				return $injector.get('UserStatus').isUserSignedinLocal();
			};
			var isUserSignedoutLocal = function($injector){
				return $injector.get('UserStatus').isUserSignedoutLocal();
			};
			$routeProvider
				.when('/rpis', {
					templateUrl: 'views/rpi/all.html',
					controller: 'RpiListCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				})
				.when('/rpi/create', {
					templateUrl: 'views/rpi/create.html',
					controller: 'RpiCreateCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				})
				.when('/rpi/:rpiId/show', {
					templateUrl: 'views/rpi/show.html',
					controller: 'RpiShowCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				})
				.when('/rpi/:rpiId/edit', {
					templateUrl: 'views/rpi/edit.html',
					controller: 'RpiEditCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				});
		}
	]);
