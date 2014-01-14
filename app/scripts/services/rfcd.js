'use strict';

angular.module('vksetupApp')
	.factory('Rfcd', [
		'$resource',
		'$rootScope',
		function(
			$resource,
			$rootScope
		){

			var rfcdUrl = $rootScope.constants.API_URL + '/rfcds/:rfcdId';
			var rfcdFactory = $resource(
				rfcdUrl,
				{rfcdId:'@id'},
				{ 'update': {method:'PUT'}
			});
			return rfcdFactory;
		}
	]);
