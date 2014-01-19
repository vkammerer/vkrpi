'use strict';

angular.module('vksetupApp')
	.factory('Task', [
		'$resource',
		'$rootScope',
		function(
			$resource,
			$rootScope
		){

			var taskUrl = $rootScope.constants.API_URL + '/tasks/:taskId';
			var taskFactory = $resource(
				taskUrl,
				{taskId:'@id'},
				{ 'update': {method:'PUT'}
			});
			return taskFactory;
		}
	]);
