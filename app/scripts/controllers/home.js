'use strict';

angular.module('vksetupApp')
	.controller('HomeCtrl', [
		'$rootScope',
		'$scope',
		function (
			$rootScope,
			$scope
		){

			$rootScope.navigationpath = ['home'];

		}
	]);
