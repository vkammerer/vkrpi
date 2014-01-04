'use strict';

angular.module('vksetupApp')
	.factory('Gpio', [
		'$resource',
		'$rootScope',
		function(
			$resource,
			$rootScope
		){
			var gpioUrl = $rootScope.constants.API_URL + '/gpios/:gpioId';
			var gpioFactory = $resource(
				gpioUrl,
				{gpioId:'@id'},
				{ "update": {method:"PUT"}
			});
			return gpioFactory;
	}]);
