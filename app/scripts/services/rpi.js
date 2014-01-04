'use strict';

angular.module('vksetupApp')
	.factory('Rpi', [
		'$resource',
		'$rootScope',
		function(
			$resource,
			$rootScope
		){

			var rpiUrl = $rootScope.constants.API_URL + '/rpis/:rpiId';
			var rpiFactory = $resource(
				rpiUrl,
				{rpiId:'@id'},
				{ "update": {method:"PUT"}
			});
			return rpiFactory;
	}]);
