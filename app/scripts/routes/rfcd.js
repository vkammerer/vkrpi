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
				.when('/rfcds', {
					templateUrl: 'views/rfcd/all.html',
					controller: 'RfcdListCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				})
				.when('/rfcd/create', {
					templateUrl: 'views/rfcd/create.html',
					controller: 'RfcdCreateCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				})
				.when('/rfcd/:rfcdId/show', {
					templateUrl: 'views/rfcd/show.html',
					controller: 'RfcdShowCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				})
				.when('/rfcd/:rfcdId/edit', {
					templateUrl: 'views/rfcd/edit.html',
					controller: 'RfcdEditCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				});
		}
	]);
