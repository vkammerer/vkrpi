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
				.when('/tasks', {
					templateUrl: 'views/task/all.html',
					controller: 'TaskListCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				})
				.when('/task/create', {
					templateUrl: 'views/task/create.html',
					controller: 'TaskCreateCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				})
				.when('/task/:taskId/edit', {
					templateUrl: 'views/task/edit.html',
					controller: 'TaskEditCtrl',
					resolve : {
						condition : isUserSignedinLocal
					}
				});
		}
	]);
